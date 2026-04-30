import React from 'react';

/**
 * Fixed top app bar with logo, nav links, and user actions.
 */
const TopAppBar = (): React.JSX.Element => (
  <header className="bg-surface-container-lowest/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-primary-container/20 flex justify-between items-center px-5 h-16 font-[Inter,var(--font-geist-sans)]">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold tracking-widest text-primary">Al-Qalam</span>
    </div>

    {/* Desktop nav */}
    <nav className="hidden md:flex items-center space-x-8">
      <a
        className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
        href="#"
      >
        Home
      </a>
      <a
        className="text-on-surface-variant hover:text-primary transition-colors duration-200"
        href="#"
      >
        How to Play
      </a>
      <a
        className="text-on-surface-variant hover:text-primary transition-colors duration-200"
        href="#"
      >
        Community
      </a>
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
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuHthqw_vn74nsV_4BkNEg-657WmshRnUEoocu-5GcXH0qowMUnxXJcQ9TLSNbuxquO4cobPGI0cEC3e5qj6UesGOwiPiYo8Gry7Djn-toAx8ml69KGYkqtrk0tk7I4vVPsEZSphWxDtHmUJmXSqG29EqxmqdHYnMvDFjDoiKkycWK6b7hikeDuQ8PWEBBN3iPFXyUAk8e2qcNHxgx2d595OwYz6x1W0o2GtjJabv8Ubh1Mz01DsBJ1Qwi1WD2rKvn95IdyetAWpaQ"
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </header>
);

export default TopAppBar;
