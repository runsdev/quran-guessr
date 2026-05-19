import Image from 'next/image';
import { redirect } from 'next/navigation';

import GameStats from './GameStats';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { fetchQfStreak } from '@/lib/qf-api';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      elo: true,
      gamesPlayed: true,
      mwcCorrect: true,
      lvGames: true,
      lvCorrect: true,
      nvGames: true,
      nvCorrect: true,
      createdAt: true,
      dailyAttempts: {
        orderBy: { date: 'desc' },
        take: 30,
      },
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const [streak] = await Promise.all([fetchQfStreak(userId)]);
  const eloFormatted = Math.round(user.elo).toLocaleString();
  const joinDate = user.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const recentActivity = user.dailyAttempts.slice(0, 7);

  return (
    <>
      <TopAppBar activeTab="Profile" />
      <main className="min-h-screen bg-surface text-on-surface pt-20 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
          {/* Profile header */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? 'User avatar'}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">person</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-on-surface truncate">
                {user.name ?? 'Anonymous'}
              </h1>
              {user.email && (
                <p className="text-sm text-on-surface-variant truncate">{user.email}</p>
              )}
              <p className="text-xs text-on-surface-variant mt-1">Joined {joinDate}</p>
            </div>
          </div>

          <GameStats streak={streak} eloFormatted={eloFormatted} user={user} />

          {/* Recent activity */}
          {recentActivity.length > 0 && (
            <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
              <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  calendar_month
                </span>
                Recent Activity
              </h2>
              <div className="space-y-2">
                {recentActivity.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between py-2 border-b border-outline-variant/30 last:border-0"
                  >
                    <span className="text-sm text-on-surface-variant">{attempt.date}</span>
                    <span className="text-sm font-medium text-on-surface">
                      {attempt.count > 0
                        ? `${attempt.count} ranked ${attempt.count === 1 ? 'game' : 'games'}`
                        : 'Played'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
