import { encryptVerseKey, signAnswer, encryptHiddenWords } from './answerToken';
import type { Question, Segment } from './types';

import type { VerseWord } from '@/app/quiz/types';
import { prisma } from '@/lib/prisma';

interface QuranWord {
  id: number;
  position: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  code_v2: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  text_qpc_hafs: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_number: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  char_type_name: string;
}

interface QuranVerse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  verse_key: string;
  words: QuranWord[];
}

interface QuranApiRandomResponse {
  verse: QuranVerse;
}

interface QuranApiPageResponse {
  verses: QuranVerse[];
}

async function fetchVerse(targetPageNumber?: number): Promise<QuranVerse> {
  if (targetPageNumber !== undefined) {
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_page/${targetPageNumber}?words=true&word_fields=code_v2,text_qpc_hafs&fields=verse_key`,
      { cache: 'no-store' },
    );
    if (!res.ok) {
      throw new Error('Quran API error');
    }
    const { verses } = (await res.json()) as QuranApiPageResponse;
    if (!verses?.length) {
      throw new Error('No verses found for page');
    }
    return verses[Math.floor(Math.random() * verses.length)];
  }

  const res = await fetch(
    'https://api.quran.com/api/v4/verses/random?words=true&word_fields=code_v2,text_qpc_hafs&fields=verse_key',
    { cache: 'no-store' },
  );
  if (!res.ok) {
    throw new Error('Quran API error');
  }
  return ((await res.json()) as QuranApiRandomResponse).verse;
}

/**
 * @param targetPageNumber - when provided, fetches a verse from that specific
 *   Mushaf page (adaptive difficulty); otherwise selects a fully random verse.
 */
export async function getRandomQuestion(targetPageNumber?: number): Promise<Question> {
  // Retry up to 5 times to find a verse with at least 4 words (so at least 1
  // can be hidden without leaving fewer than 3 visible).
  for (let attempt = 0; attempt < 5; attempt++) {
    const verse = await fetchVerse(targetPageNumber);

    const words = verse.words
      .filter((w) => w.char_type_name === 'word')
      .sort((a, b) => a.position - b.position);

    const wordCount = words.length;
    const maxMissing = Math.min(4, Math.max(0, wordCount - 3));

    // Require at least 1 word to be hidden
    if (maxMissing < 1) {
      continue;
    }

    const missingCount = 1 + Math.floor(Math.random() * maxMissing); // 1..maxMissing

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const indices: number[] = Array.from({ length: wordCount }, (_, i) => i);
    for (let i = 0; i < missingCount; i++) {
      const j = i + Math.floor(Math.random() * (wordCount - i));
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }
    const hiddenSet = new Set(indices.slice(0, missingCount));

    const segments: Segment[] = [];
    let currentWords: VerseWord[] = [];
    const hiddenWords: VerseWord[] = [];
    for (let i = 0; i < words.length; i++) {
      if (hiddenSet.has(i)) {
        hiddenWords.push(words[i] as VerseWord);
        if (currentWords.length > 0) {
          segments.push({ type: 'words', words: currentWords });
          currentWords = [];
        }
        if (segments.length === 0 || segments[segments.length - 1].type !== 'blank') {
          segments.push({ type: 'blank' });
        }
      } else {
        currentWords.push(words[i] as VerseWord);
      }
    }
    if (currentWords.length > 0) {
      segments.push({ type: 'words', words: currentWords });
    }

    const pageNumber = words[0]?.page_number ?? 1;
    // Read-only: never write here so we don't overwrite stats recorded by submitAnswer.
    const pageEloRecord = await prisma.pageElo.findUnique({ where: { pageNumber } });

    return {
      encryptedVerseKey: encryptVerseKey(verse.verse_key),
      segments,
      answerToken: signAnswer(verse.verse_key, missingCount, pageNumber),
      encryptedHiddenWords: encryptHiddenWords(hiddenWords),
      totalWords: wordCount,
      pageElo: pageEloRecord ? Math.round(pageEloRecord.elo) : 1200,
    };
  }

  throw new Error('Could not find a suitable verse after multiple attempts');
}

export async function getAdaptiveQuestion(userId: string | null): Promise<Question> {
  if (!userId) {
    return getRandomQuestion();
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { elo: true } });
  const userElo = user?.elo ?? 1000;

  const matchingPages = await prisma.pageElo.findMany({
    where: { elo: { gte: userElo - 200, lte: userElo + 200 } },
    select: { pageNumber: true },
  });

  const targetPage =
    matchingPages.length > 0
      ? matchingPages[Math.floor(Math.random() * matchingPages.length)].pageNumber
      : undefined;

  return getRandomQuestion(targetPage);
}
