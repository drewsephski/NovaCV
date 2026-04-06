'use client';

import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  external?: boolean;
}

export function EnhancedButton({
  href,
  onClick,
  children,
  icon: Icon = ArrowRight,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  external = false,
}: MagneticButtonProps) {
  const baseStyles = 'group relative inline-flex items-center gap-3 font-normal tracking-wide transition-all duration-300 overflow-hidden';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm',
  };

  const variantStyles = {
    primary: 'bg-[#1a1a1a] text-white hover:bg-[#333]',
    secondary: 'bg-white text-[#1a1a1a] border border-[#e5e5e5] hover:border-[#1a1a1a] hover:bg-[#faf9f7]',
    ghost: 'bg-transparent text-[#1a1a1a] hover:bg-[#f0f0f0]',
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`;

  const ButtonContent = () => (
    <>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
    </>
  );

  if (href) {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <Link href={href} {...linkProps}>
        <motion.button
          className={combinedClassName}
          disabled={disabled}
          transition={{ duration: 0.2 }}
        >
          <ButtonContent />
        </motion.button>
      </Link>
    );
  }

  return (
    <motion.button
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      transition={{ duration: 0.2 }}
    >
      <ButtonContent />
    </motion.button>
  );
}

interface IconButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IconButton({
  onClick,
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  className = '',
}: IconButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-300';

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const variantStyles = {
    primary: 'bg-[#1a1a1a] text-white hover:bg-[#333]',
    secondary: 'bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e5e5e5]',
    ghost: 'bg-transparent text-[#666] hover:text-[#1a1a1a] hover:bg-[#f0f0f0]',
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <motion.button
      className={combinedClassName}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label={label}
    >
      <Icon size={iconSizes[size]} strokeWidth={1.5} />
    </motion.button>
  );
}
