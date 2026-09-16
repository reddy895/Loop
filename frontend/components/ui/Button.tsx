import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium font-sans cursor-pointer focus:outline-none transition-all duration-150 select-none';

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-neutral-800 border border-black shadow-xs active:scale-[0.98]',
    secondary: 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100 shadow-xs active:scale-[0.98]',
    outline: 'bg-transparent text-neutral-900 border border-neutral-300 hover:bg-neutral-100 active:scale-[0.98]',
    danger: 'bg-neutral-900 text-white border border-neutral-800 hover:bg-red-700 active:scale-[0.98]'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
