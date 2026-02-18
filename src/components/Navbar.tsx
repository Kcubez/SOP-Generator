'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  Key,
  Loader2,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetchApiKeyStatus();
  }, [session]);

  if (!session) return null;

  const navItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: Home },
    { href: '/dashboard/sops', label: t.nav.mySops, icon: FileText },
  ];

  const fetchApiKeyStatus = async () => {
    try {
      const res = await fetch('/api/user/api-key');
      if (res.ok) {
        const data = await res.json();
        setMaskedKey(data.maskedKey);
      }
    } catch {
      // silently fail
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setSavingKey(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/user/api-key', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setApiKey('');
        fetchApiKeyStatus();
        setTimeout(() => {
          setShowApiKeyModal(false);
          setSaveSuccess(false);
        }, 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save API key');
      }
    } catch {
      alert('Failed to save API key');
    } finally {
      setSavingKey(false);
    }
  };

  const openApiKeyModal = () => {
    fetchApiKeyStatus();
    setShowApiKeyModal(true);
    setApiKey('');
    setShowApiKey(false);
    setSaveSuccess(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 transition-all group-hover:shadow-violet-500/40">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {t.nav.brand}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-500/20 text-violet-300 shadow-inner'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all active:scale-95"
                >
                  <div className="h-7 w-7 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-violet-500/20">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                    {session.user.name}
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="glass-card overflow-hidden border-white/10 shadow-2xl">
                        <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                          <p className="text-sm font-semibold text-white">{session.user.name}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>

                        <div className="p-1.5">
                          <button
                            onClick={() => {
                              openApiKeyModal();
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
                          >
                            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                              <Key className="h-4 w-4 text-violet-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-xs">Gemini API Key</p>
                              <p className="text-[10px] text-slate-500">
                                {maskedKey ? 'Update Key' : 'Not Connected'}
                              </p>
                            </div>
                          </button>
                        </div>

                        <div className="p-1.5 border-t border-white/5">
                          <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left"
                          >
                            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                              <LogOut className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-xs">{t.common.signOut}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={openApiKeyModal}
                className="p-2 rounded-lg text-violet-300 hover:text-white hover:bg-white/5"
                title={t.nav.changeApiKey}
              >
                <Key className="h-4 w-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{session.user.name}</p>
                    <p className="text-xs text-slate-400">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  {t.common.signOut}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowApiKeyModal(false)}
          />
          <div className="relative w-full max-w-md glass-card p-6 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Key className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t.nav.apiKeyModalTitle}</h3>
                <p className="text-sm text-slate-400">{t.nav.apiKeyModalDesc}</p>
              </div>
            </div>

            {/* Current Key Status */}
            {maskedKey && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-emerald-400 font-medium mb-1">{t.nav.currentKey}</p>
                <p className="text-sm text-emerald-300 font-mono">{maskedKey}</p>
              </div>
            )}

            {/* New API Key Input */}
            <div className="space-y-3">
              <label className="form-label">{t.nav.newApiKey}</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="input-field pr-10"
                  placeholder={t.login.apiKeyPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">{t.nav.apiKeyHint}</p>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowApiKeyModal(false)} className="btn-secondary flex-1">
                {t.common.cancel}
              </button>
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim() || savingKey}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {savingKey ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t.nav.saved}
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    {t.common.save}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
