/* eslint-disable @typescript-eslint/naming-convention */
import { QF_OAUTH2_BASE, REFRESH_BUFFER_SECONDS, IS_PRODUCTION } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/**
 * Refresh an OAuth2 access token using the `refresh_token` grant.
 */
async function refreshTokens(refreshToken: string): Promise<TokenResponse | null> {
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

    return (await res.json()) as TokenResponse;
  } catch (e) {
    console.error('[qf-api] Token refresh network error:', e);
    return null;
  }
}

/**
 * Return a valid access token for the given local userId.
 */
export async function getAccessToken(userId: string): Promise<string | null> {
  const currentProviderId = IS_PRODUCTION ? 'quran-foundation' : 'quran-foundation-prelive';

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
