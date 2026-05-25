import type { Metadata } from 'next';

import QuizClient from './QuizClient';

export const metadata: Metadata = {
  title: 'Translation Quiz',
  description:
    'Match Quran translations to the correct verse. A fun way to deepen your understanding of the Quran.',
};

export default function TranslationQuiz() {
  return <QuizClient />;
}
