import assert from 'node:assert';
import { getFrontendEnv } from '../../lib/env';

/**
 * @file tests/unit/envResolution.test.ts
 * @description Unit tests for frontend environment variable resolution and URL normalization.
 */

export async function runEnvResolutionTests(): Promise<void> {
  const originalEnv = { ...process.env };

  try {
    console.log('  ▸ Environment Resolution: normalized /api suffix...');
    {
      process.env.NEXT_PUBLIC_API_URL = 'https://loop-intelligence.vercel.app';
      const env = getFrontendEnv();
      assert.strictEqual(
        env.apiUrl,
        'https://loop-intelligence.vercel.app/api',
        'Should append /api if missing'
      );
    }

    console.log('  ▸ Environment Resolution: preserves existing /api path...');
    {
      process.env.NEXT_PUBLIC_API_URL = 'https://loop-intelligence.vercel.app/api';
      const env = getFrontendEnv();
      assert.strictEqual(
        env.apiUrl,
        'https://loop-intelligence.vercel.app/api',
        'Should not duplicate /api'
      );
    }

    console.log('  ▸ Environment Resolution: trims trailing slashes...');
    {
      process.env.NEXT_PUBLIC_API_URL = 'https://loop-intelligence.vercel.app/api///';
      const env = getFrontendEnv();
      assert.strictEqual(
        env.apiUrl,
        'https://loop-intelligence.vercel.app/api',
        'Should strip extraneous trailing slashes'
      );
    }

    console.log('  ▸ Environment Resolution: default localhost fallback...');
    {
      delete process.env.NEXT_PUBLIC_API_URL;
      const env = getFrontendEnv();
      assert.strictEqual(
        env.apiUrl,
        'http://localhost:3000/api',
        'Should provide local backend fallback when unset'
      );
    }
  } finally {
    process.env = originalEnv;
  }
}

if (process.argv[1] && process.argv[1].endsWith('envResolution.test.ts')) {
  runEnvResolutionTests().then(() => console.log('✔ Environment resolution unit tests passed'));
}
