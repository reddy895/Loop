/**
 * @file frontend/lib/env.ts
 * @description Safe, production-ready environment variable reader and validator for Next.js.
 * Validates public URLs while providing safe defaults for standalone preview deployments.
 */

export interface FrontendEnv {
  apiUrl: string;
  appUrl: string;
  isProduction: boolean;
}

export function getFrontendEnv(): FrontendEnv {
  const isProduction = process.env.NODE_ENV === 'production';
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
  let apiUrl: string;
  if (rawApiUrl && rawApiUrl.trim()) {
    const cleanApiUrl = rawApiUrl.trim().replace(/\/+$/, '');
    apiUrl = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;
  } else if (typeof window !== 'undefined' && isProduction) {
    apiUrl = '/api';
  } else {
    apiUrl = 'http://localhost:3000/api';
  }

  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
  ).replace(/\/+$/, '');

  return Object.freeze({
    apiUrl,
    appUrl,
    isProduction,
  });
}

export const env = getFrontendEnv();
