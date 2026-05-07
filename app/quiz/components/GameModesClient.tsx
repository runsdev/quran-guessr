'use client';

import ChallengeCategories from './ChallengeCategories';
import IntegrityModal from './IntegrityModal';
import PrimaryGameModes from './PrimaryGameModes';
import { useGameModesState } from './useGameModesState';

interface Props {
  elo: number;
  dailyRankedCount: number;
  dailyRankedLimit: number;
}

export default function GameModesClient({ elo, dailyRankedCount, dailyRankedLimit }: Props) {
  const { modalOpen, modalKey, rankedLimitReached, openModal, handleConfirm, handleClose } =
    useGameModesState(dailyRankedCount, dailyRankedLimit);

  return (
    <>
      <IntegrityModal
        key={modalKey}
        open={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />

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
