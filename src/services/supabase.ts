import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Configuration keys
const STORAGE_KEY_URL = 'shubh_deep_supabase_url';
const STORAGE_KEY_KEY = 'shubh_deep_supabase_anon_key';
const STORAGE_KEY_ADMIN_EMAIL = 'shubh_deep_admin_email';

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  display_order: number;
}

export interface ShayariWishRecord {
  id: string;
  type: 'shayari' | 'wish';
  category_id: string;
  hindi: string;
  english?: string;
  tag: string;
  emoji: string;
  image_url?: string;
  status: 'published' | 'draft';
  is_featured?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SiteContentRecord {
  id: string;
  section: string;
  label: string;
  value: string;
  input_type: 'text' | 'textarea' | 'markdown';
  display_order?: number;
  updated_at?: string;
}

export interface AdminSettingsRecord {
  id: string;
  authorized_email: string;
  site_title?: string;
  updated_at?: string;
}

export interface MediaItem {
  name: string;
  id: string;
  url: string;
  created_at?: string | null;
  size?: number;
}

// Retrieve active credentials (Environment variables first, then localStorage fallback)
export function getActiveSupabaseConfig(): { url: string; anonKey: string; adminEmail: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim();

  const localUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : '') || '';
  const localKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : '') || '';
  const localAdminEmail = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ADMIN_EMAIL) : '') || '';

  const url = envUrl || localUrl;
  const anonKey = envKey || localKey;
  const adminEmail = envAdminEmail || localAdminEmail;

  return { url, anonKey, adminEmail };
}

export function saveLocalSupabaseConfig(url: string, anonKey: string, adminEmail?: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    if (adminEmail) {
      localStorage.setItem(STORAGE_KEY_ADMIN_EMAIL, adminEmail.trim());
    }
  }
}

export function clearLocalSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    localStorage.removeItem(STORAGE_KEY_ADMIN_EMAIL);
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getActiveSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
}

// Initialize Singleton Supabase Client
let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getActiveSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// ==============================================================================
// AUTHENTICATION SERVICES
// ==============================================================================

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

export async function signInAdmin(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { user: null, error: 'Supabase is not configured yet. Please enter your project URL and Anon Key in Settings.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user };
}

export async function signOutAdmin(): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return {};
  const { error } = await supabase.auth.signOut();
  return error ? { error: error.message } : {};
}

// Verify if logged-in user is authorized admin
export async function isUserAuthorizedAdmin(userEmail?: string): Promise<boolean> {
  if (!userEmail) return false;
  const { adminEmail } = getActiveSupabaseConfig();

  // 1. Check against active config if set
  if (adminEmail && adminEmail.toLowerCase() === userEmail.toLowerCase()) {
    return true;
  }

  // 2. Check admin_settings table in Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('authorized_email')
        .single();

      if (data && data.authorized_email) {
        if (data.authorized_email.toLowerCase() === userEmail.toLowerCase()) {
          return true;
        }
      }
    } catch {
      // Fallback
    }
  }

  // If no specific authorized email has been restricted in settings, allow authenticated user
  return true;
}

// ==============================================================================
// CMS & DATABASE SERVICES
// ==============================================================================

// 1. Categories
export async function fetchCategories(): Promise<CategoryItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Using default categories. Database note:', err);
    return [];
  }
}

// 2. Shayaris & Wishes (Public)
export async function fetchPublishedShayaris(): Promise<ShayariWishRecord[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('shayaris_wishes')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Could not fetch remote shayaris, fallback will be used:', err);
    return [];
  }
}

// 3. Shayaris & Wishes (Admin: All items including drafts)
export async function fetchAllShayarisAdmin(): Promise<ShayariWishRecord[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('shayaris_wishes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching admin shayaris:', err);
    throw err;
  }
}

export async function saveShayariRecord(record: Partial<ShayariWishRecord>): Promise<{ data: ShayariWishRecord | null; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: 'Database not connected' };

  try {
    const isUpdate = Boolean(record.id);
    const id = record.id || `custom-${Date.now()}`;
    const payload = {
      ...record,
      id,
      updated_at: new Date().toISOString(),
    };

    if (isUpdate) {
      const { data, error } = await supabase
        .from('shayaris_wishes')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } else {
      const { data, error } = await supabase
        .from('shayaris_wishes')
        .insert({
          ...payload,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data };
    }
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to save record' };
  }
}

export async function deleteShayariRecord(id: string): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Database not connected' };

  try {
    const { error } = await supabase
      .from('shayaris_wishes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return {};
  } catch (err: any) {
    return { error: err.message || 'Failed to delete record' };
  }
}

// 4. Site Content (Key-Value Content Management)
export async function fetchSiteContent(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*');

    if (error) throw error;

    const map: Record<string, string> = {};
    (data || []).forEach((row: SiteContentRecord) => {
      map[row.id] = row.value;
    });
    return map;
  } catch (err) {
    console.warn('Could not fetch remote site content:', err);
    return {};
  }
}

export async function fetchAllSiteContentAdmin(): Promise<SiteContentRecord[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching admin site content:', err);
    throw err;
  }
}

export async function updateSiteContentItem(id: string, value: string): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Database not connected' };

  try {
    const { error } = await supabase
      .from('site_content')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return {};
  } catch (err: any) {
    return { error: err.message || 'Failed to update content item' };
  }
}

export async function updateBatchSiteContent(items: { id: string; value: string }[]): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Database not connected' };

  try {
    for (const item of items) {
      const { error } = await supabase
        .from('site_content')
        .update({ value: item.value, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
    }
    return {};
  } catch (err: any) {
    return { error: err.message || 'Failed to update content batch' };
  }
}

// 5. Admin Settings
export async function fetchAdminSettings(): Promise<AdminSettingsRecord | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('id', 'config')
      .single();

    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function updateAdminSettings(settings: Partial<AdminSettingsRecord>): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Database not connected' };

  try {
    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        id: 'config',
        ...settings,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return {};
  } catch (err: any) {
    return { error: err.message || 'Failed to update admin settings' };
  }
}

// 6. Media Management (Supabase Storage Bucket: 'media')
export async function uploadMediaFile(file: File): Promise<{ url?: string; name?: string; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase storage is not connected' };

  // File Validation
  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeBytes) {
    return { error: 'File size exceeds maximum allowed limit (5 MB).' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file format. Please upload JPG, PNG, WEBP, or SVG images.' };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniquePath = `${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(uniquePath);

    return { url: publicUrl, name: uniquePath };
  } catch (err: any) {
    return { error: err.message || 'Failed to upload image to Supabase' };
  }
}

export async function listMediaFiles(): Promise<{ files: MediaItem[]; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { files: [] };

  try {
    const { data, error } = await supabase.storage
      .from('media')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;

    const files: MediaItem[] = (data || [])
      .filter((item) => item.name !== '.emptyFolderPlaceholder')
      .map((item) => {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(item.name);
        return {
          id: item.id || item.name,
          name: item.name,
          url: publicUrl,
          created_at: item.created_at,
          size: item.metadata?.size,
        };
      });

    return { files };
  } catch (err: any) {
    return { files: [], error: err.message || 'Failed to list media items' };
  }
}

export async function deleteMediaFile(fileName: string): Promise<{ error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Storage not connected' };

  try {
    const { error } = await supabase.storage
      .from('media')
      .remove([fileName]);

    if (error) throw error;
    return {};
  } catch (err: any) {
    return { error: err.message || 'Failed to delete file' };
  }
}
