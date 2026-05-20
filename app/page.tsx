'use client';
import AboutSection from './components/AboutSection';
import BentoGrid from './components/BentoGrid';
import BottomNav from './components/BottomNav';
import HeroSection from './components/HeroSection';
import PurposeSection from './components/PurposeSection';
import QuizAccordionSection from './components/QuizAccordionSection';
import TopAppBar from './components/TopAppBar';

export default function Home() {
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
