import React from 'react';

import Link from 'next/link';

import ThemeSwitcher from './ThemeSwitcher';

const navItems = [
  { label: 'Quiz', href: '/quiz' },
  { label: 'Rankings', href: '/leaderboard' },
  { label: 'Stats', href: '/stats' },
];

interface TopAppBarProps {
  activeTab?: string;
}

/**
 * Airbnb-style global nav — 80px white bar, 1px hairline bottom border.
 * Wordmark (Rausch) left · product tabs center · account link right.
 */
const TopAppBar = ({ activeTab }: TopAppBarProps): React.JSX.Element => (
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
      aria-label="QuranGuessr — go to homepage"
      className="flex items-center"
      style={{
        color: 'var(--color-primary)',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: 22,
      }}
    >
      QuranGuessr
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

    {/* Right — account utilities + theme toggle */}
    <div className="flex items-center gap-3">
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
        Account
      </Link>
    </div>
  </header>
);

export default TopAppBar;
