'use server';

import { verifyAnswer, decryptVerseKey, decryptHiddenWords } from './answerToken';
import { getAdaptiveQuestion } from './getQuestion';
import type { Question, SubmitResult, SessionInitResult } from './types';
import { updateRankedElo } from './updateRankedElo';

import type { VerseWord } from '@/app/quiz/types';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  createQuizSession,
  getActiveQuizSession,
  advanceQuizSession,
  saveQuizSubmitResult,
} from '@/lib/quiz-session';

const DAILY_RANKED_LIMIT = 20;
const TIMER_LIMIT = 90;
const GAME_MODE = 'missing-word-count' as const;

export async function initSession(sessionToken?: string): Promise<SessionInitResult> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (sessionToken) {
    const existing = await getActiveQuizSession(sessionToken);
    if (existing) {
      const elapsed = Math.floor((Date.now() - existing.questionStartedAt.getTime()) / 1000);
      const submitResult = existing.submitResult as SubmitResult | null;
      const initialTimeLeft =
        submitResult !== null ? existing.timerLimit : Math.max(0, existing.timerLimit - elapsed);

      return {
        sessionToken,
        question: existing.currentQuestion as unknown as Question,
        questionNumber: existing.questionNumber,
        totalScore: existing.totalScore,
        initialTimeLeft,
        submitResult,
      };
    }
  }

  const question = await getAdaptiveQuestion(userId);
  const record = await createQuizSession({
    userId,
    gameMode: GAME_MODE,
    question,
    timerLimit: TIMER_LIMIT,
  });

  return {
    sessionToken: record.token,
    question,
    questionNumber: 1,
    totalScore: 0,
    initialTimeLeft: TIMER_LIMIT,
    submitResult: null,
  };
}

export async function fetchNextQuestion(
  sessionToken: string,
): Promise<{ question: Question; questionNumber: number }> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const existing = await getActiveQuizSession(sessionToken);
  if (!existing) {
    throw new Error('Session not found or expired');
  }

  const question = await getAdaptiveQuestion(userId);
  const questionNumber = existing.questionNumber + 1;

  await advanceQuizSession(sessionToken, { question, questionNumber, timerLimit: TIMER_LIMIT });

  return { question, questionNumber };
}

export async function submitAnswer(
  sessionToken: string,
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

  const existingPageElo = await prisma.pageElo.findUnique({ where: { pageNumber } });
  const currentPageElo = existingPageElo?.elo ?? 1200;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const unranked: SubmitResult = {
    isCorrect,
    correctAnswer,
    verseKey,
    hiddenWords,
    userEloDelta: null,
    newUserElo: null,
    newPageElo: currentPageElo,
    ranked: false,
  };

  if (!userId) {
    await saveQuizSubmitResult(sessionToken, unranked, isCorrect ? 1 : 0);
    return unranked;
  }

  const today = new Date().toISOString().slice(0, 10);
  const daily = await prisma.dailyAttempt.upsert({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { userId_date: { userId, date: today } },
    update: {},
    create: { userId, date: today, count: 0 },
  });

  if (daily.count >= DAILY_RANKED_LIMIT) {
    await saveQuizSubmitResult(sessionToken, unranked, isCorrect ? 1 : 0);
    return unranked;
  }

  const eloResult = await updateRankedElo(userId, pageNumber, isCorrect, today, currentPageElo);

  const submitResult: SubmitResult = {
    isCorrect,
    correctAnswer,
    verseKey,
    hiddenWords,
    userEloDelta: eloResult.userDelta,
    newUserElo: eloResult.newUserElo,
    newPageElo: eloResult.newPageElo,
    ranked: true,
  };
  await saveQuizSubmitResult(sessionToken, submitResult, isCorrect ? 1 : 0);
  return submitResult;
}
