'use client';

import { useState } from 'react';

import type { ActiveSession } from '../page';

import ChallengeCategories from './ChallengeCategories';
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
    useGameModesState(dailyRankedCount, dailyRankedLimit, activeSessions);

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

      <PrimaryGameModes
        elo={elo}
        dailyRankedCount={dailyRankedCount}
        dailyRankedLimit={dailyRankedLimit}
        rankedLimitReached={rankedLimitReached}
        openModal={openModal}
        openJuzPanel={() => setJuzPanelOpen(true)}
        activeJuzCount={activeJuzCount}
      />

      <ChallengeCategories rankedLimitReached={rankedLimitReached} openModal={openModal} />
    </>
  );
}
