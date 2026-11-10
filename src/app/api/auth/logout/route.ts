import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { loginFlow, logoutSession, privateJson, provider, session, settings } from '@/lib/iam';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

export async function POST(request: NextRequest) {
  try {
    const { origin, issuer, clientId } = settings();
    if (request.headers.get('origin') !== origin) return privateJson({ error: 'Invalid request origin.' }, 403);
    const logout = await logoutSession();
    const idToken = logout.idToken;
    (await session()).destroy();
    (await loginFlow()).destroy();
    logout.destroy();
    // Older sessions predate ID-token retention. IAM provides its own CSRF-protected confirmation.
    if (!idToken) return NextResponse.redirect(new URL('/logout', issuer), 303);
    let endpoint: string;
    try { endpoint = (await provider()).serverMetadata().end_session_endpoint!; }
    catch { return NextResponse.redirect(new URL('/logout', issuer), 303); }
    if (!endpoint) return NextResponse.redirect(new URL('/logout', issuer), 303);
    const action = new URL(endpoint);
    if (action.origin !== issuer.origin) throw new Error('Unexpected logout endpoint');
    const nonce = randomBytes(18).toString('base64');
    const values = { id_token_hint: idToken, client_id: clientId, post_logout_redirect_uri: `${origin}/account?signedOut=1` };
    const inputs = Object.entries(values).map(([name, value]) => `<input type="hidden" name="${name}" value="${escapeHtml(value)}">`).join('');
    // RP-initiated logout uses POST so the ID token never appears in a URL/history/access log.
    return new NextResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Signing out</title></head><body><p role="status">Signing out of ISTAD…</p><form method="post" action="${escapeHtml(action.href)}">${inputs}<button type="submit">Continue signing out</button></form><script nonce="${nonce}">document.querySelector('form').submit()</script></body></html>`, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store, private',
        'Referrer-Policy': 'no-referrer',
        'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; form-action ${action.origin} ${origin}; base-uri 'none'; frame-ancestors 'none'`,
      },
    });
  } catch {
    return privateJson({ error: 'Unable to complete sign-out. Please try signing out at ISTAD.' }, 503);
  }
}
