'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export function TopMenu() {
  const pathname = usePathname();
  
  return (
    <header className="w-full py-6 px-8 md:px-16 lg:px-24 flex justify-between items-center max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#666] transition-colors duration-200">
        <span className="text-xl font-light tracking-tight">
          Nova<span className="font-normal italic">CV</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <SignedIn>
          <Link 
            href="/dashboard" 
            className="text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            Dashboard
          </Link>
          <UserButton
            appearance={{
              elements: {
                userButtonTrigger: 'focus:shadow-none focus:ring-0',
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <Link 
            href="/upload"
            className="text-xs uppercase tracking-[0.15em] text-[#666] hover:text-[#1a1a1a] transition-colors"
          >
            Get Started
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}
