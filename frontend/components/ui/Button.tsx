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
    primary: 'skeuo-button-primary',
    secondary: 'skeuo-button-secondary',
    outline: 'bg-[#FFFFE3] text-[#4A4A4A] border border-[#CBCBCB] hover:bg-[#F4F4D6] shadow-sm active:translate-y-[1px]',
    danger: 'bg-[#8C3A3A] text-[#FFFFE3] border border-[#AA4F4F] shadow-sm hover:bg-[#732F2F] active:translate-y-[1px]'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-md gap-2',
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
