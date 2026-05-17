/* eslint-disable jsdoc/check-tag-names */
/**
 * Direct HTTP client for api.qurancdn.com — used as a fallback when the
 * @quranjs/api SDK returns 404 (e.g. in the prelive environment which has
 * limited data coverage).
 *
 * The public CDN API requires no authentication and serves the full Quran.
 */

const QDC_BASE = 'https://api.qurancdn.com/api/qdc/verses';
const QDC_WORD_PARAMS = 'words=true&word_fields=code_v2';

export interface QdcWord {
  id: number;
  position: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  code_v2: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  char_type_name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_number: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  line_number: number;
}

export interface QdcVerse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  verse_key: string;
  words: QdcWord[];
}

export async function qdcFetchByPage(page: number): Promise<QdcVerse> {
  const res = await fetch(`${QDC_BASE}/by_page/${page}?${QDC_WORD_PARAMS}&per_page=50`);
  if (!res.ok) {
    throw new Error(`QDC by_page ${page}: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { verses: QdcVerse[] };
  if (!data.verses?.length) {
    throw new Error(`QDC by_page ${page}: no verses`);
  }
  return data.verses[Math.floor(Math.random() * data.verses.length)];
}

export async function qdcFetchByJuz(juz: number): Promise<QdcVerse> {
  const res = await fetch(`${QDC_BASE}/by_juz/${juz}?${QDC_WORD_PARAMS}&per_page=300`);
  if (!res.ok) {
    throw new Error(`QDC by_juz ${juz}: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { verses: QdcVerse[] };
  if (!data.verses?.length) {
    throw new Error(`QDC by_juz ${juz}: no verses`);
  }
  return data.verses[Math.floor(Math.random() * data.verses.length)];
}

export async function qdcFetchRandom(): Promise<QdcVerse> {
  const res = await fetch(`${QDC_BASE}/random?${QDC_WORD_PARAMS}`);
  if (!res.ok) {
    throw new Error(`QDC random: ${res.status} ${res.statusText}`);
  }
  const { verse } = (await res.json()) as { verse: QdcVerse };
  return verse;
}

export async function qdcFetchByKey(verseKey: string): Promise<QdcVerse | null> {
  const res = await fetch(`${QDC_BASE}/by_key/${verseKey}?${QDC_WORD_PARAMS}`);
  if (!res.ok) {
    return null;
  }
  const { verse } = (await res.json()) as { verse: QdcVerse };
  return verse ?? null;
}
