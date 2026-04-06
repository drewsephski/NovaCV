'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { BlurFade } from '@/components/ui/BlurFade';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // The webhook will handle updating the subscription status
      // We just wait a moment to ensure the webhook has processed
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setError('No session ID found');
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
        <Loader2 className="h-8 w-8 animate-spin text-white mb-4" />
        <p className="text-muted-foreground">Confirming your subscription...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-white mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/pricing">
            <Button variant="outline">Back to Pricing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
      <BlurFade delay={0.1}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-white mb-4">
            Welcome aboard!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your subscription is now active. You can now upload your resume and claim your custom subdomain.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/upload">
              <Button className="w-full h-12 text-base font-medium bg-white text-black hover:bg-white/90 rounded-lg shadow-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]">
                Upload Your Resume
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
        <Loader2 className="h-8 w-8 animate-spin text-white mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
