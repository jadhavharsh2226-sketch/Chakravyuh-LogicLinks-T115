import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'terminal';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BenchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const BenchButton: React.FC<BenchButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-mono font-medium rounded-bench transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#C6FF3D] active:scale-[0.98] select-none disabled:opacity-40 disabled:pointer-events-none tracking-tight';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 h-7',
    md: 'text-xs px-3.5 py-1.5 gap-2 h-9',
    lg: 'text-sm px-5 py-2.5 gap-2.5 h-11',
  };

  const variantClasses = {
    primary:
      'bg-[#C6FF3D] text-[#0E1012] font-semibold hover:bg-[#b8f533] border border-[#C6FF3D] shadow-sm',
    accent:
      'bg-[#3DDCFF] text-[#0E1012] font-semibold hover:bg-[#2fc5e5] border border-[#3DDCFF]',
    secondary:
      'bg-[#16191C] text-[#ECEBE4] hover:bg-[#1D2125] hover:text-white border border-[#282E33] hover:border-[#525C64]',
    ghost:
      'bg-transparent text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#16191C] border border-transparent',
    danger:
      'bg-[#FF4D4D]/10 text-[#FF4D4D] hover:bg-[#FF4D4D]/20 border border-[#FF4D4D]/30',
    terminal:
      'bg-[#0E1012] text-[#3DDCFF] font-mono border border-[#3DDCFF]/40 hover:border-[#3DDCFF] hover:bg-[#3DDCFF]/10',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
