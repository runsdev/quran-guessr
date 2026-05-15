/* eslint-disable @typescript-eslint/naming-convention */
import { encryptVerseKey, signAnswer } from './answerToken';
import { SURAH_NAMES, SURAH_VERSE_COUNTS } from './surahData';
import type { Question, VerseWord } from './types';

/** Raw word shape returned by the Quran API — includes fields we must not forward to clients. */
interface RawWord extends VerseWord {
  audio_url: string | null;
  /** Same glyph as code_v2 but in a different font encoding — not needed client-side. */
  text?: string;
  translation?: unknown;
  transliteration?: unknown;
  page_number: number;
}

interface QuranVerseResponse {
  verse: {
    verse_key: string;
    words: RawWord[];
  };
}

/** Strip all API fields that are not in VerseWord or that could reveal a choice's identity. */
function sanitizeWords(words: RawWord[]): VerseWord[] {
  return words.map(({ id, position, code_v2, text_qpc_hafs, page_number, char_type_name }) => ({
    id,
    position,
    code_v2,
    text_qpc_hafs,
    page_number,
    char_type_name,
  }));
}

async function fetchRandomVerse(): Promise<{ verseKey: string; words: RawWord[] }> {
  // Each call gets its own AbortController signal to opt out of Next.js
  // per-render-pass fetch memoization (same URL would otherwise be deduplicated).
  const { signal } = new AbortController();
  const res = await fetch(
    'https://api.quran.com/api/v4/verses/random?words=true&word_fields=code_v2,text_qpc_hafs,page_number,char_type_name&fields=verse_key',
    { cache: 'no-store', signal },
  );
  if (!res.ok) {
    throw new Error('Quran API error (random verse)');
  }
  const { verse } = (await res.json()) as QuranVerseResponse;
  const words = [...verse.words].sort((a, b) => a.position - b.position);
  return { verseKey: verse.verse_key, words };
}

async function fetchVerseByKey(verseKey: string): Promise<RawWord[]> {
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=code_v2,text_qpc_hafs,page_number,char_type_name`,
    { cache: 'no-store' },
  );
  if (!res.ok) {
    throw new Error(`Quran API error (verse ${verseKey})`);
  }
  const { verse } = (await res.json()) as QuranVerseResponse;
  return [...verse.words].sort((a, b) => a.position - b.position);
}

/** Returns the verse key that comes immediately after the given key, or null for the last verse. */
function nextVerseKey(verseKey: string): string | null {
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = parseInt(surahStr, 10);
  const ayah = parseInt(ayahStr, 10);
  const maxAyah = SURAH_VERSE_COUNTS[surah];
  if (ayah < maxAyah) {
    return `${surah}:${ayah + 1}`;
  }
  if (surah < 114) {
    return `${surah + 1}:1`;
  }
  return null; // last verse of the Quran
}

/** Fetches a random verse from a surah chosen uniformly within [surahMin, surahMax]. */
async function fetchRandomVerseInSurahRange(
  surahMin: number,
  surahMax: number,
): Promise<{ verseKey: string; words: RawWord[] }> {
  const lo = Math.max(1, surahMin);
  const hi = Math.min(114, surahMax);
  const surah = lo + Math.floor(Math.random() * (hi - lo + 1));
  const maxAyah = SURAH_VERSE_COUNTS[surah];
  const ayah = 1 + Math.floor(Math.random() * maxAyah);
  const verseKey = `${surah}:${ayah}`;
  const words = await fetchVerseByKey(verseKey);
  return { verseKey, words };
}

export async function getRandomQuestion(): Promise<Question> {
  // Keep retrying until we get a verse that has a next verse (avoids the final ayah 114:6)
  let current: { verseKey: string; words: RawWord[] };
  let nextKey: string | null;
  do {
    current = await fetchRandomVerse();
    nextKey = nextVerseKey(current.verseKey);
  } while (nextKey === null);

  // Fetch the correct next verse + 3 distractors from ±1 surah of the answer
  const [nextSurahStr] = nextKey.split(':');
  const nextSurah = parseInt(nextSurahStr, 10);
  const distractorPromises = Array.from({ length: 3 }, () =>
    fetchRandomVerseInSurahRange(nextSurah - 1, nextSurah + 1),
  );
  const [nextVerseWords, ...distractorResults] = await Promise.all([
    fetchVerseByKey(nextKey),
    ...distractorPromises,
  ]);

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
    const extra = await fetchRandomVerseInSurahRange(nextSurah - 1, nextSurah + 1);
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
