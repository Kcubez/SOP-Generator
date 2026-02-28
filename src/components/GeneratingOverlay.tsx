'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface GeneratingOverlayProps {
  type: 'new' | 'modify';
}

const MESSAGES = {
  new: [
    'Analyzing requirements...',
    'Structuring SOP framework...',
    'Writing procedures...',
    'Adding compliance standards...',
    'Generating KPIs & metrics...',
    'Finalizing your SOP...',
  ],
  modify: [
    'Reading existing SOP...',
    'Analyzing problems...',
    'Developing improvements...',
    'Rewriting sections...',
    'Generating recommendations...',
    'Finalizing document...',
  ],
};

export default function GeneratingOverlay({ type }: GeneratingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const messages = MESSAGES[type];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Progress paced for ~2 minutes to reach 90%
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 0.075));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Cycle messages every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const content = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative z-10 glass-card p-10 sm:p-14 flex flex-col items-center w-full max-w-md rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-fade-in">
        {/* Circular Progress */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(139, 92, 246, 0.12)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#progress-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-300 ease-out"
              style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }}
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="flex flex-col items-center gap-0.5">
            <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
            </svg>
            <span className="text-lg font-bold text-violet-300 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-400 font-medium mb-3 animate-fade-in" key={msgIndex}>
          {messages[msgIndex]}
        </p>

        {/* Bouncing dots */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce-dot"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce-dot"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce-dot"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
