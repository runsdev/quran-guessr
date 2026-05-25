import type { Metadata } from 'next';

import QuizClient from './QuizClient';

export const metadata: Metadata = {
  title: 'Locate Verse Quiz',
  description:
    'Given a verse, identify which page of the Quran it belongs to. Test your knowledge of verse locations.',
};

export default function LocateVerseQuiz() {
  return <QuizClient />;
}
