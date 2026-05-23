export default function QuizProgressHeader({
  questionNumber,
  score,
  onEndSession,
}: {
  questionNumber: number;
  score?: number;
  onEndSession?: () => void;
}) {
  const totalAnswered = questionNumber - 1;
  const masteryPct = totalAnswered > 0 && score !== undefined ? (score / totalAnswered) * 100 : 0;

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center">
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
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Verse Translation
              </span>
              <span className="text-base font-medium text-on-background">
                Question {questionNumber}
              </span>
            </div>
          </div>
          {totalAnswered > 0 && score !== undefined && (
            <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>
                check_circle
              </span>
              <span className="text-sm font-semibold text-secondary">
                {score}/{totalAnswered}
              </span>
            </div>
          )}
        </div>
        {totalAnswered > 0 && (
          <div
            className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(masteryPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Mastery: ${Math.round(masteryPct)}%`}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${masteryPct}%` }}
            />
          </div>
        )}
      </div>
    </>
  );
}
