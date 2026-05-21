'use server';

import { decryptVerseKey, verifyAnswer } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import { auth } from '@/auth';
import { recordGameEvent } from '@/lib/game-events';

export async function fetchPracticeQuestion(pageNumber: number): Promise<Question> {
  return getRandomQuestion(undefined, pageNumber);
}

export async function submitPracticeAnswer(
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
  const noAnswer = guessedPage === 0 && guessedLine === 0;
  const slotGuess = (guessedPage - 1) * 15 + guessedLine;
  const slotCorrect = (correctPage - 1) * 15 + correctLine;
  const distance = Math.abs(slotGuess - slotCorrect);
  const roundScore = noAnswer ? 0 : Math.round(5000 * Math.exp(-distance / 2000));
  const practiceSession = await auth();
  const userId = (practiceSession?.user as { id?: string } | undefined)?.id ?? null;
  void recordGameEvent({
    userId,
    gameMode: 'locate-verse',
    correct: guessedPage === correctPage,
    practice: true,
  });
  return {
    pageCorrect: guessedPage === correctPage,
    lineCorrect: guessedLine === correctLine,
    correctPage,
    correctLine,
    verseKey,
    roundScore,
  };
}
