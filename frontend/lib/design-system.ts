/**
 * PROJECT LOOP — Centralized Design System
 * 
 * Strict BLACK + WHITE monochrome visual identity for all UI elements.
 * Analytics charts are the sole exception for controlled data visualization.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Monochromatic Canvas & Surfaces
    canvas: '#FFFFFF',
    surface: '#FAFAFA',
    surfaceSubtle: '#F4F4F5',
    surfaceMuted: '#ECECED',
    surfaceDark: '#09090B',
    surfaceDarkElevated: '#18181B',

    // Monochromatic Borders
    borderSubtle: '#E4E4E7',
    borderDefault: '#D4D4D8',
    borderStrong: '#18181B',
    borderBlack: '#000000',

    // Monochromatic Typography
    textPrimary: '#09090B',
    textSecondary: '#52525B',
    textMuted: '#71717A',
    textLight: '#A1A1AA',
    textInverted: '#FFFFFF',
  },

  // Controlled Analytics Color Palette (The ONLY allowed non-monochrome tokens)
  analytics: {
    sentiment: {
      positive: '#10B981',
      neutral: '#F59E0B',
      negative: '#EF4444',
    },
    series: {
      primary: '#2563EB',
      secondary: '#64748B',
      accent: '#06B6D4',
      dark: '#18181B',
    }
  },

  typography: {
    heading: 'font-heading tracking-tight font-bold text-neutral-900',
    titleLg: 'font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900',
    titleMd: 'font-heading text-lg sm:text-xl font-bold tracking-tight text-neutral-900',
    titleSm: 'font-heading text-sm sm:text-base font-semibold tracking-tight text-neutral-900',
    label: 'font-sans text-xs font-semibold uppercase tracking-wider text-neutral-500',
    subtext: 'font-sans text-xs sm:text-sm text-neutral-600',
    metadata: 'font-mono-numbers text-xs text-neutral-500',
    monoBadge: 'font-mono-numbers text-[10px] font-semibold uppercase tracking-wider',
  },

  transitions: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    interactive: 'transition-all duration-150 active:scale-[0.98]',
  }
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
