export default function QuizHeader({
  questionNumber,
  totalScore,
  onEndSession,
}: {
  questionNumber: number;
  totalScore: number;
  onEndSession?: () => void;
}) {
  return (
    <div className="w-full flex justify-between items-center pt-5">
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
          <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Verse Location
          </span>
          <span className="text-base font-medium text-on-background">
            Question {questionNumber}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>
          stars
        </span>
        <span className="text-sm font-semibold text-primary">
          {totalScore.toLocaleString()} pts
        </span>
      </div>
    </div>
  );
}
