'use client';
import BentoGrid from './components/BentoGrid';
import BottomNav from './components/BottomNav';
import HeroSection from './components/HeroSection';
import TopAppBar from './components/TopAppBar';

export default function Home() {
  return (
    <>
      <TopAppBar />
      <main style={{ paddingTop: 80, paddingBottom: 68 }} className="md:pb-0">
        <HeroSection />
        <BentoGrid />
      </main>
      <BottomNav />
    </>
  );
}
