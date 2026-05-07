import DashboardHeader from './components/DashboardHeader';
import GameModesClient from './components/GameModesClient';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DAILY_RANKED_LIMIT = 20;

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

async function getUserStats(userId: string): Promise<{ streak: number; dailyRankedCount: number }> {
  const today = new Date();
  const todayStr = dateStr(today);
  const attempts = await prisma.dailyAttempt.findMany({
    where: { userId },
    select: { date: true, count: true },
  });
  const datesWithActivity = new Set(attempts.filter((a) => a.count > 0).map((a) => a.date));
  const dailyRankedCount = attempts.find((a) => a.date === todayStr)?.count ?? 0;
  let streak = 0;
  const cursor = new Date(today);
  if (!datesWithActivity.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (datesWithActivity.has(dateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { streak, dailyRankedCount };
}

export default async function QuizHubPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  let elo = 1000;
  let streak = 0;
  let userName = 'Scholar';
  let dailyRankedCount = 0;

  if (userId) {
    const [user, stats] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { elo: true, name: true } }),
      getUserStats(userId),
    ]);
    if (user) {
      elo = Math.round(user.elo);
      userName = user.name?.split(' ')[0] ?? 'Scholar';
    }
    streak = stats.streak;
    dailyRankedCount = stats.dailyRankedCount;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#0f172a] via-background to-background opacity-80 pointer-events-none" />

      <TopAppBar activeTab="Quiz" />

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-32 space-y-24 md:space-y-32">
        <DashboardHeader
          userName={userName}
          elo={elo}
          streak={streak}
          dailyRankedCount={dailyRankedCount}
          dailyRankedLimit={DAILY_RANKED_LIMIT}
        />

        <GameModesClient
          elo={elo}
          dailyRankedCount={dailyRankedCount}
          dailyRankedLimit={DAILY_RANKED_LIMIT}
        />
      </main>

      <BottomNav />
    </div>
  );
}
