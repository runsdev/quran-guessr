import DailyQuizClient from './DailyQuizClient';
import DailyResults from './DailyResults';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { encryptVerseKey, signAnswer } from '@/app/quiz/locate-verse/answerToken';
import type { Question, VerseWord } from '@/app/quiz/locate-verse/types';
import { auth } from '@/auth';
import { getOrCreateDailyChallenge, getUtcDateStr } from '@/lib/daily-challenge';
import { prisma } from '@/lib/prisma';
import { SURAH_NAMES } from '@/lib/quran-pages';

interface QuranVerseResponse {
  verse: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    verse_key: string;
    words: VerseWord[];
  };
}

async function fetchVerseByKey(
  verseKey: string,
): Promise<{ verseKey: string; words: VerseWord[] }> {
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${encodeURIComponent(verseKey)}?words=true` +
      '&word_fields=code_v2,text_qpc_hafs,page_number,line_number,char_type_name&fields=verse_key',
    { cache: 'no-store' },
  );
  if (!res.ok) {
    throw new Error(`Quran API error ${res.status}`);
  }
  const { verse } = (await res.json()) as QuranVerseResponse;
  const words = [...verse.words].sort((a, b) => a.position - b.position);
  return { verseKey: verse.verse_key, words };
}

async function buildQuestion(verseKey: string): Promise<Question> {
  const { words } = await fetchVerseByKey(verseKey);
  const firstWord = words.find((w) => w.char_type_name !== 'end');
  const correctPage = firstWord?.page_number ?? words[0].page_number;
  const correctLine = firstWord?.line_number ?? 1;
  const [surahStr] = verseKey.split(':');
  const surahNum = parseInt(surahStr, 10);
  const surahName = SURAH_NAMES[surahNum] ?? `Surah ${surahNum}`;
  return {
    encryptedVerseKey: encryptVerseKey(verseKey),
    verseWords: words,
    verseReference: `${surahName} · ${verseKey}`,
    answerToken: signAnswer(verseKey, correctPage, correctLine),
  };
}

export default async function DailyChallengeLocateVersePage() {
  const today = getUtcDateStr();
  const challenge = await getOrCreateDailyChallenge(today);

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const existingResult = userId
    ? await prisma.dailyChallengeResult.findUnique({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        where: { challengeId_userId: { challengeId: challenge.id, userId } },
      })
    : null;

  // Pre-fetch all 5 verses in parallel
  const questions = await Promise.all(challenge.verseKeys.map(buildQuestion));

  if (existingResult?.completed) {
    return (
      <>
        <TopAppBar activeTab="Quiz" />
        <DailyResults
          date={today}
          totalScore={existingResult.totalScore}
          scores={existingResult.scores}
          questions={questions}
        />
        <BottomNav />
      </>
    );
  }

  const initialQuestionIndex = existingResult?.scores.length ?? 0;
  const previousScores = existingResult?.scores ?? [];

  return (
    <>
      <TopAppBar activeTab="Quiz" />
      <DailyQuizClient
        challengeId={challenge.id}
        questions={questions}
        date={today}
        initialQuestionIndex={initialQuestionIndex}
        previousScores={previousScores}
      />
      <BottomNav />
    </>
  );
}
