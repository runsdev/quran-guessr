import React from 'react';

import LoginPanel from './LoginPanel';

const features = [
  {
    icon: 'menu_book',
    title: 'Verse Quest',
    desc: 'Identify verses from audio or text snippets.',
  },
  {
    icon: 'translate',
    title: 'Meaning Match',
    desc: 'Master the vocabulary of the Divine message.',
  },
  {
    icon: 'format_list_numbered',
    title: 'Order Sort',
    desc: 'Arrange Ayahs in their correct sequence.',
  },
  {
    icon: 'groups',
    title: 'Live Duels',
    desc: 'Compete in real-time with friends worldwide.',
  },
];

/**
 * Bento-grid section: login panel, streak stats, and feature cards.
 */
const BentoGrid = (): React.JSX.Element => (
  <section className="px-(--spacing-margin) py-(--spacing-xl) max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-(--spacing-gutter)">
      {/* ── Login panel ── */}
      <LoginPanel />

      {/* ── Streak / progress ring ── */}
      <div className="glass-panel rounded-3xl p-(--spacing-lg) flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary mb-(--spacing-md)">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <h3 className="text-2xl font-semibold text-on-surface">Daily Streak</h3>
          <p className="text-base text-on-surface-variant mt-(--spacing-sm)">
            Join 12,000+ students studying today.
          </p>
        </div>

        {/* Progress ring */}
        <div className="mt-(--spacing-lg) relative flex items-center justify-center">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
            <circle
              className="text-primary/10"
              cx="64"
              cy="64"
              fill="transparent"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
            />
            <circle
              className="text-primary"
              cx="64"
              cy="64"
              fill="transparent"
              r="58"
              stroke="currentColor"
              strokeDasharray="364.4"
              strokeDashoffset="100"
              strokeLinecap="round"
              strokeWidth="8"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-primary">72%</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              Global Avg
            </span>
          </div>
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-(--spacing-gutter) mt-(--spacing-gutter)">
        {features.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-surface-container-low p-(--spacing-md) rounded-2xl border border-outline-variant/30 hover:border-primary/50 transition-colors group"
          >
            <span className="material-symbols-outlined text-primary mb-(--spacing-sm) block">
              {icon}
            </span>
            <h4 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
              {title}
            </h4>
            <p className="text-xs text-on-surface-variant mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BentoGrid;
