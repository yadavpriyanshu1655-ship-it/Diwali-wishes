import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { AdminLogin } from './components/AdminLogin';
import { DashboardView } from './views/DashboardView';
import { ShayariManagerView } from './views/ShayariManagerView';
import { WishesManagerView } from './views/WishesManagerView';
import { WebsiteTextEditorView } from './views/WebsiteTextEditorView';
import { MediaLibraryView } from './views/MediaLibraryView';
import { SettingsView } from './views/SettingsView';
import {
  getCurrentUser,
  signOutAdmin,
  isUserAuthorizedAdmin,
  fetchAllShayarisAdmin,
  fetchCategories,
  ShayariWishRecord,
  CategoryItem,
  getSupabase,
  isSupabaseConfigured,
} from '../services/supabase';
import { useSiteContent, DEFAULT_CATEGORIES } from '../context/ContentContext';

interface AdminAppProps {
  onNavigateToPublic: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onNavigateToPublic }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Content state for admin
  const [records, setRecords] = useState<ShayariWishRecord[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [openAddModalOnLoad, setOpenAddModalOnLoad] = useState(false);

  const { refreshContent, refreshWishes, wishes } = useSiteContent();

  // Load Records
  const loadAdminData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Fallback: map context wishes to ShayariWishRecord
      const localRecords: ShayariWishRecord[] = wishes.map((w) => ({
        id: w.id,
        type: w.category === 'heartwarming' || w.category === 'friendship' ? 'wish' : 'shayari',
        category_id: w.category,
        hindi: w.hindi,
        english: w.english,
        tag: w.tag,
        emoji: w.emoji,
        image_url: w.imageUrl,
        status: 'published',
      }));
      setRecords(localRecords);
      return;
    }

    try {
      const [fetchedRecords, fetchedCategories] = await Promise.all([
        fetchAllShayarisAdmin(),
        fetchCategories(),
      ]);

      if (fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      }

      if (fetchedRecords.length > 0) {
        setRecords(fetchedRecords);
      } else {
        // If table is newly created but empty, populate with local approved wishes
        const seedMapped: ShayariWishRecord[] = wishes.map((w) => ({
          id: w.id,
          type: w.category === 'heartwarming' || w.category === 'friendship' ? 'wish' : 'shayari',
          category_id: w.category,
          hindi: w.hindi,
          english: w.english,
          tag: w.tag,
          emoji: w.emoji,
          image_url: w.imageUrl,
          status: 'published',
        }));
        setRecords(seedMapped);
      }
    } catch (err) {
      console.warn('Could not load remote admin data:', err);
    }
  }, [wishes]);

  // Auth check on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user && user.email) {
        const isAuthorized = await isUserAuthorizedAdmin(user.email);
        if (isMounted) {
          if (isAuthorized) {
            setCurrentUserEmail(user.email);
          } else {
            await signOutAdmin();
            setCurrentUserEmail(null);
          }
        }
      } else {
        if (isMounted) {
          setCurrentUserEmail(null);
        }
      }
      if (isMounted) {
        setAuthChecking(false);
      }
    };

    checkAuth();

    // Listen to Supabase auth state change
    const supabase = getSupabase();
    let authListener: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session && session.user && session.user.email) {
          const isAuth = await isUserAuthorizedAdmin(session.user.email);
          if (isAuth && isMounted) {
            setCurrentUserEmail(session.user.email);
          } else if (isMounted) {
            await signOutAdmin();
            setCurrentUserEmail(null);
          }
        } else if (isMounted) {
          setCurrentUserEmail(null);
        }
      });
      authListener = data.subscription;
    }

    return () => {
      isMounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  // When logged in, load data
  useEffect(() => {
    if (currentUserEmail) {
      loadAdminData();
    }
  }, [currentUserEmail, loadAdminData]);

  const handleLogout = async () => {
    await signOutAdmin();
    setCurrentUserEmail(null);
  };

  const handleRefreshAll = async () => {
    await Promise.all([loadAdminData(), refreshContent(), refreshWishes()]);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-serif-indian text-base text-text">॥ शुभ दीप व्यवस्थापन ॥</p>
        <span className="text-xs font-sans text-secondary mt-1">Verifying admin access...</span>
      </div>
    );
  }

  // Not authenticated -> Show Login
  if (!currentUserEmail) {
    return (
      <AdminLogin
        onLoginSuccess={(email) => {
          setCurrentUserEmail(email);
        }}
        onNavigateToPublic={onNavigateToPublic}
      />
    );
  }

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'shayaris':
        return 'Shayari & Verses';
      case 'wishes':
        return 'Wishes & Blessings';
      case 'content':
        return 'Website Text Editor';
      case 'media':
        return 'Media Storage';
      case 'settings':
        return 'Settings & Database';
      default:
        return 'Admin CMS';
    }
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col lg:flex-row text-text">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setOpenAddModalOnLoad(false);
        }}
        onLogout={handleLogout}
        onNavigateToPublic={onNavigateToPublic}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          currentViewTitle={getTitle()}
          userEmail={currentUserEmail}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateToPublic={onNavigateToPublic}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              records={records}
              onNavigateTab={setActiveTab}
              onOpenAddModal={() => {
                setActiveTab('shayaris');
                setOpenAddModalOnLoad(true);
              }}
              onNavigateToPublic={onNavigateToPublic}
            />
          )}

          {activeTab === 'shayaris' && (
            <ShayariManagerView
              records={records}
              categories={categories}
              onRefresh={handleRefreshAll}
              isModalOpenByDefault={openAddModalOnLoad}
              onCloseDefaultModal={() => setOpenAddModalOnLoad(false)}
            />
          )}

          {activeTab === 'wishes' && (
            <WishesManagerView
              records={records}
              categories={categories}
              onRefresh={handleRefreshAll}
            />
          )}

          {activeTab === 'content' && (
            <WebsiteTextEditorView
              onRefreshSiteContent={refreshContent}
              onNavigateToPublic={onNavigateToPublic}
            />
          )}

          {activeTab === 'media' && <MediaLibraryView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};
