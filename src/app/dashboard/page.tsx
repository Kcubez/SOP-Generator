'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FileText, PenLine, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.greetingMorning || 'Good morning';
    if (hour < 17) return t.dashboard.greetingAfternoon || 'Good afternoon';
    return t.dashboard.greetingEvening || 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-8 sm:p-10">
        <div className="absolute inset-0 bg-linear-to-br from-violet-600/20 via-indigo-600/10 to-purple-600/20" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/25 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300 tracking-wide uppercase">
              {t.landing.badge}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {getGreeting()},{' '}
            <span className="bg-linear-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {session?.user?.name}
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base leading-relaxed">
            {t.dashboard.description}
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generate New SOP Card */}
        <Link
          href="/dashboard/sop/new"
          className="group relative overflow-hidden block rounded-xl border border-white/10 p-8 hover:border-violet-500/40 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-purple-500/5 group-hover:from-violet-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="h-14 w-14 rounded-xl bg-linear-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-7 w-7 text-violet-400" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t.dashboard.generateCard.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.dashboard.generateCard.desc}
            </p>
          </div>
        </Link>

        {/* Modify Existing SOP Card */}
        <Link
          href="/dashboard/sop/modify"
          className="group relative overflow-hidden block rounded-xl border border-white/10 p-8 hover:border-indigo-500/40 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-blue-500/5 group-hover:from-indigo-500/10 group-hover:to-blue-500/10 transition-all duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="h-14 w-14 rounded-xl bg-linear-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <PenLine className="h-7 w-7 text-indigo-400" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t.dashboard.modifyCard.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">{t.dashboard.modifyCard.desc}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
