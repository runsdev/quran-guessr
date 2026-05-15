'use client';

import { useState, useTransition, useMemo } from 'react';

import { submitDailyAnswer } from './actions';

import type { Question, SubmitResult } from '@/app/quiz/locate-verse/types';

export function useDailyQuizState(
  questions: Question[],
  challengeId: string,
  initialQuestionIndex: number,
  previousScores: number[],
) {
  const [currentIndex, setCurrentIndex] = useState(initialQuestionIndex);
  const [scores, setScores] = useState<number[]>(previousScores);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [allDone, setAllDone] = useState(false);

  const question = questions[currentIndex] ?? null;
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const doSubmit = (page: number, line: number) => {
    if (!question || submitResult !== null) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitDailyAnswer(
          challengeId,
          currentIndex,
          question.encryptedVerseKey,
          question.answerToken,
          page,
          line,
        );
        setSubmitResult(result);
        setScores((prev) => [...prev, result.roundScore]);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleSubmit = () => {
    if (selectedPage === null || selectedLine === null) {
      return;
    }
    doSubmit(selectedPage, selectedLine);
  };

  const handleTimerExpire = () => {
    if (submitResult !== null) {
      return;
    }
    doSubmit(selectedPage ?? 0, selectedLine ?? 0);
  };

  const handleNext = () => {
    setSelectedPage(null);
    setSelectedLine(null);
    setSubmitResult(null);
    const next = currentIndex + 1;
    if (next >= 5) {
      setAllDone(true);
    } else {
      setCurrentIndex(next);
    }
  };

  const pageNumbers = useMemo(() => question?.fontPages ?? [], [question]);

  return {
    question,
    currentIndex,
    scores,
    totalScore,
    isPending,
    fetchError,
    selectedPage,
    selectedLine,
    submitResult,
    allDone,
    submitted: submitResult !== null,
    pageNumbers,
    setSelectedPage,
    setSelectedLine,
    handleSubmit,
    handleTimerExpire,
    handleNext,
  };
}
