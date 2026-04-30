import React from 'react';

const navItems = [
  { icon: 'quiz', label: 'Quiz', active: true },
  { icon: 'leaderboard', label: 'Rankings', active: false },
  { icon: 'person', label: 'Profile', active: false },
];

/**
 * Mobile-only fixed bottom navigation bar.
 */
const BottomNav = (): React.JSX.Element => (
  <nav className="md:hidden bg-surface-container-lowest/90 backdrop-blur-lg fixed bottom-0 w-full rounded-t-2xl z-50 border-t border-primary/10 shadow-[0_-4px_12px_rgba(0,0,0,0.3)] flex justify-around items-center h-20 px-6">
    {navItems.map(({ icon, label, active }) => (
      <a
        key={label}
        href="#"
        className={[
          'flex flex-col items-center justify-center rounded-xl px-4 py-1 active:scale-90 transition-all duration-300 ease-out',
          active
            ? 'text-primary bg-primary/10'
            : 'text-on-surface-variant hover:bg-surface-container',
        ].join(' ')}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-[11px] font-medium">{label}</span>
      </a>
    ))}
  </nav>
);

export default BottomNav;
