interface Props {
  rankedLimitReached: boolean;
  openModal: (href: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ChallengeCategories({ rankedLimitReached, openModal }: Props) {
  return (
    <section className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-1" style={{ color: '#222222' }}>
          Challenge Categories
        </h3>
        <p style={{ color: '#6a6a6a' }}>Targeted mini-games to hone specific skills.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Verse */}
        <button
          onClick={() => openModal('/quiz/next-verse')}
          className="game-card card-shadow p-6 rounded-2xl text-left w-full transition-all hover:-translate-y-0.5"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#ffd1da' }}
          >
            <span className="material-symbols-outlined" style={{ color: '#ff385c' }}>
              format_quote
            </span>
          </div>
          <h5 className="font-bold mb-2" style={{ color: '#222222' }}>
            Next Verse
          </h5>
          <p className="text-sm leading-relaxed" style={{ color: '#6a6a6a' }}>
            Guess the next verse in sequence.
          </p>
        </button>

        {/* Verse Location */}
        <button
          onClick={() => openModal('/quiz/locate-verse')}
          className="game-card card-shadow p-6 rounded-2xl text-left w-full transition-all hover:-translate-y-0.5"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#ffd1da' }}
          >
            <span className="material-symbols-outlined" style={{ color: '#ff385c' }}>
              my_location
            </span>
          </div>
          <h5 className="font-bold mb-2" style={{ color: '#222222' }}>
            Verse Location
          </h5>
          <p className="text-sm leading-relaxed" style={{ color: '#6a6a6a' }}>
            Identify the page and row of an Ayah. Used in daily challenges.
          </p>
        </button>

        {/* Meaning Match — coming soon */}
        <div
          className="p-6 rounded-2xl cursor-not-allowed opacity-50"
          style={{ background: '#f7f7f7', border: '1px solid #dddddd' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#ebebeb' }}
          >
            <span className="material-symbols-outlined" style={{ color: '#6a6a6a' }}>
              translate
            </span>
          </div>
          <h5 className="font-bold mb-2" style={{ color: '#222222' }}>
            Meaning Match
          </h5>
          <p className="text-sm leading-relaxed" style={{ color: '#6a6a6a' }}>
            Identify the correct translation.
          </p>
          <span
            className="inline-block mt-3 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: '#6a6a6a', border: '1px solid #dddddd' }}
          >
            Coming Soon
          </span>
        </div>
      </div>
    </section>
  );
}
