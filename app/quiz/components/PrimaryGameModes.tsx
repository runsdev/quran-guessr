interface Props {
  elo: number;
  dailyRankedCount: number;
  dailyRankedLimit: number;
  rankedLimitReached: boolean;
  openModal: (href: string) => void;
}

export default function PrimaryGameModes({
  elo,
  dailyRankedCount,
  dailyRankedLimit,
  rankedLimitReached,
  openModal,
}: Props) {
  return (
    <section className="space-y-10 relative">
      <div className="absolute -left-20 top-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="flex items-end justify-between relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Select Game Mode</h3>
          <p className="text-on-surface-variant">Choose your path to mastery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative z-10">
        {/* Ranked Match */}
        <button
          onClick={() => openModal('/quiz/missing-word-count')}
          disabled={rankedLimitReached}
          className="group relative bg-linear-to-br from-surface-container to-surface-container-lowest border border-white/5 hover:border-primary/40 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(106,215,222,0.2)] hover:-translate-y-1 overflow-hidden flex flex-col text-left w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-white/5 disabled:hover:shadow-none"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:-rotate-12 transition-all duration-700">
            <span className="material-symbols-outlined text-[240px]">swords</span>
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(106,215,222,0.1)]">
                <span className="material-symbols-outlined text-primary text-3xl">
                  emoji_events
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm">
                  Competitive
                </span>
                {rankedLimitReached && (
                  <span className="bg-error/10 border border-error/30 text-error px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest">
                    Limit Reached
                  </span>
                )}
              </div>
            </div>
            <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300">
              Ranked Match
            </h4>
            <p className="text-on-surface-variant mb-10 leading-relaxed">
              Climb the global leaderboard. Guess the missing word count — every answer affects your
              ELO rating.
            </p>
            <div className="mt-auto flex items-center justify-between bg-black/20 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary/70">workspace_premium</span>
                <span className="text-sm font-medium text-white">
                  ELO: <span className="text-primary font-bold">{elo.toLocaleString()}</span>
                  {' · '}
                  <span className={rankedLimitReached ? 'text-error font-bold' : 'text-primary/70'}>
                    {dailyRankedCount}/{dailyRankedLimit} today
                  </span>
                </span>
              </div>
              <span className="bg-primary text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm group-hover:shadow-[0_0_20px_rgba(106,215,222,0.4)] group-hover:scale-105 transition-all duration-300 inline-block">
                {rankedLimitReached ? 'Limit Reached' : 'Enter Arena'}
              </span>
            </div>
          </div>
        </button>

        {/* Next Verse */}
        <button
          onClick={() => openModal('/quiz/next-verse')}
          className="group relative bg-linear-to-br from-surface-container to-surface-container-lowest border border-white/5 hover:border-tertiary/40 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(188,199,222,0.15)] hover:-translate-y-1 overflow-hidden flex flex-col text-left w-full"
        >
          <div className="absolute inset-0 bg-linear-to-br from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700">
            <span className="material-symbols-outlined text-[240px]">format_quote</span>
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-tertiary/20 to-tertiary/5 flex items-center justify-center border border-tertiary/20 shadow-[0_0_15px_rgba(188,199,222,0.1)]">
                <span className="material-symbols-outlined text-tertiary text-3xl">
                  auto_stories
                </span>
              </div>
              <span className="bg-slate-800/80 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm">
                Casual
              </span>
            </div>
            <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-tertiary transition-colors duration-300">
              Next Verse
            </h4>
            <p className="text-on-surface-variant mb-10 leading-relaxed">
              Given an Ayah, identify which verse comes next. A pure memory test with no ELO
              pressure.
            </p>
            <div className="mt-auto flex items-center justify-between bg-black/20 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary/70">shuffle</span>
                <span className="text-sm font-medium text-white">
                  Mode: <span className="text-tertiary font-bold">Free Play</span>
                </span>
              </div>
              <span className="border border-tertiary/50 text-tertiary px-6 py-2.5 rounded-lg font-bold text-sm group-hover:bg-tertiary/10 group-hover:border-tertiary group-hover:scale-105 transition-all duration-300 inline-block">
                Start Session
              </span>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
