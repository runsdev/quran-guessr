'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

/** Login / profile panel — Apple utility card style. */
const LoginPanel = (): React.JSX.Element => {
  const { data: session, status } = useSession();

  return (
    <div
      className="flex flex-col md:flex-row items-center gap-10 overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid #dddddd', borderRadius: 14, padding: 24 }}
    >
      <div className="w-full md:w-1/2 space-y-5">
        {status === 'authenticated' ? (
          /* ── Signed-in state ── */
          <>
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={48}
                  height={48}
                  className="rounded-full"
                  style={{ border: '1px solid #e0e0e0' }}
                  unoptimized
                />
              )}
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#222222' }}>
                  {session.user?.name}
                </p>
                <p style={{ fontSize: 14, color: '#7a7a7a', letterSpacing: '-0.224px' }}>
                  {session.user?.email}
                </p>
              </div>
            </div>
            <p
              style={{
                fontSize: 17,
                color: '#7a7a7a',
                lineHeight: 1.47,
                letterSpacing: '-0.374px',
              }}
            >
              Your progress is being synced. Keep playing to climb the leaderboard!
            </p>
            <button
              style={{
                width: '100%',
                backgroundColor: '#ff385c',
                color: '#ffffff',
                borderRadius: 8,
                padding: '14px 24px',
                fontSize: 16,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </button>
          </>
        ) : (
          /* ── Signed-out state ── */
          <>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#222222', lineHeight: 1.43 }}>
              Register or Sign In
            </h2>
            <p style={{ fontSize: 16, color: '#6a6a6a', lineHeight: 1.5 }}>
              Sign in with your Quran.com account to save your progress and compete on the
              leaderboard! It&rsquo;s quick, easy, and free. Just click the button below to get
              started.
            </p>
            <button
              style={{
                width: '100%',
                backgroundColor: '#ff385c',
                color: '#ffffff',
                borderRadius: 8,
                padding: '14px 24px',
                fontSize: 16,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
                opacity: status === 'loading' ? 0.6 : 1,
              }}
              onClick={() => signIn('quran-foundation', { callbackUrl: '/' })}
              disabled={status === 'loading'}
            >
              Continue with Quran.com
            </button>
            <p style={{ fontSize: 16, color: '#6a6a6a', lineHeight: 1.5 }}>
              Or{' '}
              <button
                style={{
                  borderRadius: 8,
                  padding: '2px 4px',
                  fontSize: 16,
                  fontWeight: 500,
                  border: '1px solid #dddddd',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  opacity: status === 'loading' ? 0.6 : 1,
                }}
                onClick={() => redirect('/quiz')}
                disabled={status === 'loading'}
              >
                try the quiz
              </button>{' '}
              without signing in.
            </p>
          </>
        )}
      </div>

      <div
        className="hidden md:block w-1/2 rounded-md overflow-hidden relative"
        style={{ minHeight: 280 }}
      >
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          src="/quran-hero.jpg"
          alt="Open Quran with elegant calligraphy"
          fill
          sizes="(max-width: 768px) 0px, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
        />
        <p
          className="absolute bottom-4 left-4 right-4"
          style={{ color: '#ffffff', fontSize: 14, fontStyle: 'italic', letterSpacing: '-0.224px' }}
        >
          &ldquo;Knowledge is a light that Allah casts into the heart.&rdquo;
        </p>
      </div>
    </div>
  );
};

export default LoginPanel;
