'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiRefreshCw, FiUser } from 'react-icons/fi';

type Profile = { sub: string; name?: string; username?: string; email?: string; emailVerified?: boolean };
type State = { kind: 'loading' } | { kind: 'guest'; expired?: boolean } | { kind: 'error'; message: string } | { kind: 'ready'; user: Profile };

export function IamAccount() {
  const params = useSearchParams();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const load = useCallback(() => { setState({ kind: 'loading' }); setAttempt(value => value + 1); }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProfile() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store', signal: controller.signal });
        const body = await response.json();
        if (controller.signal.aborted) return;
        if (response.status === 401) setState({ kind: 'guest', expired: body.expired });
        else if (!response.ok) setState({ kind: 'error', message: body.error || 'We could not load your profile. Please try again.' });
        else setState({ kind: 'ready', user: body.user });
      } catch {
        if (!controller.signal.aborted) setState({ kind: 'error', message: 'We could not connect. Check your connection and try again.' });
      }
    }
    void fetchProfile();
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const reset = () => setLeaving(false);
    const refresh = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('pageshow', reset);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.removeEventListener('pageshow', reset); document.removeEventListener('visibilitychange', refresh); };
  }, [load]);

  const authError = params.get('authError');
  return <main className="account-shell" id="main">
    <Link className="account-back" href="/"><FiArrowLeft aria-hidden="true" /> Back to portfolio</Link>
    <section className="account-card" aria-labelledby="account-title" aria-busy={state.kind === 'loading'}>
      <span className="account-symbol" aria-hidden="true"><FiUser size={24} /></span>
      <p className="account-eyebrow">SEYHA / ACCOUNT</p>
      <h1 id="account-title">{state.kind === 'ready' ? 'Your account' : 'Welcome back.'}</h1>
      <p className="account-intro">{state.kind === 'ready' ? 'Your profile from your ISTAD account.' : 'Sign in with your ISTAD account to view your profile.'}</p>
      {authError && state.kind !== 'ready' && <p className="account-notice" role="alert">{authError === 'expired' ? 'This sign-in attempt expired. Click Sign in with ISTAD to start again.' : authError === 'unavailable' ? 'Sign-in is temporarily unavailable. Please try again.' : 'Sign-in was cancelled or could not be completed. Please try again.'}</p>}
      {state.kind === 'loading' && <p className="account-status" role="status">Loading your account…</p>}
      {state.kind === 'error' && <div className="account-status"><p className="account-notice" role="alert">{state.message}</p><button className="button account-primary" type="button" onClick={load}><FiRefreshCw aria-hidden="true" /> Try again</button></div>}
      {state.kind === 'guest' && <div className="account-status">
        {state.expired && <p className="account-notice" role="status">Your session expired. Sign in again to continue.</p>}
        {params.has('signedOut') && <p role="status">You have signed out of this site.</p>}
        <a className="button account-primary" href="/api/auth/login">Sign in with ISTAD <FiArrowRight aria-hidden="true" /></a>
        <p className="account-hint">Use your password or a connected Google, GitHub, Facebook, or Telegram account.</p>
      </div>}
      {state.kind === 'ready' && <>
        <dl className="account-details">
          <div><dt>Name</dt><dd>{state.user.name || state.user.username || 'Not provided'}</dd></div>
          <div><dt>Username</dt><dd>{state.user.username || 'Not provided'}</dd></div>
          <div><dt>Email</dt><dd>{state.user.email || 'Not provided'}{state.user.emailVerified && <span className="account-verified"><FiCheckCircle aria-hidden="true" /> Verified</span>}</dd></div>
        </dl>
        <div className="account-buttons"><button className="button account-secondary" type="button" onClick={load}><FiRefreshCw aria-hidden="true" /> Refresh profile</button>
          <form action="/api/auth/logout" method="post" noValidate onSubmit={event => { if (leaving) event.preventDefault(); else setLeaving(true); }}><button className="button account-primary" type="submit" disabled={leaving}>{leaving ? 'Signing out…' : 'Sign out'}</button></form>
        </div>
        <p className="account-hint">Signing out also ends your ISTAD session in this browser.</p>
      </>}
    </section>
  </main>;
}
