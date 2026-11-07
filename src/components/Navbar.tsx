import React, { useState } from 'react';
import { Menu, X, Flame } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'मुख्य पृष्ठ', en: 'Home', href: '#hero' },
    { label: 'दीपावली विचार', en: 'Reflections', href: '#festive-intro' },
    { label: 'उत्सव दर्शन', en: 'The Celebration', href: '#celebration-spirit' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F3EBDD]/90 backdrop-blur-md border-b border-[#78805B]/15 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
            aria-label="SHUBH DEEP Home"
          >
            <div className="w-8 h-8 rounded-full bg-surface border border-secondary/20 flex items-center justify-center text-primary shadow-sm group-hover:border-primary/40 transition-colors">
              <Flame className="w-4 h-4 text-primary fill-primary/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-indian text-lg sm:text-xl font-bold tracking-wide text-text leading-tight">
                शुभ दीप
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-secondary font-medium -mt-0.5">
                SHUBH DEEP
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="group flex flex-col items-center text-sm font-medium text-text/80 hover:text-primary transition-colors py-1"
              >
                <span className="font-serif-indian text-xs text-secondary/80 group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="tracking-wider uppercase text-[11px] font-sans">
                  {link.en}
                </span>
                <span className="h-[1.5px] w-0 bg-primary group-hover:w-full transition-all duration-300 mt-0.5" />
              </a>
            ))}

            {/* Subtle Year / Festive Indicator */}
            <div className="pl-4 border-l border-secondary/20 flex items-center gap-1.5 text-xs text-secondary font-serif-indian">
              <span>ॐ</span>
              <span className="text-[11px] tracking-widest font-sans font-medium uppercase text-text/60">
                Deepavali
              </span>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-text hover:text-primary hover:bg-surface border border-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-secondary/20 shadow-soft px-4 pt-3 pb-5 transition-all">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="flex items-center justify-between px-3 py-2.5 rounded-md text-text/90 hover:text-primary hover:bg-[#F3EBDD] transition-colors border border-transparent hover:border-secondary/20"
              >
                <span className="font-serif-indian text-base">{link.label}</span>
                <span className="text-xs tracking-wider uppercase text-secondary font-medium font-sans">
                  {link.en}
                </span>
              </a>
            ))}
            <div className="pt-2 mt-2 border-t border-secondary/15 flex items-center justify-center gap-2 text-xs text-secondary font-serif-indian">
              <span>शुभ दीपावली</span>
              <span>•</span>
              <span className="text-[11px] tracking-widest font-sans uppercase">Shubh Deepavali</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
