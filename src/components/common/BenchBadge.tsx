import React from 'react';
import clsx from 'clsx';
import { SignalState } from '../../types';

interface BenchBadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'high' | 'low' | 'danger' | 'accent' | 'warning' | 'neutral';
  signal?: SignalState;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const BenchBadge: React.FC<BenchBadgeProps> = ({
  children,
  variant = 'default',
  signal,
  size = 'sm',
  className = '',
  dot = false,
}) => {
  // Infer variant if signal is passed directly
  let computedVariant = variant;
  if (signal !== undefined) {
    computedVariant = signal === 1 ? 'high' : signal === 0 ? 'low' : 'warning';
  }

  const variantStyles = {
    default: 'bg-[#1D2125] text-[#ECEBE4] border-[#282E33]',
    high: 'bg-[#3DDCFF]/10 text-[#3DDCFF] border-[#3DDCFF]/30 font-bold',
    low: 'bg-[#525C64]/10 text-[#9CA3A8] border-[#525C64]/30',
    danger: 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/30',
    accent: 'bg-[#C6FF3D]/10 text-[#C6FF3D] border-[#C6FF3D]/30 font-semibold',
    warning: 'bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/30',
    neutral: 'bg-[#16191C] text-[#646F77] border-[#282E33]',
  };

  const dotColors = {
    default: 'bg-[#ECEBE4]',
    high: 'bg-[#3DDCFF] shadow-glow-cyan',
    low: 'bg-[#525C64]',
    danger: 'bg-[#FF4D4D] animate-pulse',
    accent: 'bg-[#C6FF3D] shadow-glow-accent',
    warning: 'bg-[#FFB020]',
    neutral: 'bg-[#646F77]',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-mono uppercase tracking-wider rounded border',
        sizeStyles[size],
        variantStyles[computedVariant],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[computedVariant])} />}
      {children ? (
        children
      ) : signal !== undefined ? (
        signal === 1 ? 'HIGH (1)' : signal === 0 ? 'LOW (0)' : 'UNDEF (?)'
      ) : null}
    </span>
  );
};

interface BenchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface' | 'elevated' | 'glass';
  isInteractive?: boolean;
}

export const BenchCard: React.FC<BenchCardProps> = ({
  children,
  variant = 'surface',
  isInteractive = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-[#16191C] border-[#282E33]',
    elevated: 'bg-[#1D2125] border-[#282E33]',
    glass: 'bg-[#16191C]/80 backdrop-blur-md border-[#282E33]',
  };

  return (
    <div
      className={clsx(
        'rounded-instrument border p-5 transition-all duration-200',
        variantStyles[variant],
        isInteractive && 'hover:border-[#525C64] hover:bg-[#1D2125]/80 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
