'use client';

import { useTransition, useState, useMemo } from 'react';

import ActionRow from './ActionRow';
import { fetchNextQuestion, submitAnswer } from './actions';
import AnswerGrid, { type Option } from './AnswerGrid';
import AyahCard from './AyahCard';
import TimerBar from './TimerBar';
import type { Question, SubmitResult } from './types';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { useQcfFontLoader } from '@/app/quiz/useQcfFontLoader';

interface QuizClientProps {
  initialQuestion: Question;
}

export default function QuizClient({ initialQuestion }: QuizClientProps) {
  const [question, setQuestion] = useState<Question | null>(initialQuestion);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);

  const submitted = submitResult !== null;
  const isCorrect = submitResult?.isCorrect ?? false;
  const timedOut = selected === null && submitted;

  const doSubmit = (guess: number) => {
    if (!question || submitted) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitAnswer(
          question.encryptedVerseKey,
          question.answerToken,
          guess,
          question.encryptedHiddenWords,
        );
        setSubmitResult(result);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleTimerExpire = () => doSubmit(0);
  const handleSubmit = () => doSubmit(selected ?? 0);

  const loadNextQuestion = () => {
    setFetchError(false);
    startTransition(async () => {
      try {
        const data = await fetchNextQuestion();
        setQuestion(data);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitResult(null);
    setQuestion(null);
    setQuestionNumber((n) => n + 1);
    loadNextQuestion();
  };

  const displayPageElo = submitResult?.newPageElo ?? question?.pageElo ?? null;

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    question?.segments.forEach((seg) => {
      if (seg.type === 'words') {
        seg.words.forEach((w) => nums.push(w.page_number));
      }
    });
    return [...new Set(nums)];
  }, [question]);
  const loadedPages = useQcfFontLoader(pageNumbers);

  return (
    <>
      <TopAppBar activeTab="Quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-16 pb-24 md:pb-8">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
              Missing Word Count
            </span>
            <span className="text-base font-medium text-on-background">
              Question {questionNumber}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant">
            <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>
              bar_chart
            </span>
            <span className="text-sm font-semibold text-secondary">
              {displayPageElo !== null ? `Page ELO ${displayPageElo}` : '—'}
            </span>
          </div>
        </div>

        <TimerBar
          key={questionNumber}
          totalWords={question?.totalWords ?? 0}
          submitted={submitted}
          onExpire={handleTimerExpire}
        />

        <AyahCard
          question={question}
          loading={isPending}
          error={fetchError}
          submitted={submitted}
          isCorrect={isCorrect}
          verseKey={submitResult?.verseKey ?? null}
          hiddenWords={submitResult?.hiddenWords ?? null}
          loadedPages={loadedPages}
          onRetry={loadNextQuestion}
        />

        <div className="w-full text-center">
          <h2 className="text-2xl font-semibold text-on-background">
            How many words are missing from this Ayah?
          </h2>
        </div>

        <AnswerGrid
          selected={selected}
          submitted={submitted}
          correctAnswer={submitResult?.correctAnswer ?? null}
          isCorrect={isCorrect}
          onSelect={(n) => setSelected(n)}
        />

        <ActionRow
          isCorrect={isCorrect}
          submitted={submitted}
          selected={selected}
          loading={isPending}
          missingCount={submitResult?.correctAnswer ?? null}
          userEloDelta={submitResult?.userEloDelta ?? null}
          newUserElo={submitResult?.newUserElo ?? null}
          ranked={submitResult?.ranked ?? false}
          timedOut={timedOut}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      </main>
      <BottomNav />
    </>
  );
}
