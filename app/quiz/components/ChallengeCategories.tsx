interface Props {
  rankedLimitReached: boolean;
  openModal: (href: string) => void;
}

export default function ChallengeCategories({ rankedLimitReached, openModal }: Props) {
  return (
    <section className="space-y-10 relative">
      <div className="flex items-end justify-between relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Challenge Categories</h3>
          <p className="text-on-surface-variant">Targeted mini-games to hone specific skills.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {/* Verse Quest */}
        <button
          onClick={() => openModal('/quiz/next-verse')}
          className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl hover:bg-surface-container hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1 text-left w-full"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
            <span className="material-symbols-outlined text-primary">format_quote</span>
          </div>
          <h5 className="font-bold text-white mb-2 group-hover:text-primary transition-colors">
            Verse Quest
          </h5>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Guess the next Ayah in sequence.
          </p>
        </button>

        {/* Verse Location */}
        <button
          onClick={() => openModal('/quiz/locate-verse')}
          className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl hover:bg-surface-container hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1 text-left w-full"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
            <span className="material-symbols-outlined text-primary">my_location</span>
          </div>
          <h5 className="font-bold text-white mb-2 group-hover:text-primary transition-colors">
            Verse Location
          </h5>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Identify the page and row of an Ayah.
          </p>
        </button>

        {/* Meaning Match */}
        <div className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl transition-all duration-300 group opacity-50 cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-primary">translate</span>
          </div>
          <h5 className="font-bold text-white mb-2">Meaning Match</h5>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Identify the correct translation.
          </p>
          <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 border border-outline-variant/40 px-2 py-0.5 rounded-full">
            Coming Soon
          </span>
        </div>

        {/* Missing Word Count (Ranked) */}
        <button
          onClick={() => openModal('/quiz/missing-word-count')}
          disabled={rankedLimitReached}
          className="bg-surface-container/50 border border-white/5 p-6 rounded-2xl hover:bg-surface-container hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1 text-left w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-white/5"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
            <span className="material-symbols-outlined text-primary">find_replace</span>
          </div>
          <h5 className="font-bold text-white mb-2 group-hover:text-primary transition-colors">
            Missing Word Count
          </h5>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Guess how many words are hidden. Affects ELO.
          </p>
        </button>
      </div>
    </section>
  );
}
