'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

import { getUserProfileAction } from '@/app/actions/user';
import type { QfUserProfile } from '@/lib/qf-api';

interface TopAppBarProps {
  activeHref?: string;
}

/**
 * Airbnb-style global nav — 80px white bar, 1px hairline bottom border.
 * Wordmark (Rausch) left · product tabs center · account link right.
 */
export default function TopAppBar({ activeHref }: TopAppBarProps): React.JSX.Element {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const { data: session } = useSession();

  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  // FIXED: Corrected the TypeScript syntax for useState
  const [user, setUser] = useState<QfUserProfile | null>(null);

  useEffect(() => {
    async function getUserSession() {
      if (!userId) {
        setUser(null);
        return;
      }

      try {
        // FIXED: Call the Server Action instead of the direct DB API
        const userProfile = await getUserProfileAction(userId);
        console.log('Fetched user profile:', userProfile);
        setUser(userProfile);
      } catch (error) {
        console.error('Failed to load user profile', error);
        setUser(null);
      }
    }

    getUserSession();
  }, [userId]);

  const navItems = [
    { label: t('quiz'), href: '/quiz' },
    { label: t('rankings'), href: '/leaderboard' },
    { label: t('stats'), href: '/stats' },
  ];

  // Helper values mapping to the QfUserProfile schema
  const imageUrl = user?.photoUrl || (user?.avatarUrls && Object.values(user.avatarUrls)[0]);
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : (user?.username ?? t('profile'));

  return (
    <header
      className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 80,
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-outline)',
        fontFamily: 'var(--font-inter), Circular, system-ui, sans-serif',
      }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        aria-label={tNav('goToHomepage')}
        className="flex items-center"
        style={{
          color: 'var(--color-primary)',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        {tNav('quranGuessr')}
      </Link>

      {/* Desktop center product tabs */}
      <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
        {navItems.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            aria-current={activeHref === href ? 'page' : undefined}
            className="flex flex-col items-center pb-1"
            style={{
              color: 'var(--color-on-surface)',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 600,
              borderBottom:
                activeHref === href ? '2px solid var(--color-on-surface)' : '2px solid transparent',
              transition: 'border-color 0.15s',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right — account utilities + language + theme toggle */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <Link
          href="/profile"
          aria-label={t('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            border: '1px solid var(--color-outline)',
            borderRadius: 9999,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={userName}
              width={36}
              height={36}
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20, color: 'var(--color-on-surface-variant)' }}
            >
              person
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
