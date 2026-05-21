/* eslint-disable @typescript-eslint/naming-convention */
import type { UserSession } from '@quranjs/api';
import { createServerClient } from '@quranjs/api/server';
import { unstable_cache } from 'next/cache';

import { prisma } from './prisma';

const IS_PRODUCTION = process.env.QF_ENVIRONMENT === 'production';

const QF_USER_API_BASE = IS_PRODUCTION
  ? 'https://apis.quran.foundation/auth'
  : 'https://apis-prelive.quran.foundation/auth';

/** Prelive service URLs — used when QF_ENVIRONMENT is not "production". */
const PRELIVE_SERVICES = {
  oauth2BaseUrl: 'https://prelive-oauth2.quran.foundation',
  contentBaseUrl: 'https://apis-prelive.quran.foundation/content',
  searchBaseUrl: 'https://apis-prelive.quran.foundation/search',
  authBaseUrl: 'https://apis-prelive.quran.foundation/auth',
} as const;

/**
 * Build a @quranjs/api/server client scoped to a signed-in user session.
 *
 * The SDK handles token refresh automatically.  When it refreshes, the
 * `storage.setSession` callback persists the new tokens back to the database
 * so the next request can reuse them without another round-trip.
 *
 * CLIENT_SECRET stays here — server module, never bundled into the client.
 */
async function buildUserClient(
  userId: string,
): Promise<ReturnType<typeof createServerClient> | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: 'quran-foundation' },
    select: { access_token: true, refresh_token: true, expires_at: true },
  });
  if (!account?.access_token) {
    return null;
  }

  const userSession: UserSession = {
    accessToken: account.access_token,
    refreshToken: account.refresh_token ?? undefined,
    expiresAt: account.expires_at ?? undefined,
  };

  return createServerClient({
    clientId: process.env.QF_CLIENT_ID!,
    clientSecret: process.env.QF_CLIENT_SECRET!,
    userSession,
    ...(!IS_PRODUCTION && { services: PRELIVE_SERVICES }),
    storage: {
      setSession: async (session: UserSession | null) => {
        if (session?.accessToken) {
          await prisma.account.updateMany({
            where: { userId, provider: 'quran-foundation' },
            data: {
              access_token: session.accessToken,
              refresh_token: session.refreshToken ?? account.refresh_token,
              expires_at: session.expiresAt ?? null,
            },
          });
        }
      },
    },
  });
}

/**
 * Return a valid access token for userId, letting the SDK refresh it if
 * needed and persist the new tokens via the storage callback above.
 */
async function getAccessToken(userId: string): Promise<string | null> {
  const client = await buildUserClient(userId);
  if (!client) {
    return null;
  }
  const session = await client.getUserSession();
  return session?.accessToken ?? null;
}

/**
 * Fetch the user's current Quran streak days from the QF API.
 * Returns 0 on any error so callers always get a safe integer.
 */
export async function fetchQfStreak(userId: string): Promise<number> {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    return 0;
  }

  try {
    const res = await fetch(`${QF_USER_API_BASE}/v1/streaks/current-streak-days?type=QURAN`, {
      headers: {
        Accept: 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': process.env.QF_CLIENT_ID!,
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return 0;
    }
    const json = (await res.json()) as { data?: { days?: number } };
    return json?.data?.days ?? 0;
  } catch {
    return 0;
  }
}

const _cachedQfStreak = unstable_cache((userId: string) => fetchQfStreak(userId), ['qf-streak'], {
  revalidate: 60,
});

export const getCachedQfStreak = (userId: string) => _cachedQfStreak(userId);

/**
 * Record a quiz activity day against the user's QF account.
 * Converts the verse key ("surah:verse") into a QF range and posts to /v1/activity-days.
 * Fires-and-forgets: errors are silently swallowed so the quiz flow is never blocked.
 */
export async function recordQfActivityDay(userId: string, verseKey: string): Promise<void> {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    return;
  }

  // QF range format: "chapter:verse-chapter:verse"
  const range = `${verseKey}-${verseKey}`;

  try {
    await fetch(`${QF_USER_API_BASE}/v1/activity-days`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': process.env.QF_CLIENT_ID!,
      },
      body: JSON.stringify({
        type: 'QURAN',
        seconds: 30,
        ranges: [range],
        mushafId: 4, // UthmaniHafs
      }),
    });
  } catch (e) {
    console.error('Failed to record QF activity day', e);
    // Non-blocking — streak display degrades gracefully
  }
}
