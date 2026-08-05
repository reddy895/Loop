import React from 'react';
import { cn } from '@/lib/utils';

interface LoopLogoProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'cream';
}

export const LoopLogoIcon: React.FC<LoopLogoProps> = ({
  className,
  size = 32,
  variant = 'dark'
}) => {
  const colorMap = {
    dark: '#4A4A4A',
    light: '#FFFFE3',
    cream: '#FFFFE3'
  };

  const strokeColor = colorMap[variant] || colorMap.dark;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none', className)}
    >
      {/* Left Loop */}
      <path
        d="M 45 28 C 25 28 14 42 14 60 C 14 78 25 92 45 92 C 58 92 68 81 76 66 C 84 51 91 38 102 38 C 108 38 112 43 112 50"
        stroke={strokeColor}
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Right Interlocking Loop */}
      <path
        d="M 75 92 C 95 92 106 78 106 60 C 106 42 95 28 75 28 C 62 28 52 39 44 54 C 36 69 29 82 18 82 C 12 82 8 77 8 70"
        stroke={strokeColor}
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Intersecting Node Ring Overlay */}
      <circle
        cx="60"
        cy="60"
        r="14"
        stroke={strokeColor}
        strokeWidth="9"
      />
    </svg>
  );
};

export const LoopBrand: React.FC<{
  showTagline?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}> = ({ showTagline = true, variant = 'dark', className }) => {
  const textColor = variant === 'dark' ? 'text-[#4A4A4A]' : 'text-[#FFFFE3]';
  const taglineColor = variant === 'dark' ? 'text-[#4A4A4A]/70' : 'text-[#CBCBCB]/70';

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      <div className={cn(
        'p-2 rounded-xl border flex items-center justify-center shadow-md transition-all',
        variant === 'dark'
          ? 'bg-[#4A4A4A] border-[#CBCBCB] text-[#FFFFE3]'
          : 'bg-[#FFFFE3] border-[#4A4A4A]/20 text-[#4A4A4A]'
      )}>
        <LoopLogoIcon size={24} variant={variant === 'dark' ? 'light' : 'dark'} />
      </div>

      <div>
        <h1 className={cn('font-heading text-xl font-extrabold tracking-wider leading-none', textColor)}>
          LOOP
        </h1>
        {showTagline && (
          <span className={cn('text-[9px] uppercase font-mono-numbers tracking-widest block mt-1', taglineColor)}>
            Customer Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
