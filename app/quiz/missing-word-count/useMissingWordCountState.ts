'use client';

import { useTransition, useState, useMemo, useEffect } from 'react';

import { initSession, fetchNextQuestion, submitAnswer } from './actions';
import type { Option } from './AnswerGrid';
import type { Question, SubmitResult } from './types';

import { loadJuzFilter } from '@/app/quiz/components/JuzFilterSettings';

const SESSION_KEY = 'quizSession:missing-word-count';
const TIMER_LIMIT = 90;

export function useMissingWordCountState() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(false);
  const [juzFilter, setJuzFilter] = useState<number[]>([]);

  const [question, setQuestion] = useState<Question | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [initialTimeLeft, setInitialTimeLeft] = useState(TIMER_LIMIT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const filter = loadJuzFilter();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJuzFilter(filter);
    const urlToken = new URLSearchParams(window.location.search).get('token') ?? undefined;
    const stored = urlToken ?? localStorage.getItem(SESSION_KEY) ?? undefined;
    initSession(stored, filter.length > 0 ? filter : undefined)
      .then((data) => {
        localStorage.setItem(SESSION_KEY, data.sessionToken);
        setSessionToken(data.sessionToken);
        setQuestion(data.question);
        setQuestionNumber(data.questionNumber);
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

  const submitted = isSubmitting || submitResult !== null;
  const isCorrect = submitResult?.isCorrect ?? false;
  const timedOut = selected === null && submitted;
  const displayPageElo = submitResult?.newPageElo ?? question?.pageElo ?? null;

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    question?.segments.forEach((seg) => {
      if (seg.type === 'words') {
        seg.words.forEach((w) => {
          if (w.page_number !== undefined) {
            nums.push(w.page_number);
          }
        });
      }
    });
    return [...new Set(nums)];
  }, [question]);

  const doSubmit = (guess: number) => {
    if (!sessionToken || !question || isSubmitting || submitResult !== null) {
      return;
    }
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = await submitAnswer(
          sessionToken,
          question.encryptedVerseKey,
          question.answerToken,
          guess,
          question.encryptedHiddenWords,
        );
        setSubmitResult(result);
      } catch {
        setFetchError(true);
        setIsSubmitting(false);
      }
    });
  };

  const handleTimerExpire = () => doSubmit(0);
  const handleSubmit = () => doSubmit(selected ?? 0);

  const handleNext = () => {
    if (!sessionToken) {
      return;
    }
    setSelected(null);
    setSubmitResult(null);
    setIsSubmitting(false);
    setQuestion(null);
    startTransition(async () => {
      try {
        const { question: q, questionNumber: qn } = await fetchNextQuestion(
          sessionToken,
          juzFilter.length > 0 ? juzFilter : undefined,
        );
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
        const { question: q, questionNumber: qn } = await fetchNextQuestion(
          sessionToken,
          juzFilter.length > 0 ? juzFilter : undefined,
        );
        setQuestion(q);
        setQuestionNumber(qn);
        setInitialTimeLeft(TIMER_LIMIT);
      } catch {
        setFetchError(true);
      }
    });
  };

  return {
    isInitializing,
    initError,
    question,
    isPending,
    fetchError,
    selected,
    setSelected,
    submitResult,
    questionNumber,
    initialTimeLeft,
    submitted,
    isCorrect,
    timedOut,
    displayPageElo,
    pageNumbers,
    handleTimerExpire,
    handleSubmit,
    handleNext,
    handleRetry,
  };
}
