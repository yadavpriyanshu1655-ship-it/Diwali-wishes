import React from 'react';
import {
  BookOpen,
  CheckCircle,
  FileEdit,
  Sparkles,
  ArrowRight,
  Plus,
  Image as ImageIcon,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { ShayariWishRecord } from '../../services/supabase';
import { AdminTab } from '../components/AdminSidebar';

interface DashboardViewProps {
  records: ShayariWishRecord[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddModal: () => void;
  onNavigateToPublic: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onNavigateTab,
  onOpenAddModal,
  onNavigateToPublic,
}) => {
  const totalCount = records.length;
  const publishedCount = records.filter((r) => r.status === 'published').length;
  const draftCount = records.filter((r) => r.status === 'draft').length;
  const shayariCount = records.filter((r) => r.type === 'shayari').length;
  const wishesCount = records.filter((r) => r.type === 'wish').length;

  const recentItems = [...records].slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-secondary/25 shadow-soft paper-texture flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EBDD] border border-secondary/20 text-xs font-serif-indian text-secondary mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>॥ पावन प्रबंधन केंद्र ॥</span>
          </div>
          <h2 className="font-serif-indian text-2xl sm:text-3xl font-bold text-text">
            Welcome to SHUBH DEEP Admin
          </h2>
          <p className="text-xs sm:text-sm text-text/80 font-sans mt-1 max-w-xl leading-relaxed">
            Manage your Diwali verses, emotional wishes, website editorial text, and media in real time. Changes reflect immediately on your live website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#A64C28] text-surface font-sans text-xs sm:text-sm font-medium shadow-soft transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shayari</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToPublic}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-background border border-secondary/30 text-text hover:text-primary font-sans text-xs sm:text-sm font-medium transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Public Site</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <div className="p-5 rounded-2xl bg-surface border border-secondary/20 shadow-soft paper-texture flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider">Total Verses</span>
            <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-secondary" />
            </div>
          </div>
          <div>
            <div className="font-serif-indian text-3xl sm:text-4xl font-bold text-text">{totalCount}</div>
            <div className="text-[11px] font-sans text-text/60 mt-0.5">
              {shayariCount} Shayaris • {wishesCount} Wishes
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-secondary/20 shadow-soft paper-texture flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider">Live Published</span>
            <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-700" />
            </div>
          </div>
          <div>
            <div className="font-serif-indian text-3xl sm:text-4xl font-bold text-green-800">{publishedCount}</div>
            <div className="text-[11px] font-sans text-text/60 mt-0.5">Visible to public visitors</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-secondary/20 shadow-soft paper-texture flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider">Drafts</span>
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <FileEdit className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="font-serif-indian text-3xl sm:text-4xl font-bold text-primary">{draftCount}</div>
            <div className="text-[11px] font-sans text-text/60 mt-0.5">Private unpublished items</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-secondary/20 shadow-soft paper-texture flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary mb-3">
            <span className="text-xs font-sans font-medium uppercase tracking-wider">Active Categories</span>
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Flame className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="font-serif-indian text-3xl sm:text-4xl font-bold text-text">6</div>
            <div className="text-[11px] font-sans text-text/60 mt-0.5">All festive themes ready</div>
          </div>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigateTab('shayaris')}
          className="p-5 rounded-2xl bg-surface hover:bg-[#F3EBDD]/60 border border-secondary/20 hover:border-primary/40 shadow-soft paper-texture text-left transition-all flex items-center justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif-indian text-base font-bold text-text group-hover:text-primary transition-colors">
              Manage All Shayari
            </h3>
            <p className="text-xs text-text/70 font-sans mt-0.5">
              Edit funny, flirty, & festive verses
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('content')}
          className="p-5 rounded-2xl bg-surface hover:bg-[#F3EBDD]/60 border border-secondary/20 hover:border-primary/40 shadow-soft paper-texture text-left transition-all flex items-center justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-3">
              <FileEdit className="w-5 h-5" />
            </div>
            <h3 className="font-serif-indian text-base font-bold text-text group-hover:text-primary transition-colors">
              Edit Website Text
            </h3>
            <p className="text-xs text-text/70 font-sans mt-0.5">
              Modify Hero, headings, & surprise poem
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('media')}
          className="p-5 rounded-2xl bg-surface hover:bg-[#F3EBDD]/60 border border-secondary/20 hover:border-primary/40 shadow-soft paper-texture text-left transition-all flex items-center justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center mb-3">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="font-serif-indian text-base font-bold text-text group-hover:text-primary transition-colors">
              Media & Storage
            </h3>
            <p className="text-xs text-text/70 font-sans mt-0.5">
              Upload images to Supabase bucket
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Recent Verses Section */}
      <div className="p-6 rounded-2xl bg-surface border border-secondary/25 shadow-soft paper-texture">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-secondary/20">
          <div>
            <h3 className="font-serif-indian text-lg font-bold text-text">Recent Content</h3>
            <p className="text-xs font-sans text-secondary">Recently created or updated verses</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('shayaris')}
            className="text-xs font-sans font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-background/60 border border-secondary/20 hover:border-secondary/40 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl select-none">{item.emoji || '🪔'}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                      {item.tag || item.category_id}
                    </span>
                    <span
                      className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${
                        item.status === 'published'
                          ? 'bg-green-500/10 text-green-700'
                          : 'bg-amber-500/10 text-amber-700'
                      }`}
                    >
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="font-serif-indian text-xs sm:text-sm text-text line-clamp-2 whitespace-pre-line">
                    {item.hindi}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
