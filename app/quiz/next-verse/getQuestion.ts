import { encryptVerseKey, signAnswer } from './answerToken';
import type { Question, VerseWord } from './types';

// prettier-ignore
/** Verse counts per surah (1-indexed; index 0 unused). */
const SURAH_VERSE_COUNTS: readonly number[] = [
  0,
    7, 286, 200, 176, 120, 165, 206,  75, 129, 109, // 1-10
  123, 111,  43,  52,  99, 128, 111, 110,  98, 135, // 11-20
  112,  78, 118,  64,  77, 227,  93,  88,  69,  60, // 21-30
   34,  30,  73,  54,  45,  83, 182,  88,  75,  85, // 31-40
   54,  53,  89,  59,  37,  35,  38,  29,  18,  45, // 41-50
   60,  49,  62,  55,  78,  96,  29,  22,  24,  13, // 51-60
   14,  11,  11,  18,  12,  12,  30,  52,  52,  44, // 61-70
   28,  28,  20,  56,  40,  31,  50,  40,  46,  42, // 71-80
   29,  19,  36,  25,  22,  17,  19,  26,  30,  20, // 81-90
   15,  21,  11,   8,   8,  19,   5,   8,   8,  11, // 91-100
   11,   8,   3,   9,   5,   4,   7,   3,   6,   3, // 101-110
    5,   4,   5,   6,                               // 111-114
];

// prettier-ignore
const SURAH_NAMES: readonly string[] = [
  '',
  'Al-Fatihah',    'Al-Baqarah',    "Ali 'Imran",    "An-Nisa'",     "Al-Ma'idah",   // 1-5
  "Al-An'am",      "Al-A'raf",      'Al-Anfal',      'At-Tawbah',    'Yunus',         // 6-10
  'Hud',           'Yusuf',         "Ar-Ra'd",        'Ibrahim',      'Al-Hijr',       // 11-15
  'An-Nahl',       "Al-Isra'",      'Al-Kahf',       'Maryam',       'Ta-Ha',         // 16-20
  "Al-Anbiya'",    'Al-Hajj',       "Al-Mu'minun",   'An-Nur',       'Al-Furqan',     // 21-25
  "Ash-Shu'ara'",  'An-Naml',       'Al-Qasas',      "Al-'Ankabut",  'Ar-Rum',        // 26-30
  'Luqman',        'As-Sajdah',     'Al-Ahzab',      "Saba'",        'Fatir',         // 31-35
  'Ya-Sin',        'As-Saffat',     'Sad',           'Az-Zumar',     'Ghafir',        // 36-40
  'Fussilat',      'Ash-Shura',     'Az-Zukhruf',    'Ad-Dukhan',    'Al-Jathiyah',   // 41-45
  'Al-Ahqaf',      'Muhammad',      'Al-Fath',       'Al-Hujurat',   'Qaf',           // 46-50
  'Adh-Dhariyat',  'At-Tur',        'An-Najm',       'Al-Qamar',     'Ar-Rahman',     // 51-55
  "Al-Waqi'ah",    'Al-Hadid',      'Al-Mujadilah',  'Al-Hashr',     'Al-Mumtahanah', // 56-60
  'As-Saf',        "Al-Jumu'ah",    'Al-Munafiqun',  'At-Taghabun',  'At-Talaq',      // 61-65
  'At-Tahrim',     'Al-Mulk',       'Al-Qalam',      'Al-Haqqah',    "Al-Ma'arij",    // 66-70
  'Nuh',           'Al-Jinn',       'Al-Muzzammil',  'Al-Muddaththir','Al-Qiyamah',   // 71-75
  'Al-Insan',      'Al-Mursalat',   "An-Naba'",      "An-Nazi'at",   "'Abasa",        // 76-80
  'At-Takwir',     'Al-Infitar',    'Al-Mutaffifin', 'Al-Inshiqaq',  'Al-Buruj',      // 81-85
  'At-Tariq',      "Al-A'la",       'Al-Ghashiyah',  'Al-Fajr',      'Al-Balad',      // 86-90
  'Ash-Shams',     'Al-Layl',       'Ad-Duha',       'Ash-Sharh',    'At-Tin',        // 91-95
  "Al-'Alaq",      'Al-Qadr',       'Al-Bayyinah',   'Az-Zalzalah',  "Al-'Adiyat",   // 96-100
  "Al-Qari'ah",    'At-Takathur',   "Al-'Asr",       'Al-Humazah',   'Al-Fil',        // 101-105
  'Quraysh',       "Al-Ma'un",      'Al-Kawthar',    'Al-Kafirun',   'An-Nasr',       // 106-110
  'Al-Masad',      'Al-Ikhlas',     'Al-Falaq',      'An-Nas',                        // 111-114
];

