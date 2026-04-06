'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface GrainOverlayProps {
  opacity?: number;
}

export function GrainOverlay({ opacity = 0.03 }: GrainOverlayProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  );
}

interface LineDecorationProps {
  className?: string;
  color?: string;
  animated?: boolean;
}

export function LineDecoration({
  className = '',
  color = 'rgba(26, 26, 26, 0.1)',
  animated = true,
}: LineDecorationProps) {
  return (
    <motion.div
      className={`h-px w-full ${className}`}
      style={{ backgroundColor: color }}
      initial={animated ? { scaleX: 0 } : { scaleX: 1 }}
      whileInView={animated ? { scaleX: 1 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

interface CornerAccentProps {
  className?: string;
  size?: number;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function CornerAccent({
  className = '',
  size = 40,
  color = 'rgba(26, 26, 26, 0.15)',
  position = 'top-left',
}: CornerAccentProps) {
  const getStyles = () => {
    switch (position) {
      case 'top-left':
        return { top: 0, left: 0, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` };
      case 'top-right':
        return { top: 0, right: 0, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` };
      case 'bottom-left':
        return { bottom: 0, left: 0, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` };
      case 'bottom-right':
        return { bottom: 0, right: 0, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` };
    }
  };

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        ...getStyles(),
      }}
    />
  );
}

interface DotGridProps {
  className?: string;
  dotSize?: number;
  gap?: number;
  color?: string;
  rows?: number;
  cols?: number;
}

export function DotGrid({
  className = '',
  dotSize = 3,
  gap = 24,
  color = 'rgba(26, 26, 26, 0.08)',
  rows = 6,
  cols = 6,
}: DotGridProps) {
  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${dotSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ backgroundColor: color, width: dotSize, height: dotSize }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: i * 0.02,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({
  children,
  className = '',
  amplitude = 10,
  duration = 4,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude / 2, amplitude / 2, -amplitude / 2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export function ScrollProgress({ className = '', color = '#1a1a1a' }: ScrollProgressProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className={`fixed top-0 left-0 right-0 h-[2px] origin-left z-50 ${className}`}
      style={{ scaleX, backgroundColor: color }}
    />
  );
}

interface RevealLineProps {
  className?: string;
  delay?: number;
  direction?: 'horizontal' | 'vertical';
  color?: string;
}

export function RevealLine({
  className = '',
  delay = 0,
  direction = 'horizontal',
  color = 'rgba(26, 26, 26, 0.1)',
}: RevealLineProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <motion.div
      className={className}
      style={{
        backgroundColor: color,
        height: isHorizontal ? 1 : '100%',
        width: isHorizontal ? '100%' : 1,
      }}
      initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}
