'use client';

import { useState } from 'react';

import { InfoPanel } from './leaderboard-info-panel';
import { PageEloTable } from './leaderboard-page-table';
import LeaderboardStatsCards from './leaderboard-stats-cards';
import { LeaderboardTable } from './leaderboard-table';
import type {
  LeaderboardEntry,
  LeaderboardStats,
  LeaderboardTab,
  PageEloEntry,
} from './leaderboard-types';

export type { LeaderboardEntry, LeaderboardStats };

interface Props {
  playerEntries: LeaderboardEntry[];
  pageEntries: PageEloEntry[];
  currentUserId?: string;
  stats: LeaderboardStats;
}

const PAGE_SIZE = 10;

export default function LeaderboardClient({
  playerEntries,
  pageEntries,
  currentUserId,
  stats,
}: Props) {
  const [tab, setTab] = useState<LeaderboardTab>('player');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const filteredPlayers = playerEntries.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredPages = pageEntries.filter((e) => String(e.pageNumber).includes(search));
  const filtered = tab === 'player' ? filteredPlayers : filteredPages;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedPlayers = filteredPlayers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pagedPages = filteredPages.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleTabChange = (newTab: LeaderboardTab) => {
    setTab(newTab);
    setSearch('');
    setPage(0);
  };

  return (
    <div className="flex h-screen pt-16 overflow-hidden bg-surface text-on-surface">
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-2">
                {tab === 'player' ? 'Player Rankings' : 'Page Difficulty Rankings'}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {tab === 'player'
                  ? 'Players ranked by their ELO rating earned through the Missing Word Count quiz.'
                  : 'Quran pages ranked by difficulty — higher ELO means players answer incorrectly more often.'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 shrink-0 bg-surface-container border border-outline-variant rounded-xl p-1">
              <button
                onClick={() => handleTabChange('player')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === 'player'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  Player ELO
                </span>
              </button>
              <button
                onClick={() => handleTabChange('page')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab !== 'player'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  Page ELO
                </span>
              </button>
            </div>
          </div>

          <LeaderboardStatsCards stats={stats} tab={tab} />

          <div className="flex justify-end">
            <div className="flex items-center gap-2 bg-surface-container border border-outline-variant rounded-xl px-3 py-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder={tab === 'player' ? 'Search players…' : 'Search page number…'}
                className="bg-transparent text-on-surface text-sm outline-none placeholder:text-on-surface-variant w-44"
              />
            </div>
          </div>

          <div className="bg-surface-container-low border border-primary/20 rounded-3xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant text-sm">
                No entries found.
              </div>
            ) : tab === 'player' ? (
              <LeaderboardTable paged={pagedPlayers} currentUserId={currentUserId} />
            ) : (
              <PageEloTable paged={pagedPages} />
            )}
            <div className="p-6 bg-surface-container-lowest/40 border-t border-primary/10 flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">
                Showing {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}–
                {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}{' '}
                {tab === 'player' ? 'players' : 'pages'}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <span className="material-symbols-outlined">arrow_back_ios</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1 || totalPages === 0}
                  className="text-primary transition-colors disabled:opacity-30"
                  aria-label="Next page"
                >
                  <span className="material-symbols-outlined">arrow_forward_ios</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <InfoPanel tab={tab} />
    </div>
  );
}
