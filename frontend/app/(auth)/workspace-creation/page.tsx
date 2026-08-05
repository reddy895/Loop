'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Building2, Globe, Users, CheckCircle2 } from 'lucide-react';

export default function WorkspaceCreationPage() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState('Acme SaaS Corp');
  const [domain, setDomain] = useState('acmesaas');
  const [teamSize, setTeamSize] = useState('11-50');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <Card variant="panel" className="p-6 sm:p-8">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Initialize Workspace</CardTitle>
        <CardDescription>
          Configure your organization's feedback portal settings
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] mb-1.5 font-sans">
              Workspace Display Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
              <input
                type="text"
                required
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] mb-1.5 font-sans">
              Workspace URL Slug
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
              />
            </div>
            <p className="text-[10px] text-[#4A4A4A]/60 font-mono-numbers mt-1">
              app.projectloop.ai/{domain || 'your-slug'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A] mb-1.5 font-sans">
              Estimated Team Members
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans bg-[#FFFFE3]"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="500+">500+ Enterprise employees</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Launch LOOP Platform
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
