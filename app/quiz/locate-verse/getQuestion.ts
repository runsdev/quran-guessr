import { encryptVerseKey, signAnswer } from './answerToken';
import type { Question, VerseWord } from './types';

import { SURAH_NAMES } from '@/lib/quran-pages';

interface QuranVerseResponse {
  verse: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    verse_key: string;
    words: VerseWord[];
  };
}

async function fetchRandomVerse(): Promise<{ verseKey: string; words: VerseWord[] }> {
  const { signal } = new AbortController();
  const res = await fetch(
    'https://api.quran.com/api/v4/verses/random?words=true' +
      '&word_fields=code_v2,text_qpc_hafs,page_number,line_number,char_type_name&fields=verse_key',
    { cache: 'no-store', signal },
  );
  if (!res.ok) {
    throw new Error('Quran API error');
  }
  const { verse } = (await res.json()) as QuranVerseResponse;
  const words = [...verse.words].sort((a, b) => a.position - b.position);
  return { verseKey: verse.verse_key, words };
}

export async function getRandomQuestion(): Promise<Question> {
  const { verseKey, words } = await fetchRandomVerse();

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
