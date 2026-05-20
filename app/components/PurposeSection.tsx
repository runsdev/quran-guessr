import React from 'react';

const FEATURES = [
  {
    icon: 'auto_stories',
    title: 'Deepen Quranic Knowledge',
    desc: 'Regular quiz practice reinforces verse location, word recall, and sequential memory across all 114 Surahs.',
  },
  {
    icon: 'emoji_events',
    title: 'Compete Globally',
    desc: 'An ELO-based ranking system means every ranked game matters. Climb the leaderboard against players worldwide.',
  },
  {
    icon: 'calendar_today',
    title: 'Daily Discipline',
    desc: 'A shared daily challenge keeps you accountable. Compare your streak and accuracy with friends and the community.',
  },
];

export default function PurposeSection(): React.JSX.Element {
  return (
    <section id="purpose" style={{ backgroundColor: '#ffffff', padding: '80px 24px' }}>
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div style={{ maxWidth: 560, marginBottom: 56 }}>
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
            Why QuranGuessr?
          </p>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#222222',
              lineHeight: 1.3,
              marginBottom: 12,
            }}
          >
            Learn the Quran through play
          </h2>
          <p style={{ fontSize: 16, color: '#6a6a6a', lineHeight: 1.65 }}>
            QuranGuessr turns passive recitation review into active, gamified practice. Whether you
            are a student, teacher, or lifelong learner — there is a mode for your level.
          </p>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: '#f7f7f7',
                borderRadius: 14,
                padding: '28px 28px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 32, color: '#ff385c' }}
              >
                {f.icon}
              </span>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#222222',
                  lineHeight: 1.35,
                  margin: 0,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 15, color: '#6a6a6a', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
