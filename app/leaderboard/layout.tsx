import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description:
    'See top Quran Guessr players ranked by ELO rating, page difficulty rankings, and daily challenge scores.',
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
