import { NextResponse } from 'next/server';
import * as oidc from 'openid-client';
import { loginFlow, provider, settings } from '@/lib/iam';

export async function GET() {
  try {
    const config = settings();
    const client = await provider();
    const flow = await loginFlow();
    flow.verifier = oidc.randomPKCECodeVerifier();
    flow.state = oidc.randomState();
    flow.nonce = oidc.randomNonce();
    flow.createdAt = Date.now();
    await flow.save();
    const url = oidc.buildAuthorizationUrl(client, {
      redirect_uri: config.callback, scope: 'openid profile email',
      code_challenge: await oidc.calculatePKCECodeChallenge(flow.verifier),
      code_challenge_method: 'S256', state: flow.state, nonce: flow.nonce,
    });
    return NextResponse.redirect(url, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/account?authError=unavailable', origin));
  }
}
