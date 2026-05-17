// @vitest-environment node
/**
 * Integration tests for @quranjs/api SDK endpoints.
 *
 * These tests make real HTTP requests and require QF_CLIENT_ID and
 * QF_CLIENT_SECRET to be present in the environment.
 *
 * Run:  npm run test:api
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';
import { createServerClient } from '@quranjs/api/server';
import { describe, it, expect, beforeAll } from 'vitest';

const PRELIVE_SERVICES = {
  oauth2BaseUrl: 'https://prelive-oauth2.quran.foundation',
  contentBaseUrl: 'https://apis-prelive.quran.foundation/content',
  searchBaseUrl: 'https://apis-prelive.quran.foundation/search',
  authBaseUrl: 'https://apis-prelive.quran.foundation/auth',
} as const;

const IS_PRODUCTION = process.env.QF_ENVIRONMENT === 'production';

function makeClient() {
  return createServerClient({
    clientId: process.env.QF_CLIENT_ID!,
    clientSecret: process.env.QF_CLIENT_SECRET!,
    ...(!IS_PRODUCTION && { services: PRELIVE_SERVICES }),
  });
}

const hasCredentials = Boolean(process.env.QF_CLIENT_ID && process.env.QF_CLIENT_SECRET);
const itIfCreds = hasCredentials ? it : it.skip;

describe('QF SDK – verses endpoints', () => {
  let client: ReturnType<typeof makeClient>;

  beforeAll(() => {
    if (!hasCredentials) {
      console.warn(
        'QF_CLIENT_ID / QF_CLIENT_SECRET not set — skipping integration tests.\n' +
          'Run with: npx vitest run --env-file .env lib/__tests__/qf-sdk-endpoints.test.ts',
      );
    } else {
      client = makeClient();
    }
  });

  describe('verses.random', () => {
    itIfCreds('returns a single verse', async () => {
      const verse = await client.content.v4.verses.random();
      expect(verse).toBeDefined();
      expect(verse.verseKey).toMatch(/^\d+:\d+$/);
      console.log('random verse key:', verse.verseKey);
    });

    itIfCreds('returns words when words:true is passed', async () => {
      const verse = await client.content.v4.verses.random({
        words: true,
        wordFields: { codeV2: true },
      });
      expect(Array.isArray(verse.words)).toBe(true);
      expect(verse.words!.length).toBeGreaterThan(0);
      console.log('random verse word count:', verse.words!.length);
    });
  });

  describe('verses.byKey', () => {
    const KNOWN_KEYS = ['1:1', '2:255', '36:1', '112:1'] as const;

    itIfCreds.each(KNOWN_KEYS)('fetches verse %s', async (key) => {
      const verse = await client.content.v4.verses.byKey(
        key as Parameters<typeof client.content.v4.verses.byKey>[0],
        {
          words: true,
          wordFields: { codeV2: true },
        },
      );
      expect(verse).toBeDefined();
      expect(verse.verseKey).toBe(key);
      console.log(`byKey(${key}) words:`, verse.words?.length ?? 0);
    });
  });

  describe('verses.byPage', () => {
    // Page range is 1-604 (Mushaf pages). Test a spread of page numbers to
    // determine which ones the current environment supports.
    const TEST_PAGES = [1, 50, 100, 200, 300, 356, 400, 500, 604] as const;

    itIfCreds.each(TEST_PAGES)('page %i returns verses or throws informatively', async (page) => {
      try {
        const verses = await client.content.v4.verses.byPage(
          String(page) as Parameters<typeof client.content.v4.verses.byPage>[0],
        );
        expect(Array.isArray(verses)).toBe(true);
        console.log(`byPage(${page}) → ${verses.length} verses`);
      } catch (err) {
        // Surface the error message so it's visible in test output
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`byPage(${page}) FAILED: ${msg}`);
        // Re-throw so the test is marked as failing — we want to know which pages error
        throw err;
      }
    });

    itIfCreds('first page contains verse 1:1', async () => {
      const verses = await client.content.v4.verses.byPage('1');
      const keys = verses.map((v) => v.verseKey);
      expect(keys).toContain('1:1');
    });
  });

  describe('verses.byJuz', () => {
    const TEST_JUZES = [1, 15, 30] as const;

    itIfCreds.each(TEST_JUZES)('juz %i returns verses', async (juz) => {
      const verses = await client.content.v4.verses.byJuz(
        String(juz) as Parameters<typeof client.content.v4.verses.byJuz>[0],
        { words: true, wordFields: { codeV2: true } },
      );
      expect(Array.isArray(verses)).toBe(true);
      expect(verses.length).toBeGreaterThan(0);
      console.log(`byJuz(${juz}) → ${verses.length} verses`);
    });
  });
});

// ---------------------------------------------------------------------------
// Direct API fallback tests (api.qurancdn.com)
// ---------------------------------------------------------------------------

const QDC_BASE = 'https://api.qurancdn.com/api/qdc/verses';
const QDC_WORD_PARAMS = 'words=true&word_fields=code_v2';

describe('QDC direct API fallback', () => {
  describe('by_page', () => {
    const TEST_PAGES = [1, 50, 100, 200, 300, 356, 400, 500, 604] as const;

    it.each(TEST_PAGES)('page %i returns verses', async (page) => {
      const res = await fetch(`${QDC_BASE}/by_page/${page}?${QDC_WORD_PARAMS}&per_page=50`);
      expect(res.ok).toBe(true);
      const data = (await res.json()) as { verses: { verse_key: string; words: unknown[] }[] };
      expect(Array.isArray(data.verses)).toBe(true);
      expect(data.verses.length).toBeGreaterThan(0);
      console.log(`QDC byPage(${page}) → ${data.verses.length} verses`);
    });
  });

  describe('by_juz', () => {
    const TEST_JUZES = [1, 15, 30] as const;

    it.each(TEST_JUZES)('juz %i returns verses', async (juz) => {
      const res = await fetch(`${QDC_BASE}/by_juz/${juz}?${QDC_WORD_PARAMS}&per_page=300`);
      expect(res.ok).toBe(true);
      const data = (await res.json()) as { verses: { verse_key: string; words: unknown[] }[] };
      expect(Array.isArray(data.verses)).toBe(true);
      expect(data.verses.length).toBeGreaterThan(0);
      console.log(`QDC byJuz(${juz}) → ${data.verses.length} verses`);
    });
  });

  describe('random', () => {
    it('returns a verse with words', async () => {
      const res = await fetch(`${QDC_BASE}/random?${QDC_WORD_PARAMS}`);
      expect(res.ok).toBe(true);
      const data = (await res.json()) as { verse: { verse_key: string; words: unknown[] } };
      expect(data.verse.verse_key).toMatch(/^\d+:\d+$/);
      expect(Array.isArray(data.verse.words)).toBe(true);
      console.log(`QDC random → ${data.verse.verse_key}`);
    });
  });
});
