'use client';

import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

/** Login / profile panel inside the bento grid. */
const LoginPanel = (): React.JSX.Element => {
  const { data: session, status } = useSession();

  return (
    <div className="md:col-span-2 glass-panel rounded-3xl p-(--spacing-lg) flex flex-col md:flex-row items-center gap-(--spacing-xl)">
      <div className="w-full md:w-1/2 space-y-(--spacing-md)">
        {status === 'authenticated' ? (
          /* ── Signed-in state ────────────────────────────────── */
          <>
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={48}
                  height={48}
                  className="rounded-full border border-primary/30"
                  unoptimized
                />
              )}
              <div>
                <p className="font-semibold text-on-surface">{session.user?.name}</p>
                <p className="text-xs text-on-surface-variant">{session.user?.email}</p>
              </div>
            </div>
            <p className="text-base text-on-surface-variant">
              Your progress is being synced. Keep playing to climb the leaderboard!
            </p>
            <button
              className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant py-3 rounded-xl font-semibold active:scale-95 transition-transform"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </button>
          </>
        ) : (
          /* ── Signed-out state ───────────────────────────────── */
          <>
            <h2 className="text-2xl font-semibold text-on-surface">Continue Journey</h2>
            <p className="text-base text-on-surface-variant">
              Sign in to sync your progress across devices and climb the global leaderboards.
            </p>

            <div className="space-y-3 pt-1">
              <button
                className="w-full flex items-center justify-center gap-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary rounded-xl py-3 px-5 font-medium transition-colors active:scale-95"
                onClick={() => signIn('quran-foundation', { callbackUrl: '/' })}
                disabled={status === 'loading'}
              >
                Continue with Quran.com
              </button>
            </div>
          </>
        )}
      </div>

      <div className="hidden md:block w-1/2 h-full min-h-75 rounded-2xl overflow-hidden relative">
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2xsd6Gzg9iRdBDk3SItlpJFEdSMMCmTkEjeNQYEMsVQ40ZxSXypQ2o2I-CsB06Vwrg7-HGoCeSGoLNRt1IJPZsNF4GpyBV1L4SBLSm1rcK8iOYYG99E9OpjPxTnJQXwgpyvQflVL8WxquAnWYOpO_GeaFr4tr3Cl34aj-BdE4HwDDe-6zmi45gigh9jDi5BvtSa2dI-nyAWju5ckkLEfHhDD8ZzQX7TeiXd0WFKcpXywhT8NCgO0TEHtsR1Yt40elv-SrCwNwLEXi"
          alt="Open Quran with elegant calligraphy"
          fill
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm font-medium italic">
            &ldquo;Knowledge is a light that Allah casts into the heart.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
