/* eslint-disable @typescript-eslint/naming-convention */
import type { Word } from '@quranjs/api';

import { encryptVerseKey, signAnswer } from './answerToken';
import { SURAH_NAMES, nextVerseKey, fetchRandomVerseInAyahRange } from './surahData';
import type { Question, VerseWord } from './types';

import { qdcFetchByJuz, qdcFetchByPage, qdcFetchRandom, qdcFetchByKey } from '@/lib/qdc-client';
import type { QdcWord } from '@/lib/qdc-client';
import { getContentClient } from '@/lib/qf-server-client';
import { pickRandomJuz } from '@/lib/quran-pages';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Raw word shape — includes page_number for font loading (must not reach the client). */
interface RawWord extends VerseWord {
  page_number: number;
}

/** Options for next-verse: include words and request the QCF v2 glyph codes. */
const WORD_OPTS = {
  words: true,
  wordFields: { codeV2: true },
} as const;

function mapWord(w: Word): RawWord {
  // prettier-ignore
  return { id: w.id ?? 0, position: w.position, code_v2: w.codeV2 ?? '', text_qpc_hafs: w.text ?? '', page_number: w.pageNumber ?? 1, char_type_name: w.charTypeName };
}

/** Strip all API fields that are not in VerseWord or that could reveal a choice's identity. */
function sanitizeWords(words: RawWord[]): VerseWord[] {
  return words;
}

function qdcToRaw(w: QdcWord): RawWord {
  const { id, position, code_v2, text, page_number, char_type_name } = w;
  // prettier-ignore
  return { id, position, code_v2: code_v2 ?? '', text_qpc_hafs: text ?? '', page_number: page_number ?? 1, char_type_name };
}

async function fetchRandomVerse(
  juzFilter?: number[],
  pageNumber?: number,
): Promise<{ verseKey: string; words: RawWord[] }> {
  if (pageNumber !== undefined) {
    if (!IS_PRODUCTION) {
      const qdcVerse = await qdcFetchByPage(pageNumber);
      return {
        verseKey: qdcVerse.verse_key,
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
      };
    }
    try {
      const client = getContentClient();
      const pageIndex = await client.content.v4.verses.byPage(
        String(pageNumber) as Parameters<typeof client.content.v4.verses.byPage>[0],
      );
      if (!pageIndex?.length) {
        throw new Error('No verses for page');
      }
      const picked = pageIndex[Math.floor(Math.random() * pageIndex.length)];
      const verse = await client.content.v4.verses.byKey(
        picked.verseKey as Parameters<typeof client.content.v4.verses.byKey>[0],
        WORD_OPTS,
      );
      const words = [...(verse.words ?? [])].sort((a, b) => a.position - b.position).map(mapWord);
      return { verseKey: verse.verseKey, words };
    } catch (err) {
      console.warn(`SDK byPage(${pageNumber}) failed, falling back to direct API:`, err);
      const qdcVerse = await qdcFetchByPage(pageNumber);
      return {
        verseKey: qdcVerse.verse_key,
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
      };
    }
  }
  if (juzFilter && juzFilter.length > 0) {
    const juzNum = pickRandomJuz(juzFilter);
    if (!IS_PRODUCTION) {
      const qdcVerse = await qdcFetchByJuz(juzNum);
      return {
        verseKey: qdcVerse.verse_key,
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
      };
    }
    try {
      const client = getContentClient();
      const verses = await client.content.v4.verses.byJuz(
        String(juzNum) as Parameters<typeof client.content.v4.verses.byJuz>[0],
        WORD_OPTS,
      );
      if (!verses?.length) {
        throw new Error('No verses for juz');
      }
      const verse = verses[Math.floor(Math.random() * verses.length)];
      const words = [...(verse.words ?? [])].sort((a, b) => a.position - b.position).map(mapWord);
      return { verseKey: verse.verseKey, words };
    } catch (err) {
      console.warn(`SDK byJuz(${juzNum}) failed, falling back to direct API:`, err);
      const qdcVerse = await qdcFetchByJuz(juzNum);
      return {
        verseKey: qdcVerse.verse_key,
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
      };
    }
  }

  if (!IS_PRODUCTION) {
    const qdcVerse = await qdcFetchRandom();
    return {
      verseKey: qdcVerse.verse_key,
      words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
    };
  }
  try {
    const client = getContentClient();
    const verse = await client.content.v4.verses.random(WORD_OPTS);
    const words = [...(verse.words ?? [])].sort((a, b) => a.position - b.position).map(mapWord);
    return { verseKey: verse.verseKey, words };
  } catch (err) {
    console.warn('SDK random failed, falling back to direct API:', err);
    const qdcVerse = await qdcFetchRandom();
    return {
      verseKey: qdcVerse.verse_key,
      words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
    };
  }
}

