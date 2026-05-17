'use client';

import { useState } from 'react';

import { abandonSession } from '../actions';
import type { ActiveSession } from '../page';

const GAME_MODE_META: Record<string, { label: string; icon: string; href: string; color: string }> =
  {
    'missing-word-count': {
      label: 'Missing Word Count',
      icon: 'find_replace',
      href: '/quiz/missing-word-count',
      color: 'text-primary',
    },
    'next-verse': {
      label: 'Verse Quest',
      icon: 'format_quote',
      href: '/quiz/next-verse',
      color: 'text-secondary',
    },
    'locate-verse': {
      label: 'Verse Location',
      icon: 'my_location',
      href: '/quiz/locate-verse',
      color: 'text-tertiary',
    },
    'locate-verse-daily': {
      label: 'Daily Locate Verse',
      icon: 'today',
      href: '/quiz/locate-verse/daily',
      color: 'text-tertiary',
    },
  };

interface Props {
  sessions: ActiveSession[];
}

export default function ContinueSessions({ sessions: initialSessions }: Props) {
  const [sessions, setSessions] = useState(initialSessions);

  if (sessions.length === 0) {
    return null;
  }

  const handleEnd = async (token: string, gameMode: string) => {
    setSessions((prev) => prev.filter((s) => s.token !== token));
    if (gameMode !== 'locate-verse-daily') {
      await abandonSession(token);
    }
  };

  return (
    <section className="space-y-6 relative z-10">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Continue Playing</h3>
        <p className="text-on-surface-variant text-sm">Pick up where you left off.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {sessions.map((s) => {
          const meta = GAME_MODE_META[s.gameMode] ?? {
            label: s.gameMode,
            icon: 'sports_esports',
            href: '#',
            color: 'text-primary',
          };
          const href =
            s.gameMode === 'locate-verse-daily' ? meta.href : `${meta.href}?token=${s.token}`;

          return (
            <div
              key={s.token}
              className="flex-1 flex items-center gap-4 bg-surface-container/70 border border-primary/20 hover:border-primary/50 hover:bg-surface-container rounded-2xl px-5 py-4 transition-all duration-300 group hover:-translate-y-0.5"
            >
              <a href={href} className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors duration-300">
                  <span className={`material-symbols-outlined ${meta.color}`}>{meta.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white group-hover:text-primary transition-colors duration-300 truncate">
                    {meta.label}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Q{s.questionNumber} · Score {s.totalScore}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors duration-300 text-[20px]">
                  arrow_forward
                </span>
              </a>
              <button
                onClick={() => handleEnd(s.token, s.gameMode)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors shrink-0"
                aria-label="End session"
                title="End session"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
