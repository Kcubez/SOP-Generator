'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Eye,
  Loader2,
  Calendar,
  User,
  Trash2,
  Pencil,
  X,
  AlertTriangle,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SOP {
  id: string;
  type: string;
  title: string;
  generatedContent: string;
  businessName: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

export default function SOPDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLanguage();
  const [sop, setSop] = useState<SOP | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 8000);
  };

  useEffect(() => {
    fetchSOP();
  }, [id]);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Set innerHTML only ONCE when sop data loads — never let React re-render this
  useEffect(() => {
    if (sop && printRef.current && !printRef.current.innerHTML.trim()) {
      printRef.current.innerHTML = sop.generatedContent;
    }
  }, [sop]);

  const fetchSOP = async () => {
    try {
      const res = await fetch(`/api/sop/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSop(data.sop);
        setEditedTitle(data.sop.title);
      } else router.push('/dashboard/sops');
    } catch {
      router.push('/dashboard/sops');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/sop/${id}`, { method: 'DELETE' });
      if (res.ok) router.push('/dashboard/sops?deleted=true');
    } catch {
      showError('Failed to delete SOP. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Auto-save function
  const autoSaveContent = useCallback(async () => {
    if (!printRef.current || !sop) return;
    setAutoSaving(true);
    setSaveStatus('saving');
    try {
      const updatedContent = printRef.current.innerHTML;
      const res = await fetch(`/api/sop/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedContent: updatedContent }),
      });
      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('idle');
      }
    } catch {
      setSaveStatus('idle');
    } finally {
      setAutoSaving(false);
    }
  }, [sop, id]);

  // Debounced content change handler
  const handleContentInput = useCallback(() => {
    // Clear previous timer
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    setSaveStatus('idle');

    // Set new timer — auto-save after 2 seconds of inactivity
    saveTimerRef.current = setTimeout(() => {
      autoSaveContent();
    }, 2000);
  }, [autoSaveContent]);

  const handleSaveTitle = async () => {
    if (!sop || editedTitle.trim() === '') return;
    if (editedTitle === sop.title) {
      setEditingTitle(false);
      return;
    }
    setAutoSaving(true);
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/sop/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle }),
      });
      if (res.ok) {
        const data = await res.json();
        setSop(data.sop);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      showError('Failed to save title. Please try again.');
    } finally {
      setAutoSaving(false);
      setEditingTitle(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current || !sop) return;
    setDownloading(true);
    try {
      const content = printRef.current.innerHTML;
      const title = editedTitle || sop.title;
      const date = new Date(sop.createdAt).toLocaleDateString();
      const business = sop.businessName || '';

      // Open a new window for printing
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        showError('Please allow pop-ups for this site to export PDF.');
        setDownloading(false);
        return;
      }

      printWindow.document.write(`<!DOCTYPE html>
<html lang="my">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ─── Base ──────────────────────────────────────── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Noto Sans Myanmar', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      line-height: 1.7;
      font-size: 11pt;
      background: #fff;
    }

    /* ─── Print Container ──────────────────────────── */
    .print-header {
      text-align: center;
      padding-bottom: 16px;
      margin-bottom: 20px;
      border-bottom: 3px solid #4338ca;
    }
    .print-header h1 {
      font-size: 18pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .print-header .meta {
      font-size: 9pt;
      color: #64748b;
      display: flex;
      justify-content: center;
      gap: 24px;
    }

    .print-content {
      padding: 0 10px;
    }

    /* ─── Typography ───────────────────────────────── */
    h1 {
      font-family: 'Noto Sans Myanmar', 'Inter', 'Segoe UI', system-ui, sans-serif;
      font-size: 17pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 8px;
      margin-bottom: 14px;
      margin-top: 0;
    }
    h2 {
      font-family: 'Noto Sans Myanmar', 'Inter', 'Segoe UI', system-ui, sans-serif;
      font-size: 13pt;
      font-weight: 600;
      color: #1e293b;
      margin-top: 18px;
      margin-bottom: 8px;
      border-left: 3px solid #8b5cf6;
      padding-left: 10px;
    }
    h3 {
      font-family: 'Noto Sans Myanmar', 'Inter', 'Segoe UI', system-ui, sans-serif;
      font-size: 11.5pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
    }
    p {
      margin-bottom: 7px;
      color: #475569;
      font-size: 11pt;
      line-height: 1.7;
    }
    strong { color: #1e293b; }

    /* ─── Tables ────────────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 10pt;
      table-layout: fixed;
      page-break-inside: auto;
    }
    tr { page-break-inside: avoid; page-break-after: auto; }
    thead { display: table-header-group; }
    th {
      background-color: #4338ca !important;
      color: #ffffff !important;
      padding: 8px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 10pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    td {
      padding: 6px 12px;
      border-bottom: 1px solid #d1d5db;
      color: #334155;
      font-size: 10pt;
      word-wrap: break-word;
    }
    tr:nth-child(even) {
      background: #f8fafc;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ─── Lists ─────────────────────────────────────── */
    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 10px;
    }
    li {
      font-size: 11pt;
      line-height: 1.7;
      color: #475569;
      margin-bottom: 3px;
    }

    /* ─── AI Suggestions Box ────────────────────────── */
    div[style*="background: #eff6ff"],
    div[style*="background:#eff6ff"] {
      background: #eff6ff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      page-break-inside: avoid;
    }

    /* ─── Print Settings ───────────────────────────── */
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-header { border-bottom-color: #4338ca !important; }
      th { background-color: #4338ca !important; color: #fff !important; }
      tr:nth-child(even) { background: #f8fafc !important; }
      h1 { border-bottom-color: #6366f1 !important; }
      h2 { border-left-color: #8b5cf6 !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-header">
    <h1 style="border-bottom: none; margin-bottom: 6px; padding-bottom: 0;">${title}</h1>
    <div class="meta">
      ${business ? '<span>Business: ' + business + '</span>' : ''}
      <span>Date: ${date}</span>
      <span>Generated by SOP Generator</span>
    </div>
  </div>
  <div class="print-content">
    ${content}
  </div>
  <script>
    // Wait for Google Fonts to fully load before printing
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function() {
        setTimeout(function() { window.print(); }, 400);
      });
    } else {
      // Fallback for older browsers
      window.onload = function() {
        setTimeout(function() { window.print(); }, 800);
      };
    }
  </script>
</body>
</html>`);

      printWindow.document.close();
    } catch (error) {
      console.error('PDF export error:', error);
      showError('Failed to open print dialog. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse" />
        </div>
        <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-150 bg-white/2 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!sop) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">SOP not found</p>
      </div>
    );
  }

  const displayBusinessName = sop.businessName || '-';
  const isContentEmpty = !sop.generatedContent || sop.generatedContent.trim() === '';

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Empty Content Warning */}
        {isContentEmpty && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
            <p className="text-sm flex-1">
              This SOP has no generated content. The content may not have been saved properly during
              generation. Please try generating the SOP again.
            </p>
          </div>
        )}
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
        {/* Header & Sticky Actions Row */}
        <div className="sticky top-16 z-30 pt-4 pb-2 -mt-4 bg-slate-900/60 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/dashboard/sops"
                className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="min-w-0">
                {editingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') {
                          setEditedTitle(sop.title);
                          setEditingTitle(false);
                        }
                      }}
                      className="text-lg sm:text-xl font-bold text-white bg-white/5 border border-violet-500/50 rounded-lg px-3 py-1 outline-none focus:border-violet-400"
                    />
                    <button
                      onClick={handleSaveTitle}
                      disabled={autoSaving}
                      className="h-8 w-8 rounded-lg bg-violet-600 text-white flex items-center justify-center"
                    >
                      {autoSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <h1
                    className="text-lg sm:text-xl font-bold text-white truncate cursor-pointer hover:text-violet-300"
                    onClick={() => setEditingTitle(true)}
                  >
                    {sop.title}
                  </h1>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading || isContentEmpty}
                className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/20"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{t.sopDetail.downloadPdf}</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="h-10 w-10 shrink-0 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6">
          <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5" />
          <div className="relative z-10 flex flex-wrap items-center gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {t.dashboard.stats?.total || 'SOP Type'}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${sop.type === 'NEW' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]'}`}
                />
                <p className="text-white font-semibold">
                  {sop.type === 'NEW' ? 'New Document' : 'Modified Content'}
                </p>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block" />

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Business Name
              </p>
              <p className="text-white font-semibold">{displayBusinessName}</p>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block" />

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Created Date
              </p>
              <div className="flex items-center gap-2 text-white font-semibold">
                <Calendar className="h-4 w-4 text-slate-400" />
                {new Date(sop.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block" />

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Generator
              </p>
              <div className="flex items-center gap-2 text-white font-semibold">
                <div className="h-5 w-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] text-violet-400 uppercase">
                  {sop.user.name.charAt(0)}
                </div>
                {sop.user.name}
              </div>
            </div>
          </div>
        </div>

        {/* SOP Preview (Editable with Auto-save) */}
        <div className="glass-card p-2 sm:p-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-slate-300">
                {t.sopDetail.generatedDocument}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Auto-save status indicator */}
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1.5 text-xs text-yellow-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t.sopDetail.autoSaving}
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <Check className="h-3 w-3" />
                  {t.sopDetail.saved}
                </span>
              )}
              {saveStatus === 'idle' && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Pencil className="h-3 w-3" />
                  <span>{t.sopDetail.clickToEdit}</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div
              ref={printRef}
              className="sop-preview"
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentInput}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{t.sopDetail.deleteSop}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {t.sopDetail.confirmDelete}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors flex items-center gap-2"
              >
                {deleting ? (
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
    </>
  );
}
