import React from 'react';

const LINKS = [
  { label: 'GitHub', icon: 'code', href: 'https://github.com/runsdev' },
  { label: 'Quran.com', icon: 'menu_book', href: 'https://quran.com' },
];

export default function AboutSection(): React.JSX.Element {
  return (
    <section id="about" style={{ backgroundColor: '#f7f7f7', padding: '80px 24px' }}>
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#ff385c',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          About
        </p>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#222222',
            lineHeight: 1.3,
            marginBottom: 48,
          }}
        >
          The person behind the project
        </h2>

        {/* ── Card ── */}
        <div
          className="flex flex-col md:flex-row"
          style={{
            background: '#ffffff',
            border: '1px solid #dddddd',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* Avatar column */}
          <div
            className="shrink-0 w-full"
            style={{
              width: '100%',
              maxWidth: 240,
              minHeight: 240,
              background: '#ebebeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 72, color: '#bbbbbb' }}>
              person
            </span>
          </div>

          {/* Content column */}
          <div style={{ padding: '36px 40px', flex: 1 }}>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#222222',
                marginBottom: 4,
              }}
            >
              runsha
            </h3>
            <p
              style={{
                fontSize: 14,
                color: '#ff385c',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              FullStack Developer
            </p>
            <p
              style={{
                fontSize: 16,
                color: '#6a6a6a',
                lineHeight: 1.65,
                marginBottom: 28,
                textAlign: 'justify',
              }}
            >
              I built QuranGuessr to make Quranic study and muraja&apos;a more interactive and
              enjoyable. Inspired by the daily-challenge format of GeoGuessr and the ranking systems
              in competitive games, I wanted to create something that motivates consistent, focused
              practice — while staying lightweight and free.
            </p>

            {/* Links */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    border: '1px solid #dddddd',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#222222',
                    textDecoration: 'none',
                    background: '#ffffff',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
