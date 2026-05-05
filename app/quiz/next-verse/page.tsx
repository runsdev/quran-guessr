import { getRandomQuestion } from './getQuestion';
import QuizClient from './QuizClient';

export default async function NextVerseQuiz() {
  const initialQuestion = await getRandomQuestion();
  return <QuizClient initialQuestion={initialQuestion} />;
}
