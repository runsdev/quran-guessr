/**
 * API Playground proxy route — forwards requests from the playground UI
 * to the Quran Foundation User APIs (pre-live).
 *
 * Uses getAccessToken() from qf-api.ts which refreshes expired tokens
 * using HTTP Basic Auth (client_secret_basic) against the QF OAuth2 server
 * and persists new tokens back to the database.
 */
import { type NextRequest } from 'next/server';

import { auth } from '@/auth';
import { getAccessToken } from '@/lib/qf-api';

const IS_PRODUCTION = process.env.QF_ENVIRONMENT === 'production';

const QF_USER_API_BASE = IS_PRODUCTION
  ? 'https://apis.quran.foundation/auth'
  : 'https://apis-prelive.quran.foundation/auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Not authenticated. Please sign in first.' }, { status: 401 });
  }

  const accessToken = await getAccessToken(session.user.id);

  if (!accessToken) {
    return Response.json(
      {
        error:
          'No valid Quran Foundation access token. Please sign out and sign back in with Quran.com.',
      },
      { status: 401 },
    );
  }

  let body: {
    method: string;
    path: string;
    query?: Record<string, string>;
    body?: unknown;
    headers?: Record<string, string>;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { method, path, query, body: requestBody, headers: extraHeaders } = body;

  if (!method || !path) {
    return Response.json({ error: 'method and path are required' }, { status: 400 });
  }

  // Build the target URL
  const url = new URL(`${QF_USER_API_BASE}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== '' && value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  // Build headers
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-auth-token': accessToken,
    'x-client-id': process.env.QF_CLIENT_ID!,
    ...extraHeaders,
  };

  if (requestBody && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    headers['Content-Type'] = 'application/json';
  }

  const startTime = Date.now();

  try {
    const upstream = await fetch(url.toString(), {
      method: method.toUpperCase(),
      headers,
      body:
        requestBody && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
          ? JSON.stringify(requestBody)
          : undefined,
      cache: 'no-store',
    });

    const elapsed = Date.now() - startTime;
    const responseText = await upstream.text();

    let responseJson: unknown;
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = null;
    }

    return Response.json({
      status: upstream.status,
      statusText: upstream.statusText,
      elapsed,
      url: url.toString(),
      headers: Object.fromEntries(upstream.headers.entries()),
      body: responseJson ?? responseText,
    });
  } catch (error) {
    const elapsed = Date.now() - startTime;
    return Response.json(
      {
        status: 0,
        statusText: 'Network Error',
        elapsed,
        url: url.toString(),
        headers: {},
        body: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      { status: 502 },
    );
  }
}
