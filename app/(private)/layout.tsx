import type React from 'react';
import { TopMenu } from '../../components/TopMenu';
import { Footer } from '../../components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <TopMenu />
      <section className="flex-1 flex flex-col min-h-[calc(100vh-200px)]">
        {children}
      </section>
      <Footer />
    </div>
  );
}
