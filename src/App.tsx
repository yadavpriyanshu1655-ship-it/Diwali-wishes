import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FestiveIntro } from './components/FestiveIntro';
import { WishesExperience } from './components/wishes/WishesExperience';
import { FinalSurprise } from './components/surprise/FinalSurprise';
import { Footer } from './components/Footer';
import { FloatingPetals } from './components/ambience/FloatingPetals';
import { CelebrationFireworks } from './components/ambience/CelebrationFireworks';
import { ContentProvider } from './context/ContentContext';
import { soundEngine } from './services/soundEngine';

const AdminApp = lazy(() =>
  import('./admin/AdminApp').then((mod) => ({ default: mod.AdminApp }))
);

export const PublicWebsite: React.FC = () => {
  const navigate = useNavigate();
  const [fireworksActive, setFireworksActive] = useState<boolean>(false);

  // Attempt instant background music autoplay on website entry
  useEffect(() => {
    soundEngine.attemptAutoplay();
  }, []);

  // Diya ignition celebratory fireworks listener
  useEffect(() => {
    const handleDiyaLit = () => {
      setFireworksActive(true);
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

  // Keyboard shortcut: Ctrl + Shift + A to open Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

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

      {/* Footer with discrete Admin portal link */}
      <Footer onOpenAdmin={() => navigate('/admin')} />
    </div>
  );
};

export const AdminRouteWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-serif-indian text-base text-text">॥ शुभ दीप व्यवस्थापन ॥</p>
          <span className="text-xs font-sans text-secondary mt-1">Loading Admin Panel...</span>
        </div>
      }
    >
      <AdminApp onNavigateToPublic={() => navigate('/')} />
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Route */}
          <Route path="/" element={<PublicWebsite />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminRouteWrapper />} />
          <Route path="/admin/*" element={<AdminRouteWrapper />} />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<PublicWebsite />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
};

export default App;
