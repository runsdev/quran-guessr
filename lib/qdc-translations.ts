/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Direct HTTP client for fetching verse translations from api.qurancdn.com.
 *
 * Endpoints used:
 * - GET /api/qdc/verses/by_key/:verse_key?translations=:translation_id
 * - GET /api/qdc/resources/translations  (list available translations)
 *
 * The public CDN API requires no authentication.
 */

const QDC_BASE = 'https://api.qurancdn.com/api/qdc';

export interface QdcTranslation {
  id: number;
  resource_id: number;
  text: string;
}

export interface QdcTranslationResource {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
  translated_name: { name: string; language_name: string };
}

/**
 * Well-known translation IDs grouped by language.
 * These are the most popular translations from api.qurancdn.com.
 */
export const TRANSLATION_OPTIONS: {
  id: number;
  language: string;
  label: string;
}[] = [
  { id: 131, language: 'en', label: 'Dr. Mustafa Khattab (English)' },
  { id: 20, language: 'en', label: 'Saheeh International (English)' },
  { id: 33, language: 'id', label: 'Indonesian Ministry of Religious Affairs' },
  { id: 77, language: 'ms', label: 'Abdul Majid (Malay)' },
  { id: 134, language: 'fr', label: 'Muhammad Hamidullah (French)' },
  { id: 79, language: 'tr', label: 'Diyanet İşleri (Turkish)' },
  { id: 135, language: 'de', label: 'Abu Rida Muhammad (German)' },
  { id: 36, language: 'es', label: 'Julio Cortes (Spanish)' },
  { id: 161, language: 'ur', label: 'Fateh Muhammad Jalandhry (Urdu)' },
  { id: 136, language: 'ru', label: 'Ministry of Awqaf, Egypt (Russian)' },
  { id: 45, language: 'bn', label: 'Muhiuddin Khan (Bengali)' },
  { id: 27, language: 'zh', label: 'Muhammad Makin (Chinese)' },
];

/**
 * Fetches the translation text for a single verse using a specific translation resource ID.
 * Returns the translation text string, or null if unavailable.
 */
export async function qdcFetchTranslation(
  verseKey: string,
  translationId: number,
): Promise<string | null> {
  const res = await fetch(
    `${QDC_BASE}/verses/by_key/${verseKey}?translations=${translationId}&translation_fields=text`,
  );
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as {
    verse: { translations?: QdcTranslation[] };
  };
  const translations = data.verse?.translations;
  if (!translations?.length) {
    return null;
  }
  return translations[0].text;
}

/**
 * Fetches translations for multiple verse keys in a single batch call using the by_range endpoint.
 * Returns a map from verse_key to translation text.
 */
export async function qdcFetchTranslationsByRange(
  fromKey: string,
  toKey: string,
  translationId: number,
): Promise<Map<string, string>> {
  const res = await fetch(
    `${QDC_BASE}/verses/by_range/${fromKey}-${toKey}?translations=${translationId}&translation_fields=text&per_page=50`,
  );
  const result = new Map<string, string>();
  if (!res.ok) {
    return result;
  }
  const data = (await res.json()) as {
    verses: Array<{ verse_key: string; translations?: QdcTranslation[] }>;
  };
  for (const verse of data.verses ?? []) {
    const text = verse.translations?.[0]?.text;
    if (text) {
      result.set(verse.verse_key, text);
    }
  }
  return result;
}
