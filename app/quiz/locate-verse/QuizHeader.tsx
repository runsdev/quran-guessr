export default function QuizHeader({
  questionNumber,
  totalScore,
}: {
  questionNumber: number;
  totalScore: number;
}) {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
          Verse Location
        </span>
        <span className="text-base font-medium text-on-background">Question {questionNumber}</span>
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
