import type { Verse, Word } from '@quranjs/api';

import { encryptVerseKey, signAnswer, encryptHiddenWords } from './answerToken';
import type { Question, Segment } from './types';

import { SURAH_VERSE_COUNTS } from '@/app/quiz/next-verse/surahData';
import type { VerseWord } from '@/app/quiz/types';
import { prisma } from '@/lib/prisma';
import { qdcFetchByJuz, qdcFetchByPage, qdcFetchRandom, qdcFetchByKey } from '@/lib/qdc-client';
import type { QdcVerse } from '@/lib/qdc-client';
import { getContentClient } from '@/lib/qf-server-client';
import { pickRandomJuz } from '@/lib/quran-pages';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Map an SDK Word to the app's VerseWord shape. */
function mapWord(w: Word): VerseWord & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_number: number;
} {
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { id: w.id ?? 0, position: w.position, code_v2: w.codeV2 ?? '', text_qpc_hafs: w.text ?? '', page_number: w.pageNumber ?? 1, char_type_name: w.charTypeName };
}

/** Options passed to every verse endpoint: include words and request the QCF v2 glyph codes. */
const WORD_OPTS = {
  words: true,
  wordFields: { codeV2: true },
} as const;

interface QuranVerse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  verse_key: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  words: Array<VerseWord & { page_number: number }>;
}

function toQuranVerse(v: Verse): QuranVerse {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    verse_key: v.verseKey,
    words: (v.words ?? []).map(mapWord),
  };
}

function qdcToQuranVerse(v: QdcVerse): QuranVerse {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    verse_key: v.verse_key,
    words: v.words.map((w) => ({
      id: w.id,
      position: w.position,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      code_v2: w.code_v2 ?? '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      text_qpc_hafs: w.text ?? '',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_number: w.page_number ?? 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      char_type_name: w.char_type_name,
    })),
  };
}

async function fetchVerse(targetPageNumber?: number, juzFilter?: number[]): Promise<QuranVerse> {
  if (targetPageNumber !== undefined) {
    if (!IS_PRODUCTION) {
      return qdcToQuranVerse(await qdcFetchByPage(targetPageNumber));
    }
    try {
      // byPage with words:true returns empty on some environments; use a two-step
      // approach: get the verse index for the page (no words), pick randomly, then
      // fetch the full verse with words via byKey.
      const client = getContentClient();
      const pageIndex = await client.content.v4.verses.byPage(
        String(targetPageNumber) as Parameters<typeof client.content.v4.verses.byPage>[0],
      );
      if (!pageIndex?.length) {
        throw new Error('No verses found for page');
      }
      const picked = pageIndex[Math.floor(Math.random() * pageIndex.length)];
      const verse = await client.content.v4.verses.byKey(
        picked.verseKey as Parameters<typeof client.content.v4.verses.byKey>[0],
        WORD_OPTS,
      );
      return toQuranVerse(verse);
    } catch (err) {
      console.warn(`SDK byPage(${targetPageNumber}) failed, falling back to direct API:`, err);
      return qdcToQuranVerse(await qdcFetchByPage(targetPageNumber));
    }
  }

  if (juzFilter && juzFilter.length > 0) {
    const juzNum = pickRandomJuz(juzFilter);
    if (!IS_PRODUCTION) {
      return qdcToQuranVerse(await qdcFetchByJuz(juzNum));
    }
    try {
      const client = getContentClient();
      const verses = await client.content.v4.verses.byJuz(
        String(juzNum) as Parameters<typeof client.content.v4.verses.byJuz>[0],
        WORD_OPTS,
      );
      if (!verses?.length) {
        throw new Error('No verses found for juz');
      }
      return toQuranVerse(verses[Math.floor(Math.random() * verses.length)]);
    } catch (err) {
      console.warn(`SDK byJuz(${juzNum}) failed, falling back to direct API:`, err);
      return qdcToQuranVerse(await qdcFetchByJuz(juzNum));
    }
  }

  if (!IS_PRODUCTION) {
    return qdcToQuranVerse(await qdcFetchRandom());
  }
  try {
    const client = getContentClient();
    const verse = await client.content.v4.verses.random(WORD_OPTS);
    return toQuranVerse(verse);
  } catch (err) {
    console.warn('SDK random failed, falling back to direct API:', err);
    return qdcToQuranVerse(await qdcFetchRandom());
  }
}

