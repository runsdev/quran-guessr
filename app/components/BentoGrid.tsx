import React from 'react';

import LoginPanel from './LoginPanel';

// const GAME_MODES = [
//   {
//     icon: 'my_location',
//     badge: 'Daily Challenge',
//     title: 'Locate the Verse',
//     desc: 'Given a Quranic verse, identify the Surah and Ayah. New challenge every day — same for everyone.',
//     cta: 'Play',
//     href: '/quiz/locate-verse',
//   },
//   {
//     icon: 'emoji_events',
//     badge: 'Competitive',
//     title: 'Missing Word Count',
//     desc: 'Fill in the missing word count from a Quranic verse. Ranked mode — every answer affects your ELO.',
//     cta: 'Play',
//     href: '/quiz/missing-word-count',
//   },
//   {
//     icon: 'format_quote',
//     badge: 'Casual',
//     title: 'Next Verse',
//     desc: 'Given a verse, pick the Ayah that comes right after it. Great for practising sequential recitation.',
//     cta: 'Play',
//     href: '/quiz/next-verse',
//   },
// ];

/**
 * Airbnb-style discovery grid — property-card aesthetic, all light surfaces,
 * Rausch (#ff385c) accent.
 */
const BentoGrid = (): React.JSX.Element => (
  <>
    {/* ── Login / sign-in panel ── */}
    <section style={{ backgroundColor: '#f7f7f7', padding: '64px 24px' }}>
      <div className="max-w-5xl mx-auto">
        <LoginPanel />
      </div>
    </section>
  </>
);

export default BentoGrid;
