/* eslint-disable @typescript-eslint/naming-convention */
import { prisma } from './prisma';

const QF_USER_API_BASE =
  process.env.QF_ENVIRONMENT === 'production'
    ? 'https://apis.quran.foundation/auth'
    : 'https://apis-prelive.quran.foundation/auth';

const QF_TOKEN_URL =
  process.env.QF_ENVIRONMENT === 'production'
    ? 'https://oauth2.quran.foundation/oauth2/token'
    : 'https://prelive-oauth2.quran.foundation/oauth2/token';

/** Returns a fresh (possibly refreshed) access token for the given userId, or null if unavailable. */
async function getAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: 'quran-foundation' },
    select: { access_token: true, refresh_token: true, expires_at: true },
  });
  if (!account?.access_token) {
    return null;
  }

  // Valid for at least 60 more seconds
  if (account.expires_at && account.expires_at > Math.floor(Date.now() / 1000) + 60) {
    return account.access_token;
  }

  // Token expired — try to refresh
  if (!account.refresh_token) {
    return account.access_token;
  }

  try {
    const res = await fetch(QF_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',

        refresh_token: account.refresh_token,

        client_id: process.env.QF_CLIENT_ID!,

        client_secret: process.env.QF_CLIENT_SECRET!,
      }),
    });
    if (!res.ok) {
      return account.access_token;
    }

    const tokens = (await res.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };
    if (!tokens.access_token) {
      return account.access_token;
    }

    await prisma.account.updateMany({
      where: { userId, provider: 'quran-foundation' },
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? account.refresh_token,
        expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
      },
    });

    return tokens.access_token;
  } catch {
    return account.access_token;
  }
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
    console.log('QF streak response', res);
    if (!res.ok) {
      return 0;
    }
    const json = (await res.json()) as { data?: { days?: number } };
    return json?.data?.days ?? 0;
  } catch {
    return 0;
  }
}

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
