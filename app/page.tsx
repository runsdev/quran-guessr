import { Suspense } from 'react';

import BelowFoldSections from './components/BelowFoldSections';
import BottomNav from './components/BottomNav';
import HeroSection from './components/HeroSection';
import JsonLd from './components/JsonLd';
import QuizAccordionSection from './components/QuizAccordionSection';
import StripSearchParams from './components/StripSearchParams';
import TopAppBar from './components/TopAppBar';

export default function Home() {
  return (
    <>
      <JsonLd />
      <Suspense>
        <StripSearchParams />
      </Suspense>
      <TopAppBar />
      <main style={{ paddingTop: 80, paddingBottom: 68 }} className="md:pb-0">
        <HeroSection />
        <QuizAccordionSection />
        <BelowFoldSections />
      </main>
      <BottomNav />
    </>
  );
}
