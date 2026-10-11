'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { User, Mail, Lock, Building, ArrowRight, AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LoopLogoIcon } from '@/components/ui/LoopLogo';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password strength computation
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const getStrengthPercent = () => {
    let score = 0;
    if (hasMinLength) score += 34;
    if (hasNumberOrSymbol) score += 33;
    if (hasLetter) score += 33;
    return score;
  };

  const strengthPercent = getStrengthPercent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    if (!hasMinLength || !hasNumberOrSymbol) {
      setErrorMsg('Password must be at least 8 characters and include numbers or symbols.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await register(name, email, password, companyName);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMsg(res.error || 'Registration failed. Please check details and try again.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during account creation.');
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
        <CardTitle className="text-2xl font-bold tracking-tight">Create Enterprise Account</CardTitle>
        <CardDescription className="text-xs text-neutral-600">
          Provision an isolated AI customer feedback intelligence workspace
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

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <div>
            <label
              htmlFor="name-input"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1 font-sans"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="name-input"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Praveen Kumar"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email-input"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1 font-sans"
            >
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="email-input"
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

          <div>
            <label
              htmlFor="company-input"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1 font-sans"
            >
              Organization / Company Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="company-input"
                type="text"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Global Inc"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password-input"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1 font-sans"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
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

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5 animate-in fade-in">
                <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthPercent < 60
                        ? 'bg-neutral-400 w-1/3'
                        : strengthPercent < 100
                        ? 'bg-neutral-700 w-2/3'
                        : 'bg-neutral-950 w-full'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-sans">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-neutral-900 font-semibold' : ''}`}>
                    {hasMinLength ? <Check className="w-3 h-3 text-neutral-900" /> : <X className="w-3 h-3 text-neutral-300" />}
                    8+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumberOrSymbol ? 'text-neutral-900 font-semibold' : ''}`}>
                    {hasNumberOrSymbol ? <Check className="w-3 h-3 text-neutral-900" /> : <X className="w-3 h-3 text-neutral-300" />}
                    Number or symbol
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password-input"
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1 font-sans"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                id="confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-sm font-sans focus:outline-hidden focus:border-neutral-900 transition-colors"
              />
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <span className="text-[11px] text-red-600 font-sans mt-1 block">
                Passwords do not match
              </span>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={submitting}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-600">
          Already have an enterprise account?{' '}
          <Link href="/login" className="text-neutral-950 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
