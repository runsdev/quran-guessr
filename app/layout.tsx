import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import SessionProvider from './components/providers/SessionProvider';

import { auth } from '@/auth';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '600', '700'],
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
    <html lang="en" className={`${GeistMono.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://verses.quran.foundation" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
