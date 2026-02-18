import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SOP Generator - Professional Standard Operating Procedures',
  description:
    'Generate professional Standard Operating Procedures (SOPs) with AI. Create new SOPs or modify existing ones with intelligent analysis and recommendations.',
  keywords: ['SOP', 'Standard Operating Procedure', 'generator', 'AI', 'business'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
