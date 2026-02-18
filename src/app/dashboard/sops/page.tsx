'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  User,
  Trash2,
  Eye,
  Loader2,
  FilePlus,
  FileEdit,
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  X,
  TrendingUp,
  Plus,
  PenLine,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SOP {
  id: string;
  type: string;
  title: string;
  businessName: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

export default function SOPsListPage() {
  const { t } = useLanguage();
  const [sops, setSops] = useState<SOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'MODIFIED'>('ALL');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredSops = sops.filter(sop => {
    const matchesFilter = filter === 'ALL' || sop.type === filter;
    const matchesSearch =
      search === '' ||
      sop.title.toLowerCase().includes(search.toLowerCase()) ||
      sop.businessName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 8000);
  };

  useEffect(() => {
    fetchSOPs();
  }, []);

  const fetchSOPs = async () => {
    try {
      const res = await fetch('/api/sop');
      if (res.ok) {
        const data = await res.json();
        setSops(data.sops);
      }
    } catch (error) {
      console.error('Failed to fetch SOPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/sop/${id}`, { method: 'DELETE' });
      if (res.ok) setSops(prev => prev.filter(sop => sop.id !== id));
    } catch {
      showError('Failed to delete SOP. Please try again.');
    } finally {
      setDeletingId(null);
      setDeleteModalId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-5 h-24 animate-pulse bg-white/5" />
          ))}
        </div>

        {/* Search Row Skeleton */}
        <div className="h-12 w-full lg:max-w-md bg-white/5 rounded-full animate-pulse" />

        {/* List Skeletons */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="glass-card p-5 h-20 animate-pulse bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm flex-1">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage('')}
            className="shrink-0 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{t.sopList.title}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-9 w-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <FileText className="h-4 w-4 text-violet-400" />
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-400 opacity-60" />
          </div>
          <p className="text-2xl font-bold text-white">{sops.length}</p>
          <p className="text-xs text-slate-400 mt-1">{t.dashboard.stats?.total || 'Total SOPs'}</p>
        </div>
        <div className="glass-card p-5 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Plus className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {sops.filter(s => s.type === 'NEW').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">{t.dashboard.stats?.created || 'New'}</p>
        </div>
        <div className="glass-card p-5 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <PenLine className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {sops.filter(s => s.type === 'MODIFIED').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">{t.dashboard.stats?.modified || 'Modified'}</p>
        </div>
      </div>

      {/* Search and Actions Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.sopList.searchPlaceholder}
            className="w-full bg-slate-800/50 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          />
        </div>

        {/* Filters and Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Group */}
          <div className="flex items-center bg-slate-800/50 border border-white/10 rounded-full p-1">
            {[
              { key: 'ALL' as const, label: t.sopList.filterAll },
              { key: 'NEW' as const, label: t.sopList.filterNew },
              { key: 'MODIFIED' as const, label: t.sopList.filterModified },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === item.key
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SOP List */}
      {filteredSops.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/2 p-12 sm:p-20 text-center animate-in fade-in zoom-in duration-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] -z-10" />

          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-violet-500/20 rounded-2xl rotate-6" />
            <div className="absolute inset-0 bg-violet-600 shadow-xl shadow-violet-600/30 rounded-2xl flex items-center justify-center -rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            {search ? 'No results found' : t.sopList.noSops}
          </h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-sm mx-auto mb-8 leading-relaxed">
            {search
              ? `We couldn't find any SOPs matching "${search}". Try a different term or clear filters.`
              : t.sopList.noSopsDesc}
          </p>

          {!search && filter === 'ALL' && (
            <Link
              href="/dashboard/sop/new"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-violet-600/25 active:scale-95"
            >
              <FilePlus className="h-5 w-5" />
              {t.sopList.generateFirst}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSops.map((sop, index) => (
            <div
              key={sop.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="glass-card-hover p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                    sop.type === 'NEW' ? 'bg-violet-500/20' : 'bg-indigo-500/20'
                  }`}
                >
                  {sop.type === 'NEW' ? (
                    <FilePlus className="h-5 w-5 text-violet-400" />
                  ) : (
                    <FileEdit className="h-5 w-5 text-indigo-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{sop.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(sop.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {sop.user.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        sop.type === 'NEW'
                          ? 'bg-violet-500/15 text-violet-300'
                          : 'bg-indigo-500/15 text-indigo-300'
                      }`}
                    >
                      {sop.type === 'NEW' ? t.sopList.filterNew : t.sopList.filterModified}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/dashboard/sop/${sop.id}`}
                  className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Eye className="h-4 w-4" />
                  {t.sopList.viewDetails}
                </Link>
                <button
                  onClick={() => setDeleteModalId(sop.id)}
                  disabled={deletingId === sop.id}
                  className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  {deletingId === sop.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModalId(null)}
          />
          <div className="relative bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{t.sopDetail.deleteSop}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {t.sopList.confirmDelete}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteModalId)}
                disabled={deletingId === deleteModalId}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors flex items-center gap-2"
              >
                {deletingId === deleteModalId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
