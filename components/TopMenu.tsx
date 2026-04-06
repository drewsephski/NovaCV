import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function TopMenu() {
  return (
    <>
      <header className="w-full py-5 px-6 md:px-12 flex justify-between items-center max-w-6xl mx-auto h-[72px]">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-semibold tracking-tight text-white group-hover:text-white/80 transition-colors duration-200">
            NovaCV
          </span>
        </Link>

        <div className="flex items-center">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonTrigger: 'focus:shadow-none focus:ring-0',
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <div className="flex flex-row gap-3">
              <Link href="/upload">
                <Button
                  variant="default"
                  className="text-sm font-medium py-2 px-5 bg-white text-black hover:bg-white/90 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </header>
    </>
  );
}
