import { useState } from 'react';

import { useRouter } from 'next/navigation';

export function useGameModesState(dailyRankedCount: number, dailyRankedLimit: number) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [pendingHref, setPendingHref] = useState('');

  const openModal = (href: string) => {
    setPendingHref(href);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    router.push(pendingHref);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const rankedLimitReached = dailyRankedCount >= dailyRankedLimit;

  return {
    modalOpen,
    modalKey,
    rankedLimitReached,
    openModal,
    handleConfirm,
    handleClose,
  };
}
