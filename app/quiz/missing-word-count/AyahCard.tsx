import type { Question, VerseWord } from './types';

interface AyahCardProps {
  question: Question | null;
  loading: boolean;
  error: boolean;
  submitted: boolean;
  isCorrect: boolean;
  verseKey: string | null;
  hiddenWords: VerseWord[] | null;
  loadedPages: Set<number>;
  onRetry: () => void;
}

function WordSpan({
  word,
  loadedPages,
  highlight,
}: {
  word: VerseWord;
  loadedPages: Set<number>;
  highlight?: 'correct' | 'incorrect' | null;
}) {
  const highlightClass =
    highlight === 'correct'
      ? 'text-green-700 bg-green-400/10 rounded px-0.5'
      : highlight === 'incorrect'
        ? 'text-red-700 bg-red-400/10 rounded px-0.5'
        : '';

  const inner =
    word.char_type_name === 'end' ||
    word.page_number == null ||
    !loadedPages.has(word.page_number) ||
    !word.code_v2 ? (
      <span style={{ fontFamily: "UthmanicHafs, 'Traditional Arabic', serif" }}>
        {word.text_qpc_hafs}
      </span>
    ) : (
      <span
        style={{ fontFamily: `p${word.page_number}-v2` }}
        dangerouslySetInnerHTML={{ __html: word.code_v2 }}
      />
    );

  return <span className={highlightClass}>{inner} </span>;
}

export default function AyahCard({
  question,
  loading,
  error,
  submitted,
  isCorrect,
  verseKey,
  hiddenWords,
  loadedPages,
  onRetry,
}: AyahCardProps) {
  // Build ordered full-verse word list when we have hidden words after submission
  const fullVerseWords: { word: VerseWord; wasHidden: boolean }[] | null =
    submitted && hiddenWords && question
      ? (() => {
          const visible: { word: VerseWord; wasHidden: boolean }[] = question.segments
            .filter((seg): seg is { type: 'words'; words: VerseWord[] } => seg.type === 'words')
            .flatMap((seg) => seg.words.map((w) => ({ word: w, wasHidden: false })));
          const hidden: { word: VerseWord; wasHidden: boolean }[] = hiddenWords.map((w) => ({
            word: w,
            wasHidden: true,
          }));
          return [...visible, ...hidden].sort((a, b) => a.word.position - b.word.position);
        })()
      : null;

  return (
    <div className="w-full bg-surface-container/60 backdrop-blur-xl border border-surface-bright rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center justify-center min-h-50">
      <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      {loading && (
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span className="text-sm">Loading ayah…</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm text-error">Failed to load verse.</span>
          <button onClick={onRetry} className="text-sm text-primary underline underline-offset-2">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && question && !submitted && (
        <p lang="ar" dir="rtl" className="quran-text text-on-surface relative z-10 text-center">
          {question.segments
            .filter((seg): seg is { type: 'words'; words: VerseWord[] } => seg.type === 'words')
            .map((seg, segIdx) =>
              seg.words.map((word, wordIdx) => (
                <WordSpan key={`${segIdx}-${wordIdx}`} word={word} loadedPages={loadedPages} />
              )),
            )}
        </p>
      )}

      {!loading && !error && submitted && fullVerseWords && (
        <div className="flex flex-col items-center gap-3 w-full relative z-10">
          <p lang="ar" dir="rtl" className="quran-text text-on-surface text-center">
            {fullVerseWords.map((entry, idx) => (
              <WordSpan
                key={idx}
                word={entry.word}
                loadedPages={loadedPages}
                highlight={entry.wasHidden ? (isCorrect ? 'correct' : 'incorrect') : null}
              />
            ))}
          </p>
          {verseKey && (
            <span className="text-xs text-on-surface-variant/50 font-mono">{verseKey}</span>
          )}
        </div>
      )}
    </div>
  );
}
