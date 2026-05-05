import { getRandomQuestion } from './getQuestion';
import QuizClient from './QuizClient';

export default async function MissingWordCountQuiz() {
  const initialQuestion = await getRandomQuestion();
  return <QuizClient initialQuestion={initialQuestion} />;
}
