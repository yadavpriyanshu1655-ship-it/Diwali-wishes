import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FestiveIntro } from './components/FestiveIntro';
import { WishesExperience } from './components/wishes/WishesExperience';
import { FinalSurprise } from './components/surprise/FinalSurprise';
import { Footer } from './components/Footer';
import { FloatingPetals } from './components/ambience/FloatingPetals';
import { CelebrationFireworks } from './components/ambience/CelebrationFireworks';
import { ContentProvider } from './context/ContentContext';

const AdminApp = lazy(() =>
  import('./admin/AdminApp').then((mod) => ({ default: mod.AdminApp }))
);

const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#admin' ||
    hash.startsWith('#/admin') ||
    hash.startsWith('#admin')
  );
};

export const AppContent: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState<boolean>(checkIsAdminRoute);
  const [fireworksActive, setFireworksActive] = useState<boolean>(false);

  // Sync route on browser navigation (history back/forward & hash changes)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminView(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    // Keyboard shortcut: Ctrl + Shift + A to open Admin Panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminView) {
          window.history.pushState({}, '', '/');
          setIsAdminView(false);
        } else {
          window.history.pushState({}, '', '/admin');
          setIsAdminView(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminView]);

  // Diya ignition fireworks listener
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

  const navigateToAdmin = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      window.location.hash = '#admin';
    }
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin View if on /admin route
  if (isAdminView) {
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
        <AdminApp onNavigateToPublic={navigateToPublic} />
      </Suspense>
    );
  }

  // Render Public Diwali Greeting Website
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
      <Footer onOpenAdmin={navigateToAdmin} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
};

export default App;
