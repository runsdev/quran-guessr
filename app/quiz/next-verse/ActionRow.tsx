interface ActionRowProps {
  isCorrect: boolean;
  submitted: boolean;
  selected: number | null;
  loading: boolean;
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
  onSubmit,
  onNext,
}: ActionRowProps) {
  return (
    <div className="w-full flex items-center justify-between min-h-12">
      {submitted ? (
        <p className={`text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-rose-400'}`}>
          {isCorrect ? 'Correct!' : 'Not quite — see the highlighted answer.'}
        </p>
      ) : (
        <span />
      )}
      {submitted ? (
        <button onClick={onNext} className={BTN}>
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
  );
}
