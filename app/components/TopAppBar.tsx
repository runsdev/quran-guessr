import React from 'react';

import Image from 'next/image';

const navItems = [
  { label: 'Quiz', href: '/quiz/missing-word-count' },
  { label: 'Rankings', href: '/leaderboard' },
  { label: 'Profile', href: '/profile' },
];

interface TopAppBarProps {
  activeTab?: string;
}

/**
 * Fixed top app bar with logo, nav links, and user actions.
 */
const TopAppBar = ({ activeTab }: TopAppBarProps): React.JSX.Element => (
  <header className="bg-surface-container-lowest/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-primary-container/20 flex justify-between items-center px-5 h-16 font-[Inter,var(--font-geist-sans)]">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold tracking-widest text-primary">QuranGuessr</span>
    </div>

    {/* Desktop nav */}
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          className={
            activeTab === label
              ? 'text-primary font-semibold transition-colors duration-200'
              : 'text-on-surface-variant hover:text-primary transition-colors duration-200'
          }
        >
          {label}
        </a>
      ))}
    </nav>

    {/* Actions */}
    <div className="flex items-center gap-4">
      <button
        className="active:scale-95 transition-transform p-2 text-primary"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
      </button>
      <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuHthqw_vn74nsV_4BkNEg-657WmshRnUEoocu-5GcXH0qowMUnxXJcQ9TLSNbuxquO4cobPGI0cEC3e5qj6UesGOwiPiYo8Gry7Djn-toAx8ml69KGYkqtrk0tk7I4vVPsEZSphWxDtHmUJmXSqG29EqxmqdHYnMvDFjDoiKkycWK6b7hikeDuQ8PWEBBN3iPFXyUAk8e2qcNHxgx2d595OwYz6x1W0o2GtjJabv8Ubh1Mz01DsBJ1Qwi1WD2rKvn95IdyetAWpaQ"
          alt="User avatar"
          width={32}
          height={32}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    </div>
  </header>
);

export default TopAppBar;
