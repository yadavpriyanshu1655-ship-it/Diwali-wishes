import React from 'react';
import { Flame, Heart, Lock } from 'lucide-react';
import { RangoliDivider } from './illustrations/RangoliMotif';
import { useSiteContent } from '../context/ContentContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { getContent } = useSiteContent();

  return (
    <footer className="bg-surface border-t border-secondary/20 pt-12 pb-10 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Decorative Divider */}
        <RangoliDivider className="mb-8" />

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#F3EBDD] border border-secondary/20 flex items-center justify-center text-primary">
            <Flame className="w-3.5 h-3.5 fill-primary/20 text-primary" />
          </div>
          <span className="font-serif-indian text-xl font-bold tracking-wide text-text">
            शुभ दीप
          </span>
          <span className="text-secondary/40">•</span>
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-medium text-secondary">
            SHUBH DEEP
          </span>
        </div>

        {/* Short Diwali Greeting */}
        <p className="font-serif-indian text-base sm:text-lg text-primary max-w-xl mx-auto mb-2">
          {getContent(
            'footer_shloka',
            '"दीप ज्योति परब्रह्म दीप ज्योति जनार्दनः। दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तुते॥"'
          )}
        </p>
        <p className="font-sans text-xs sm:text-sm text-text/80 max-w-lg mx-auto leading-relaxed mb-8">
          {getContent(
            'footer_greeting',
            'Wishing you and your loved ones an auspicious Deepavali blessed with serene health, quiet fulfillment, and lasting peace.'
          )}
        </p>

        {/* Subtle Decorative Sanskrit Shloka */}
        <div className="inline-block py-2 px-5 rounded-full bg-[#F3EBDD]/60 border border-secondary/15 text-xs text-secondary font-serif-indian mb-8">
          {getContent('footer_peace_shloka', '॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥')}
        </div>

        {/* Subtle Footer Meta */}
        <div className="pt-6 border-t border-secondary/15 flex flex-col sm:flex-row items-center justify-between text-xs text-text/60 font-sans gap-3">
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-primary fill-primary/40" />
            <span>in Earthy Indian Minimalism</span>
          </div>

          <div className="flex items-center gap-4">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-secondary/70 hover:text-primary transition-colors flex items-center gap-1 text-[11px]"
                title="Admin Portal"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            )}
            <span>{getContent('footer_copyright', `© ${new Date().getFullYear()} SHUBH DEEP. All Rights Reserved.`)}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
