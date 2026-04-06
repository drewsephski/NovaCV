'use client';

import { useRef, useEffect, useState } from 'react';
import SplitType from 'split-type';

interface ScrollRevealTextProps {
  children: string;
  className?: string;
}

export function ScrollRevealText({ children, className = '' }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    // Clean up previous split
    if (splitRef.current) {
      splitRef.current.revert();
    }

    // Split text into words
    splitRef.current = new SplitType(textRef.current, {
      types: 'words',
      wordClass: 'word'
    });

    // Apply inline styles to each word for transition
    const words = textRef.current.querySelectorAll('.word');
    words.forEach((word, index) => {
      const el = word as HTMLElement;
      el.style.display = 'inline-block';
      el.style.opacity = '0.2';
      el.style.transform = 'translateY(8px)';
      el.style.transition = `opacity 600ms ease-out ${index * 50}ms, transform 600ms ease-out ${index * 50}ms`;
    });

    // Set up intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          words.forEach((word) => {
            const el = word as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="flex min-h-[70vh] justify-center items-center px-8 md:px-16 py-20"
    >
      <h2
        ref={textRef}
        className={`text-3xl sm:text-4xl lg:text-[3.25rem] xl:text-[3.5rem] font-light leading-[1.25] tracking-tight text-[#1a1a1a] text-center max-w-[65ch] ${className}`}
      >
        {children}
      </h2>
    </div>
  );
}