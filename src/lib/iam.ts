import 'server-only';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import * as oidc from 'openid-client';

export type IamSession = { accessToken?: string; subject?: string; expiresAt?: number };
type LoginFlow = { verifier?: string; state?: string; nonce?: string; createdAt?: number };

export function settings() {
  const origin = new URL(process.env.APP_ORIGIN || 'http://localhost:3000');
  const issuer = new URL(process.env.IAM_ISSUER || 'http://localhost:9000');
  const secret = process.env.IAM_CLIENT_SECRET;
  const password = process.env.SESSION_PASSWORD;
  if (!secret || !password || password.length < 32) throw new Error('IAM configuration is incomplete');
  for (const url of [origin, issuer]) {
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) throw new Error('HTTPS is required outside localhost');
  }
  return { origin: origin.origin, issuer, secret, password, secure: origin.protocol === 'https:',
    clientId: process.env.IAM_CLIENT_ID || 'theoun-seyha', callback: `${origin.origin}/api/auth/callback/iam` };
}

export async function session() {
  const config = settings();
  return getIronSession<IamSession>(await cookies(), {
    cookieName: 'seyha_iam_session', password: config.password, ttl: 3600,
    cookieOptions: { httpOnly: true, secure: config.secure, sameSite: 'lax', path: '/' },
  });
}

export async function loginFlow() {
  const config = settings();
  return getIronSession<LoginFlow>(await cookies(), {
    cookieName: 'seyha_iam_flow', password: config.password, ttl: 600,
    cookieOptions: { httpOnly: true, secure: config.secure, sameSite: 'lax', path: '/api/auth' },
  });
}

// Keep the ID token in its own encrypted cookie to stay below per-cookie size limits.
export async function logoutSession() {
  const config = settings();
  return getIronSession<{ idToken?: string }>(await cookies(), {
    cookieName: 'seyha_iam_logout', password: config.password, ttl: 3600,
    cookieOptions: { httpOnly: true, secure: config.secure, sameSite: 'lax', path: '/api/auth' },
  });
}

let configuration: Promise<oidc.Configuration> | undefined;
export function provider() {
  if (!configuration) {
    const config = settings();
    configuration = oidc.discovery(config.issuer, config.clientId, undefined,
      oidc.ClientSecretBasic(config.secret), {
        timeout: 10,
        execute: config.issuer.protocol === 'http:'
          ? [oidc.allowInsecureRequests, oidc.enableNonRepudiationChecks]
          : [oidc.enableNonRepudiationChecks],
      }).catch(error => { configuration = undefined; throw error; });
  }
  return configuration;
}

export function privateJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store, private', Vary: 'Cookie' } });
}
