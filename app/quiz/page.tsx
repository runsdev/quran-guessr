import DashboardHeader from './components/DashboardHeader';
import GameModesClient from './components/GameModesClient';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { auth } from '@/auth';
import { getOrCreateDailyChallenge } from '@/lib/daily-challenge';
import { prisma } from '@/lib/prisma';
import { getCachedQfStreak } from '@/lib/qf-api';

export const dynamic = 'force-dynamic';

const DAILY_RANKED_LIMIT = 20;

export interface ActiveSession {
  token: string;
  gameMode: string;
  questionNumber: number;
  totalScore: number;
  updatedAt: Date;
}

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

async function getDailyRankedCount(userId: string): Promise<number> {
  const today = dateStr(new Date());
  const attempt = await prisma.dailyAttempt.findUnique({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { userId_date: { userId, date: today } },
    select: { count: true },
  });
  return attempt?.count ?? 0;
}

export default async function QuizHubPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  let elo = 1000;
  let streak = 0;
  let userName = 'Scholar';
  let dailyRankedCount = 0;
  let activeSessions: ActiveSession[] = [];

  if (userId) {
    const today = dateStr(new Date());

    // getOrCreateDailyChallenge is cached — call it first to unlock parallel dailyResult lookup
    const dailyChallenge = await getOrCreateDailyChallenge(today);

    const [user, rankedCount, qfStreak, sessions, dailyResult] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { elo: true, name: true } }),
      getDailyRankedCount(userId),
      getCachedQfStreak(userId),
      prisma.quizSession.findMany({
        where: { userId, status: 'active', expiresAt: { gt: new Date() } },
        select: {
          token: true,
          gameMode: true,
          questionNumber: true,
          totalScore: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.dailyChallengeResult.findUnique({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        where: { challengeId_userId: { challengeId: dailyChallenge.id, userId } },
        select: { completed: true, scores: true, totalScore: true },
      }),
    ]);

    if (user) {
      elo = Math.round(user.elo);
      userName = user.name?.split(' ')[0] ?? 'Scholar';
    }
    streak = qfStreak;
    dailyRankedCount = rankedCount;
    activeSessions = sessions;

    if (dailyResult && !dailyResult.completed) {
      activeSessions = [
        {
          token: `daily-${dailyChallenge.id}`,
          gameMode: 'locate-verse-daily',
          questionNumber: dailyResult.scores.length + 1,
          totalScore: dailyResult.totalScore,
          updatedAt: new Date(),
        },
        ...activeSessions,
      ];
    }
  }

  return (
    <div className="min-h-screen text-on-surface">
      <TopAppBar activeTab="Quiz" />

      {/* ── Band 1: white — welcome header ── */}
      <section
        style={{
          backgroundColor: 'var(--color-background)',
          paddingTop: 80 + 48,
          paddingBottom: 48,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <DashboardHeader
            userName={userName}
            elo={elo}
            streak={streak}
            dailyRankedCount={dailyRankedCount}
            dailyRankedLimit={DAILY_RANKED_LIMIT}
          />
        </div>
      </section>

      {/* ── Band 2: soft — game modes ── */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-container-low)',
          paddingTop: 64,
          paddingBottom: 96,
        }}
        className="pb-32 md:pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-10">
          <GameModesClient
            elo={elo}
            dailyRankedCount={dailyRankedCount}
            dailyRankedLimit={DAILY_RANKED_LIMIT}
            activeSessions={activeSessions}
          />
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
