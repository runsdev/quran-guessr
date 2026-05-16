'use client';

import { useState } from 'react';

import type { ActiveSession } from '../page';

import ChallengeCategories from './ChallengeCategories';
import ContinueSessions from './ContinueSessions';
import IntegrityModal from './IntegrityModal';
import JuzFilterSettings, { loadJuzFilter } from './JuzFilterSettings';
import PrimaryGameModes from './PrimaryGameModes';
import { useGameModesState } from './useGameModesState';

interface Props {
  elo: number;
  dailyRankedCount: number;
  dailyRankedLimit: number;
  activeSessions: ActiveSession[];
}

export default function GameModesClient({
  elo,
  dailyRankedCount,
  dailyRankedLimit,
  activeSessions,
}: Props) {
  const { modalOpen, modalKey, rankedLimitReached, openModal, handleConfirm, handleClose } =
    useGameModesState(dailyRankedCount, dailyRankedLimit);

  const [juzPanelOpen, setJuzPanelOpen] = useState(false);
  const [activeJuzCount, setActiveJuzCount] = useState<number>(() => {
    const saved = loadJuzFilter();
    return saved.length > 0 ? saved.length : 30;
  });

  const handleJuzPanelClose = () => {
    setJuzPanelOpen(false);
    // Refresh badge after saving
    const saved = loadJuzFilter();
    setActiveJuzCount(saved.length > 0 ? saved.length : 30);
  };

  return (
    <>
      <IntegrityModal
        key={modalKey}
        open={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />

      <JuzFilterSettings open={juzPanelOpen} onClose={handleJuzPanelClose} />

      {/* Juz filter pill */}
      <div className="flex justify-end">
        <button
          onClick={() => setJuzPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant bg-surface-container-high text-sm text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors"
          aria-label="Configure juz filter"
        >
          <span className="material-symbols-outlined text-base">filter_list</span>
          <span>
            Juz Filter
            {activeJuzCount < 30 && (
              <span className="ml-1.5 bg-primary/20 text-primary text-xs font-bold rounded-full px-2 py-0.5">
                {activeJuzCount}
              </span>
            )}
          </span>
        </button>
      </div>

      <ContinueSessions sessions={activeSessions} />

      <PrimaryGameModes
        elo={elo}
        dailyRankedCount={dailyRankedCount}
        dailyRankedLimit={dailyRankedLimit}
        rankedLimitReached={rankedLimitReached}
        openModal={openModal}
      />

      <ChallengeCategories rankedLimitReached={rankedLimitReached} openModal={openModal} />
    </>
  );
}
