'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { BlurFade } from '@/components/ui/BlurFade';

export default function CancelPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
      <BlurFade delay={0.1}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white mb-4">
            Checkout cancelled
          </h1>
          <p className="text-muted-foreground mb-8">
            No worries! You can come back anytime when you&apos;re ready to host your portfolio.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/pricing">
              <Button className="w-full h-12 text-base font-medium bg-white text-black hover:bg-white/90 rounded-lg shadow-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]">
                Back to Pricing
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full h-12 text-base">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
