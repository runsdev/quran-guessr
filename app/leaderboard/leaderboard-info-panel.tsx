'use client';

import Image from 'next/image';

const QURAN_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCzVNydmKB58bxdb3OgfahabJW6_eKMkRj-2ha0GCVRSg1Rg3ropPXtIRH0Ml1Hg7Dzu-QUmEG8Od9OEGVcwTKkjL0IEC_yy1KydgOKxpekv-0JKFqumAlW0wltQgSF540z1vHvKHEtWPZniH6AQQrbipbTEOnokmEkwgklimClc2iGsE5eDnjKM6GM-KqqKtNtrZKiFRIRMxiJWIUOs4j33vbcPAO1bUtw2Vt-hYFaVP2MkN4dkI08C7hyzi1l2mLO5ZClvq1a3USk';

import type { LeaderboardTab } from './leaderboard-types';

interface InfoPanelProps {
  tab: LeaderboardTab;
}

export function InfoPanel({ tab }: InfoPanelProps) {
  return (
    <aside className="hidden lg:flex flex-col w-80 bg-surface-container-low border-l border-primary/10 p-8 overflow-y-auto shrink-0">
      <h2 className="text-xl font-bold text-on-surface mb-6">
        {tab === 'player' ? 'Player ELO' : 'Page-Level ELO'}
      </h2>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            The Algorithm
          </h3>
          {tab === 'player' ? (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Your Player ELO reflects your performance against the{' '}
              <span className="text-primary">page difficulty</span>. Win against hard pages to climb
              faster. Uses adaptive K-factor (K=40 new, K=32 regular, K=16 established).
            </p>
          ) : (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Unlike Surah-level tracking, Page ELO provides a{' '}
              <span className="text-primary">granular difficulty map</span> across the 604 pages.
              Pages gain ELO when players answer incorrectly.
            </p>
          )}
        </section>

        <div className="h-px bg-primary/10" />

        <section className="space-y-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Mastery Thresholds
          </h3>
          {tab === 'player' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Master (1,300+)</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Consistently beats difficult pages.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Intermediate (1,100 – 1,299)</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Solid recall with occasional misses.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-outline shrink-0" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Beginner (&lt; 1,100)</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Still building memorization strength.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-error shrink-0" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Hard (1,300+)</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Players frequently answer incorrectly.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Moderate (1,100 – 1,299)</p>
                  <p className="text-[11px] text-on-surface-variant">Mixed player performance.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-tertiary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-on-surface">Easy (&lt; 1,100)</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Players answer correctly most of the time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
          <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4">
            <Image
              src={QURAN_IMG}
              alt="Quran pages"
              fill
              className="object-cover opacity-60"
              unoptimized
            />
          </div>
          <p className="text-xs text-primary/80 italic text-center">
            &ldquo;The best of you are those who learn the Quran and teach it.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
