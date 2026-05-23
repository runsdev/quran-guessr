import { SURAH_NAMES, SURAH_VERSE_COUNTS } from '../next-verse/surahData';

import { encryptVerseKey, signAnswer } from './answerToken';
import { fetchRandomVerse, qdcToRaw } from './fetchVerse';
import type { Question, VerseWord } from './types';

import { qdcFetchByKey } from '@/lib/qdc-client';
import { qdcFetchTranslation } from '@/lib/qdc-translations';

const DISTRACTOR_RANGE = 5;

/** Strip HTML tags from translation text (loop to handle nested fragments). */
function stripHtml(html: string): string {
  let prev = html;
  for (;;) {
    const cleaned = prev.replace(/<[^>]*>/g, '');
    if (cleaned === prev) {
      return cleaned;
    }
    prev = cleaned;
  }
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Build candidate distractor verse keys within ±range of the correct ayah. */
function buildCandidateKeys(verseKey: string, range: number, exclude: Set<string>): string[] {
  const [s, a] = verseKey.split(':').map(Number) as [number, number];
  const max = SURAH_VERSE_COUNTS[s];
  const keys: string[] = [];
  for (let i = Math.max(1, a - range); i <= Math.min(max, a + range); i++) {
    const k = `${s}:${i}`;
    if (!exclude.has(k)) {
      keys.push(k);
    }
  }
  return shuffle(keys);
}

/** Collect ≥3 unique distractor translations, widening range if needed. */
async function collectDistractors(
  verseKey: string,
  translationId: number,
  correctText: string,
): Promise<string[] | null> {
  const usedTexts = new Set([stripHtml(correctText)]);
  const valid: string[] = [];
  const tried = new Set([verseKey]);

  for (const range of [DISTRACTOR_RANGE, 15]) {
    const candidates = buildCandidateKeys(verseKey, range, tried);
    for (const ck of candidates) {
      if (valid.length >= 3) {
        return valid;
      }
      tried.add(ck);
      const t = await qdcFetchTranslation(ck, translationId);
      if (!t) {
        continue;
      }
      const stripped = stripHtml(t);
      if (!usedTexts.has(stripped)) {
        usedTexts.add(stripped);
        valid.push(t);
      }
    }
  }
  return valid.length >= 3 ? valid : null;
}

export async function getRandomQuestion(
  translationId: number,
  juzFilter?: number[],
): Promise<Question> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { verseKey, words } = await fetchRandomVerse(juzFilter);
    const correctTranslation = await qdcFetchTranslation(verseKey, translationId);
    if (!correctTranslation) {
      continue;
    }

    const distractors = await collectDistractors(verseKey, translationId, correctTranslation);
    if (!distractors) {
      continue;
    }

    const correctIndex = Math.floor(Math.random() * 4);
    const choices: { text: string }[] = [];
    let dc = 0;
    for (let i = 0; i < 4; i++) {
      choices.push({
        text: stripHtml(i === correctIndex ? correctTranslation : distractors[dc++]),
      });
    }

    const surahNum = parseInt(verseKey.split(':')[0], 10);
    const verseReference = `${SURAH_NAMES[surahNum] ?? `Surah ${surahNum}`} · ${verseKey}`;

    let verseWords: VerseWord[] = words;
    if (!words.length) {
      const fb = await qdcFetchByKey(verseKey);
      verseWords = fb ? fb.words.sort((a, b) => a.position - b.position).map(qdcToRaw) : [];
    }

    return {
      encryptedVerseKey: encryptVerseKey(verseKey),
      verseWords,
      verseReference,
      choices,
      answerToken: signAnswer(verseKey, correctIndex),
      translationId,
    };
  }
  throw new Error('Failed to generate translation question after multiple attempts');
}
