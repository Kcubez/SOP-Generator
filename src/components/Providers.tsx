'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ToastContainer from '@/components/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
        <ToastContainer />
      </LanguageProvider>
    </SessionProvider>
  );
}
