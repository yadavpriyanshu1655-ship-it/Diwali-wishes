import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FestiveIntro } from './components/FestiveIntro';
import { WishesExperience } from './components/wishes/WishesExperience';
import { FinalSurprise } from './components/surprise/FinalSurprise';
import { Footer } from './components/Footer';
import { FloatingPetals } from './components/ambience/FloatingPetals';
import { CelebrationFireworks } from './components/ambience/CelebrationFireworks';

export const App: React.FC = () => {
  const [fireworksActive, setFireworksActive] = useState<boolean>(false);

  useEffect(() => {
    const handleDiyaLit = () => {
      setFireworksActive(true);

      // Auto-turn off fireworks state after celebratory bursts so it doesn't run continuously
      setTimeout(() => {
        setFireworksActive(false);
      }, 4200);
    };

    const handleDiyaExtinguished = () => {
      setFireworksActive(false);
    };

    window.addEventListener('shubh-deep:diya-lit', handleDiyaLit);
    window.addEventListener('shubh-deep:diya-extinguished', handleDiyaExtinguished);

    return () => {
      window.removeEventListener('shubh-deep:diya-lit', handleDiyaLit);
      window.removeEventListener('shubh-deep:diya-extinguished', handleDiyaExtinguished);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-text paper-texture overflow-x-hidden selection:bg-accent/30 selection:text-text page-fade-in relative">
      {/* Floating Marigold Petals & Warm Ambient Particles */}
      <FloatingPetals />

      {/* Subtle Celebratory Golden Fireworks Canvas */}
      <CelebrationFireworks active={fireworksActive} />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow relative z-10">
        <Hero />
        <FestiveIntro />
        <WishesExperience />
        <FinalSurprise />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
