'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-panel rounded-3xl p-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-primary tracking-widest">Al-Qalam</h1>
          <p className="text-on-surface-variant text-sm">
            Sign in to sync your progress and climb the leaderboards.
          </p>
        </div>

        {/* OAuth button */}
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-center gap-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary rounded-xl py-3 px-5 font-medium transition-colors active:scale-95"
            onClick={() => signIn('quran-foundation', { callbackUrl: '/' })}
          >
            <QuranComIcon />
            Continue with Quran.com
          </button>
        </div>

        <p className="text-center text-xs text-on-surface-variant">
          By signing in you agree to our&nbsp;
          <a className="underline hover:text-primary" href="#">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </main>
  );
}

function QuranComIcon() {
  return (
    <span className="text-lg leading-none font-bold" aria-hidden="true">
      ﷽
    </span>
  );
}
