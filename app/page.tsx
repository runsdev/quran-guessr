'use client';

import { useEffect } from 'react';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import AboutSection from './components/AboutSection';
import BentoGrid from './components/BentoGrid';
import BottomNav from './components/BottomNav';
import HeroSection from './components/HeroSection';
import PurposeSection from './components/PurposeSection';
import QuizAccordionSection from './components/QuizAccordionSection';
import TopAppBar from './components/TopAppBar';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If there are any search params, redirect to the clean pathname
    if (searchParams.toString().length > 0) {
      router.replace(pathname, { scroll: false });
    }
  }, [pathname, searchParams, router]);
  return (
    <>
      <TopAppBar />
      <main style={{ paddingTop: 80, paddingBottom: 68 }} className="md:pb-0">
        <HeroSection />
        <QuizAccordionSection />
        <PurposeSection />
        <BentoGrid />
        <AboutSection />
      </main>
      <BottomNav />
    </>
  );
}
