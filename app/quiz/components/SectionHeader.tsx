import { PrimaryGameModesProps } from './types';

type HeaderProps = Pick<PrimaryGameModesProps, 'openJuzPanel' | 'activeJuzCount'>;

export default function SectionHeader({ openJuzPanel, activeJuzCount }: HeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h3 className="text-2xl font-bold mb-1" style={{ color: '#222222' }}>
          Select Game Mode
        </h3>
        <p style={{ color: '#6a6a6a' }}>Choose your path to mastery.</p>
      </div>
      <button
        onClick={openJuzPanel}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors shrink-0"
        style={{
          border: '1px solid #dddddd',
          background: '#f7f7f7',
          color: '#6a6a6a',
          fontSize: 12,
        }}
        aria-label="Configure juz filter"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          filter_list
        </span>
        <span>
          Juz Filter
          {activeJuzCount < 30 && (
            <span
              className="ml-1 text-xs font-bold rounded-full px-1.5 py-0.5"
              style={{ background: '#ffd1da', color: '#ff385c' }}
            >
              {activeJuzCount}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
