'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { User, Mail, Lock, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await register(name, email, password, companyName);
      if (res.success) {
        router.push('/workspace-creation');
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during account creation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="panel" className="p-6 sm:p-8">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Create Enterprise Account</CardTitle>
        <CardDescription>
          Start aggregating customer feedback intelligence in minutes
        </CardDescription>
      </CardHeader>

      <CardContent>
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-neutral-50 border-l-4 border-l-black text-neutral-900 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-neutral-900" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Praveen Kumar"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="praveen@company.com"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans">
              Company Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corporation"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
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
            {submitting ? 'Creating Account...' : 'Continue to Workspace Setup'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-600">
          Already have an account?{' '}
          <Link href="/login" className="text-neutral-950 font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
