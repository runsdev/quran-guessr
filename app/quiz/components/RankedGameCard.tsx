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
      style={{ background: '#ffffff', border: '1px solid #dddddd' }}
    >
      <div className="flex justify-between items-start mb-6 w-full">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ background: '#ffd1da', border: '1px solid #ffb3c2' }}
        >
          <span className="material-symbols-outlined text-3xl" style={{ color: '#ff385c' }}>
            emoji_events
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: '#ffd1da', color: '#ff385c' }}
          >
            Competitive
          </span>
          {rankedLimitReached && (
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: '#fde8e0', color: '#c13515' }}
            >
              Limit Reached
            </span>
          )}
        </div>
      </div>
      <h4 className="text-2xl font-bold mb-3" style={{ color: '#222222' }}>
        Missing Word Count
      </h4>
      <p className="mb-8 leading-relaxed" style={{ color: '#6a6a6a' }}>
        Climb the global leaderboard. Guess the missing word count — every answer affects your ELO
        rating.
      </p>
      <div
        className="mt-auto flex items-center justify-between rounded-xl p-4 w-full"
        style={{ background: '#f2f2f2', border: '1px solid #dddddd' }}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined" style={{ color: '#ff385c', opacity: 0.7 }}>
            workspace_premium
          </span>
          <span className="text-sm font-medium" style={{ color: '#222222' }}>
            ELO: <span style={{ color: '#ff385c', fontWeight: 700 }}>{elo.toLocaleString()}</span>
            {' · '}
            <span
              style={{
                color: rankedLimitReached ? '#c13515' : '#6a6a6a',
                fontWeight: rankedLimitReached ? 700 : 400,
              }}
            >
              {dailyRankedCount}/{dailyRankedLimit} today
            </span>
          </span>
        </div>
        <span
          className="px-6 py-2.5 rounded-lg font-bold text-sm inline-block"
          style={{ background: '#ff385c', color: '#ffffff' }}
        >
          {rankedLimitReached ? 'Limit Reached' : 'Start'}
        </span>
      </div>
    </button>
  );
}
