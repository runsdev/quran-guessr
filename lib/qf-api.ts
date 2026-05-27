/* eslint-disable @typescript-eslint/naming-convention */
import { unstable_cache } from 'next/cache';

import { prisma } from './prisma';

const IS_PRODUCTION = process.env.QF_ENVIRONMENT === 'production';

const QF_OAUTH2_BASE = IS_PRODUCTION
  ? 'https://oauth2.quran.foundation'
  : 'https://prelive-oauth2.quran.foundation';

const QF_USER_API_BASE = IS_PRODUCTION
  ? 'https://apis.quran.foundation/auth'
  : 'https://apis-prelive.quran.foundation/auth';

/** Buffer in seconds — refresh the token this far before actual expiry. */
const REFRESH_BUFFER_SECONDS = 60;

/**
 * Refresh an OAuth2 access token using the `refresh_token` grant.
 */
async function refreshTokens(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
} | null> {
  const clientId = process.env.QF_CLIENT_ID!;
  const clientSecret = process.env.QF_CLIENT_SECRET!;

  // HTTP Basic Auth as required by the QF OAuth2 server (client_secret_basic)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch(`${QF_OAUTH2_BASE}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[qf-api] Token refresh failed:', res.status, err);
      return null;
    }

    return (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      scope: string;
      token_type: string;
    };
  } catch (e) {
    console.error('[qf-api] Token refresh network error:', e);
    return null;
  }
}

/**
 * Return a valid access token for the given local userId.
 *
 * 1. Looks up the Account record by the app's local `userId` FK.
 * 2. If the stored access_token hasn't expired yet, returns it immediately.
 * 3. If it has expired, uses the `refresh_token` + HTTP Basic Auth to get
 *    a fresh token pair from the QF OAuth2 server.
 * 4. Persists the refreshed tokens back to the database so subsequent
 *    requests don't need another round-trip.
 */
export async function getAccessToken(userId: string): Promise<string | null> {
  const currentProviderId =
    process.env.QF_ENVIRONMENT === 'production' ? 'quran-foundation' : 'quran-foundation-prelive';

  // 1. Only look for the account matching the CURRENT environment
  const account = await prisma.account.findFirst({
    where: { userId, provider: currentProviderId },
    select: { id: true, access_token: true, refresh_token: true, expires_at: true },
  });

  if (!account?.access_token) {
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const isExpired =
    !account.expires_at || nowSeconds >= account.expires_at - REFRESH_BUFFER_SECONDS;

  if (!isExpired) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    return null;
  }

  const refreshed = await refreshTokens(account.refresh_token);
  if (!refreshed) {
    return null;
  }

  const newExpiresAt = Math.floor(Date.now() / 1000) + refreshed.expires_in;

  // 2. Safely update ONLY the exact account record we are refreshing
  await prisma.account.update({
    where: { id: account.id },
    data: {
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: newExpiresAt,
    },
  });

  return refreshed.access_token;
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
