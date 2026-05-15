'use client';

import { useTransition, useState, useMemo } from 'react';

import ActionRow from './ActionRow';
import { fetchNextQuestion, submitAnswer } from './actions';
import ChoicesGrid from './ChoicesGrid';
import QuizProgressHeader from './QuizProgressHeader';
import type { Question, SubmitResult } from './types';
import VerseCard from './VerseCard';

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
  const [selected, setSelected] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);

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

  const handleRetry = loadNextQuestion;

  const handleSubmit = () => {
    if (selected === null || !question || submitResult !== null) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitAnswer(
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

  const handleNext = () => {
    setSelected(null);
    setSubmitResult(null);
    setQuestion(null);
    setQuestionNumber((n) => n + 1);
    loadNextQuestion();
  };

  const submitted = submitResult !== null;
  const isCorrect = submitResult?.isCorrect ?? false;
  const masteryPercent = questionNumber > 1 ? Math.round((score / (questionNumber - 1)) * 100) : 0;
  const progressWidth = questionNumber > 1 ? `${(score / (questionNumber - 1)) * 100}%` : '0%';

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    question?.verseWords.forEach((w) => {
      if (w.page_number !== undefined) {
        nums.push(w.page_number);
      }
    });
    question?.choices.forEach((c) =>
      c.words.forEach((w) => {
        if (w.page_number !== undefined) {
          nums.push(w.page_number);
        }
      }),
    );
    return [...new Set(nums)];
  }, [question]);
  const loadedPages = useQcfFontLoader(pageNumbers);

  return (
    <>
      <TopAppBar activeTab="Quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-16 pb-24 md:pb-8">
        <QuizProgressHeader
          verseReference={question?.verseReference ?? null}
          questionNumber={questionNumber}
          masteryPercent={masteryPercent}
          progressWidth={progressWidth}
        />

        {/* Verse display */}
        <VerseCard
          verseWords={question?.verseWords ?? null}
          loading={isPending && question === null}
          error={fetchError}
          verseKey={submitted ? (submitResult?.verseKey ?? null) : null}
          loadedPages={loadedPages}
          onRetry={handleRetry}
        />

        {/* Prompt */}
        <div className="w-full text-center">
          <h2 className="text-2xl font-semibold text-on-background">What is the next Ayah?</h2>
          <p className="text-sm text-on-surface-variant mt-1">Select the correct continuation.</p>
        </div>

        {/* Choices */}
        {question && (
          <ChoicesGrid
            choices={question.choices}
            selected={selected}
            submitted={submitted}
            correctIndex={submitResult?.correctIndex ?? null}
            loadedPages={loadedPages}
            onSelect={setSelected}
          />
        )}

        {!question && !isPending && fetchError && (
          <div className="flex flex-col items-center gap-3 py-8">
            <span className="text-sm text-error">Failed to load question.</span>
            <button
              onClick={handleRetry}
              className="text-sm text-primary underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Action row */}
        <ActionRow
          isCorrect={isCorrect}
          submitted={submitted}
          selected={selected}
          loading={isPending}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      </main>
      <BottomNav />
    </>
  );
}
