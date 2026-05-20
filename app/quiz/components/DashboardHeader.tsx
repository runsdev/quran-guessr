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
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      {/* ── Left: greeting ── */}
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#ff385c',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Your Dashboard
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#222222' }}>
          Welcome back, {userName}
        </h1>
        <p style={{ color: '#6a6a6a', fontSize: 16 }}>Ready to test your knowledge today?</p>
      </div>

      {/* ── Right: stat chips ── */}
      <div
        className="flex flex-wrap gap-4 items-center p-4 rounded-2xl shrink-0"
        style={{ background: '#f7f7f7', border: '1px solid #dddddd' }}
      >
        {/* ELO */}
        <div className="flex items-center gap-3 px-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: '#ffd1da', border: '1px solid #ffb3c2' }}
          >
            <span className="material-symbols-outlined" style={{ color: '#ff385c', fontSize: 20 }}>
              star_rate
            </span>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: '#6a6a6a' }}
            >
              ELO
            </p>
            <span className="text-xl font-bold" style={{ color: '#222222' }}>
              {elo.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="w-px h-10 hidden md:block" style={{ background: '#dddddd' }} />

        {/* Streak */}
        <div className="flex items-center gap-3 px-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="transparent" stroke="#ebebeb" strokeWidth="3" />
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
              <span className="text-xs font-bold" style={{ color: '#222222' }}>
                {streak}
              </span>
            </div>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: '#6a6a6a' }}
            >
              Streak
            </p>
            <p className="text-sm font-medium" style={{ color: '#222222' }}>
              {streak >= STREAK_GOAL ? 'Goal reached!' : `${STREAK_GOAL - streak} to goal`}
            </p>
          </div>
        </div>

        <div className="w-px h-10 hidden md:block" style={{ background: '#dddddd' }} />

        {/* Daily ranked */}
        <div className="flex items-center gap-3 px-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: dailyRankedCount >= dailyRankedLimit ? '#fde8e0' : '#d1e7dd',
              border: `1px solid ${dailyRankedCount >= dailyRankedLimit ? '#f5c6c0' : '#a3cfbb'}`,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: dailyRankedCount >= dailyRankedLimit ? '#c13515' : '#0a4a28',
                fontSize: 20,
              }}
            >
              {dailyRankedCount >= dailyRankedLimit ? 'block' : 'check_circle'}
            </span>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: '#6a6a6a' }}
            >
              Ranked Today
            </p>
            <span className="text-xl font-bold" style={{ color: '#222222' }}>
              {dailyRankedCount}
              <span className="text-sm font-normal" style={{ color: '#6a6a6a' }}>
                /{dailyRankedLimit}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
