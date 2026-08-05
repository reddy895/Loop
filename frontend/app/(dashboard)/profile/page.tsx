'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/MiscUI';
import { User, Mail, Lock, Key, Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('Praveen Kumar');
  const [email, setEmail] = useState('praveen@acmesaas.com');
  const [jobTitle, setJobTitle] = useState('Senior Staff Product Lead');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Preference Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [aiAutoTagging, setAiAutoTagging] = useState(true);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New password and confirmation do not match.');
      return;
    }
    setPasswordMsg('Password successfully updated!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="skeuo-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={name} size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#4A4A4A]">
              {name}
            </h1>
            <p className="text-xs text-[#4A4A4A]/80 font-sans">
              {jobTitle} • {email}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded text-xs font-bold uppercase font-mono-numbers bg-[#6D8196] text-[#FFFFE3]">
          Enterprise Account
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Information Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="panel" className="p-6 space-y-4">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display credentials and email preferences</CardDescription>
            </CardHeader>

            <form onSubmit={(e) => { e.preventDefault(); alert('Profile saved!'); }} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A4A4A] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A4A4A] mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full skeuo-input px-3 py-2 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A4A4A] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Save Personal Info
                </Button>
              </div>
            </form>
          </Card>

          {/* Password Change Form */}
          <Card variant="panel" className="p-6 space-y-4">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your enterprise login credentials</CardDescription>
            </CardHeader>

            {passwordMsg && (
              <div className="skeuo-inset p-3 bg-[#E2ECD8] border-l-4 border-l-green-600 text-xs text-[#2D4E2A] font-semibold">
                {passwordMsg}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-semibold text-[#4A4A4A] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A4A4A] mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A4A4A] mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="secondary" size="sm">
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Account Settings & Preferences */}
        <div className="space-y-6">
          <Card variant="panel" className="p-6 space-y-4">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Configure notifications and AI preference flags</CardDescription>
            </CardHeader>

            <div className="space-y-3 font-sans text-xs">
              <label className="skeuo-card-cream p-3 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-[#4A4A4A]">High-Priority Negative Alerts</p>
                  <p className="text-[10px] text-[#4A4A4A]/70">Email alerts for urgent negative sentiment spikes</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="accent-[#6D8196] w-4 h-4"
                />
              </label>

              <label className="skeuo-card-cream p-3 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-[#4A4A4A]">Weekly Executive Digest</p>
                  <p className="text-[10px] text-[#4A4A4A]/70">Automated Monday morning PDF synthesis email</p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="accent-[#6D8196] w-4 h-4"
                />
              </label>

              <label className="skeuo-card-cream p-3 flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-[#4A4A4A]">Automated AI Theme Tagging</p>
                  <p className="text-[10px] text-[#4A4A4A]/70">Classify new tickets into topics on ingest</p>
                </div>
                <input
                  type="checkbox"
                  checked={aiAutoTagging}
                  onChange={(e) => setAiAutoTagging(e.target.checked)}
                  className="accent-[#6D8196] w-4 h-4"
                />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
