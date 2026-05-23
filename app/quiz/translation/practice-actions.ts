'use server';

import { decryptVerseKey, verifyAnswer } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import { auth } from '@/auth';
import { recordGameEvent } from '@/lib/game-events';

export async function fetchPracticeQuestion(translationId: number): Promise<Question> {
  return getRandomQuestion(translationId);
}

export async function submitPracticeAnswer(
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
  const practiceSession = await auth();
  const userId = (practiceSession?.user as { id?: string } | undefined)?.id ?? null;
  void recordGameEvent({
    userId,
    gameMode: 'translation-quiz',
    correct: isCorrect,
    practice: true,
  });
  return { isCorrect, correctIndex, verseKey };
}
