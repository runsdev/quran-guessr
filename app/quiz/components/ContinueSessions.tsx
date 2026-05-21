'use client';

import { useState } from 'react';

import { abandonSession } from '../actions';
import type { ActiveSession } from '../page';

const GAME_MODE_META: Record<string, { label: string; icon: string; href: string }> = {
  'missing-word-count': {
    label: 'Missing Word Count',
    icon: 'find_replace',
    href: '/quiz/missing-word-count',
  },
  'next-verse': {
    label: 'Verse Quest',
    icon: 'format_quote',
    href: '/quiz/next-verse',
  },
  'locate-verse': {
    label: 'Verse Location',
    icon: 'my_location',
    href: '/quiz/locate-verse',
  },
  'locate-verse-daily': {
    label: 'Daily Locate Verse',
    icon: 'today',
    href: '/quiz/locate-verse/daily',
  },
};

interface Props {
  sessions: ActiveSession[];
}

export default function ContinueSessions({ sessions: initialSessions }: Props) {
  const [sessions, setSessions] = useState(initialSessions);
  const [pendingEnd, setPendingEnd] = useState<string | null>(null);

  if (sessions.length === 0) {
    return null;
  }

  const handleEnd = async (token: string, gameMode: string) => {
    setSessions((prev) => prev.filter((s) => s.token !== token));
    setPendingEnd(null);
    if (gameMode !== 'locate-verse-daily') {
      await abandonSession(token);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-xl font-bold mb-1" style={{ color: '#222222' }}>
          Continue Playing
        </h3>
        <p className="text-sm" style={{ color: '#6a6a6a' }}>
          Pick up where you left off.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {sessions.map((s) => {
          const meta = GAME_MODE_META[s.gameMode] ?? {
            label: s.gameMode,
            icon: 'sports_esports',
            href: '#',
          };
          const href =
            s.gameMode === 'locate-verse-daily' ? meta.href : `${meta.href}?token=${s.token}`;

          return (
            <div
              key={s.token}
              className="relative flex-1 flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 group hover:-translate-y-0.5"
              style={{ background: '#ffffff', border: '1px solid #dddddd' }}
            >
              <a href={href} className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#ffd1da' }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#ff385c' }}>
                    {meta.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate" style={{ color: '#222222' }}>
                    {meta.label}
                  </p>
                  <p className="text-xs" style={{ color: '#6a6a6a' }}>
                    Q{s.questionNumber} · Score {s.totalScore}
                  </p>
                </div>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: '#6a6a6a' }}
                >
                  arrow_forward
                </span>
              </a>
              <button
                onClick={() => setPendingEnd(pendingEnd === s.token ? null : s.token)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:text-error hover:bg-error/10 active:scale-90 shrink-0"
                style={{ color: '#6a6a6a' }}
                aria-label="End session"
                title="End session"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              {pendingEnd === s.token && (
                <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-outline-variant rounded-xl shadow-lg px-4 py-3 flex flex-col gap-2 min-w-48">
                  <p className="text-xs font-medium text-on-surface">End this session?</p>
                  <p className="text-xs text-on-surface-variant">Your progress will be lost.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEnd(s.token, s.gameMode)}
                      className="flex-1 text-xs font-semibold text-white bg-error rounded-lg py-1.5 hover:opacity-90 transition-opacity"
                    >
                      End
                    </button>
                    <button
                      onClick={() => setPendingEnd(null)}
                      className="flex-1 text-xs font-medium text-on-surface bg-surface-container rounded-lg py-1.5 hover:bg-surface-container-high transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
