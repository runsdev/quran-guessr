import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { Inter, Scheherazade_New } from 'next/font/google';
import { Toaster } from 'sonner';

import MaterialSymbolsLoader from './components/MaterialSymbolsLoader';
import SessionProvider from './components/providers/SessionProvider';
import ThemeProvider from './components/providers/ThemeProvider';

import { auth } from '@/auth';

import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quranguessr.com';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '600', '700'],
  display: 'swap',
});

const scheherazadeNew = Scheherazade_New({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-scheherazade',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Quran Guessr — Test Your Knowledge of the Holy Quran',
    template: '%s | Quran Guessr',
  },
  description:
    'Interactive Quran quizzes on verse location, missing words, and sequence — for every level. Challenge yourself and climb the leaderboard.',
  keywords: [
    'Quran',
    'quiz',
    'Islamic',
    'Quran game',
    'verse location',
    'missing word',
    'Quran trivia',
    'learn Quran',
    'Quran challenge',
  ],
  authors: [{ name: 'Quran Guessr' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Quran Guessr',
    title: 'Quran Guessr — Test Your Knowledge of the Holy Quran',
    description:
      'Interactive Quran quizzes on verse location, missing words, and sequence — for every level.',
    images: [{ url: '/quran-hero.jpg', width: 1200, height: 630, alt: 'Quran Guessr' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quran Guessr — Test Your Knowledge of the Holy Quran',
    description:
      'Interactive Quran quizzes on verse location, missing words, and sequence — for every level.',
    images: ['/quran-hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
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
        <meta
          name="google-site-verification"
          content="ugY-qC7oXMg5tU6qAy3jb3F70tAmhio1uWMoy2rpICQ"
        />
        <GoogleTagManager gtmId="GTM-5B2K62HZ" />
        <GoogleAnalytics gaId="G-GNR9C7CWZ3" />
      </head>
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
