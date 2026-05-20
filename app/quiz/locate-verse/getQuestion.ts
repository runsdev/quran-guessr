import type { Word } from '@quranjs/api';

import { encryptVerseKey, signAnswer } from './answerToken';
import type { Question, VerseWord } from './types';

import { qdcFetchByJuz, qdcFetchByPage, qdcFetchRandom } from '@/lib/qdc-client';
import type { QdcWord } from '@/lib/qdc-client';
import { getContentClient } from '@/lib/qf-server-client';
import { SURAH_NAMES, pickRandomJuz } from '@/lib/quran-pages';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

interface RawWord extends VerseWord {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_number: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  line_number: number;
}

/** Options for locate-verse: include words and request the QCF v2 glyph codes. */
const WORD_OPTS = {
  words: true,
  wordFields: { codeV2: true },
} as const;

function mapWord(w: Word): RawWord {
  return {
    id: w.id ?? 0,
    position: w.position,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    code_v2: w.codeV2 ?? '',
    // word.text is the default QPC Hafs rendering returned by the Content API.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    text_qpc_hafs: w.text ?? '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    page_number: w.pageNumber ?? 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    line_number: w.lineNumber ?? 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    char_type_name: w.charTypeName,
  };
}

function qdcWordToRaw(w: QdcWord): RawWord {
  return {
    id: w.id,
    position: w.position,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    code_v2: w.code_v2 ?? '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    text_qpc_hafs: w.text ?? '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    page_number: w.page_number ?? 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    line_number: w.line_number ?? 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    char_type_name: w.char_type_name,
  };
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
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToRaw),
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
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToRaw),
      };
    }
  }

  if (juzFilter && juzFilter.length > 0) {
    const juzNum = pickRandomJuz(juzFilter);
    if (!IS_PRODUCTION) {
      const qdcVerse = await qdcFetchByJuz(juzNum);
      return {
        verseKey: qdcVerse.verse_key,
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToRaw),
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
        words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToRaw),
      };
    }
  }

  if (!IS_PRODUCTION) {
    const qdcVerse = await qdcFetchRandom();
    return {
      verseKey: qdcVerse.verse_key,
      words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToRaw),
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
      words: qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToRaw),
    };
  }
}

export async function getRandomQuestion(
  juzFilter?: number[],
  pageNumber?: number,
): Promise<Question> {
  const { verseKey, words } = await fetchRandomVerse(juzFilter, pageNumber);

  const firstWord = words.find((w) => w.char_type_name !== 'end');
  const correctPage = firstWord?.page_number ?? words[0].page_number;
  const correctLine = firstWord?.line_number ?? 1;

  const fontPages = [...new Set(words.map((w) => w.page_number))];

  // Keep page_number so VerseCard can select the correct QCF v2 per-page font.
  // Strip line_number only — it directly reveals the answer line.
  const verseWords: VerseWord[] = words.map(
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    ({ line_number: _l, ...word }) => word,
  );

  const [surahStr] = verseKey.split(':');
  const surahNum = parseInt(surahStr, 10);
  const surahName = SURAH_NAMES[surahNum] ?? `Surah ${surahNum}`;

  return {
    encryptedVerseKey: encryptVerseKey(verseKey),
    verseWords,
    verseReference: `${surahName} · ${verseKey}`,
    answerToken: signAnswer(verseKey, correctPage, correctLine),
    fontPages,
  };
}
