export function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function computeStreak(attempts: { date: string }[]): number {
  const today = new Date();
  const todayStr = dateStr(today);

  const datesWithActivity = new Set(attempts.map((a) => a.date));
  let streak = 0;
  const cursor = new Date(today);

  if (!datesWithActivity.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (datesWithActivity.has(dateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function pct(correct: number, total: number): string {
  if (total === 0) {
    return '—';
  }
  return `${Math.round((correct / total) * 100)}%`;
}
