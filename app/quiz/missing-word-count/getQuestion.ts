import type { Verse, Word } from '@quranjs/api';

import { encryptVerseKey, signAnswer, encryptHiddenWords } from './answerToken';
import type { Question, Segment } from './types';

import type { VerseWord } from '@/app/quiz/types';
import { prisma } from '@/lib/prisma';
import { qdcFetchByJuz, qdcFetchByPage, qdcFetchRandom } from '@/lib/qdc-client';
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

/**
 * @param targetPageNumber - when provided, fetches a verse from that specific
 *   Mushaf page (adaptive difficulty); otherwise selects a fully random verse.
 * @param juzFilter - when provided, restricts random selection to these juz.
 */
export async function getRandomQuestion(
  targetPageNumber?: number,
  juzFilter?: number[],
): Promise<Question> {
  // Retry up to 5 times to find a verse with at least 4 words (so at least 1
  // can be hidden without leaving fewer than 3 visible).
  for (let attempt = 0; attempt < 5; attempt++) {
    const verse = await fetchVerse(targetPageNumber, juzFilter);

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
      answerToken: signAnswer(verse.verse_key, missingCount, pageNumber, wordCount),
      encryptedHiddenWords: encryptHiddenWords(hiddenWords),
      totalWords: wordCount,
      pageElo: pageEloRecord ? Math.round(pageEloRecord.elo) : 1200,
    };
  }

  throw new Error('Could not find a suitable verse after multiple attempts');
}
