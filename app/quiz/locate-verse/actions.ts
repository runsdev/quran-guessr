'use server';

import { decryptVerseKey, verifyAnswer } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function fetchNextQuestion(): Promise<Question> {
  return getRandomQuestion();
}

export async function submitAnswer(
  encryptedVerseKey: string,
  answerToken: string,
  guessedPage: number,
  guessedLine: number,
): Promise<SubmitResult> {
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
    await prisma.user.update({
      where: { id: userId },
      data: {
        lvGames: { increment: 1 },
        ...(guessedPage === correctPage ? { lvCorrect: { increment: 1 } } : {}),
      },
    });
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
