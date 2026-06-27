'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

let globalShowToast: ToastContextValue['showToast'] | null = null;

export function showToast(message: string, type: ToastType = 'info', duration: number = 5000) {
  if (globalShowToast) {
    globalShowToast(message, type, duration);
  }
}

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap = {
  error: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    text: 'text-red-300',
    icon: 'text-red-400',
    progress: 'bg-red-500',
  },
  success: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    icon: 'text-emerald-400',
    progress: 'bg-emerald-500',
  },
  info: {
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    icon: 'text-blue-400',
    progress: 'bg-blue-500',
  },
  warning: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    icon: 'text-amber-400',
    progress: 'bg-amber-500',
  },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    globalShowToast = (message: string, type: ToastType = 'info', duration: number = 5000) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    return () => {
      globalShowToast = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-[9999] flex flex-col gap-3 md:max-w-md pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration || 5000;
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const removeTimer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const Icon = iconMap[toast.type];
  const styles = styleMap[toast.type];

  return (
    <div
      className={`pointer-events-auto ${styles.bg} ${styles.border} border rounded-xl p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0 animate-in slide-in-from-right duration-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${styles.icon}`} />
        <p className={`text-sm flex-1 font-medium ${styles.text}`}>{toast.message}</p>
        <button
          onClick={handleClose}
          className={`shrink-0 ${styles.text} hover:text-white transition-colors`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Progress bar */}
      {toast.type !== 'error' && (
        <div className="mt-3 h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${styles.progress} rounded-full`}
            style={{
              animation: `shrink ${(toast.duration || 5000) / 1000}s linear forwards`,
            }}
          />
        </div>
      )}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
