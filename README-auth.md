# ISTAD account integration

Start IAM on port 9000 and Next.js on port 3000. Visit `/account` or use the Account link in the portfolio navigation.

Copy `.env.example` to `.env.local` and configure server-only secrets. IAM must use the same client secret in `IAM_PORTFOLIO_CLIENT_SECRET`, with `IAM_PORTFOLIO_ORIGIN=http://localhost:3000`. Restart IAM after configuring these values: startup registers the `theoun-seyha` client and exact callback `http://localhost:3000/api/auth/callback/iam`. Existing client secrets are not overwritten on startup.

The browser follows the IAM authorization redirect. Next.js uses `openid-client` for discovery, client-secret-basic authentication, S256 PKCE, state, nonce, and ID-token signature validation. A ten-minute encrypted, HttpOnly cookie holds the one-time login flow. The authenticated session is encrypted by `iron-session` in a separate HttpOnly, SameSite=Lax cookie. Access tokens are never returned to JavaScript or stored in localStorage. The cookie uses Secure when APP_ORIGIN is HTTPS; remote HTTP issuers/origins are rejected.

`GET /api/auth/session` fetches IAM `/userinfo` with the access token and validates the returned subject. It returns only name, username, email, verification status, and subject. Responses are private/no-store. Backend failures offer retry; invalid/expired tokens prompt sign-in. Sessions expire with the access token (up to one hour); no refresh tokens are requested/stored. `POST /api/auth/logout` checks the request Origin and clears all three application cookies. This signs out of the portfolio and submits an OIDC logout request to IAM, ending the browser SSO session. The ID token is retained in a separate encrypted HttpOnly cookie and sent to IAM by POST, never in a URL. Legacy sessions without this cookie use IAM’s CSRF-protected logout confirmation. Google’s own session is unaffected.

Production: set HTTPS APP_ORIGIN/IAM_ISSUER and IAM_PORTFOLIO_ORIGIN, configure matching secrets in your secret manager, and register the corresponding callback. Keep secrets out of source control and NEXT_PUBLIC variables.

Verification: `npm run lint`, `npx tsc --noEmit`, `npm run build`. Exercise sign-in → IAM credentials/consent → account profile; reload, refresh profile, and sign out. Check callback replay/state mismatch, expired login flow, missing session, offline IAM, and mobile/light/dark layouts.
