'use client';

import ActionRow from './ActionRow';
import ChoicesGrid from './ChoicesGrid';
import { NextVerseSkeleton } from './loading';
import QuizProgressHeader from './QuizProgressHeader';
import { useNextVerseState } from './useNextVerseState';
import VerseCard from './VerseCard';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { useQcfFontLoader } from '@/app/quiz/useQcfFontLoader';

export default function QuizClient() {
  const {
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
    pageNumbers,
    handleSubmit,
    handleNext,
    handleRetry,
    handleEndSession,
  } = useNextVerseState();
  const loadedPages = useQcfFontLoader(pageNumbers);

  if (isInitializing) {
    return <NextVerseSkeleton />;
  }

  return (
    <>
      <TopAppBar activeTab="Quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
        {initError ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <span className="text-sm text-error">Failed to start quiz session.</span>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <QuizProgressHeader questionNumber={questionNumber} onEndSession={handleEndSession} />

            <VerseCard
              verseWords={question?.verseWords ?? null}
              loading={isPending && question === null}
              error={fetchError}
              verseKey={submitted ? (submitResult?.verseKey ?? null) : null}
              loadedPages={loadedPages}
              onRetry={handleRetry}
            />

            <div className="w-full text-center">
              <h2 className="text-2xl font-semibold text-on-background">What is the next Ayah?</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Select the correct continuation.
              </p>
            </div>

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

            <ActionRow
              isCorrect={isCorrect}
              submitted={submitted}
              selected={selected}
              loading={isPending}
              onSubmit={handleSubmit}
              onNext={handleNext}
            />
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
}
