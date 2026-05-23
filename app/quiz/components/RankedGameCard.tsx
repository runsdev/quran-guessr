import { PrimaryGameModesProps } from './types';

type RankedProps = Omit<PrimaryGameModesProps, 'openJuzPanel' | 'activeJuzCount'>;

export default function RankedGameCard({
  elo,
  dailyRankedCount,
  dailyRankedLimit,
  rankedLimitReached,
  openModal,
}: RankedProps) {
  return (
    <button
      onClick={() => openModal('/quiz/missing-word-count')}
      disabled={rankedLimitReached}
      className="game-card card-shadow group flex flex-col text-left w-full p-8 rounded-2xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline)',
      }}
    >
      <div className="flex justify-between items-start mb-6 w-full">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: 'var(--color-primary-container)',
            border: '1px solid #ffb3c2',
          }}
        >
          <span
            className="material-symbols-outlined text-3xl"
            style={{ color: 'var(--color-primary)' }}
          >
            emoji_events
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'var(--color-primary-container)',
              color: 'var(--color-primary)',
            }}
          >
            Competitive
          </span>
          {rankedLimitReached && (
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: '#fde8e0', color: 'var(--color-error)' }}
              title={`Daily limit of ${dailyRankedLimit} ranked games reached. Resets at midnight UTC.`}
            >
              Limit Reached
            </span>
          )}
        </div>
      </div>
      <h4 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
        Missing Word Count
      </h4>
      <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
        Climb the global leaderboard. Guess the missing word count — every answer affects your ELO
        rating.
      </p>
      <div
        className="mt-auto flex items-center justify-between rounded-xl p-4 w-full"
        style={{
          background: 'var(--color-surface-container)',
          border: '1px solid var(--color-outline)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined"
            style={{ color: 'var(--color-primary)', opacity: 0.7 }}
          >
            workspace_premium
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
            <span title="Your ELO rating — starts at 1000. Correct answers increase it, wrong answers decrease it.">
              ELO:{' '}
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                {elo.toLocaleString()}
              </span>
            </span>
            {' · '}
            <span
              title={`${dailyRankedCount} of ${dailyRankedLimit} ranked games played today. Resets at midnight UTC.`}
              style={{
                color: rankedLimitReached
                  ? 'var(--color-error)'
                  : 'var(--color-on-surface-variant)',
                fontWeight: rankedLimitReached ? 700 : 400,
              }}
            >
              {dailyRankedCount}/{dailyRankedLimit} today
            </span>
          </span>
        </div>
        <span
          className="px-6 py-2.5 rounded-lg font-bold text-sm inline-block"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
          }}
        >
          {rankedLimitReached ? 'Limit Reached' : 'Start'}
        </span>
      </div>
    </button>
  );
}
