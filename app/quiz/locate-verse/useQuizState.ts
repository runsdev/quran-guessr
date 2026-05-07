import { useState, useTransition, useMemo } from 'react';

import { fetchNextQuestion, submitAnswer } from './actions';
import type { Question, SubmitResult } from './types';

export function useQuizState(initialQuestion: Question) {
  const [question, setQuestion] = useState<Question | null>(initialQuestion);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  const loadNextQuestion = () => {
    setFetchError(false);
    startTransition(async () => {
      try {
        setQuestion(await fetchNextQuestion());
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleSubmit = () => {
    if (selectedPage === null || selectedLine === null || !question || submitResult !== null) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitAnswer(
          question.encryptedVerseKey,
          question.answerToken,
          selectedPage,
          selectedLine,
        );
        setSubmitResult(result);
        setTotalScore((s) => s + result.roundScore);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleTimerExpire = () => {
    if (!question || submitResult !== null) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitAnswer(
          question.encryptedVerseKey,
          question.answerToken,
          selectedPage ?? 0,
          selectedLine ?? 0,
        );
        setSubmitResult(result);
        setTotalScore((s) => s + result.roundScore);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleNext = () => {
    setSelectedPage(null);
    setSelectedLine(null);
    setSubmitResult(null);
    setQuestion(null);
    setQuestionNumber((n) => n + 1);
    loadNextQuestion();
  };

  const submitted = submitResult !== null;

  const pageNumbers = useMemo(() => {
    const nums = question?.verseWords.map((w) => w.page_number).filter(Boolean) ?? [];
    return [...new Set(nums)] as number[];
  }, [question]);

  return {
    question,
    isPending,
    fetchError,
    selectedPage,
    selectedLine,
    submitResult,
    questionNumber,
    totalScore,
    submitted,
    pageNumbers,
    setSelectedPage,
    setSelectedLine,
    loadNextQuestion,
    handleSubmit,
    handleTimerExpire,
    handleNext,
  };
}
