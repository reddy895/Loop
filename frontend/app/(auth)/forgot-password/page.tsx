'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Card variant="panel" className="p-6 sm:p-8">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your registered work email to receive password recovery instructions
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="text-center space-y-4 py-3">
            <div className="inline-flex p-3 bg-green-100 rounded-full text-green-700 border border-green-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-lg font-bold">Check Your Inbox</h3>
            <p className="text-xs text-[#4A4A4A]/80 font-sans">
              We have dispatched a password recovery link to <span className="font-bold">{email}</span>.
            </p>
            <Link href="/login" className="inline-block mt-4">
              <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] mb-1.5 font-sans">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="praveen@company.com"
                  className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
              Send Recovery Link
            </Button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-[#6D8196] hover:underline font-sans font-medium flex items-center justify-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
