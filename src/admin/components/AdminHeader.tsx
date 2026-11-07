import React from 'react';
import { Flame, ExternalLink, Menu, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

interface AdminHeaderProps {
  currentViewTitle: string;
  userEmail?: string;
  onOpenMobileMenu: () => void;
  onNavigateToPublic: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentViewTitle,
  userEmail,
  onOpenMobileMenu,
  onNavigateToPublic,
}) => {
  const isConnected = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-secondary/20 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-soft">
      {/* Left: Mobile Menu Trigger & View Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg border border-secondary/25 hover:bg-background text-text transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
            <Flame className="w-4 h-4 fill-primary/20" />
          </div>
          <div>
            <h1 className="font-serif-indian text-lg sm:text-xl font-bold text-text leading-tight">
              {currentViewTitle}
            </h1>
            <p className="text-[11px] font-sans text-secondary font-medium tracking-wider uppercase hidden sm:block">
              SHUBH DEEP Content Management
            </p>
          </div>
        </div>
      </div>

      {/* Right: Status Pill & Public View CTA */}
      <div className="flex items-center gap-3">
        {/* Supabase Connection Status Indicator */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium border ${
            isConnected
              ? 'bg-secondary/10 border-secondary/30 text-secondary'
              : 'bg-accent/15 border-accent/40 text-primary'
          }`}
          title={isConnected ? 'Connected to Supabase database' : 'Using local mock/fallback'}
        >
          {isConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
              <span className="hidden md:inline">Supabase Live</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-primary" />
              <span className="hidden md:inline">Offline Mode</span>
            </>
          )}
        </div>

        {/* User Badge */}
        {userEmail && (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-secondary/20 text-xs font-sans text-text">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span className="max-w-[140px] truncate">{userEmail}</span>
          </div>
        )}

        {/* View Public Website Link */}
        <button
          type="button"
          onClick={onNavigateToPublic}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-background border border-secondary/30 hover:border-primary/40 text-text hover:text-primary text-xs font-medium font-sans shadow-soft transition-all"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
