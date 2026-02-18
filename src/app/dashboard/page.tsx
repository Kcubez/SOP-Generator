'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FileText, PenLine, ArrowRight, Sparkles, Clock, Award, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden glass-card p-8">
        <div className="absolute inset-0 bg-linear-to-r from-violet-500/10 via-transparent to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/20 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-300">{t.landing.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t.dashboard.welcome}{' '}
            <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {session?.user?.name}
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl">{t.dashboard.description}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generate New SOP */}
        <Link
          href="/dashboard/sop/new"
          className="glass-card p-8 group hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-violet-400" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {t.dashboard.generateCard.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            {t.dashboard.generateCard.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.dashboard.generateCard.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </Link>

        {/* Modify Existing SOP */}
        <Link
          href="/dashboard/sop/modify"
          className="glass-card p-8 group hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PenLine className="h-6 w-6 text-indigo-400" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">{t.dashboard.modifyCard.title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            {t.dashboard.modifyCard.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.dashboard.modifyCard.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </Link>
      </div>

      {/* Why Use Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">{t.dashboard.features.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.dashboard.features.items.map((item, i) => {
            const icons = [Zap, Clock, Award];
            const Icon = icons[i];
            return (
              <div key={i} className="glass-card p-6">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-3">
                  <Icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
