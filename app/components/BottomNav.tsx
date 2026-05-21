'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: 'quiz', label: 'Quiz', href: '/quiz' },
  { icon: 'leaderboard', label: 'Rankings', href: '/leaderboard' },
  { icon: 'person', label: 'Profile', href: '/profile' },
];

/**
 * Mobile-only fixed bottom navigation bar — Apple-style frosted bar.
 */
const BottomNav = (): React.JSX.Element => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center rounded-t-2xl"
      style={{
        height: 68,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
      }}
    >
      {navItems.map(({ icon, label, href }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-1 active:opacity-60 transition-all"
            style={{
              color: isActive ? '#ff385c' : '#6a6a6a',
              textDecoration: 'none',
            }}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{ fontSize: 24, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {icon}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '-0.08px',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
