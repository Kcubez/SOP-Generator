'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Sparkles, PenLine, Zap, Award, Download } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen animated-gradient">
      {/* Language Switcher - top right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-sm text-slate-300">{t.landing.badge}</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6">
          {t.landing.title}
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          {t.landing.description}
        </p>

        <Link href="/login" className="btn-primary text-lg px-8 py-4 flex items-center gap-3 group">
          {t.landing.signInBtn}
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 group hover:border-violet-500/30 transition-all duration-300">
          <div className="h-12 w-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="h-6 w-6 text-violet-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{t.landing.generateTitle}</h3>
          <p className="text-slate-400">{t.landing.generateDesc}</p>
        </div>

        <div className="glass-card p-8 group hover:border-violet-500/30 transition-all duration-300">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PenLine className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{t.landing.modifyTitle}</h3>
          <p className="text-slate-400">{t.landing.modifyDesc}</p>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Zap, label: t.landing.featureAI },
            { icon: Award, label: t.landing.featureProfessional },
            { icon: Download, label: t.landing.featureExport },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
            >
              <f.icon className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-slate-300">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
