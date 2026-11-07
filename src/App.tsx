import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FestiveIntro } from './components/FestiveIntro';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text paper-texture overflow-x-hidden selection:bg-accent/30 selection:text-text">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Hero />
        <FestiveIntro />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
