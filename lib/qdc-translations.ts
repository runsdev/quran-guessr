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
  // English
  { id: 20, language: 'en', label: 'Saheeh International (English)' },
  // { id: 85, language: 'en', label: 'M.A.S. Abdel Haleem (English)' },
  // { id: 131, language: 'en', label: 'Dr. Mustafa Khattab (English)' },
  // { id: 84, language: 'en', label: 'T. Usmani (English)' },
  // { id: 95, language: 'en', label: 'A. Maududi (English)' },
  // { id: 19, language: 'en', label: 'M. Pickthall (English)' },
  // { id: 22, language: 'en', label: 'A. Yusuf Ali (English)' },
  // { id: 203, language: 'en', label: 'Al-Hilali & Khan (English)' },
  // { id: 57, language: 'en', label: 'Transliteration (English)' },
  // Indonesian
  { id: 33, language: 'id', label: 'Indonesian Ministry of Religious Affairs' },
  { id: 134, language: 'id', label: 'King Fahad Quran Complex (Indonesian)' },
  { id: 141, language: 'id', label: 'The Sabiq Company (Indonesian)' },
  // Bengali
  { id: 161, language: 'bn', label: 'Taisirul Quran (Bengali)' },
  // { id: 163, language: 'bn', label: 'Sheikh Mujibur Rahman (Bengali)' },
  // { id: 162, language: 'bn', label: 'Rawai Al-bayan (Bengali)' },
  // { id: 213, language: 'bn', label: 'Dr. Abu Bakr Muhammad Zakaria (Bengali)' },
  // Chinese
  { id: 56, language: 'cn', label: 'Chinese Translation Simplified - Ma Jian' },
  // { id: 109, language: 'zh', label: 'Muhammad Makin (Chinese)' },
  // French
  { id: 136, language: 'fr', label: 'Montada Islamic Foundation (French)' },
  // { id: 31, language: 'fr', label: 'Muhammad Hamidullah (French)' },
  // { id: 779, language: 'fr', label: 'Rashid Maash (French)' },
  // Turkish
  { id: 210, language: 'tr', label: 'Dar Al-Salam Center (Turkish)' },
  // { id: 77, language: 'tr', label: 'Turkish Translation (Diyanet)' },
  // { id: 124, language: 'tr', label: 'Muslim Shahin (Turkish)' },
  // { id: 112, language: 'tr', label: 'Shaban Britch (Turkish)' },
  // { id: 52, language: 'tr', label: 'Elmalili Hamdi Yazir (Turkish)' },
  // Urdu
  { id: 234, language: 'ur', label: 'Fatah Muhammad Jalandhari (Urdu)' },
  // { id: 54, language: 'ur', label: 'Maulana Muhammad Junagarhi (Urdu)' },
  // { id: 156, language: 'ur', label: "Fi Zilal al-Qur'an (Urdu)" },
  // { id: 151, language: 'ur', label: 'Shaykh al-Hind Mahmud al-Hasan (Urdu)' },
  // { id: 158, language: 'ur', label: 'Bayan-ul-Quran - Dr. Israr Ahmad (Urdu)' },
  // { id: 97, language: 'ur', label: "Tafheem e Qur'an - Maududi (Urdu)" },
  // { id: 819, language: 'ur', label: 'Maulana Wahiduddin Khan (Urdu)' },
  // { id: 831, language: 'ur', label: 'Abul Ala Maududi (Roman Urdu)' },
  // Russian
  { id: 79, language: 'ru', label: 'Abu Adel (Russian)' },
  // { id: 78, language: 'ru', label: 'Ministry of Awqaf, Egypt (Russian)' },
  // { id: 45, language: 'ru', label: 'Elmir Kuliev (Russian)' },
  // Persian
  { id: 135, language: 'fa', label: 'IslamHouse.com (Persian)' },
  // { id: 29, language: 'fa', label: 'Hussein Taji Kal Dari (Persian)' },
  // German
  { id: 208, language: 'de', label: 'Abu Reda Muhammad ibn Ahmad (German)' },
  // { id: 27, language: 'de', label: 'Frank Bubenheim and Nadeem (German)' },
  // Malay
  { id: 39, language: 'ms', label: 'Abdullah Muhammad Basmeih (Malay)' },
  // Spanish
  { id: 83, language: 'es', label: 'Sheikh Isa Garcia (Spanish)' },
  // { id: 140, language: 'es', label: 'Montada Islamic Foundation (Spanish)' },
  // { id: 199, language: 'es', label: 'Noor International Center (Spanish)' },
  // Japanese
  { id: 35, language: 'ja', label: 'Ryoichi Mita (Japanese)' },
  // { id: 218, language: 'ja', label: 'Saeed Sato (Japanese)' },
  // Korean
  { id: 36, language: 'ko', label: 'Korean Translation' },
  // { id: 219, language: 'ko', label: 'Hamed Choi (Korean)' },
  // Hindi
  { id: 122, language: 'hi', label: 'Maulana Azizul Haque al-Umari (Hindi)' },
  // Malayalam
  { id: 80, language: 'ml', label: 'Muhammad Karakunnu and Vanidas Elayavoor (Malayalam)' },
  // { id: 37, language: 'ml', label: 'Abdul Hameed and Kunhi (Malayalam)' },
  // Tamil
  { id: 50, language: 'ta', label: 'Jan Trust Foundation (Tamil)' },
  // Hausa
  { id: 115, language: 'ha', label: 'Abubakar Mahmood Jummi (Hausa)' },
  // Italian
  { id: 153, language: 'it', label: 'Hamza Roberto Piccardo (Italian)' },
  // Polish
  { id: 42, language: 'pl', label: 'Józef Bielawski (Polish)' },
  // Swedish
  { id: 48, language: 'sv', label: 'Knut Bernström (Swedish)' },
  // Portuguese
  { id: 103, language: 'pt', label: 'Helmi Nasr (Portuguese)' },
  // { id: 43, language: 'pt', label: 'Samir El-Hayek (Portuguese)' },
  // Norwegian
  { id: 41, language: 'no', label: 'Norwegian Translation' },
  // Finnish
  { id: 30, language: 'fi', label: 'Finnish Translation' },
  // Czech
  { id: 26, language: 'cs', label: 'Czech Translation' },
  // Romanian
  { id: 44, language: 'ro', label: 'Grigore (Romanian)' },
  // Somali
  { id: 46, language: 'so', label: 'Mahmud Muhammad Abduh (Somali)' },
  // Albanian
  { id: 88, language: 'sq', label: 'Hasan Efendi Nahi (Albanian)' },
  // { id: 89, language: 'sq', label: 'Sherif Ahmeti (Albanian)' },
  // Amharic
  { id: 87, language: 'am', label: 'Sadiq and Sani (Amharic)' },
  // Azeri
  { id: 75, language: 'az', label: 'Alikhan Musayev (Azeri)' },
  // { id: 23, language: 'az', label: 'Azerbaijani Translation' },
  // Bosnian
  { id: 214, language: 'bs', label: 'Dar Al-Salam Center (Bosnian)' },
  // { id: 25, language: 'bs', label: 'Muhamed Mehanović (Bosnian)' },
  // { id: 126, language: 'bs', label: 'Besim Korkut (Bosnian)' },
  // Bulgarian
  { id: 237, language: 'bg', label: 'Tzvetan Theophanov (Bulgarian)' },
  // Chechen
  { id: 106, language: 'ce', label: 'Magomed Magomedov (Chechen)' },
  // Divehi
  { id: 86, language: 'dv', label: 'Office of the president of Maldives (Divehi)' },
  // Kurdish
  { id: 81, language: 'ku', label: 'Burhan Muhammad-Amin (Kurdish)' },
  // { id: 143, language: 'ku', label: 'Muhammad Saleh Bamoki (Kurdish)' },
  // Maranao
  { id: 38, language: 'mrw', label: 'Maranao Translation' },
  // Serbian
  { id: 215, language: 'sr', label: 'Dar Al-Salam Center (Serbian)' },
  // Sindhi
  { id: 238, language: 'sd', label: 'Taj Mehmood Amroti (Sindhi)' },
  // Tajik
  { id: 139, language: 'tg', label: 'Khawaja Mirof & Khawaja Mir (Tajik)' },
  // { id: 223, language: 'tg', label: 'Pioneers of Translation Center (Tajik)' },
  // { id: 74, language: 'tg', label: 'Tajik Translation' },
  // Tagalog
  { id: 211, language: 'tl', label: 'Dar Al-Salam Center (Tagalog)' },
  // Tatar
  { id: 53, language: 'tt', label: 'Tatar Translation' },
  // Ukrainian
  { id: 217, language: 'uk', label: 'Dr. Mikhailo Yaqubovic (Ukrainian)' },
  // Uyghur
  { id: 76, language: 'ug', label: 'Muhammad Saleh (Uyghur)' },
  // Uzbek
  { id: 55, language: 'uz', label: 'Muhammad Sodiq Muhammad Yusuf (Uzbek, Latin)' },
  // { id: 101, language: 'uz', label: 'Alauddin Mansour (Uzbek)' },
  // { id: 127, language: 'uz', label: 'Muhammad Sodik Muhammad Yusuf (Uzbek)' },
  // Vietnamese
  { id: 220, language: 'vi', label: 'Translation Pioneers Center (Vietnamese)' },
  // { id: 221, language: 'vi', label: 'Hasan Abdul-Karim (Vietnamese)' },
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
  // const res = await fetch(`${QDC_BASE}/translations/${translationId}/by_ayah/${verseKey}`);
  console.log(res);
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
