import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  fetchAllSiteContentAdmin,
  updateBatchSiteContent,
} from '../../services/supabase';
import { DEFAULT_SITE_CONTENT } from '../../context/ContentContext';

interface WebsiteTextEditorViewProps {
  onRefreshSiteContent: () => Promise<void>;
  onNavigateToPublic: () => void;
}

type SectionKey = 'hero' | 'festive_intro' | 'wishes' | 'surprise' | 'footer';

export const WebsiteTextEditorView: React.FC<WebsiteTextEditorViewProps> = ({
  onRefreshSiteContent,
  onNavigateToPublic,
}) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [contentValues, setContentValues] = useState<Record<string, string>>(DEFAULT_SITE_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load latest content on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const records = await fetchAllSiteContentAdmin();
        if (records.length > 0) {
          const map: Record<string, string> = { ...DEFAULT_SITE_CONTENT };
          records.forEach((r) => {
            map[r.id] = r.value;
          });
          setContentValues(map);
        }
      } catch (err) {
        console.warn('Using local site content defaults:', err);
      }
    };

    loadContent();
  }, []);

  const handleInputChange = (id: string, value: string) => {
    setContentValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    setSaveSuccess(false);
  };

  const handleResetSection = (keys: string[]) => {
    if (window.confirm('Reset this section to its default approved text?')) {
      setContentValues((prev) => {
        const updated = { ...prev };
        keys.forEach((k) => {
          if (DEFAULT_SITE_CONTENT[k]) {
            updated[k] = DEFAULT_SITE_CONTENT[k];
          }
        });
        return updated;
      });
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    const itemsToUpdate = Object.entries(contentValues).map(([id, value]) => ({
      id,
      value,
    }));

    const { error } = await updateBatchSiteContent(itemsToUpdate);

    if (error) {
      setErrorMessage(error);
      setIsSaving(false);
      return;
    }

    await onRefreshSiteContent();
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Field Definitions per Section
  const sections: {
    id: SectionKey;
    label: string;
    description: string;
    fields: { id: string; label: string; desc: string; isTextarea?: boolean }[];
  }[] = [
    {
      id: 'hero',
      label: 'Hero & Welcome',
      description: 'Homepage title, Hindi heading, welcome subtitle, and entry button',
      fields: [
        { id: 'hero_heading_hindi', label: 'Main Hindi Heading', desc: 'Large focal greeting on the homepage' },
        { id: 'hero_subtitle', label: 'Hero Subtitle', desc: 'Editorial subtitle under the main heading' },
        { id: 'hero_badge', label: 'Decorative Badge Text', desc: 'Small uppercase pill above heading' },
        { id: 'hero_intro_quote', label: 'Introductory Welcome Message', desc: 'Italicized quote in the hero section', isTextarea: true },
        { id: 'hero_enter_btn', label: 'Enter Celebration Button Label', desc: 'CTA button text' },
      ],
    },
    {
      id: 'festive_intro',
      label: 'Festive Intro & Story',
      description: 'Narrative editorial paragraph and Deepavali spirit headings',
      fields: [
        { id: 'intro_badge', label: 'Section Badge', desc: 'Header badge text' },
        { id: 'intro_heading', label: 'Section Heading', desc: 'Main section heading' },
        { id: 'intro_quote', label: 'Section Subtitle Quote', desc: 'Italicized quote underneath heading' },
        { id: 'intro_narrative', label: 'Main Editorial Story Paragraph', desc: 'Long-form narrative describing Shubh Deep simplicity', isTextarea: true },
      ],
    },
    {
      id: 'wishes',
      label: 'Wishes Section',
      description: 'Headings and button labels for the interactive verses section',
      fields: [
        { id: 'wishes_badge', label: 'Section Pill Badge', desc: 'Small pill above section heading' },
        { id: 'wishes_heading', label: 'Wishes Section Heading', desc: 'Main Hindi title' },
        { id: 'wishes_subtitle', label: 'Wishes Subtitle', desc: 'Introductory explanation of verses' },
        { id: 'wishes_next_btn', label: 'Next Wish Button Label', desc: 'Interactive generator button text' },
        { id: 'wishes_copy_btn', label: 'Copy Button Label', desc: 'Clipboard button text' },
      ],
    },
    {
      id: 'surprise',
      label: 'Gift Reveal & Poem',
      description: 'Handmade gift box, special multi-line poem, and final celebration screen',
      fields: [
        { id: 'gift_badge', label: 'Gift Section Badge', desc: 'Header badge for the surprise area' },
        { id: 'gift_heading', label: 'Gift Heading', desc: 'Title displayed above the gift box' },
        { id: 'gift_subtitle', label: 'Gift Subtitle', desc: 'Subtext displayed above the gift box' },
        { id: 'gift_open_btn', label: 'Open Gift Button Text', desc: 'CTA button to unbox' },
        { id: 'gift_unveiling_hindi', label: 'Unveiling Animation Hindi Text', desc: 'Text shown while the box opens' },
        { id: 'gift_unveiling_en', label: 'Unveiling Animation English Text', desc: 'Secondary animation label' },
        { id: 'poem_line_1', label: 'Special Poem - Line 1', desc: 'First line of reveal poem' },
        { id: 'poem_line_2', label: 'Special Poem - Line 2', desc: 'Second line of reveal poem' },
        { id: 'poem_line_3', label: 'Special Poem - Line 3', desc: 'Third line of reveal poem' },
        { id: 'poem_line_4', label: 'Special Poem - Line 4', desc: 'Fourth line of reveal poem' },
        { id: 'poem_line_5', label: 'Special Poem - Line 5 (Playful)', desc: 'Transition line in poem' },
        { id: 'poem_line_6', label: 'Special Poem - Line 6', desc: 'Sixth line of reveal poem' },
        { id: 'poem_line_7', label: 'Special Poem - Line 7', desc: 'Seventh line of reveal poem' },
        { id: 'poem_final_title', label: 'Poem Final Blessing Title', desc: 'Heading inside gift card' },
        { id: 'poem_final_subtitle', label: 'Poem Final Blessing Subtitle', desc: 'Subtext inside gift card' },
        { id: 'final_screen_heading', label: 'Final Celebration Heading', desc: 'Header of the lit celebration screen' },
        { id: 'final_screen_sub', label: 'Final Celebration Subtitle', desc: 'English subtitle' },
        { id: 'final_screen_quote', label: 'Final Celebration Quote', desc: 'Closing heartfelt line' },
        { id: 'final_replay_btn', label: 'Replay Magic Button Label', desc: 'Button to re-open gift' },
      ],
    },
    {
      id: 'footer',
      label: 'Footer & Shlokas',
      description: 'Sanskrit shlokas, blessing messages, and copyright notices',
      fields: [
        { id: 'footer_shloka', label: 'Diwali Sanskrit Shloka', desc: 'Sacred verse in footer' },
        { id: 'footer_greeting', label: 'Footer Blessing Message', desc: 'Main footer paragraph', isTextarea: true },
        { id: 'footer_peace_shloka', label: 'Universal Peace Shloka Badge', desc: 'Pill badge in footer' },
        { id: 'footer_copyright', label: 'Copyright Notice', desc: 'Legal and date notice' },
      ],
    },
  ];

  const currentSection = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-indian text-2xl font-bold text-text">Website Text Editor</h2>
          <p className="text-xs font-sans text-secondary">
            Edit any text on your live Diwali website without rebuilding or redeploying code.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateToPublic}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-background border border-secondary/30 text-text hover:text-primary text-xs font-medium font-sans transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Site</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#A64C28] text-surface font-sans text-xs sm:text-sm font-medium shadow-soft transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-accent" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>All text changes have been published to your live database. Refresh your website to see the update!</span>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 border-b border-secondary/20">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2 rounded-xl font-sans text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSection === sec.id
                ? 'bg-primary text-surface shadow-soft'
                : 'bg-surface hover:bg-background text-text border border-secondary/25'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${activeSection === sec.id ? 'text-surface' : 'text-secondary'}`} />
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Section Editor Card */}
      <div className="p-6 rounded-2xl bg-surface border border-secondary/25 shadow-soft paper-texture space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-secondary/20">
          <div>
            <h3 className="font-serif-indian text-lg font-bold text-text">
              {currentSection.label}
            </h3>
            <p className="text-xs font-sans text-secondary mt-0.5">
              {currentSection.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleResetSection(currentSection.fields.map((f) => f.id))}
            className="text-xs font-sans text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset this section</span>
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-5">
          {currentSection.fields.map((field) => {
            const val = contentValues[field.id] || '';
            return (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-sans font-medium text-text flex items-center gap-1.5">
                    <span>{field.label}</span>
                    <span className="text-[10px] text-secondary/60 font-mono">({field.id})</span>
                  </label>
                  <span className="text-[10px] font-sans text-secondary/60">
                    {val.length} chars
                  </span>
                </div>

                {field.isTextarea ? (
                  <textarea
                    rows={4}
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full p-3 rounded-xl bg-background border border-secondary/30 text-xs sm:text-sm text-text outline-none focus:border-primary font-sans leading-relaxed transition-colors"
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs sm:text-sm text-text outline-none focus:border-primary font-sans transition-colors"
                  />
                )}

                <div className="text-[11px] font-sans text-secondary/75">
                  {field.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
