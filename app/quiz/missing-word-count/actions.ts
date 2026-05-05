'use server';

import { verifyAnswer, decryptVerseKey } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import { auth } from '@/auth';
import { computeElo } from '@/lib/elo';
import { prisma } from '@/lib/prisma';

const DAILY_RANKED_LIMIT = 20;

/** UTC date string YYYY-MM-DD */
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchNextQuestion(): Promise<Question> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  let targetPageNumber: number | undefined;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { elo: true } });
    const userElo = user?.elo ?? 1000;

    // Adaptive selection: find a page within ±200 ELO of the player
    const matchingPages = await prisma.pageElo.findMany({
      where: { elo: { gte: userElo - 200, lte: userElo + 200 } },
      select: { pageNumber: true },
    });

    if (matchingPages.length > 0) {
      targetPageNumber = matchingPages[Math.floor(Math.random() * matchingPages.length)].pageNumber;
    }
  }

  return getRandomQuestion(targetPageNumber);
}

export async function submitAnswer(
  encryptedVerseKey: string,
  answerToken: string,
  guess: number,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const verified = verifyAnswer(verseKey, answerToken);
  if (verified === null) {
    throw new Error('Invalid answer token');
  }
  const { missingCount: correctAnswer, pageNumber } = verified;
  const isCorrect = guess === correctAnswer;

  // Fetch or initialise page ELO record
  const pageEloRecord = await prisma.pageElo.upsert({
    where: { pageNumber },
    update: {},
    create: { pageNumber, elo: 1200 },
  });

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  // ── Anonymous: no ELO updates at all (fix #1) ───────────────────────────
  if (!userId) {
    return {
      isCorrect,
      correctAnswer,
      verseKey,
      userEloDelta: null,
      newUserElo: null,
      newPageElo: pageEloRecord.elo,
      ranked: false,
    };
  }

  // ── Authenticated: check daily rate limit (fix #8) ───────────────────────
  const today = todayUtc();
  const daily = await prisma.dailyAttempt.upsert({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { userId_date: { userId, date: today } },
    update: {},
    create: { userId, date: today, count: 0 },
  });

  if (daily.count >= DAILY_RANKED_LIMIT) {
    return {
      isCorrect,
      correctAnswer,
      verseKey,
      userEloDelta: null,
      newUserElo: null,
      newPageElo: pageEloRecord.elo,
      ranked: false,
    };
  }

  // ── Ranked attempt: compute and persist ELO (fixes #1, #4) ──────────────
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { elo: true, gamesPlayed: true },
  });
  const currentUserElo = user?.elo ?? 1000;
  const gamesPlayed = user?.gamesPlayed ?? 0;

  const result = computeElo(currentUserElo, pageEloRecord.elo, isCorrect, gamesPlayed);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { elo: result.newUserElo, gamesPlayed: { increment: 1 } },
    }),
    prisma.pageElo.update({
      where: { pageNumber },
      data: { elo: result.newPageElo },
    }),
    prisma.dailyAttempt.update({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { userId_date: { userId, date: today } },
      data: { count: { increment: 1 } },
    }),
  ]);

  return {
    isCorrect,
    correctAnswer,
    verseKey,
    userEloDelta: result.userDelta,
    newUserElo: result.newUserElo,
    newPageElo: result.newPageElo,
    ranked: true,
  };
}
