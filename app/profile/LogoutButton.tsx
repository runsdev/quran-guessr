'use client';

import { useTransition } from 'react';

import { oidcLogout } from '@/app/actions/auth';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => oidcLogout())}
      disabled={isPending}
      aria-label="Sign out"
      className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-error transition-colors disabled:opacity-50 disabled:pointer-events-none shrink-0"
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      <span className="hidden sm:inline">{isPending ? 'Signing out\u2026' : 'Sign out'}</span>
    </button>
  );
}
