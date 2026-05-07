import React from 'react';

import LoginPanel from './LoginPanel';

// const features = [
//   {
//     icon: 'menu_book',
//     title: 'Missing Word ',
//     desc: 'Identify verses from audio or text snippets.',
//   },
//   {
//     icon: 'translate',
//     title: 'Meaning Match',
//     desc: 'Master the vocabulary of the Divine message.',
//   },
//   {
//     icon: 'format_list_numbered',
//     title: 'Order Sort',
//     desc: 'Arrange Ayahs in their correct sequence.',
//   },
//   {
//     icon: 'groups',
//     title: 'Live Duels',
//     desc: 'Compete in real-time with friends worldwide.',
//   },
// ];

/**
 * Bento-grid section: login panel, streak stats, and feature cards.
 */
const BentoGrid = (): React.JSX.Element => (
  <section className="px-(--spacing-margin) py-(--spacing-xl) max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-(--spacing-gutter)">
      {/* ── Login panel ── */}
      <LoginPanel />

      {/* ── Feature cards ── */}
      {/* <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-(--spacing-gutter) mt-(--spacing-gutter)">
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
      </div> */}
    </div>
  </section>
);

export default BentoGrid;
