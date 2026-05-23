'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

import { TranslationQuizSkeleton } from './loading';
import TranslationChoicesGrid from './TranslationChoicesGrid';
import TranslationSelector from './TranslationSelector';
import { useTranslationQuizState } from './useTranslationQuizState';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import ActionRow from '@/app/quiz/next-verse/ActionRow';
import QuizProgressHeader from '@/app/quiz/next-verse/QuizProgressHeader';
import VerseCard from '@/app/quiz/next-verse/VerseCard';
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
    score,
    translationId,
    handleTranslationChange,
    handleSubmit,
    handleNext,
    handleRetry,
    handleEndSession,
  } = useTranslationQuizState();

  const pageNumbers =
    question?.verseWords.filter((w) => w.page_number !== undefined).map((w) => w.page_number!) ??
    [];
  const loadedPages = useQcfFontLoader([...new Set(pageNumbers)]);

  if (isInitializing) {
    return <TranslationQuizSkeleton />;
  }

  return (
    <>
      <TopAppBar activeTab="Quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
        {initError ? (
          <div role="alert" className="flex flex-col items-center gap-3 py-8">
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
            <QuizProgressHeader
              questionNumber={questionNumber}
              score={score}
              onEndSession={async () => {
                toast.info('Session ended');
                await handleEndSession();
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={questionNumber}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-6"
              >
                <VerseCard
                  verseWords={question?.verseWords ?? null}
                  loading={isPending && question === null}
                  error={fetchError}
                  verseKey={submitted ? (submitResult?.verseKey ?? null) : null}
                  loadedPages={loadedPages}
                  onRetry={handleRetry}
                />

                <div className="w-full flex flex-col items-center gap-2">
                  <h2 className="text-2xl font-semibold text-on-background">
                    Which is the correct translation?
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    Select the matching translation for this Ayah.
                  </p>
                  <div className="mt-1">
                    <TranslationSelector
                      value={translationId}
                      onChange={handleTranslationChange}
                      disabled={submitted || isPending}
                    />
                  </div>
                </div>

                {question && (
                  <TranslationChoicesGrid
                    choices={question.choices}
                    selected={selected}
                    submitted={submitted}
                    correctIndex={submitResult?.correctIndex ?? null}
                    onSelect={setSelected}
                  />
                )}

                {isPending && !question && !fetchError && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((n) => (
                      <div key={n} className="h-24 rounded-xl bg-surface-container animate-pulse" />
                    ))}
                  </div>
                )}

                {!question && !isPending && fetchError && (
                  <div role="alert" className="flex flex-col items-center gap-3 py-8">
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
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
}
