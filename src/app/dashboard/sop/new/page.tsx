'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Users,
  ListOrdered,
  Wrench,
  Shield,
  AlertTriangle,
  Target,
  GitBranch,
  GraduationCap,
  Loader2,
  Sparkles,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewSOPPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    purpose: '',
    progressStartEnd: '',
    scope: '',
    stakeholders: '',
    responsibility: '',
    approvalAuthority: '',
    stepByStep: '',
    decisionPoints: '',
    tools: '',
    referenceDocuments: '',
    complianceStandards: '',
    dosAndDonts: '',
    risks: '',
    controls: '',
    expectedOutput: '',
    kpiMetrics: '',
    versionNo: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    reviewCycle: '',
    revisionHistory: '',
    trainingMethod: '',
    inductionProcess: '',
    updateNotification: '',
  });

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 8000);
  };

  const steps = [
    {
      id: 1,
      title: t.newSop.steps.processInfo.title,
      icon: Building2,
      desc: t.newSop.steps.processInfo.desc,
    },
    {
      id: 2,
      title: t.newSop.steps.stakeholders.title,
      icon: Users,
      desc: t.newSop.steps.stakeholders.desc,
    },
    {
      id: 3,
      title: t.newSop.steps.procedures.title,
      icon: ListOrdered,
      desc: t.newSop.steps.procedures.desc,
    },
    { id: 4, title: t.newSop.steps.tools.title, icon: Wrench, desc: t.newSop.steps.tools.desc },
    {
      id: 5,
      title: t.newSop.steps.compliance.title,
      icon: Shield,
      desc: t.newSop.steps.compliance.desc,
    },
    {
      id: 6,
      title: t.newSop.steps.risks.title,
      icon: AlertTriangle,
      desc: t.newSop.steps.risks.desc,
    },
    { id: 7, title: t.newSop.steps.kpis.title, icon: Target, desc: t.newSop.steps.kpis.desc },
    {
      id: 8,
      title: t.newSop.steps.versionControl.title,
      icon: GitBranch,
      desc: t.newSop.steps.versionControl.desc,
    },
    {
      id: 9,
      title: t.newSop.steps.training.title,
      icon: GraduationCap,
      desc: t.newSop.steps.training.desc,
    },
  ];

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const f = t.newSop.fields;

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.businessName.trim() &&
          formData.businessType.trim() &&
          formData.purpose.trim() &&
          formData.progressStartEnd.trim() &&
          formData.scope.trim()
        );
      case 2:
        return !!(
          formData.stakeholders.trim() &&
          formData.responsibility.trim() &&
          formData.approvalAuthority.trim()
        );
      case 3:
        return !!(formData.stepByStep.trim() && formData.decisionPoints.trim());
      case 4:
        return !!(formData.tools.trim() && formData.referenceDocuments.trim());
      case 5:
        return !!(formData.complianceStandards.trim() && formData.dosAndDonts.trim());
      case 6:
        return !!(formData.risks.trim() && formData.controls.trim());
      case 7:
        return !!(formData.expectedOutput.trim() && formData.kpiMetrics.trim());
      case 8:
        return !!(
          formData.versionNo.trim() &&
          formData.effectiveDate.trim() &&
          formData.reviewCycle.trim() &&
          formData.revisionHistory.trim()
        );
      case 9:
        return !!(
          formData.trainingMethod.trim() &&
          formData.inductionProcess.trim() &&
          formData.updateNotification.trim()
        );
      default:
        return true;
    }
  };

  const isFormComplete = (): boolean => Object.values(formData).every(val => val.trim() !== '');

  const handleSubmit = async () => {
    if (!isFormComplete()) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'NEW' }),
      });

      // Handle non-streaming error responses (e.g., 401, 400)
      if (!res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        const errCode = data.error;
        if (errCode === 'NO_API_KEY') {
          showError(t.apiErrors.noApiKey);
        } else if (errCode === 'API_LIMIT_REACHED') {
          showError(t.apiErrors.limitReached);
        } else if (errCode === 'INVALID_API_KEY') {
          showError(t.apiErrors.invalidKey);
        } else {
          showError(data.message || 'Failed to generate SOP. Please try again.');
        }
        return;
      }

      // Read the streaming response
      const reader = res.body?.getReader();
      if (!reader) {
        showError('Failed to read response stream.');
        return;
      }

      const decoder = new TextDecoder();
      let fullText = '';
      let sopId = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });

        // Extract SOP ID from the first line (sent immediately by the server)
        if (!sopId) {
          const idMatch = fullText.match(/^__SOP_ID__:(.+)\n/);
          if (idMatch) {
            sopId = idMatch[1].trim();
          }
        }
      }

      // Check for error in stream
      if (fullText.includes('__ERROR__:')) {
        const errorMatch = fullText.match(/__ERROR__:(\w+)/);
        const errCode = errorMatch?.[1] || 'GENERATION_FAILED';
        if (errCode === 'API_LIMIT_REACHED') {
          showError(t.apiErrors.limitReached);
        } else if (errCode === 'INVALID_API_KEY') {
          showError(t.apiErrors.invalidKey);
        } else {
          showError('Failed to generate SOP. Please try again.');
        }
        return;
      }

      // Navigate to the SOP page
      if (sopId) {
        // Extract just the AI-generated content (strip the SOP ID header and stream markers)
        const generatedContent = fullText
          .replace(/^__SOP_ID__:.+\n/, '')
          .replace(/\n__STREAM_DONE__$/, '')
          .replace(/\n__ERROR__:.+$/, '')
          .trim();

        // Save the generated content to DB via a separate PATCH request
        if (generatedContent) {
          try {
            await fetch(`/api/sop/${sopId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ generatedContent }),
            });
          } catch {
            // Content save failed — user can still view/edit on the SOP page
            console.error('Failed to save SOP content');
          }
        }

        router.push(`/dashboard/sop/${sopId}`);
      } else {
        showError('SOP was generated but could not be saved. Please try again.');
      }
    } catch {
      showError('A network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    field: string,
    placeholder: string,
    isTextarea = false,
    extraClass = ''
  ) => (
    <div>
      <label className="form-label">
        {label} <span className="text-red-400">*</span>
      </label>
      {isTextarea ? (
        <textarea
          value={formData[field as keyof typeof formData]}
          onChange={e => updateField(field, e.target.value)}
          className={`textarea-field ${extraClass}`}
          placeholder={placeholder}
          required
        />
      ) : (
        <input
          type={field === 'effectiveDate' ? 'date' : 'text'}
          value={formData[field as keyof typeof formData]}
          onChange={e => updateField(field, e.target.value)}
          className={`input-field ${extraClass}`}
          placeholder={placeholder}
          required
        />
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            {renderField(f.businessName, 'businessName', f.businessNamePlaceholder)}
            {renderField(f.businessType, 'businessType', f.businessTypePlaceholder)}
            {renderField(f.purpose, 'purpose', f.purposePlaceholder, true)}
            {renderField(
              f.progressStartEnd,
              'progressStartEnd',
              f.progressStartEndPlaceholder,
              true
            )}
            {renderField(f.scope, 'scope', f.scopePlaceholder)}
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            {renderField(f.stakeholders, 'stakeholders', f.stakeholdersPlaceholder, true)}
            {renderField(f.responsibility, 'responsibility', f.responsibilityPlaceholder, true)}
            {renderField(
              f.approvalAuthority,
              'approvalAuthority',
              f.approvalAuthorityPlaceholder,
              true
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            {renderField(
              f.stepByStep,
              'stepByStep',
              f.stepByStepPlaceholder,
              true,
              'min-h-[200px]'
            )}
            {renderField(f.decisionPoints, 'decisionPoints', f.decisionPointsPlaceholder, true)}
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            {renderField(f.tools, 'tools', f.toolsPlaceholder, true)}
            {renderField(
              f.referenceDocuments,
              'referenceDocuments',
              f.referenceDocumentsPlaceholder,
              true
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-5">
            {renderField(
              f.complianceStandards,
              'complianceStandards',
              f.complianceStandardsPlaceholder,
              true
            )}
            {renderField(f.dosAndDonts, 'dosAndDonts', f.dosAndDontsPlaceholder, true)}
          </div>
        );
      case 6:
        return (
          <div className="space-y-5">
            {renderField(f.risks, 'risks', f.risksPlaceholder, true)}
            {renderField(f.controls, 'controls', f.controlsPlaceholder, true)}
          </div>
        );
      case 7:
        return (
          <div className="space-y-5">
            {renderField(f.expectedOutput, 'expectedOutput', f.expectedOutputPlaceholder, true)}
            {renderField(f.kpiMetrics, 'kpiMetrics', f.kpiMetricsPlaceholder, true)}
          </div>
        );
      case 8:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {renderField(f.versionNo, 'versionNo', f.versionNoPlaceholder)}
              {renderField(f.effectiveDate, 'effectiveDate', '')}
            </div>
            {renderField(f.reviewCycle, 'reviewCycle', f.reviewCyclePlaceholder)}
            {renderField(f.revisionHistory, 'revisionHistory', f.revisionHistoryPlaceholder, true)}
          </div>
        );
      case 9:
        return (
          <div className="space-y-5">
            {renderField(f.trainingMethod, 'trainingMethod', f.trainingMethodPlaceholder, true)}
            {renderField(
              f.inductionProcess,
              'inductionProcess',
              f.inductionProcessPlaceholder,
              true
            )}
            {renderField(
              f.updateNotification,
              'updateNotification',
              f.updateNotificationPlaceholder,
              true
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {/* Generation Progress Bar */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-100 h-1.5 bg-slate-900">
          <div className="h-full bg-linear-to-right from-violet-500 via-fuchsia-500 to-indigo-500 bg-size-[200%_100%] animate-gradient-x animate-progress-glow relative">
            <div className="absolute inset-0 shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-violet-300 uppercase tracking-widest flex items-center gap-2 shadow-2xl">
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating your professional SOP...
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 animate-in fade-in slide-in-from-top-2">
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
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{t.newSop.title}</h1>
          <p className="text-sm text-slate-400">{t.newSop.subtitle}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-card p-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                currentStep === step.id
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : currentStep > step.id
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === step.id
                    ? 'bg-violet-500 text-white'
                    : currentStep > step.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-slate-500'
                }`}
              >
                {currentStep > step.id ? <Check className="h-3 w-3" /> : step.id}
              </div>
              <span className="hidden sm:inline">{step.title}</span>
              {i < steps.length - 1 && <div className="w-4 h-px bg-white/10 ml-1" />}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          {(() => {
            const StepIcon = steps[currentStep - 1].icon;
            return (
              <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <StepIcon className="h-5 w-5 text-violet-400" />
              </div>
            );
          })()}
          <div>
            <h2 className="text-lg font-semibold text-white">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-slate-400">{steps[currentStep - 1].desc}</p>
          </div>
        </div>

        {renderStepContent()}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.previous}
          </button>
          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormComplete()}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.newSop.generating}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t.newSop.generateBtn}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
              disabled={!isStepValid()}
              className="btn-primary flex items-center gap-2"
            >
              {t.common.next}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
