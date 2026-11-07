import React, { useState } from 'react';
import {
  Flame,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Settings,
  Database,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  signInAdmin,
  signOutAdmin,
  isUserAuthorizedAdmin,
  isSupabaseConfigured,
  getActiveSupabaseConfig,
  saveLocalSupabaseConfig,
} from '../../services/supabase';

interface AdminLoginProps {
  onLoginSuccess: (email: string) => void;
  onNavigateToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateToPublic,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Supabase Credentials Setup Modal/Drawer State
  const [showConfigDrawer, setShowConfigDrawer] = useState(!isSupabaseConfigured());
  const activeConfig = getActiveSupabaseConfig();
  const [inputUrl, setInputUrl] = useState(activeConfig.url);
  const [inputKey, setInputKey] = useState(activeConfig.anonKey);
  const [inputAdminEmail, setInputAdminEmail] = useState(activeConfig.adminEmail);
  const [configSuccess, setConfigSuccess] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl || !inputKey) {
      setErrorMsg('Please provide both Supabase Project URL and Public Anon Key.');
      return;
    }
    saveLocalSupabaseConfig(inputUrl, inputKey, inputAdminEmail);
    setConfigSuccess(true);
    setErrorMsg(null);
    setTimeout(() => {
      setShowConfigDrawer(false);
      setConfigSuccess(false);
    }, 1200);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isSupabaseConfigured()) {
      setShowConfigDrawer(true);
      setErrorMsg('Please connect your Supabase project credentials first.');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await signInAdmin(email, password);

      if (error || !user) {
        setErrorMsg(error || 'Invalid credentials. Please verify your email and password.');
        setLoading(false);
        return;
      }

      // Check authorization
      const isAuthorized = await isUserAuthorizedAdmin(user.email);
      if (!isAuthorized) {
        await signOutAdmin();
        setErrorMsg(`Access denied: The email "${user.email}" is not authorized for SHUBH DEEP admin access.`);
        setLoading(false);
        return;
      }

      onLoginSuccess(user.email || email);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-surface border border-secondary/25 rounded-2xl p-6 sm:p-8 shadow-earthy paper-texture relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary text-surface mx-auto flex items-center justify-center shadow-soft mb-3">
            <Flame className="w-6 h-6 fill-surface/20" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EBDD] border border-secondary/20 text-[11px] font-sans font-medium uppercase tracking-widest text-secondary mb-2">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>Private Content Management</span>
          </div>
          <h2 className="font-serif-indian text-2xl sm:text-3xl font-bold text-text">
            शुभ दीप Admin
          </h2>
          <p className="text-xs sm:text-sm text-text/75 mt-1 font-sans">
            Sign in to manage live Shayaris, wishes, and site text.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-text mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shubhdeep.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text outline-none transition-all placeholder:text-text/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-text mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm text-text outline-none transition-all placeholder:text-text/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary/60 hover:text-text transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#A64C28] text-surface font-sans font-medium text-sm shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Supabase Connection Setup Accordion */}
        <div className="mt-6 pt-5 border-t border-secondary/20">
          <button
            type="button"
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="w-full flex items-center justify-between text-xs font-sans text-secondary hover:text-primary transition-colors font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured() ? 'Supabase Project Connected' : 'Connect Supabase Project'}</span>
            </span>
            <Settings className="w-3.5 h-3.5" />
          </button>

          {showConfigDrawer && (
            <div className="mt-3 p-3.5 rounded-xl bg-background/80 border border-secondary/25 space-y-3">
              <div className="text-[11px] text-text/75 leading-relaxed font-sans">
                Paste your Supabase credentials (from your Supabase dashboard $\rightarrow$ Project Settings $\rightarrow$ API):
              </div>

              {configSuccess && (
                <div className="p-2 rounded-lg bg-secondary/15 text-secondary text-xs font-medium">
                  ✓ Credentials saved successfully!
                </div>
              )}

              <form onSubmit={handleSaveConfig} className="space-y-2">
                <div>
                  <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-secondary">
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-secondary/30 text-xs text-text outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-secondary">
                    Anon Public Key
                  </label>
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-secondary/30 text-xs text-text outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-secondary">
                    Authorized Admin Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={inputAdminEmail}
                    onChange={(e) => setInputAdminEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-secondary/30 text-xs text-text outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-secondary text-surface text-xs font-medium hover:bg-[#666D4C] transition-colors"
                >
                  Save Connection Settings
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Back to Site Link */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onNavigateToPublic}
            className="text-xs font-sans text-secondary hover:text-primary transition-colors underline underline-offset-4"
          >
            ← Back to Public Diwali Website
          </button>
        </div>
      </div>
    </div>
  );
};
