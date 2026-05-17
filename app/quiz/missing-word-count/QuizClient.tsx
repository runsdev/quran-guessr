'use client';

import ActionRow from './ActionRow';
import AnswerGrid from './AnswerGrid';
import AyahCard from './AyahCard';
import TimerBar from './TimerBar';
import { useMissingWordCountState } from './useMissingWordCountState';

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
    handleEndSession,
  } = useMissingWordCountState();
  const loadedPages = useQcfFontLoader(pageNumbers);

  return (
    <>
      <TopAppBar activeTab="Quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-16 pb-24 md:pb-8">
        {isInitializing ? (
          <div className="flex items-center justify-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span className="text-sm">Loading quiz…</span>
          </div>
        ) : initError ? (
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
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEndSession}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                  aria-label="End session"
                  title="End session and return to quiz hub"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Missing Word Count
                  </span>
                  <span className="text-base font-medium text-on-background">
                    Question {questionNumber}
                  </span>
                </div>
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
              initialTimeLeft={initialTimeLeft}
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
              onRetry={handleRetry}
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
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
}
