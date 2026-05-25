import type { Metadata } from 'next';

import QuizClient from './QuizClient';

export const metadata: Metadata = {
  title: 'Next Verse Quiz',
  description: 'Read a verse and guess which verse comes next. Test your Quran sequence knowledge.',
};

export default function NextVerseQuiz() {
  return <QuizClient />;
}
