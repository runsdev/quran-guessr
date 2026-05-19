import { PrimaryGameModesProps } from './types';

type DailyProps = Pick<PrimaryGameModesProps, 'openModal'>;

export default function DailyGameCard({ openModal }: DailyProps) {
  return (
    <button
      onClick={() => openModal('/quiz/locate-verse/daily')}
      className="game-card card-shadow group flex flex-col text-left w-full p-8 rounded-2xl transition-all hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-start mb-6 w-full">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ background: '#f0f0f0', border: '1px solid #dddddd' }}
        >
          <span className="material-symbols-outlined text-3xl" style={{ color: '#6a6a6a' }}>
            auto_stories
          </span>
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ background: '#f7f7f7', border: '1px solid #dddddd', color: '#6a6a6a' }}
        >
          Daily Casual
        </span>
      </div>
      <h4 className="text-2xl font-bold mb-3" style={{ color: '#222222' }}>
        Locate the Verse
      </h4>
      <p className="mb-8 leading-relaxed" style={{ color: '#6a6a6a' }}>
        5 verses · same for everyone · new challenge each day · identify the page and row of an
        Ayah.
      </p>
      <div
        className="mt-auto flex items-center justify-between rounded-xl p-4 w-full"
        style={{ background: '#f7f7f7', border: '1px solid #dddddd' }}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined" style={{ color: '#6a6a6a' }}>
            shuffle
          </span>
          <span className="text-sm font-medium" style={{ color: '#222222' }}>
            Mode: <span style={{ color: '#6a6a6a', fontWeight: 700 }}>Daily Free Play</span>
          </span>
        </div>
        <span
          className="px-6 py-2.5 rounded-lg font-bold text-sm inline-block"
          style={{ border: '1px solid #dddddd', color: '#222222', background: '#ffffff' }}
        >
          Start
        </span>
      </div>
    </button>
  );
}
