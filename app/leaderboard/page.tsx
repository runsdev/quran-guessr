import LeaderboardClient from './LeaderboardClient';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getJuzForPage, getSurahsForPage } from '@/lib/quran-pages';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const session = await auth();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  // ── Player ELO leaderboard ────────────────────────────────────────────────
  const topUsers = await prisma.user.findMany({
    where: { elo: { not: 1000 } },
    orderBy: { elo: 'desc' },
    take: 50,
    select: { id: true, name: true, image: true, elo: true, gamesPlayed: true },
  });

  const playerEntries = topUsers.map((u, idx) => ({
    rank: idx + 1,
    userId: u.id,
    name: u.name ?? 'Anonymous',
    image: u.image ?? null,
    elo: Math.round(u.elo),
    eloChange: 0,
    gamesPlayed: u.gamesPlayed,
  }));

  // ── Page ELO leaderboard (hardest pages first) ────────────────────────────
  const pageEloRecords = await prisma.pageElo.findMany({
    orderBy: { elo: 'desc' },
  });

  const pageEntries = pageEloRecords.map((p, idx) => ({
    rank: idx + 1,
    pageNumber: p.pageNumber,
    elo: Math.round(p.elo),
    updatedAt: p.updatedAt,
    juz: getJuzForPage(p.pageNumber),
    surah: getSurahsForPage(p.pageNumber),
  }));

  // ── Stats ─────────────────────────────────────────────────────────────────
  const currentEntry = currentUserId
    ? playerEntries.find((e) => e.userId === currentUserId)
    : undefined;

  const globalAvgPlayerElo =
    playerEntries.length > 0
      ? Math.round(playerEntries.reduce((acc, e) => acc + e.elo, 0) / playerEntries.length)
      : 1000;

  const masteryCount = playerEntries.filter((e) => e.elo >= 1300).length;
  const playerMasteryRate =
    playerEntries.length > 0 ? ((masteryCount / playerEntries.length) * 100).toFixed(1) : '0.0';

  const globalAvgPageElo =
    pageEntries.length > 0
      ? Math.round(pageEntries.reduce((acc, e) => acc + e.elo, 0) / pageEntries.length)
      : 1200;

  const stats = {
    globalAvgPlayerElo,
    playerMasteryRate,
    currentUserElo: currentEntry ? currentEntry.elo : null,
    currentUserEloChange: 0,
    totalPlayerEntries: playerEntries.length,
    globalAvgPageElo,
    hardestPageNumber: pageEntries[0]?.pageNumber ?? null,
    easiestPageNumber: pageEntries[pageEntries.length - 1]?.pageNumber ?? null,
    totalPageEntries: pageEntries.length,
  };

  return (
    <>
      <TopAppBar activeTab="Rankings" />
      <LeaderboardClient
        playerEntries={playerEntries}
        pageEntries={pageEntries}
        currentUserId={currentUserId}
        stats={stats}
      />
      <BottomNav />
    </>
  );
}
