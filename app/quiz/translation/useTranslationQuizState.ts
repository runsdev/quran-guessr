'use client';

import { useTransition, useState, useEffect } from 'react';

import { initSession, fetchNextQuestion, submitAnswer } from './actions';
import { fetchPracticeQuestion, submitPracticeAnswer } from './practice-actions';
import { loadTranslationId, saveTranslationId } from './TranslationSelector';
import type { Question, SubmitResult } from './types';

import { abandonSession } from '@/app/quiz/actions';
import { loadJuzFilter } from '@/app/quiz/components/JuzFilterSettings';

const SESSION_KEY = 'quizSession:translation-quiz';

export function useTranslationQuizState() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(false);
  const [juzFilter, setJuzFilter] = useState<number[]>([]);
  const [translationId, setTranslationId] = useState<number>(() => loadTranslationId());
  const [isPractice] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('practice') === 'true',
  );

  const [question, setQuestion] = useState<Question | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isPractice) {
      fetchPracticeQuestion(translationId)
        .then((q) => {
          setQuestion(q);
          setIsInitializing(false);
        })
        .catch(() => {
          setInitError(true);
          setIsInitializing(false);
        });
      return;
    }
    const filter = loadJuzFilter();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJuzFilter(filter);
    const urlToken = new URLSearchParams(window.location.search).get('token') ?? undefined;
    const stored = urlToken ?? localStorage.getItem(SESSION_KEY) ?? undefined;
    initSession(translationId, stored, filter.length > 0 ? filter : undefined)
      .then((data) => {
        localStorage.setItem(SESSION_KEY, data.sessionToken);
        setSessionToken(data.sessionToken);
        setQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setScore(data.totalScore);
        if (data.submitResult) {
          setSubmitResult(data.submitResult);
        }
        setIsInitializing(false);
      })
      .catch(() => {
        setInitError(true);
        setIsInitializing(false);
      });
  }, [isPractice, translationId]);

  const submitted = submitResult !== null;
  const isCorrect = submitResult?.isCorrect ?? false;

  const handleSubmit = () => {
    if ((!sessionToken && !isPractice) || selected === null || !question || submitResult !== null) {
      return;
    }
    startTransition(async () => {
      try {
        const result = isPractice
          ? await submitPracticeAnswer(question.encryptedVerseKey, question.answerToken, selected)
          : await submitAnswer(
              sessionToken!,
              question.encryptedVerseKey,
              question.answerToken,
              selected,
            );
        setSubmitResult(result);
        if (result.isCorrect) {
          setScore((s) => s + 1);
        }
      } catch {
        setFetchError(true);
      }
    });
  };

  const fetchNext = () => {
    startTransition(async () => {
      try {
        if (isPractice) {
          const q = await fetchPracticeQuestion(translationId);
          setQuestion(q);
          setQuestionNumber((n) => n + 1);
        } else {
          const { question: q, questionNumber: qn } = await fetchNextQuestion(
            sessionToken!,
            translationId,
            juzFilter.length > 0 ? juzFilter : undefined,
          );
          setQuestion(q);
          setQuestionNumber(qn);
        }
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleNext = () => {
    if (!sessionToken && !isPractice) {
      return;
    }
    setSelected(null);
    setSubmitResult(null);
    setQuestion(null);
    fetchNext();
  };

  const handleRetry = () => {
    if (!sessionToken && !isPractice) {
      return;
    }
    setFetchError(false);
    fetchNext();
  };

  const handleEndSession = async () => {
    if (!isPractice && sessionToken) {
      localStorage.removeItem(SESSION_KEY);
      await abandonSession(sessionToken);
    }
    window.location.href = '/quiz';
  };

  const handleTranslationChange = (newId: number) => {
    saveTranslationId(newId);
    setTranslationId(newId);
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
    submitted,
    isCorrect,
    score,
    translationId,
    handleTranslationChange,
    handleSubmit,
    handleNext,
    handleRetry,
    handleEndSession,
  };
}
