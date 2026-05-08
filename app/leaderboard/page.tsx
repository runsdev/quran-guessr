import LeaderboardClient from './LeaderboardClient';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { auth } from '@/auth';
import { getOrCreateDailyChallenge, getUtcDateStr } from '@/lib/daily-challenge';
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
    select: {
      id: true,
      name: true,
      image: true,
      elo: true,
      gamesPlayed: true,
      mwcCorrect: true,
      lvGames: true,
      lvCorrect: true,
      nvGames: true,
      nvCorrect: true,
    },
  });

  const playerEntries = topUsers.map((u, idx) => ({
    rank: idx + 1,
    userId: u.id,
    name: u.name ?? 'Anonymous',
    image: u.image ?? null,
    elo: Math.round(u.elo),
    eloChange: 0,
    gamesPlayed: u.gamesPlayed,
    mwcCorrect: u.mwcCorrect,
    lvGames: u.lvGames,
    lvCorrect: u.lvCorrect,
    nvGames: u.nvGames,
    nvCorrect: u.nvCorrect,
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
    totalAttempts: p.totalAttempts,
    correctAttempts: p.correctAttempts,
  }));

  // ── Daily Challenge leaderboard ───────────────────────────────────────────
  const today = getUtcDateStr();
  const dailyChallenge = await getOrCreateDailyChallenge(today);

  const dailyResults = await prisma.dailyChallengeResult.findMany({
    where: { challengeId: dailyChallenge.id, completed: true },
    orderBy: [{ totalScore: 'desc' }, { completedAt: 'asc' }],
    take: 50,
    include: {
      user: { select: { name: true, image: true } },
    },
  });

  const dailyEntries = dailyResults.map((r, idx) => ({
    rank: idx + 1,
    userId: r.userId,
    name: r.user.name ?? 'Anonymous',
    image: r.user.image ?? null,
    totalScore: r.totalScore,
    completedAt: r.completedAt!,
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
    dailyDate: today,
    dailyTopScore: dailyEntries[0]?.totalScore ?? null,
    dailyCompletions: dailyEntries.length,
    currentUserDailyScore: currentUserId
      ? (dailyEntries.find((e) => e.userId === currentUserId)?.totalScore ?? null)
      : null,
  };

  return (
    <>
      <TopAppBar activeTab="Rankings" />
      <LeaderboardClient
        playerEntries={playerEntries}
        pageEntries={pageEntries}
        dailyEntries={dailyEntries}
        currentUserId={currentUserId}
        stats={stats}
      />
      <BottomNav />
    </>
  );
}
