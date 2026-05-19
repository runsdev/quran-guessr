import React from 'react';

const navItems = [
  { icon: 'quiz', label: 'Quiz', href: '/quiz' },
  { icon: 'leaderboard', label: 'Rankings', href: '/leaderboard' },
  { icon: 'person', label: 'Profile', href: '/profile' },
];

/**
 * Mobile-only fixed bottom navigation bar — Apple-style frosted bar.
 */
const BottomNav = (): React.JSX.Element => (
  <nav
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
    {navItems.map(({ icon, label, href }) => (
      <a
        key={label}
        href={href}
        className="flex flex-col items-center justify-center gap-0.5 px-4 py-1 active:opacity-60 transition-opacity"
        style={{ color: '#6a6a6a', textDecoration: 'none' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          {icon}
        </span>
        <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: '-0.08px' }}>{label}</span>
      </a>
    ))}
  </nav>
);

export default BottomNav;
