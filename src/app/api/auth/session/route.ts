import * as oidc from 'openid-client';
import { privateJson, provider, session } from '@/lib/iam';

export async function GET() {
  try {
    const current = await session();
    if (!current.accessToken || !current.subject) return privateJson({ authenticated: false }, 401);
    if (!current.expiresAt || current.expiresAt <= Date.now()) {
      current.destroy();
      return privateJson({ authenticated: false, expired: true }, 401);
    }
    try {
      const user = await oidc.fetchUserInfo(await provider(), current.accessToken, current.subject);
      return privateJson({ authenticated: true, user: {
        sub: user.sub, name: user.name, username: user.preferred_username,
        email: user.email, emailVerified: user.email_verified,
      } });
    } catch (error) {
      const status = error instanceof oidc.ResponseBodyError ? error.status : undefined;
      if (status === 401 || (error instanceof oidc.WWWAuthenticateChallengeError && error.status === 401)) {
        current.destroy();
        return privateJson({ authenticated: false, expired: true }, 401);
      }
      return privateJson({ error: 'Profile is temporarily unavailable. Please try again.' }, 502);
    }
  } catch {
    return privateJson({ error: 'Sign-in is temporarily unavailable. Please try again.' }, 503);
  }
}
