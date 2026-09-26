'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';
import { LoadingSkeleton } from '@/components/ui/FeedbackStates';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('praveen@acmesaas.com');
  const [password, setPassword] = useState('••••••••••••');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setIsPreparing(true);
        setTimeout(() => {
          router.push(redirectTarget);
        }, 750);
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Please verify corporate email and password.');
        setSubmitting(false);
      }
    } catch {
      setErrorMsg('An unexpected error occurred during authentication.');
      setSubmitting(false);
    }
  };

  if (isPreparing) {
    return (
      <Card variant="panel" className="p-8 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <LoopLogoIcon size={24} variant="light" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono-numbers tracking-widest font-bold text-neutral-400">
            AUTHENTICATION SUCCESSFUL
          </span>
          <h2 className="font-heading text-lg font-bold text-neutral-900">
            Preparing your workspace...
          </h2>
          <p className="text-xs text-neutral-500 font-sans">
            Validating RBAC roles and connecting to feedback intelligence corpus.
          </p>
        </div>
        <div className="w-48 h-1 bg-neutral-100 rounded-full overflow-hidden mx-auto">
          <div className="w-1/2 h-full bg-neutral-900 rounded-full animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="panel" className="p-6 sm:p-8 font-sans">
      <CardHeader className="text-center pb-5 space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="p-1.5 rounded-xl bg-neutral-900 text-white shadow-2xs">
            <LoopLogoIcon size={20} variant="light" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-wider text-neutral-950">
            PROJECT LOOP
          </span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back.</CardTitle>
        <CardDescription className="text-xs text-neutral-600">
          Sign in to access your private AI customer intelligence workspace
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-neutral-50 border-l-4 border-l-black text-neutral-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-neutral-900" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans">
              Corporate Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 font-sans">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline font-sans font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>

            <Link href="/signup" className="block w-full">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full justify-center"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-500 font-mono-numbers">
          Enterprise Session Protected by NextAuth & RBAC
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={4} />}>
      <LoginContent />
    </Suspense>
  );
}
