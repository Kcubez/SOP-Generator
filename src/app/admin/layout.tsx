'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, LogOut, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/admin/login');
    }
  }, [status, session, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
          <p className="text-slate-400">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-amber-500/20 bg-slate-900/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-linear-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                  {t.admin.brand}
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-400 rounded-full uppercase tracking-wider">
                  {t.admin.badge}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="h-6 w-6 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-300">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title={t.common.signOut}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t.common.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
