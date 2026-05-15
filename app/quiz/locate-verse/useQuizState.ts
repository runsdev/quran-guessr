import { useState, useTransition, useMemo, useEffect } from 'react';

import { initSession, fetchNextQuestion, submitAnswer } from './actions';
import { TIMER_LIMIT } from './types';
import type { Question, SubmitResult } from './types';

const SESSION_KEY = 'quizSession:locate-verse';

export function useQuizState() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(false);

  const [question, setQuestion] = useState<Question | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState(TIMER_LIMIT);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY) ?? undefined;
    initSession(stored)
      .then((data) => {
        localStorage.setItem(SESSION_KEY, data.sessionToken);
        setSessionToken(data.sessionToken);
        setQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setTotalScore(data.totalScore);
        setInitialTimeLeft(data.initialTimeLeft);
        if (data.submitResult) {
          setSubmitResult(data.submitResult);
        }
        setIsInitializing(false);
      })
      .catch(() => {
        setInitError(true);
        setIsInitializing(false);
      });
  }, []);

  const handleSubmit = () => {
    if (
      !sessionToken ||
      selectedPage === null ||
      selectedLine === null ||
      !question ||
      submitResult !== null
    ) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitAnswer(
          sessionToken,
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
    if (!sessionToken || !question || submitResult !== null) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitAnswer(
          sessionToken,
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
    if (!sessionToken) {
      return;
    }
    setSelectedPage(null);
    setSelectedLine(null);
    setSubmitResult(null);
    setQuestion(null);
    startTransition(async () => {
      try {
        const { question: q, questionNumber: qn } = await fetchNextQuestion(sessionToken);
        setQuestion(q);
        setQuestionNumber(qn);
        setInitialTimeLeft(TIMER_LIMIT);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleRetry = () => {
    if (!sessionToken) {
      return;
    }
    setFetchError(false);
    startTransition(async () => {
      try {
        const { question: q, questionNumber: qn } = await fetchNextQuestion(sessionToken);
        setQuestion(q);
        setQuestionNumber(qn);
        setInitialTimeLeft(TIMER_LIMIT);
      } catch {
        setFetchError(true);
      }
    });
  };

  const submitted = submitResult !== null;
  const pageNumbers = useMemo(() => question?.fontPages ?? [], [question]);

  return {
    isInitializing,
    initError,
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
    initialTimeLeft,
    setSelectedPage,
    setSelectedLine,
    handleSubmit,
    handleTimerExpire,
    handleNext,
    handleRetry,
  };
}
