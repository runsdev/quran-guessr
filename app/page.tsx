import BentoGrid from './components/BentoGrid';
import BottomNav from './components/BottomNav';
import HeroSection from './components/HeroSection';
import TopAppBar from './components/TopAppBar';

export default function Home() {
  return (
    <>
      <TopAppBar />
      <main className="min-h-screen pt-16 pb-24 md:pb-0 bg-background">
        <HeroSection />
        <BentoGrid />
      </main>
      <BottomNav />
    </>
  );
}
