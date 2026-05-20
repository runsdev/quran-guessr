'use client';

import type { LeaderboardTab } from './leaderboard-types';

interface InfoPanelProps {
  tab: LeaderboardTab;
}

export function InfoPanel({ tab }: InfoPanelProps) {
  return (
    <aside className="hidden lg:flex flex-col w-80 bg-surface-container-low border-l border-primary/10 p-8 overflow-y-auto shrink-0">
      <h2 className="text-xl font-bold text-on-surface mb-6">
        {tab === 'player' ? 'Player ELO' : tab === 'page' ? 'Page-Level ELO' : 'Daily Challenge'}
      </h2>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            {tab === 'daily' ? 'How It Works' : 'The Algorithm'}
          </h3>
          {tab === 'player' ? (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Your Player ELO reflects your performance against the{' '}
              <span className="text-primary">page difficulty</span>. ELO is calculated using a
              modified Glicko-2 system, which accounts for the number of questions answered to
              stabilize ratings for newer players.
            </p>
          ) : tab === 'daily' ? (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Each day, <span className="text-primary">5 random verses </span> are selected for
              everyone worldwide. Scores are based on how close your page &amp; row guess is —
              perfect guesses earn up to 5,000 pts per question (25,000 total).
            </p>
          ) : (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Unlike Surah-level tracking, Page ELO provides a{' '}
              <span className="text-primary">granular difficulty map</span> across the 604 pages.
              Pages gain ELO when players answer incorrectly.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}
