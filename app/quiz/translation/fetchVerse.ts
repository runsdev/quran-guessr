/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Shared verse-fetching helpers for the translation quiz.
 */
import type { Word } from '@quranjs/api';

import type { VerseWord } from './types';

import { qdcFetchByJuz, qdcFetchRandom } from '@/lib/qdc-client';
import type { QdcWord } from '@/lib/qdc-client';
import { getContentClient } from '@/lib/qf-server-client';
import { pickRandomJuz } from '@/lib/quran-pages';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export interface RawWord extends VerseWord {
  page_number: number;
}

const WORD_OPTS = { words: true, wordFields: { codeV2: true } } as const;

function mapWord(w: Word): RawWord {
  // prettier-ignore
  return { id: w.id ?? 0, position: w.position, code_v2: w.codeV2 ?? '', text_qpc_hafs: w.text ?? '', page_number: w.pageNumber ?? 1, char_type_name: w.charTypeName };
}

export function qdcToRaw(w: QdcWord): RawWord {
  const { id, position, code_v2, text, page_number, char_type_name } = w;
  // prettier-ignore
  return { id, position, code_v2: code_v2 ?? '', text_qpc_hafs: text ?? '', page_number: page_number ?? 1, char_type_name };
}

export async function fetchRandomVerse(
  juzFilter?: number[],
): Promise<{ verseKey: string; words: RawWord[] }> {
  if (juzFilter && juzFilter.length > 0) {
    const juzNum = pickRandomJuz(juzFilter);
    if (!IS_PRODUCTION) {
      const v = await qdcFetchByJuz(juzNum);
      return {
        verseKey: v.verse_key,
        words: v.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
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
      return {
        verseKey: verse.verseKey,
        words: [...(verse.words ?? [])].sort((a, b) => a.position - b.position).map(mapWord),
      };
    } catch (err) {
      console.warn(`SDK byJuz(${juzNum}) fallback:`, err);
      const v = await qdcFetchByJuz(juzNum);
      return {
        verseKey: v.verse_key,
        words: v.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
      };
    }
  }
  if (!IS_PRODUCTION) {
    const v = await qdcFetchRandom();
    return {
      verseKey: v.verse_key,
      words: v.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
    };
  }
  try {
    const client = getContentClient();
    const verse = await client.content.v4.verses.random(WORD_OPTS);
    return {
      verseKey: verse.verseKey,
      words: [...(verse.words ?? [])].sort((a, b) => a.position - b.position).map(mapWord),
    };
  } catch (err) {
    console.warn('SDK random fallback:', err);
    const v = await qdcFetchRandom();
    return {
      verseKey: v.verse_key,
      words: v.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
    };
  }
}
