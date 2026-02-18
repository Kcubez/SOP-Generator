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
      if (res.ok) router.push('/dashboard/sops');
    } catch {
      alert('Failed to delete SOP');
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
      alert('Failed to save title');
    } finally {
      setAutoSaving(false);
      setEditingTitle(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current || !sop) return;
    setDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const container = document.createElement('div');
      container.innerHTML = printRef.current.innerHTML;
      container.style.cssText = `
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        color: #1e293b;
        line-height: 1.7;
        padding: 40px 30px;
        background: white;
        font-size: 11pt;
        max-width: 100%;
      `;

      container.querySelectorAll('h1').forEach(el => {
        (el as HTMLElement).style.cssText =
          "font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 18pt; font-weight: 700; color: #0f172a; border-bottom: 2px solid #6366f1; padding-bottom: 8px; margin-bottom: 16px; margin-top: 0;";
      });
      container.querySelectorAll('h2').forEach(el => {
        (el as HTMLElement).style.cssText =
          "font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 14pt; font-weight: 600; color: #1e293b; margin-top: 20px; margin-bottom: 10px; border-left: 3px solid #8b5cf6; padding-left: 10px;";
      });
      container.querySelectorAll('h3').forEach(el => {
        (el as HTMLElement).style.cssText =
          "font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 12pt; font-weight: 600; color: #334155; margin-top: 16px; margin-bottom: 8px;";
      });
      container.querySelectorAll('p').forEach(el => {
        (el as HTMLElement).style.cssText =
          "font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; margin-bottom: 8px; color: #475569; font-size: 11pt; line-height: 1.7;";
      });
      container.querySelectorAll('table').forEach(table => {
        (table as HTMLElement).style.cssText =
          'width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; table-layout: fixed; page-break-inside: avoid;';
      });
      container.querySelectorAll('th').forEach(th => {
        (th as HTMLElement).style.cssText =
          "background-color: #4338ca !important; color: #ffffff !important; padding: 8px 12px; text-align: left; font-weight: 600; font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 10pt;";
      });
      container.querySelectorAll('td').forEach(td => {
        (td as HTMLElement).style.cssText =
          "padding: 6px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 10pt; word-wrap: break-word;";
      });
      container.querySelectorAll('li').forEach(li => {
        (li as HTMLElement).style.cssText =
          "font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.7; color: #475569; margin-bottom: 4px;";
      });

      const fileName = (editedTitle || sop.title)
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 60);

      const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          width: 794,
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(container).save();
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

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

  if (!sop) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">SOP not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/sops"
              className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 min-w-0">
              {/* Editable Title */}
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
                    className="flex-1 text-xl sm:text-2xl font-bold text-white bg-white/5 border border-violet-500/50 rounded-lg px-3 py-1.5 outline-none focus:border-violet-400 transition-colors"
                  />
                  <button
                    onClick={handleSaveTitle}
                    disabled={autoSaving}
                    className="h-9 w-9 shrink-0 rounded-lg bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-colors"
                  >
                    {autoSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditedTitle(sop.title);
                      setEditingTitle(false);
                    }}
                    className="h-9 w-9 shrink-0 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="group flex items-start gap-2">
                  <h1
                    className="text-xl sm:text-2xl font-bold text-white leading-snug cursor-pointer hover:text-violet-300 transition-colors"
                    onClick={() => setEditingTitle(true)}
                    title={t.sopDetail.clickToEdit}
                  >
                    {sop.title}
                  </h1>
                  <button
                    onClick={() => setEditingTitle(true)}
                    className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-violet-400"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(sop.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {sop.user.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sop.type === 'NEW'
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {sop.type === 'NEW' ? 'New' : 'Modified'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pl-14">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t.sopDetail.downloadPdf}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="btn-danger flex items-center gap-2 text-sm px-5 py-2.5"
            >
              <Trash2 className="h-4 w-4" />
              {t.common.delete}
            </button>
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