interface QuranVerseResponse {
  verse: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    verse_key: string;
    words: VerseWord[];
  };
}

async function fetchRandomVerse(): Promise<{ verseKey: string; words: VerseWord[] }> {
  // Each call gets its own AbortController signal to opt out of Next.js
  // per-render-pass fetch memoization (same URL would otherwise be deduplicated).
  const { signal } = new AbortController();
  const res = await fetch(
    'https://api.quran.com/api/v4/verses/random?words=true&word_fields=code_v2,text_qpc_hafs&fields=verse_key',
    { cache: 'no-store', signal },
  );
  if (!res.ok) {
    throw new Error('Quran API error (random verse)');
  }
  const { verse } = (await res.json()) as QuranVerseResponse;
  return { verseKey: verse.verse_key, words: verse.words };
}

async function fetchVerseByKey(verseKey: string): Promise<VerseWord[]> {
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=code_v2,text_qpc_hafs`,
    { cache: 'no-store' },
  );
  if (!res.ok) {
    throw new Error(`Quran API error (verse ${verseKey})`);
  }
  const { verse } = (await res.json()) as QuranVerseResponse;
  return verse.words;
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

export async function getRandomQuestion(): Promise<Question> {
  // Keep retrying until we get a verse that has a next verse (avoids the final ayah 114:6)
  let current: { verseKey: string; words: VerseWord[] };
  let nextKey: string | null;
  do {
    current = await fetchRandomVerse();
    nextKey = nextVerseKey(current.verseKey);
  } while (nextKey === null);

  // Fetch the correct next verse + 3 distractors in parallel
  const distractorPromises = Array.from({ length: 3 }, () => fetchRandomVerse());
  const [nextVerseWords, ...distractorResults] = await Promise.all([
    fetchVerseByKey(nextKey),
    ...distractorPromises,
  ]);

  // Deduplicate: ensure no distractor matches the correct next verse or current verse
  const usedKeys = new Set([current.verseKey, nextKey]);
  const distractorWordSets: VerseWord[][] = [];
  for (const d of distractorResults) {
    if (!usedKeys.has(d.verseKey)) {
      usedKeys.add(d.verseKey);
      distractorWordSets.push(d.words);
    }
  }
  // If deduplication removed some, fetch replacements
  while (distractorWordSets.length < 3) {
    const extra = await fetchRandomVerse();
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
      choices.push({ words: nextVerseWords });
    } else {
      choices.push({ words: distractorWordSets[distractorCursor++] });
    }
  }

  const [surahStr] = current.verseKey.split(':');
  const surahNum = parseInt(surahStr, 10);
  const surahName = SURAH_NAMES[surahNum] ?? `Surah ${surahNum}`;
  const verseReference = `${surahName} · ${current.verseKey}`;

  return {
    encryptedVerseKey: encryptVerseKey(current.verseKey),
    verseWords: current.words,
    verseReference,
    choices,
    answerToken: signAnswer(current.verseKey, correctIndex),
  };
}
