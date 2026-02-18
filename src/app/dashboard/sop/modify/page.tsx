'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, FileText, X, Loader2, Sparkles, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ModifySOPPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [uploadedContent, setUploadedContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [problems, setProblems] = useState('');
  const [additionalReq, setAdditionalReq] = useState('');
  const [loading, setLoading] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileName(file.name);
    setParseLoading(true);
    try {
      if (
        file.type === 'application/pdf' ||
        file.name.endsWith('.pdf') ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword' ||
        file.name.endsWith('.docx') ||
        file.name.endsWith('.doc')
      ) {
        // Store file reference for FormData upload
        setUploadedFile(file);
        setUploadedContent(`[File: ${file.name}]`);
      } else {
        const text = await file.text();
        setUploadedContent(text);
        setUploadedFile(null);
      }
    } catch {
      setUploadedContent(
        `[File: ${file.name}] - Could not parse file. Please paste the SOP content manually below.`
      );
    } finally {
      setParseLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
  });

  const handleSubmit = async () => {
    if ((!uploadedContent.trim() && !uploadedFile) || !problems.trim()) return;
    setLoading(true);
    try {
      // Use FormData to avoid JSON body size limits on Vercel
      const formData = new FormData();
      formData.append('type', 'MODIFIED');
      formData.append('problems', problems);
      formData.append('additionalReq', additionalReq || '');
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      } else {
        formData.append('uploadedSOPContent', uploadedContent);
      }

      const res = await fetch('/api/sop', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/dashboard/sop/${data.sop.id}`);
      } else {
        const errCode = data.error;
        if (errCode === 'NO_API_KEY') {
          alert(t.apiErrors.noApiKey);
        } else if (errCode === 'API_LIMIT_REACHED') {
          alert(t.apiErrors.limitReached);
        } else if (errCode === 'INVALID_API_KEY') {
          alert(t.apiErrors.invalidKey);
        } else {
          alert(data.message || 'Failed to modify SOP');
        }
      }
    } catch {
      alert('An error occurred while modifying the SOP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{t.modifySop.title}</h1>
          <p className="text-sm text-slate-400">{t.modifySop.subtitle}</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Upload className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{t.modifySop.uploadLabel}</h2>
            <p className="text-sm text-slate-400">{t.modifySop.uploadDesc}</p>
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          {parseLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
              <p className="text-slate-300">{t.common.loading}</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">{fileName}</p>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setFileName('');
                  setUploadedContent('');
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                {t.common.delete}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Upload className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-white font-medium">{t.modifySop.dropHere}</p>
                <p className="text-sm text-slate-400">{t.modifySop.supportedFormats}</p>
              </div>
            </div>
          )}
        </div>

        {/* Only show manual paste textarea when NO file is uploaded */}
        {!fileName && (
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {t.modifySop.orUpload}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <textarea
              value={uploadedContent}
              onChange={e => setUploadedContent(e.target.value)}
              className="textarea-field min-h-50"
              placeholder={t.modifySop.uploadPlaceholder}
            />
          </div>
        )}
      </div>

      {/* Problems Section */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t.modifySop.problemsLabel} <span className="text-red-400">*</span>
            </h2>
          </div>
        </div>
        <textarea
          value={problems}
          onChange={e => setProblems(e.target.value)}
          className="textarea-field min-h-37.5"
          placeholder={t.modifySop.problemsPlaceholder}
        />
      </div>

      {/* Additional Requirements */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Plus className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t.modifySop.additionalLabel}{' '}
              <span className="text-slate-500 text-sm font-normal">(Optional)</span>
            </h2>
          </div>
        </div>
        <textarea
          value={additionalReq}
          onChange={e => setAdditionalReq(e.target.value)}
          className="textarea-field min-h-30"
          placeholder={t.modifySop.additionalPlaceholder}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t.common.previous}
        </Link>
        <button
          onClick={handleSubmit}
          disabled={loading || !uploadedContent.trim() || !problems.trim()}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.modifySop.modifying}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {t.modifySop.submitBtn}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
