'use server';

import { decryptVerseKey, verifyAnswer } from '@/app/quiz/locate-verse/answerToken';
import type { SubmitResult } from '@/app/quiz/locate-verse/types';
import { auth } from '@/auth';
import { getOrCreateDailyChallenge, getUtcDateStr } from '@/lib/daily-challenge';
import { prisma } from '@/lib/prisma';

export async function submitDailyAnswer(
  challengeId: string,
  questionIndex: number,
  encryptedVerseKey: string,
  answerToken: string,
  guessedPage: number,
  guessedLine: number,
): Promise<SubmitResult> {
  if (questionIndex < 0 || questionIndex > 4) {
    throw new Error('Invalid question index');
  }

  const verseKey = decryptVerseKey(encryptedVerseKey);
  const result = verifyAnswer(verseKey, answerToken);
  if (!result) {
    throw new Error('Invalid answer token');
  }

  const { correctPage, correctLine } = result;
  const slotGuess = (guessedPage - 1) * 15 + guessedLine;
  const slotCorrect = (correctPage - 1) * 15 + correctLine;
  const distance = Math.abs(slotGuess - slotCorrect);
  const roundScore = Math.round(5000 * Math.exp(-distance / 2000));

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (userId) {
    const today = getUtcDateStr();
    const challenge = await prisma.dailyChallenge.findUnique({ where: { id: challengeId } });
    if (!challenge || challenge.date !== today) {
      throw new Error('Invalid challenge');
    }

    const existing = await prisma.dailyChallengeResult.findUnique({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { challengeId_userId: { challengeId, userId } },
    });

    if (!existing) {
      await prisma.dailyChallengeResult.create({
        data: {
          challengeId,
          userId,
          scores: [roundScore],
          totalScore: roundScore,
          completed: false,
        },
      });
    } else if (!existing.completed) {
      // Only append if this question hasn't been recorded yet
      if (existing.scores.length === questionIndex) {
        const newScores = [...existing.scores, roundScore];
        const newTotal = newScores.reduce((a, b) => a + b, 0);
        const completed = newScores.length >= 5;
        await prisma.dailyChallengeResult.update({
          where: { id: existing.id },
          data: {
            scores: newScores,
            totalScore: newTotal,
            completed,
            completedAt: completed ? new Date() : null,
          },
        });
      }
    }
  }

  return {
    pageCorrect: guessedPage === correctPage,
    lineCorrect: guessedLine === correctLine,
    correctPage,
    correctLine,
    verseKey,
    roundScore,
  };
}

export async function getDailyChallengeStatus(): Promise<{
  challengeId: string;
  completedScores: number[] | null;
  resumeFromIndex: number;
}> {
  const today = getUtcDateStr();
  const challenge = await getOrCreateDailyChallenge(today);

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (!userId) {
    return { challengeId: challenge.id, completedScores: null, resumeFromIndex: 0 };
  }

  const existing = await prisma.dailyChallengeResult.findUnique({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { challengeId_userId: { challengeId: challenge.id, userId } },
  });

  if (!existing) {
    return { challengeId: challenge.id, completedScores: null, resumeFromIndex: 0 };
  }

  if (existing.completed) {
    return { challengeId: challenge.id, completedScores: existing.scores, resumeFromIndex: 5 };
  }

  return {
    challengeId: challenge.id,
    completedScores: null,
    resumeFromIndex: existing.scores.length,
  };
}
