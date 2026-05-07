'use server';

import { verifyAnswer, decryptVerseKey } from './answerToken';
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
  guess: number,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const correctIndex = verifyAnswer(verseKey, answerToken);
  if (correctIndex === null) {
    throw new Error('Invalid answer token');
  }
  const isCorrect = guess === correctIndex;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        nvGames: { increment: 1 },
        ...(isCorrect ? { nvCorrect: { increment: 1 } } : {}),
      },
    });
  }

  return { isCorrect, correctIndex, verseKey };
}
