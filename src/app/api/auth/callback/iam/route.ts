import { NextRequest, NextResponse } from 'next/server';
import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as oidc from 'openid-client';
import { loginFlow, logoutSession, provider, session, settings } from '@/lib/iam';

export async function GET(request: NextRequest) {
  const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
  let stage = 'login-flow';
  try {
    const flow = await loginFlow();
    const { verifier, state, nonce, createdAt } = flow;
    flow.destroy(); // Consume every callback once, including denied or malformed responses.
    if (!verifier || !state || !nonce || !createdAt || Date.now() - createdAt > 600_000) {
      throw new Error('Login flow expired');
    }
    const config = settings();
    const callback = new URL(config.callback);
    callback.search = request.nextUrl.search;
    stage = 'token-exchange';
    const tokens = await oidc.authorizationCodeGrant(await provider(), callback, {
      pkceCodeVerifier: verifier, expectedState: state, expectedNonce: nonce, idTokenExpected: true,
    });
    stage = 'identity';
    const claims = tokens.claims();
    if (!claims?.sub || !tokens.access_token) throw new Error('Incomplete identity');
    stage = 'session-save';
    const current = await session();
    current.accessToken = tokens.access_token;
    current.subject = claims.sub;
    current.expiresAt = Date.now() + Math.min(tokens.expires_in ?? 300, 3600) * 1000;
    const logout = await logoutSession();
    logout.idToken = tokens.id_token;
    await logout.save();
    await current.save();
    return NextResponse.redirect(new URL('/account', origin), {
      headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
    });
  } catch (error) {
    const failure = error instanceof Error ? error : new Error('Unknown failure');
    const metadata = failure as Error & { code?: unknown; error?: unknown; cause?: { name?: unknown; code?: unknown } };
    const safeCode = (value: unknown) => typeof value === 'string' && /^[A-Za-z0-9_]{1,80}$/.test(value) ? value : undefined;
    const diagnostic = { time: new Date().toISOString(), stage, name: failure.name,
      code: safeCode(metadata.code), oauthError: safeCode(metadata.error),
      cause: safeCode(metadata.cause?.name), causeCode: safeCode(metadata.cause?.code),
      httpStatus: failure.cause instanceof Response ? failure.cause.status : undefined,
      endpoint: failure.cause instanceof Response ? new URL(failure.cause.url).pathname : undefined,
      cookieTooLarge: failure.message.startsWith('iron-session: Cookie length is too big'),
    };
    console.warn('[iam-callback]', diagnostic);
    // Local development evidence contains only bounded codes/types, never tokens, URLs, or PII.
    if (process.env.NODE_ENV === 'development') {
      await appendFile(join(process.cwd(), '.next', 'iam-auth.log'), JSON.stringify(diagnostic) + '\n').catch(() => {});
    }
    const reason = stage === 'login-flow' ? 'expired' : 'failed';
    return NextResponse.redirect(new URL(`/account?authError=${reason}`, origin), {
      headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
    });
  }
}
