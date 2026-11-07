import React, { useState } from 'react';
import {
  Database,
  Key,
  ShieldCheck,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Save,
  Trash2,
} from 'lucide-react';
import {
  getActiveSupabaseConfig,
  saveLocalSupabaseConfig,
  clearLocalSupabaseConfig,
  isSupabaseConfigured,
  updateAdminSettings,
} from '../../services/supabase';

export const SettingsView: React.FC = () => {
  const config = getActiveSupabaseConfig();
  const [url, setUrl] = useState(config.url);
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [adminEmail, setAdminEmail] = useState(config.adminEmail);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !anonKey) {
      setErrorMessage('Please provide both Supabase Project URL and Anon Key.');
      return;
    }

    saveLocalSupabaseConfig(url, anonKey, adminEmail);

    if (adminEmail) {
      await updateAdminSettings({ authorized_email: adminEmail });
    }

    setErrorMessage(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClear = () => {
    if (window.confirm('Clear local Supabase credentials from browser memory?')) {
      clearLocalSupabaseConfig();
      setUrl('');
      setAnonKey('');
      setAdminEmail('');
      setSavedSuccess(true);
    }
  };

  const handleCopySql = () => {
    // Read the supabase_schema.sql instructions
    const sqlNotice = `-- Run this in your Supabase Dashboard -> SQL Editor:\n-- The complete script is located in file: supabase_schema.sql in the project root.`;
    navigator.clipboard.writeText(sqlNotice);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-serif-indian text-2xl font-bold text-text">Admin Settings & Database</h2>
        <p className="text-xs font-sans text-secondary">
          Configure Supabase PostgreSQL connection, admin authentication, and production deployment keys.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Supabase Connection Card */}
      <div className="p-6 rounded-2xl bg-surface border border-secondary/25 shadow-soft paper-texture space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-indian text-base font-bold text-text">
                Supabase Project Credentials
              </h3>
              <p className="text-xs font-sans text-secondary">
                {isSupabaseConfigured() ? '✓ Connected to database' : '⚠️ Credentials not configured'}
              </p>
            </div>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-sans text-primary hover:underline flex items-center gap-1"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-medium text-text mb-1">
              Supabase Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs sm:text-sm text-text outline-none focus:border-primary font-mono"
            />
            <span className="text-[11px] font-sans text-secondary/70 mt-1 block">
              Found in Supabase: Project Settings $\rightarrow$ API $\rightarrow$ Project URL
            </span>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-text mb-1">
              Supabase Public Anonymous Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              required
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs sm:text-sm text-text outline-none focus:border-primary font-mono"
            />
            <span className="text-[11px] font-sans text-secondary/70 mt-1 block">
              Found in Supabase: Project Settings $\rightarrow$ API $\rightarrow$ Project API keys (anon public)
            </span>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-text mb-1">
              Authorized Admin Email (VITE_ADMIN_EMAIL)
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@shubhdeep.com"
              className="w-full px-3 py-2 rounded-xl bg-background border border-secondary/30 text-xs sm:text-sm text-text outline-none focus:border-primary"
            />
            <span className="text-[11px] font-sans text-secondary/70 mt-1 block">
              Only this email address can access the admin dashboard.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="px-3.5 py-2 rounded-xl hover:bg-red-500/10 text-text/60 hover:text-red-600 text-xs font-sans transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Storage</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#A64C28] text-surface font-sans text-xs sm:text-sm font-medium shadow-soft transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Migration Script Card */}
      <div className="p-6 rounded-2xl bg-surface border border-secondary/25 shadow-soft paper-texture space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-indian text-base font-bold text-text">
                Database Migration SQL Script
              </h3>
              <p className="text-xs font-sans text-secondary">
                Pre-configures all tables, RLS policies, storage bucket, and seeds all 27 approved Shayaris.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface hover:bg-background border border-secondary/30 text-xs font-sans text-text hover:text-primary transition-all font-medium"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-secondary" />}
            <span>{copiedSql ? 'Copied Notice' : 'Copy SQL Location'}</span>
          </button>
        </div>

        <p className="text-xs font-sans text-text/80 leading-relaxed">
          The complete SQL setup script has been generated in your workspace at:
          <br />
          <code className="inline-block mt-1 px-2 py-1 rounded bg-background border border-secondary/30 text-primary font-mono text-[11px]">
            supabase_schema.sql
          </code>
        </p>

        <div className="p-3.5 rounded-xl bg-background/80 border border-secondary/20 text-xs font-sans text-secondary space-y-1.5">
          <div className="font-semibold text-text">How to execute in Supabase:</div>
          <ol className="list-decimal list-inside space-y-1 text-text/75">
            <li>Open your Supabase Project dashboard.</li>
            <li>Click <strong>SQL Editor</strong> in the left navigation sidebar.</li>
            <li>Click <strong>New Query</strong>, paste the contents of <code className="text-primary font-mono">supabase_schema.sql</code>, and click <strong>Run</strong>.</li>
            <li>All 4 tables, RLS policies, the <code className="text-primary font-mono">media</code> storage bucket, and all 27 approved verses will be created immediately!</li>
          </ol>
        </div>
      </div>

      {/* Netlify Deployment Guide */}
      <div className="p-6 rounded-2xl bg-surface border border-secondary/25 shadow-soft paper-texture space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-secondary/20">
          <div className="w-8 h-8 rounded-lg bg-accent/20 text-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-indian text-base font-bold text-text">
              Netlify Production Environment Setup
            </h3>
            <p className="text-xs font-sans text-secondary">
              Keep your live website connected on Netlify
            </p>
          </div>
        </div>

        <p className="text-xs font-sans text-text/80 leading-relaxed">
          In your Netlify dashboard, go to <strong>Site configuration $\rightarrow$ Environment variables</strong> and add:
        </p>

        <div className="space-y-2 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-background border border-secondary/25 flex items-center justify-between">
            <span className="text-primary font-semibold">VITE_SUPABASE_URL</span>
            <span className="text-text/70">{url || 'https://your-project.supabase.co'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-background border border-secondary/25 flex items-center justify-between">
            <span className="text-primary font-semibold">VITE_SUPABASE_ANON_KEY</span>
            <span className="text-text/70">{anonKey ? '••••••••••••' : 'your-anon-public-key'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-background border border-secondary/25 flex items-center justify-between">
            <span className="text-primary font-semibold">VITE_ADMIN_EMAIL</span>
            <span className="text-text/70">{adminEmail || 'admin@shubhdeep.com'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
