import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchPublishedShayaris,
  fetchSiteContent,
  fetchCategories,
  CategoryItem,
  ShayariWishRecord,
  isSupabaseConfigured,
} from '../services/supabase';
import { WISHES_DATA, WishItem, WishCategory } from '../data/wishesData';

// Approved Phase 01-06 Hardcoded Defaults
export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  // Hero
  hero_badge: 'A FESTIVAL OF LIGHT',
  hero_heading_hindi: 'शुभ दीपावली',
  hero_subtitle: 'A Little Light, A Lot of Happiness.',
  hero_intro_quote: '"May this beautiful festival bring peace, happiness, and countless little reasons to smile."',
  hero_enter_btn: 'Enter Celebration',

  // Festive Intro
  intro_badge: 'The Spirit of Deepavali',
  intro_heading: 'दीपक की ज्योति से आलोकित हो संसार',
  intro_quote: '"May the flame of every earthen lamp illuminate the world with peace."',
  intro_narrative:
    "Diwali is a return to simplicity. It is the fragrance of raw river clay baking in the potter's kiln, the deliberate geometry of rice-flour rangoli adorning courtyard steps, and the warmth of reuniting with loved ones. When an earthen lamp is lit, it asks for neither fanfare nor extravagance—only a drop of oil to offer unconditional brightness. In that quiet gesture lies the true soul of SHUBH DEEP: a mindful celebration of light, harmony, and renewed hope.",

  // Wishes Section
  wishes_badge: 'Festive Verses & Heartfelt Wishes',
  wishes_heading: 'शब्दों में दीपावली की मिठास',
  wishes_subtitle: 'Spreading warmth, lighthearted laughter, and heartfelt blessings to celebrate this festival of lights.',
  wishes_next_btn: 'Next Wish',
  wishes_copy_btn: 'Copy Wish',

  // Gift Reveal & Final Surprise
  gift_badge: 'The Final Blessing',
  gift_heading: 'A Little Surprise For You...',
  gift_subtitle: 'Because every beautiful celebration deserves a little extra happiness.',
  gift_open_btn: 'Open Your Gift',
  gift_unveiling_hindi: '॥ उपहार खुल रहा है... ॥',
  gift_unveiling_en: 'Unveiling your celebration...',
  poem_line_1: 'जिंदगी में रोशनी हमेशा बनी रहे,',
  poem_line_2: 'चेहरे पर मुस्कान कभी कम न हो।',
  poem_line_3: 'हर ख्वाब पूरा हो तुम्हारा,',
  poem_line_4: 'और खुशियों का कोई अंत न हो।',
  poem_line_5: 'वैसे एक छोटी सी बात...',
  poem_line_6: 'Diwali ke diye toh har koi jalata hai,',
  poem_line_7: 'par kuch log apni smile se hi celebration complete kar dete hain! 😉',
  poem_final_title: 'Happy Diwali to You and Your Family!',
  poem_final_subtitle: 'May Peace & Joy Abound',
  final_screen_heading: 'शुभ दीपावली',
  final_screen_sub: 'Happy Diwali!',
  final_screen_quote: '"Keep smiling. Keep shining. Keep spreading happiness."',
  final_replay_btn: 'Replay Magic ✨',

  // Footer
  footer_shloka: '"दीप ज्योति परब्रह्म दीप ज्योति जनार्दनः। दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तुते॥"',
  footer_greeting:
    'Wishing you and your loved ones an auspicious Deepavali blessed with serene health, quiet fulfillment, and lasting peace.',
  footer_peace_shloka: '॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥',
  footer_copyright: `© ${new Date().getFullYear()} SHUBH DEEP. All Rights Reserved.`,
};

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'funny', name: 'Funny Shayari', emoji: '🍬', display_order: 1 },
  { id: 'friendship', name: 'Friendship Shayari', emoji: '💛', display_order: 2 },
  { id: 'heartwarming', name: 'Heartwarming Wishes', emoji: '🌸', display_order: 3 },
  { id: 'flirt', 'name': 'Cute & Subtle Flirt', emoji: '✨', display_order: 4 },
  { id: 'diwali_special', name: 'Diwali Special Shayari', emoji: '🪔', display_order: 5 },
  { id: 'custom', name: 'Custom Category', emoji: '✍️', display_order: 6 },
];

interface ContentContextType {
  content: Record<string, string>;
  getContent: (key: string, fallback?: string) => string;
  wishes: WishItem[];
  categories: CategoryItem[];
  isLoading: boolean;
  isLiveSynced: boolean;
  refreshContent: () => Promise<void>;
  refreshWishes: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  getContent: (key: string, fallback?: string) => fallback || DEFAULT_SITE_CONTENT[key] || '',
  wishes: WISHES_DATA,
  categories: DEFAULT_CATEGORIES,
  isLoading: false,
  isLiveSynced: false,
  refreshContent: async () => {},
  refreshWishes: async () => {},
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Record<string, string>>(DEFAULT_SITE_CONTENT);
  const [wishes, setWishes] = useState<WishItem[]>(WISHES_DATA);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);

  // Helper to safely get content with fallback
  const getContent = useCallback(
    (key: string, fallback?: string): string => {
      if (content[key] && content[key].trim() !== '') {
        return content[key];
      }
      return fallback || DEFAULT_SITE_CONTENT[key] || '';
    },
    [content]
  );

  // Sync site content from Supabase
  const refreshContent = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const dynamicContent = await fetchSiteContent();
      if (Object.keys(dynamicContent).length > 0) {
        setContent((prev) => ({
          ...prev,
          ...dynamicContent,
        }));
        setIsLiveSynced(true);
      }
    } catch (err) {
      console.warn('Live content fetch skipped, retaining fallback content:', err);
    }
  }, []);

  // Sync shayaris & wishes from Supabase
  const refreshWishes = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const [remoteRecords, remoteCategories] = await Promise.all([
        fetchPublishedShayaris(),
        fetchCategories(),
      ]);

      if (remoteCategories.length > 0) {
        setCategories(remoteCategories);
      }

      if (remoteRecords.length > 0) {
        const formatted: WishItem[] = remoteRecords.map((r: ShayariWishRecord) => ({
          id: r.id,
          category: (r.category_id || 'funny') as WishCategory,
          hindi: r.hindi,
          english: r.english,
          tag: r.tag,
          emoji: r.emoji,
          imageUrl: r.image_url,
        }));
        setWishes(formatted);
        setIsLiveSynced(true);
      }
    } catch (err) {
      console.warn('Live wishes fetch skipped, retaining fallback wishes:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const initSync = async () => {
      if (!isSupabaseConfigured()) return;
      setIsLoading(true);
      await Promise.all([refreshContent(), refreshWishes()]);
      if (isMounted) setIsLoading(false);
    };

    initSync();
    return () => {
      isMounted = false;
    };
  }, [refreshContent, refreshWishes]);

  return (
    <ContentContext.Provider
      value={{
        content,
        getContent,
        wishes,
        categories,
        isLoading,
        isLiveSynced,
        refreshContent,
        refreshWishes,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(ContentContext);
