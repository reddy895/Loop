'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('praveen@acmesaas.com');
  const [password, setPassword] = useState('••••••••••••');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMsg(res.error || 'Failed to authenticate. Please check credentials.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during login.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="panel" className="p-6 sm:p-8">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Enterprise Login</CardTitle>
        <CardDescription>
          Access your workspace feedback intelligence portal
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-100 border-l-4 border-red-500 text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

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
                placeholder="name@company.com"
                className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] font-sans">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#6D8196] hover:underline font-sans font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="w-full mt-2"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#4A4A4A]/15 text-center text-xs text-[#4A4A4A]/80">
          Don't have a workspace account?{' '}
          <Link href="/signup" className="text-[#6D8196] font-bold hover:underline">
            Register new account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
