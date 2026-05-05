'use server';

import { verifyAnswer, decryptVerseKey } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

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
  return { isCorrect: guess === correctIndex, correctIndex, verseKey };
}
