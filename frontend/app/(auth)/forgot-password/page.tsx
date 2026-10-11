'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid corporate email address.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || 'Failed to dispatch password recovery instructions.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
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
        <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
        <CardDescription className="text-xs text-neutral-600">
          Enter your registered work email to receive password recovery instructions
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

        {submitted ? (
          <div className="text-center space-y-4 py-3 animate-in fade-in">
            <div className="inline-flex p-3 bg-neutral-900 rounded-2xl text-white border border-neutral-800 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-900">Recovery Link Sent</h3>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              If an enterprise account exists for{' '}
              <span className="font-bold text-neutral-900">{email}</span>, a secure time-limited password
              reset link has been dispatched to your inbox.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="inline-block">
                <Button variant="primary" size="md" className="w-full justify-center" icon={<ArrowLeft className="w-4 h-4" />}>
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="reset-email-input"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans"
              >
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="reset-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="praveen@company.com"
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
              Send Recovery Link
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