async function fetchVerseByKey(verseKey: string): Promise<RawWord[] | null> {
  if (!IS_PRODUCTION) {
    const qdcVerse = await qdcFetchByKey(verseKey);
    if (!qdcVerse) {
      return null;
    }
    return qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw);
  }
  try {
    const client = getContentClient();
    const verse = await client.content.v4.verses.byKey(
      verseKey as Parameters<typeof client.content.v4.verses.byKey>[0],
      WORD_OPTS,
    );
    return [...(verse.words ?? [])].sort((a, b) => a.position - b.position).map(mapWord);
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      console.warn(`SDK byKey(${verseKey}) 404, falling back to direct API`);
      const qdcVerse = await qdcFetchByKey(verseKey);
      if (!qdcVerse) {
        return null;
      }
      return qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcToRaw);
    }
    throw e;
  }
}

export async function getRandomQuestion(
  juzFilter?: number[],
  pageNumber?: number,
): Promise<Question> {
  // Keep retrying until we get a verse that has a fetchable next verse (nextVerseKey returns null for 114:6).
  let current: { verseKey: string; words: RawWord[] };
  let nextKey: string | null;
  let nextVerseWords: RawWord[] | null;
  do {
    current = await fetchRandomVerse(juzFilter, pageNumber);
    nextKey = nextVerseKey(current.verseKey);
    nextVerseWords = nextKey ? await fetchVerseByKey(nextKey) : null;
  } while (!nextKey || !nextVerseWords);

  // Fetch 3 distractors from the same surah, within ±10 ayahs of the correct answer
  const [nextSurah, nextAyah] = nextKey.split(':').map(Number) as [number, number];
  const distractorResults = await Promise.all(
    Array.from({ length: 3 }, () =>
      fetchRandomVerseInAyahRange(nextSurah, nextAyah - 10, nextAyah + 10, fetchVerseByKey),
    ),
  );

  // Deduplicate: ensure no distractor matches the correct next verse or current verse
  const usedKeys = new Set([current.verseKey, nextKey]);
  const distractorWordSets: RawWord[][] = [];
  for (const d of distractorResults) {
    if (!usedKeys.has(d.verseKey)) {
      usedKeys.add(d.verseKey);
      distractorWordSets.push(d.words);
    }
  }
  // If deduplication removed some, fetch replacements from the same range
  while (distractorWordSets.length < 3) {
    const extra = await fetchRandomVerseInAyahRange(
      nextSurah,
      nextAyah - 10,
      nextAyah + 10,
      fetchVerseByKey,
    );
    if (!usedKeys.has(extra.verseKey)) {
      usedKeys.add(extra.verseKey);
      distractorWordSets.push(extra.words);
    }
  }

  // Place the correct answer at a random index among the 4 choices
  const correctIndex = Math.floor(Math.random() * 4);
  const choices: { words: VerseWord[] }[] = [];
  let distractorCursor = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      choices.push({ words: sanitizeWords(nextVerseWords) });
    } else {
      choices.push({ words: sanitizeWords(distractorWordSets[distractorCursor++]) });
    }
  }

  const [surahStr] = current.verseKey.split(':');
  const surahNum = parseInt(surahStr, 10);
  const surahName = SURAH_NAMES[surahNum] ?? `Surah ${surahNum}`;
  const verseReference = `${surahName} · ${current.verseKey}`;

  return {
    encryptedVerseKey: encryptVerseKey(current.verseKey),
    verseWords: sanitizeWords(current.words),
    verseReference,
    choices,
    answerToken: signAnswer(current.verseKey, correctIndex),
  };
}
