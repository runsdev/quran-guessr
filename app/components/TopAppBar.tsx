import React from 'react';

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

interface TopAppBarProps {
  activeTab?: string;
}

/**
 * Airbnb-style global nav — 80px white bar, 1px hairline bottom border.
 * Wordmark (Rausch) left · product tabs center · account link right.
 */
export default async function TopAppBar({ activeTab }: TopAppBarProps): Promise<React.JSX.Element> {
  const t = await getTranslations('common');
  const tNav = await getTranslations('nav');

  const navItems = [
    { label: t('quiz'), href: '/quiz' },
    { label: t('rankings'), href: '/leaderboard' },
    { label: t('stats'), href: '/stats' },
  ];

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
            aria-current={activeTab === label ? 'page' : undefined}
            className="flex flex-col items-center pb-1"
            style={{
              color: 'var(--color-on-surface)',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 600,
              borderBottom:
                activeTab === label ? '2px solid var(--color-on-surface)' : '2px solid transparent',
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
          style={{
            color: 'var(--color-on-surface)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            border: '1px solid var(--color-outline)',
            borderRadius: 9999,
            padding: '8px 16px',
          }}
        >
          {t('account')}
        </Link>
      </div>
    </header>
  );
}
