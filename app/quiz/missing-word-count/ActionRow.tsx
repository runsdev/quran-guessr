interface ActionRowProps {
  isCorrect: boolean;
  submitted: boolean;
  selected: number | null;
  loading: boolean;
  missingCount: number | null;
  userEloDelta: number | null;
  newUserElo: number | null;
  ranked: boolean;
  timedOut: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

const BTN =
  'bg-primary-container text-on-primary-container text-sm font-medium px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors active:scale-95 flex items-center gap-2';

export default function ActionRow({
  isCorrect,
  submitted,
  selected,
  loading,
  missingCount,
  userEloDelta,
  newUserElo,
  ranked,
  timedOut,
  onSubmit,
  onNext,
}: ActionRowProps) {
  return (
    <div className="w-full flex items-center justify-between min-h-12">
      <div role="status" aria-live="polite" aria-atomic="true" className="flex-1">
        {submitted && missingCount !== null ? (
          <div className="flex flex-col gap-1">
            <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect
                ? 'Correct!'
                : timedOut
                  ? `Time's up! The answer was ${missingCount} missing word${missingCount !== 1 ? 's' : ''}.`
                  : `The answer was ${missingCount} missing word${missingCount !== 1 ? 's' : ''}.`}
            </p>
            {userEloDelta !== null && newUserElo !== null ? (
              <p className="text-xs text-on-surface-variant">
                ELO:{' '}
                <span className={userEloDelta >= 0 ? 'text-green-700' : 'text-red-700'}>
                  {userEloDelta >= 0 ? '+' : ''}
                  {userEloDelta}
                </span>{' '}
                → <span className="font-semibold text-on-background">{Math.round(newUserElo)}</span>
              </p>
            ) : ranked === false && userEloDelta === null ? (
              <p className="text-xs text-on-surface-variant opacity-60">
                Unranked — daily limit reached
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="shrink-0">
        {submitted ? (
          <button
            onClick={onNext}
            disabled={loading}
            className={`${BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Next Question
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_forward
            </span>
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={selected === null || loading}
            className={`${BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Submit
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_forward
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
