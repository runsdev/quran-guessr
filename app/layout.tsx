import { GoogleTagManager } from '@next/third-parties/google';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { Inter, Scheherazade_New } from 'next/font/google';
import { Toaster } from 'sonner';

import MaterialSymbolsLoader from './components/MaterialSymbolsLoader';
import SessionProvider from './components/providers/SessionProvider';
import ThemeProvider from './components/providers/ThemeProvider';

import { auth } from '@/auth';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '600', '700'],
  display: 'optional',
});

const scheherazadeNew = Scheherazade_New({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-scheherazade',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quran Guessr',
  description: 'Test your knowledge of the Holy Quran',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${GeistMono.variable} ${inter.variable} ${scheherazadeNew.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://verses.quran.foundation" crossOrigin="anonymous" />
      </head>
      <GoogleTagManager gtmId="GTM-5B2K62HZ" />
      <GoogleTagManager gtmId="G-GNR9C7CWZ3" />
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SessionProvider session={session}>{children}</SessionProvider>
          <MaterialSymbolsLoader />
          <Toaster position="bottom-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
