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
      alert('Failed to delete SOP');
    } finally {
      setDeletingId(null);
      setDeleteModalId(null);
    }
  };

  const filteredSops = sops.filter(sop => {
    const matchesFilter = filter === 'ALL' || sop.type === filter;
    const matchesSearch =
      search === '' ||
      sop.title.toLowerCase().includes(search.toLowerCase()) ||
      sop.businessName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
          <p className="text-slate-400">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.sopList.title}</h1>
          <p className="text-sm text-slate-400 mt-1">
            {sops.length} SOP{sops.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/sop/new" className="btn-primary flex items-center gap-2 text-sm">
            <FilePlus className="h-4 w-4" />
            {t.sopList.filterNew}
          </Link>
          <Link
            href="/dashboard/sop/modify"
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <FileEdit className="h-4 w-4" />
            {t.sopList.filterModified}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.sopList.searchPlaceholder}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-slate-400 mr-2" />
          {[
            { key: 'ALL' as const, label: t.sopList.filterAll },
            { key: 'NEW' as const, label: t.sopList.filterNew },
            { key: 'MODIFIED' as const, label: t.sopList.filterModified },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === item.key
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SOP List */}
      {filteredSops.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t.sopList.noSops}</h3>
          <p className="text-slate-400 text-sm mb-6">{t.sopList.noSopsDesc}</p>
          {!search && filter === 'ALL' && (
            <Link href="/dashboard/sop/new" className="btn-primary inline-flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              {t.sopList.generateFirst}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSops.map(sop => (
            <div
              key={sop.id}
              className="glass-card-hover p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
