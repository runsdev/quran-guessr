import { useEffect, useRef, useState } from 'react';

export const TIMER_LIMIT = 90;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface TimerBarProps {
  submitted: boolean;
  onExpire: () => void;
}

export default function TimerBar({ submitted, onExpire }: TimerBarProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_LIMIT);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (submitted) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t > 1) {
          return t - 1;
        }
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return 0;
      });
    }, 1000);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      onExpireRef.current();
    }
  }, [timeLeft, submitted]);

  const percent = (timeLeft / TIMER_LIMIT) * 100;
  const barColor = percent > 50 ? 'bg-primary' : percent > 25 ? 'bg-yellow-400' : 'bg-red-500';
  const label = submitted ? 'Done' : timeLeft === 0 ? "Time's up" : formatTime(timeLeft);

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            submitted ? 'bg-primary w-full' : barColor
          }`}
          style={submitted ? undefined : { width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[11px] text-on-surface-variant tabular-nums">{label}</span>
        {!submitted && (
          <span className="text-[11px] text-on-surface-variant">/ {formatTime(TIMER_LIMIT)}</span>
        )}
      </div>
    </div>
  );
}
