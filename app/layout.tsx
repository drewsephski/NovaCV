import type React from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';

export const metadata: Metadata = {
  metadataBase: new URL('https://self.so'),
  title: 'Self.so - Turn your LinkedIn into a website',
  description:
    'LinkedIn to Website in one click. Get a beautiful professional website instantly.',
  openGraph: {
    images: '/og.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <PlausibleProvider domain="self.so">
        <ReactQueryClientProvider>
          <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
            <body className={`${GeistSans.className} min-h-screen flex flex-col bg-background`}>
              <main className="flex-1 flex flex-col">{children}</main>
              <Toaster richColors position="bottom-center" />
            </body>
          </html>
        </ReactQueryClientProvider>
      </PlausibleProvider>
    </ClerkProvider>
  );
}