async function fetchVerseByKey(verseKey: string): Promise<QuranVerse | null> {
  if (!IS_PRODUCTION) {
    const v = await qdcFetchByKey(verseKey);
    return v ? qdcToQuranVerse(v) : null;
  }
  try {
    const client = getContentClient();
    const verse = await client.content.v4.verses.byKey(
      verseKey as Parameters<typeof client.content.v4.verses.byKey>[0],
      WORD_OPTS,
    );
    return toQuranVerse(verse);
  } catch {
    const v = await qdcFetchByKey(verseKey);
    return v ? qdcToQuranVerse(v) : null;
  }
}

/** Next verse key within the same surah, or null if at the end of the surah. */
function nextSurahVerseKey(verseKey: string): string | null {
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = parseInt(surahStr, 10);
  const ayah = parseInt(ayahStr, 10);
  if (ayah < SURAH_VERSE_COUNTS[surah]) {
    return `${surah}:${ayah + 1}`;
  }
  return null;
}

/** Arabic words only, sorted by position within the verse. */
// eslint-disable-next-line @typescript-eslint/naming-convention
function arabicWords(v: QuranVerse): Array<VerseWord & { page_number: number }> {
  return v.words.filter((w) => w.char_type_name === 'word').sort((a, b) => a.position - b.position);
}

/**
 * @param targetPageNumber - when provided, fetches a verse from that specific
 *   Mushaf page (adaptive difficulty); otherwise selects a fully random verse.
 * @param juzFilter - when provided, restricts random selection to these juz.
 */
export async function getRandomQuestion(
  targetPageNumber?: number,
  juzFilter?: number[],
): Promise<Question> {
  const primaryVerse = await fetchVerse(targetPageNumber, juzFilter);
  const primaryWords = arabicWords(primaryVerse);
  const wordCount = primaryWords.length;

  // Need at least 1 word to hide; cap missing at 4
  const maxMissing = Math.min(4, Math.max(0, wordCount - 1));
  if (maxMissing < 1) {
    throw new Error('Could not build a question: verse has too few Arabic words');
  }

  const missingCount = 1 + Math.floor(Math.random() * maxMissing);
  const visibleCount = wordCount - missingCount;

  // If ≤ 2 words remain visible, fetch the next verse as informational context only
  let infoVerse: QuranVerse | null = null;
  if (visibleCount <= 2) {
    const nextKey = nextSurahVerseKey(primaryVerse.verse_key);
    if (nextKey) {
      infoVerse = await fetchVerseByKey(nextKey);
    }
  }

  // Select hidden word indices via Fisher-Yates partial shuffle
  const indices = [...Array(wordCount).keys()];
  for (let i = 0; i < missingCount; i++) {
    const j = i + Math.floor(Math.random() * (wordCount - i));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }
  const hiddenSet = new Set(indices.slice(0, missingCount));

  // Build segments for primary verse
  const segments: Segment[] = [];
  const hiddenWords: VerseWord[] = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let currentWords: Array<VerseWord & { page_number: number }> = [];

  for (let i = 0; i < primaryWords.length; i++) {
    if (hiddenSet.has(i)) {
      hiddenWords.push(primaryWords[i] as VerseWord);
      if (currentWords.length > 0) {
        segments.push({ type: 'words', words: currentWords });
        currentWords = [];
      }
      if (segments.length === 0 || segments[segments.length - 1].type !== 'blank') {
        segments.push({ type: 'blank' });
      }
    } else {
      currentWords.push(primaryWords[i]);
    }
  }
  if (currentWords.length > 0) {
    segments.push({ type: 'words', words: currentWords });
  }

  // Always insert a verse-end marker after the primary verse
  segments.push({ type: 'verse-end', verseKey: primaryVerse.verse_key });

  // Info verse: all words visible, no blanks
  if (infoVerse) {
    const infoWords = arabicWords(infoVerse);
    if (infoWords.length > 0) {
      segments.push({ type: 'words', words: infoWords });
      segments.push({ type: 'verse-end', verseKey: primaryVerse.verse_key });
    }
  }

  const pageNumber = primaryWords[0]?.page_number ?? 1;
  const pageEloRecord = await prisma.pageElo.findUnique({ where: { pageNumber } });

  return {
    encryptedVerseKey: encryptVerseKey(primaryVerse.verse_key),
    segments,
    answerToken: signAnswer(primaryVerse.verse_key, missingCount, pageNumber, wordCount),
    encryptedHiddenWords: encryptHiddenWords(hiddenWords),
    totalWords: wordCount,
    pageElo: pageEloRecord ? Math.round(pageEloRecord.elo) : 1000,
  };
}
