'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { useLanguage } from '@/contexts/LanguageContext';
import { showToast } from '@/components/Toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang } = useLanguage();

  const checkSubscription = useCallback(async () => {
    try {
      const res = await fetch('/api/user/subscription-status');
      const data = await res.json();

      if (data.status === 'expired') {
        const msg = lang === 'mm' ? data.messageMM : data.message;
        showToast(
          msg || 'Your subscription has expired.',
          'error',
          8000
        );
        // Wait a moment so the user can see the toast before logout
        setTimeout(() => {
          signOut({ callbackUrl: '/login' });
        }, 2000);
      }
    } catch {
      // Silently fail - don't interrupt the user experience
    }
  }, [lang]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Check subscription status periodically
  useEffect(() => {
    if (status !== 'authenticated') return;

    // Check immediately on mount
    checkSubscription();

    // Check every 60 seconds
    const interval = setInterval(checkSubscription, 60 * 1000);

    return () => clearInterval(interval);
  }, [status, checkSubscription]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1 pb-20 md:pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>
      <BottomNav />
      <footer className="border-t border-white/5 py-4 hidden md:block">
        <p className="text-center text-xs text-slate-500">© 2026 SOP Generator</p>
      </footer>
    </div>
  );
}
