'use client';

import ActionRow from './ActionRow';
import LocationGrid from './LocationGrid';
import QuizError from './QuizError';
import QuizHeader from './QuizHeader';
import QuizPrompt from './QuizPrompt';
import TimerBar from './TimerBar';
import { useQuizState } from './useQuizState';
import VerseCard from './VerseCard';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { useQcfFontLoader } from '@/app/quiz/useQcfFontLoader';

export default function QuizClient() {
  const state = useQuizState();
  const loadedPages = useQcfFontLoader(state.pageNumbers);

  return (
    <>
      <TopAppBar activeTab="Quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-16 pb-24 md:pb-8">
        {state.isInitializing ? (
          <div className="flex items-center justify-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span className="text-sm">Loading quiz…</span>
          </div>
        ) : state.initError ? (
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
            <QuizHeader
              questionNumber={state.questionNumber}
              totalScore={state.totalScore}
              onEndSession={state.handleEndSession}
            />

            {state.question && (
              <TimerBar
                key={state.questionNumber}
                submitted={state.submitted}
                onExpire={state.handleTimerExpire}
                initialTimeLeft={state.initialTimeLeft}
              />
            )}

            <VerseCard
              verseWords={state.question?.verseWords ?? null}
              loading={state.isPending && state.question === null}
              error={state.fetchError}
              loadedPages={loadedPages}
              onRetry={state.handleRetry}
            />

            <QuizPrompt />

            {state.question && (
              <LocationGrid
                selectedPage={state.selectedPage}
                selectedLine={state.selectedLine}
                submitted={state.submitted}
                correctPage={state.submitResult?.correctPage ?? null}
                correctLine={state.submitResult?.correctLine ?? null}
                onSelectPage={state.setSelectedPage}
                onSelectLine={state.setSelectedLine}
              />
            )}

            {!state.question && !state.isPending && state.fetchError && (
              <QuizError onRetry={state.handleRetry} />
            )}

            <ActionRow
              submitResult={state.submitResult}
              submitted={state.submitted}
              selectedPage={state.selectedPage}
              selectedLine={state.selectedLine}
              loading={state.isPending}
              onSubmit={state.handleSubmit}
              onNext={state.handleNext}
            />
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
}
