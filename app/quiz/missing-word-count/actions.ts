'use server';

import { verifyAnswer, decryptVerseKey, decryptHiddenWords } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import type { VerseWord } from '@/app/quiz/types';
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
  encryptedHiddenWords: string,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const hiddenWords = decryptHiddenWords<VerseWord>(encryptedHiddenWords);
  const verified = verifyAnswer(verseKey, answerToken);
  if (verified === null) {
    throw new Error('Invalid answer token');
  }
  const { missingCount: correctAnswer, pageNumber } = verified;
  const isCorrect = guess === correctAnswer;

  // Read the page ELO record (created lazily on first ranked submit below).
  // Using findUnique here avoids any upsert that could overwrite accumulated stats.
  const existingPageElo = await prisma.pageElo.findUnique({ where: { pageNumber } });
  const currentPageElo = existingPageElo?.elo ?? 1200;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  // ── Anonymous: no ELO updates at all (fix #1) ───────────────────────────
  if (!userId) {
    return {
      isCorrect,
      correctAnswer,
      verseKey,
      hiddenWords,
      userEloDelta: null,
      newUserElo: null,
      newPageElo: currentPageElo,
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
      hiddenWords,
      userEloDelta: null,
      newUserElo: null,
      newPageElo: currentPageElo,
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

  const result = computeElo(currentUserElo, currentPageElo, isCorrect, gamesPlayed);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        elo: result.newUserElo,
        gamesPlayed: { increment: 1 },
        ...(isCorrect ? { mwcCorrect: { increment: 1 } } : {}),
      },
    }),
    // upsert so the record is created on first ranked attempt (getQuestion.ts no longer writes)
    prisma.pageElo.upsert({
      where: { pageNumber },
      create: {
        pageNumber,
        elo: result.newPageElo,
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
      },
      update: {
        elo: result.newPageElo,
        totalAttempts: { increment: 1 },
        ...(isCorrect ? { correctAttempts: { increment: 1 } } : {}),
      },
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
    hiddenWords,
    userEloDelta: result.userDelta,
    newUserElo: result.newUserElo,
    newPageElo: result.newPageElo,
    ranked: true,
  };
}
