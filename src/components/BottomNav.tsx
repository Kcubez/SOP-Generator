'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, PlusCircle, Settings, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: Home },
    { href: '/dashboard/sops', label: t.nav.mySops, icon: FileText },
    { href: '/dashboard/sop/new', label: 'Create', icon: PlusCircle, highlight: true },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-4 pb-safe">
      <div className="flex items-center justify-between h-16">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-16 transition-all ${
                isActive ? 'text-violet-400' : 'text-slate-500'
              }`}
            >
              <div
                className={`relative ${item.highlight ? '-mt-8 bg-violet-600 p-3 rounded-full shadow-lg shadow-violet-600/40 text-white border-4 border-slate-900' : ''}`}
              >
                <item.icon className={item.highlight ? 'h-6 w-6' : 'h-5 w-5'} />
              </div>
              {!item.highlight && <span className="text-[10px] font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
