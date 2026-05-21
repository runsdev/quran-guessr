import React from 'react';

import Link from 'next/link';

/**
 * Airbnb-style hero section — white canvas, modest 28px/700 headline,
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

    {/* CTAs */}
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link
        href="/quiz"
        className="inline-block bg-primary text-on-primary hover:bg-on-primary-container active:scale-95 transition-all"
        style={{
          borderRadius: 8,
          padding: '14px 24px',
          fontSize: 16,
          fontWeight: 500,
          textDecoration: 'none',
          textAlign: 'center',
          lineHeight: 1.25,
        }}
      >
        Explore Quiz
      </Link>
      <Link
        href="/leaderboard"
        className="inline-block bg-background text-on-background hover:bg-surface-container active:scale-95 transition-all"
        style={{
          padding: '12px 24px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          border: '1px solid #222222',
        }}
      >
        View Leaderboard
      </Link>
    </div>
  </section>
);

export default HeroSection;
