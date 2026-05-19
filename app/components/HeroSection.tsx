import React from 'react';

import Link from 'next/link';

/**
 * Airbnb-style hero section — white canvas, modest 28px/700 headline,
 * pill-shaped search-bar adaptation, Rausch CTA.
 */
const HeroSection = (): React.JSX.Element => (
  <section
    className="w-full flex flex-col items-center text-center"
    style={{ backgroundColor: '#ffffff', padding: '64px 24px' }}
  >
    {/* Hero headline — 28px/700 per Airbnb spec */}
    <h1
      style={{
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 1.43,
        color: '#222222',
        maxWidth: 640,
        marginBottom: 8,
      }}
    >
      Test your knowledge of the Holy Quran
    </h1>

    {/* Sub-headline */}
    <p
      style={{
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#6a6a6a',
        maxWidth: 480,
        marginBottom: 36,
      }}
    >
      Interactive quizzes on verse location, missing words, and sequence — for every level.
    </p>

    {/* Pill-shaped discovery bar (Airbnb search-bar aesthetic) */}
    <div
      className="flex flex-col sm:flex-row items-center gap-0 w-full max-w-xl"
      style={{
        background: '#ffffff',
        border: '1px solid #dddddd',
        borderRadius: 9999,
        boxShadow:
          'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.10) 0 4px 8px',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex-1 flex flex-col items-start px-6 py-3"
        style={{ borderRight: '1px solid #dddddd' }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: '#222222' }}>Quiz Mode</span>
        <span style={{ fontSize: 14, color: '#6a6a6a' }}>Choose your game</span>
      </div>
      <div className="flex-1 flex flex-col items-start px-6 py-3">
        <span style={{ fontSize: 14, fontWeight: 500, color: '#222222' }}>Difficulty</span>
        <span style={{ fontSize: 14, color: '#6a6a6a' }}>All levels</span>
      </div>
      {/* Rausch search orb */}
      <Link
        href="/quiz"
        className="flex items-center justify-center shrink-0 m-2"
        style={{
          width: 48,
          height: 48,
          borderRadius: 9999,
          backgroundColor: '#ff385c',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: 22,
        }}
        aria-label="Start quiz"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
          search
        </span>
      </Link>
    </div>

    {/* Secondary CTA */}
    <Link
      href="/leaderboard"
      style={{
        display: 'inline-block',
        marginTop: 20,
        color: '#222222',
        textDecoration: 'underline',
        fontSize: 14,
        fontWeight: 400,
      }}
    >
      View Leaderboard
    </Link>
  </section>
);

export default HeroSection;
