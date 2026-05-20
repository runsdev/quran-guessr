export default function QuizProgressHeader({
  questionNumber,
  onEndSession,
}: {
  questionNumber: number;
  onEndSession?: () => void;
}) {
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onEndSession && (
            <button
              onClick={onEndSession}
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
              aria-label="End session"
              title="End session and return to quiz hub"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-base font-medium text-on-background">
              Question {questionNumber}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
