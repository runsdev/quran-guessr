import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Playground — QuranGuessr',
  description:
    'Interactive playground for testing all Quran Foundation User-Related APIs (pre-live). Explore bookmarks, collections, notes, streaks, posts, rooms, and more.',
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
