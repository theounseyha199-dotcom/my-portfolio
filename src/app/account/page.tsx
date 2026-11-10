import type { Metadata } from 'next';
import { Suspense } from 'react';
import { IamAccount } from '@/components/iam-account';
import './account.css';

export const metadata: Metadata = { title: 'Account | Seyha', robots: { index: false, follow: false } };

export default function AccountPage() {
  return <Suspense fallback={<main className="account-shell"><p role="status">Loading your account…</p></main>}><IamAccount /></Suspense>;
}
