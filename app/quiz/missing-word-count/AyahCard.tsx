import type { Question, VerseWord } from './types';

interface AyahCardProps {
  question: Question | null;
  loading: boolean;
  error: boolean;
  submitted: boolean;
  verseKey: string | null;
  loadedPages: Set<number>;
  onRetry: () => void;
}

export default function AyahCard({
  question,
  loading,
  error,
  submitted,
  verseKey,
  loadedPages,
  onRetry,
}: AyahCardProps) {
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

      {!loading && !error && question && (
        <p className="quran-text text-on-surface relative z-10 text-center">
          {question.segments
            .filter((seg): seg is { type: 'words'; words: VerseWord[] } => seg.type === 'words')
            .map((seg, segIdx) =>
              seg.words.map((word, wordIdx) => (
                <span key={`${segIdx}-${wordIdx}`}>
                  {word.char_type_name === 'end' || !loadedPages.has(word.page_number) ? (
                    <span style={{ fontFamily: "UthmanicHafs, 'Traditional Arabic', serif" }}>
                      {word.text_qpc_hafs}
                    </span>
                  ) : (
                    <span
                      style={{ fontFamily: `p${word.page_number}-v2` }}
                      dangerouslySetInnerHTML={{ __html: word.code_v2 }}
                    />
                  )}{' '}
                </span>
              )),
            )}
        </p>
      )}

      {submitted && verseKey && (
        <span className="absolute bottom-3 left-4 text-xs text-on-surface-variant/50 font-mono z-10">
          {verseKey}
        </span>
      )}
    </div>
  );
}
