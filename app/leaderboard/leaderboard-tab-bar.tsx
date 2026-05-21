'use client';

import type { LeaderboardTab } from './leaderboard-types';

export const TAB_META: Record<
  LeaderboardTab,
  { title: string; desc: string; placeholder: string; empty: string; noun: string }
> = {
  player: {
    title: 'Player Rankings',
    desc: 'Players ranked by their ELO rating earned through the Missing Word Count quiz.',
    placeholder: 'Search players…',
    empty: 'No entries found.',
    noun: 'players',
  },
  page: {
    title: 'Page Difficulty Rankings',
    desc: 'Quran pages ranked by difficulty — higher ELO means players answer incorrectly more often.',
    placeholder: 'Search page number…',
    empty: 'No entries found.',
    noun: 'pages',
  },
  daily: {
    title: 'Daily Challenge Rankings',
    desc: "Top scores for today's 5-question Locate Verse challenge.",
    placeholder: 'Search players…',
    empty: "No one has completed today's challenge yet.",
    noun: 'completions',
  },
};

const TABS: { id: LeaderboardTab; label: string; icon: string }[] = [
  { id: 'player', label: 'Player ELO', icon: 'person' },
  { id: 'page', label: 'Page ELO', icon: 'menu_book' },
  { id: 'daily', label: 'Daily', icon: 'today' },
];

interface Props {
  tab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
  search: string;
  onSearchChange: (v: string) => void;
  placeholder: string;
}

export function LeaderboardTabBar({
  tab,
  onTabChange,
  search,
  onSearchChange,
  placeholder,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div
        role="tablist"
        aria-label="Leaderboard categories"
        className="flex gap-1 shrink-0 bg-surface-container border border-outline-variant rounded-xl p-1"
      >
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTabChange(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${tab === id ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
              {label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-surface-container border border-outline-variant rounded-xl px-3 py-2">
        <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
          search
        </span>
        <input
          type="search"
          aria-label="Search leaderboard"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-on-surface text-sm outline-none placeholder:text-on-surface-variant w-44"
        />
      </div>
    </div>
  );
}
