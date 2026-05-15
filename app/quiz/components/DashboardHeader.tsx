/* eslint-disable @typescript-eslint/no-unused-vars */
interface Props {
  userName: string;
  elo: number;
  streak: number;
  dailyRankedCount: number;
  dailyRankedLimit: number;
}

const STREAK_GOAL = 1;

export default function DashboardHeader({
  userName,
  elo,
  streak,
  dailyRankedCount,
  dailyRankedLimit,
}: Props) {
  const circumference = 2 * Math.PI * 20;
  const streakOffset = circumference - circumference * Math.min(streak / STREAK_GOAL, 1);

  return (
    <section
      className="rounded-3xl p-6 md:p-12 relative overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 mix-blend-screen pointer-events-none">
        <span className="material-symbols-outlined text-[200px] text-primary">military_tech</span>
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome Back, {userName}
          </h1>
          <p className="text-on-surface-variant text-lg">Ready to test your knowledge today?</p>
        </div>

        <div className="flex flex-wrap gap-6 items-center bg-surface/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
          {/* ELO */}
          <div className="flex items-center gap-4 px-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary">star_rate</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">
                ELO Rating
              </p>
              <span className="text-2xl font-bold text-white">{elo.toLocaleString()}</span>
            </div>
          </div>

          <div className="w-px h-12 bg-white/10 hidden md:block" />

          {/* Streak */}
          <div className="flex items-center gap-4 px-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="text-white/10"
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  className="text-primary drop-shadow-[0_0_6px_rgba(106,215,222,0.5)]"
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={streakOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-bold text-white">{streak}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">
                Day Streak
              </p>
              <p className="text-sm text-white font-medium">
                {streak >= STREAK_GOAL
                  ? 'Goal reached!'
                  : `${STREAK_GOAL - streak} sessions to goal`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
