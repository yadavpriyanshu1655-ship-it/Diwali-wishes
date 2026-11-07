import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  HeartHandshake,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Flame,
  X,
  ExternalLink,
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'shayaris' | 'wishes' | 'content' | 'media' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onNavigateToPublic: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onNavigateToPublic,
  mobileOpen,
  onCloseMobile,
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & statistics',
    },
    {
      id: 'shayaris',
      label: 'Shayari Manager',
      icon: BookOpen,
      description: 'Funny, Flirty & Special verses',
    },
    {
      id: 'wishes',
      label: 'Wishes Manager',
      icon: HeartHandshake,
      description: 'Heartwarming & Friendship',
    },
    {
      id: 'content',
      label: 'Website Text Editor',
      icon: FileText,
      description: 'Hero, Intro, Surprise & Footer',
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: ImageIcon,
      description: 'Supabase storage & images',
    },
    {
      id: 'settings',
      label: 'Settings & Database',
      icon: Settings,
      description: 'Credentials & SQL setup',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-text/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-surface border-r border-secondary/20 flex flex-col justify-between shadow-soft paper-texture transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-secondary/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-surface shadow-soft">
              <Flame className="w-5 h-5 fill-surface/20" />
            </div>
            <div>
              <span className="font-serif-indian text-lg font-bold text-text block leading-none">
                शुभ दीप
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-secondary">
                Admin CMS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-text/60 hover:text-text hover:bg-background"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-sans font-semibold uppercase tracking-widest text-secondary/70">
            Content Sections
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all font-sans text-xs sm:text-sm ${
                  isActive
                    ? 'bg-primary text-surface font-medium shadow-soft'
                    : 'text-text hover:bg-background/80 hover:text-primary'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-surface' : 'text-secondary'
                  }`}
                />
                <div className="flex-1 truncate">
                  <div className="leading-tight font-medium">{item.label}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-surface/80' : 'text-text/60'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-secondary/20 space-y-2 bg-background/40">
          <button
            type="button"
            onClick={onNavigateToPublic}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface hover:bg-background border border-secondary/25 text-xs text-text hover:text-primary transition-all font-medium"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-secondary" />
              <span>Back to Public Website</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl hover:bg-red-500/10 text-xs text-primary hover:text-red-600 transition-all font-medium"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
