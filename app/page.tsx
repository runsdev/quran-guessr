import { Suspense } from 'react';

import dynamic from 'next/dynamic';

import BottomNav from './components/BottomNav';
import HeroSection from './components/HeroSection';
import JsonLd from './components/JsonLd';
import QuizAccordionSection from './components/QuizAccordionSection';
import StripSearchParams from './components/StripSearchParams';
import TopAppBar from './components/TopAppBar';

// Below-fold sections: lazy-loaded so they don't block LCP / initial paint
const PurposeSection = dynamic(() => import('./components/PurposeSection'), { ssr: false });
const BentoGrid = dynamic(() => import('./components/BentoGrid'), { ssr: false });
const AboutSection = dynamic(() => import('./components/AboutSection'), { ssr: false });

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
        <Suspense fallback={null}>
          <PurposeSection />
          <BentoGrid />
          <AboutSection />
        </Suspense>
      </main>
      <BottomNav />
    </>
  );
}
