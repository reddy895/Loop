'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';
import { LoadingSkeleton } from '@/components/ui/FeedbackStates';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const tokenFromUrl = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token.trim()) {
      setErrorMsg('A valid password reset token is required.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Password reset token is invalid or expired.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred while resetting password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="panel" className="p-6 sm:p-8 font-sans">
      <CardHeader className="text-center pb-4 space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="p-1.5 rounded-xl bg-neutral-900 text-white shadow-2xs">
            <LoopLogoIcon size={20} variant="light" />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-wider text-neutral-950">
            PROJECT LOOP
          </span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Set New Password</CardTitle>
        <CardDescription className="text-xs text-neutral-600">
          Choose a secure password for your enterprise account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-neutral-50 border-l-4 border-l-red-600 text-neutral-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4 py-3 animate-in fade-in">
            <div className="inline-flex p-3 bg-neutral-900 rounded-2xl text-white border border-neutral-800 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-900">Password Updated</h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Your password has been securely updated. Redirecting to sign in...
            </p>
            <Link href="/login" className="inline-block pt-2">
              <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!tokenFromUrl && (
              <div>
                <label
                  htmlFor="token-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans"
                >
                  Reset Token
                </label>
                <input
                  id="token-input"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste 64-character token"
                  className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl px-3 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="new-password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="new-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl pl-9 pr-10 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-new-password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="confirm-new-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={submitting}
              className="w-full mt-2 justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Update Password
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-neutral-600 hover:text-neutral-900 hover:underline font-sans font-medium flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={4} />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
