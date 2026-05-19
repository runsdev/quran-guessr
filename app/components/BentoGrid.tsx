import React from 'react';

import Link from 'next/link';

import LoginPanel from './LoginPanel';

const GAME_MODES = [
  {
    icon: 'my_location',
    badge: 'Daily Challenge',
    title: 'Locate the Verse',
    desc: 'Given a Quranic verse, identify the Surah and Ayah. New challenge every day — same for everyone.',
    cta: 'Play',
    href: '/quiz/locate-verse',
  },
  {
    icon: 'emoji_events',
    badge: 'Competitive',
    title: 'Missing Word Count',
    desc: 'Fill in the missing word count from a Quranic verse. Ranked mode — every answer affects your ELO.',
    cta: 'Play',
    href: '/quiz/missing-word-count',
  },
  {
    icon: 'format_quote',
    badge: 'Casual',
    title: 'Next Verse',
    desc: 'Given a verse, pick the Ayah that comes right after it. Great for practising sequential recitation.',
    cta: 'Play',
    href: '/quiz/next-verse',
  },
];

/**
 * Airbnb-style discovery grid — property-card aesthetic, all light surfaces,
 * Rausch (#ff385c) accent.
 */
const BentoGrid = (): React.JSX.Element => (
  <>
    {/* ── Game mode card grid ── */}
    <section style={{ backgroundColor: '#f7f7f7', padding: '64px 24px' }}>
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#222222',
            marginBottom: 24,
          }}
        >
          Choose your quiz mode
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAME_MODES.map(({ icon, badge, title, desc, cta, href }) => (
            <div
              key={title}
              className="game-card card-shadow flex flex-col"
              style={{ padding: 24 }}
            >
              {/* Badge + icon row */}
              <div className="flex items-center justify-between mb-5">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#ff385c',
                    background: '#ffd1da',
                    borderRadius: 9999,
                    padding: '4px 10px',
                    letterSpacing: '0.32px',
                    textTransform: 'uppercase',
                  }}
                >
                  {badge}
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 24, color: '#6a6a6a' }}
                >
                  {icon}
                </span>
              </div>

              {/* Content */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#222222',
                  marginBottom: 8,
                  lineHeight: 1.25,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#6a6a6a',
                  lineHeight: 1.43,
                  flexGrow: 1,
                  marginBottom: 20,
                }}
              >
                {desc}
              </p>

              {/* CTA */}
              <Link
                href={href}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#ff385c',
                  color: '#ffffff',
                  borderRadius: 8,
                  padding: '14px 24px',
                  fontSize: 16,
                  fontWeight: 500,
                  textDecoration: 'none',
                  textAlign: 'center',
                  lineHeight: 1.25,
                }}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Login / sign-in panel ── */}
    <section style={{ backgroundColor: '#ffffff', padding: '64px 24px' }}>
      <div className="max-w-5xl mx-auto">
        <LoginPanel />
      </div>
    </section>
  </>
);

export default BentoGrid;
