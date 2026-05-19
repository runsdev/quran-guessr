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
      className="rounded-2xl p-6 md:p-10 relative overflow-hidden"
      style={{
        background: '#ffffff',
        border: '1px solid #dddddd',
      }}
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#222222' }}>
            Welcome Back, {userName}
          </h1>
          <p style={{ color: '#6a6a6a', fontSize: 16 }}>Ready to test your knowledge today?</p>
        </div>

        <div
          className="flex flex-wrap gap-6 items-center p-4 rounded-xl"
          style={{ background: '#f7f7f7', border: '1px solid #dddddd' }}
        >
          {/* ELO */}
          <div className="flex items-center gap-4 px-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: '#ffd1da', border: '1px solid #ffb3c2' }}
            >
              <span className="material-symbols-outlined" style={{ color: '#ff385c' }}>
                star_rate
              </span>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-1"
                style={{ color: '#6a6a6a' }}
              >
                ELO Rating
              </p>
              <span className="text-2xl font-bold" style={{ color: '#222222' }}>
                {elo.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="w-px h-12 hidden md:block" style={{ background: '#dddddd' }} />

          {/* Streak */}
          <div className="flex items-center gap-4 px-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="#ebebeb"
                  strokeWidth="3"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="#ff385c"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={streakOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-bold" style={{ color: '#222222' }}>
                  {streak}
                </span>
              </div>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-1"
                style={{ color: '#6a6a6a' }}
              >
                Day Streak
              </p>
              <p className="text-sm font-medium" style={{ color: '#222222' }}>
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
