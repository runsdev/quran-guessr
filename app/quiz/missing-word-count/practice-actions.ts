'use server';

import { decryptVerseKey, verifyAnswer, decryptHiddenWords } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import type { VerseWord } from '@/app/quiz/types';
import { auth } from '@/auth';
import { recordGameEvent } from '@/lib/game-events';
import { prisma } from '@/lib/prisma';

export async function fetchPracticeQuestion(pageNumber: number): Promise<Question> {
  return getRandomQuestion(pageNumber, undefined);
}

export async function submitPracticeAnswer(
  encryptedVerseKey: string,
  answerToken: string,
  guess: number,
  encryptedHiddenWords: string,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const hiddenWords = decryptHiddenWords<VerseWord>(encryptedHiddenWords);
  const verified = verifyAnswer(verseKey, answerToken);
  if (!verified) {
    throw new Error('Invalid answer token');
  }
  const { missingCount: correctAnswer, pageNumber } = verified;
  const pageEloRecord = await prisma.pageElo.findUnique({ where: { pageNumber } });
  const newPageElo = Math.round(pageEloRecord?.elo ?? 1000);
  const isCorrect = guess === correctAnswer;
  const practiceSession = await auth();
  const userId = (practiceSession?.user as { id?: string } | undefined)?.id ?? null;
  void recordGameEvent({
    userId,
    gameMode: 'missing-word-count',
    correct: isCorrect,
    practice: true,
  });
  return {
    isCorrect,
    correctAnswer,
    verseKey,
    hiddenWords,
    userEloDelta: null,
    newUserElo: null,
    newPageElo,
    ranked: false,
  };
}
