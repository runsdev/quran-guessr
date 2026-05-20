'use client';

import { useEffect, useRef } from 'react';

import QuizCardItem from './QuizCardItem';

const QUIZ_MODES = [
  {
    index: '01',
    badge: 'Daily Challenge',
    badgeColors: { bg: '#fff3cd', text: '#856404' },
    title: 'Locate the Verse',
    desc: 'A Quranic verse appears on screen. Identify the correct page and row number. A fresh puzzle drops every day — the same verse for all players worldwide.',
    image: '/img/locate-verse.png',
    href: '/quiz/locate-verse',
  },
  {
    index: '02',
    badge: 'Ranked · ELO',
    badgeColors: { bg: '#ffd1da', text: '#c00030' },
    title: 'Missing Word Count',
    desc: 'A verse is shown with one or more segment(s) hidden. Guess the number of missing words. Every correct or incorrect answer shifts your ELO rating on the global ladder.',
    image: '/img/missing-word-count.png',
    href: '/quiz/missing-word-count',
  },
  {
    index: '03',
    badge: 'Casual',
    badgeColors: { bg: '#d1e7dd', text: '#0a4a28' },
    title: 'Next Verse',
    desc: 'Given an Ayah, pick the one that comes right after it. Perfect for practising sequential recitation and strengthening your Quranic memory.',
    image: '/img/next-verse.png',
    href: '/quiz/next-verse',
  },
];

const NAV_HEIGHT = 80;

export default function QuizAccordionSection() {
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      innerRefs.current.forEach((inner, i) => {
        if (!inner) {
          return;
        }
        const nextOuter = outerRefs.current[i + 1];
        if (!nextOuter) {
          return;
        }

        const innerHeight = inner.offsetHeight;
        const nextRect = nextOuter.getBoundingClientRect();

        // progress: 0 = next card just arriving at sticky position; 1 = next card fully over this one
        const coverProgress = Math.max(
          0,
          Math.min(1, (NAV_HEIGHT + innerHeight - nextRect.top) / (innerHeight * 0.55)),
        );

        inner.style.transform = `scale(${1 - coverProgress * 0.04})`;
        inner.style.opacity = String(1 - coverProgress * 0.18);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="quiz-modes" style={{ backgroundColor: '#f7f7f7', paddingTop: 64 }}>
      {/* ── Section header ── */}
      <div className="max-w-5xl mx-auto" style={{ padding: '0 24px 48px' }}>
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
          Quiz Modes
        </p>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#222222',
            lineHeight: 1.3,
            maxWidth: 480,
          }}
        >
          Pick your challenge
        </h2>
        <p
          style={{
            fontSize: 16,
            color: '#6a6a6a',
            lineHeight: 1.6,
            maxWidth: 480,
            marginTop: 8,
          }}
        >
          Three distinct game modes — from daily community puzzles to competitive ranked play.
        </p>
      </div>

      {/* ── Stacking sticky cards ── */}
      <div style={{ position: 'relative' }}>
        {QUIZ_MODES.map((quiz, i) => (
          <div
            key={quiz.index}
            ref={(el) => {
              outerRefs.current[i] = el;
            }}
            style={{
              position: 'sticky',
              top: NAV_HEIGHT,
              zIndex: i + 1,
              backgroundColor: '#f7f7f7',
              padding: '0 24px',
            }}
          >
            <QuizCardItem
              quiz={quiz}
              innerRef={(el) => {
                innerRefs.current[i] = el;
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Bottom spacer so last card scrolls fully into view ── */}
      <div style={{ height: 64, backgroundColor: '#f7f7f7' }} />
    </section>
  );
}
