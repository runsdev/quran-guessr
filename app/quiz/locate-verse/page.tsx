import { getRandomQuestion } from './getQuestion';
import QuizClient from './QuizClient';

export default async function LocateVerseQuiz() {
  const initialQuestion = await getRandomQuestion();
  return <QuizClient initialQuestion={initialQuestion} />;
}
