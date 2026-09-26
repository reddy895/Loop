'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/MiscUI';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Key,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sliders,
  Database,
  Download,
  Trash2,
  Sparkles,
  ShieldAlert,
  Laptop,
  Check
} from 'lucide-react';

function SettingsContent() {
  const searchParams = useSearchParams();
  const { user, updateProfile, changePassword, logout } = useAuth();

  // Active Tab state
  const tabQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'appearance' | 'workspace'>(
    (tabQuery as any) || 'profile'
  );

  useEffect(() => {
    if (tabQuery && ['profile', 'security', 'preferences', 'appearance', 'workspace'].includes(tabQuery)) {
      setActiveTab(tabQuery as any);
    }
  }, [tabQuery]);

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Praveen Kumar');
  const [email, setEmail] = useState(user?.email || 'praveen@acmesaas.com');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || 'Senior Staff Product Lead');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Security / Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [changingPass, setChangingPass] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Preferences Toggles
  const [emailAlerts, setEmailAlerts] = useState(user?.emailAlerts ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(user?.weeklyDigest ?? true);
  const [aiAutoTagging, setAiAutoTagging] = useState(user?.aiAutoTagging ?? true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [prefMsg, setPrefMsg] = useState<string | null>(null);

  // Appearance state
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'monochrome'>('light');
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('UTC-05:00 Eastern Time');

  // Keep state synced with loaded user
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setJobTitle(user.jobTitle);
      setEmailAlerts(user.emailAlerts);
      setWeeklyDigest(user.weeklyDigest);
      setAiAutoTagging(user.aiAutoTagging);
    }
  }, [user]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-neutral-300' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score, label: 'Weak', color: 'bg-neutral-400' };
      case 2:
        return { score, label: 'Fair', color: 'bg-neutral-600' };
      case 3:
        return { score, label: 'Strong', color: 'bg-neutral-800' };
      case 4:
        return { score, label: 'Very Strong', color: 'bg-black' };
      default:
        return { score, label: 'Weak', color: 'bg-neutral-400' };
    }
  };

  const passStrength = getPasswordStrength(newPassword);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    const res = await updateProfile({ name, email, jobTitle });
    setSavingProfile(false);

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile changes updated successfully.' });
      setTimeout(() => setProfileMsg(null), 4000);
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setChangingPass(true);
    const res = await changePassword(currentPassword, newPassword);
    setChangingPass(false);

    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Password successfully updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Incorrect current password.' });
    }
  };

  const handleSavePreferences = async () => {
    setPrefMsg(null);
    await updateProfile({ emailAlerts, weeklyDigest, aiAutoTagging });
    setPrefMsg('Preferences saved successfully.');
    setTimeout(() => setPrefMsg(null), 3500);
  };

  const handleExportData = () => {
    const data = {
      user: { id: user?.id, name, email, role: user?.role },
      workspace: 'ws_default',
      exportedAt: new Date().toISOString(),
      version: '2.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loop_settings_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTabChange = (tabId: 'profile' | 'security' | 'preferences' | 'appearance' | 'workspace') => {
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="loop-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={name} size="lg" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-neutral-900 tracking-tight">
              Account & Workspace Settings
            </h1>
            <p className="text-xs text-neutral-600 font-sans mt-0.5">
              Manage your personal credentials, security policies, AI preferences & workspace options.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded text-xs font-bold uppercase font-mono-numbers bg-neutral-900 text-white">
            {user?.role || 'Enterprise Admin'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2 font-sans text-xs">
        <button
          onClick={() => handleTabChange('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <User className="w-4 h-4" />
          Personal Profile
        </button>

        <button
          onClick={() => handleTabChange('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Security & Password
        </button>

        <button
          onClick={() => handleTabChange('preferences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications & AI
        </button>

        <button
          onClick={() => handleTabChange('appearance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === 'appearance'
              ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Appearance & Locale
        </button>

        <button
          onClick={() => handleTabChange('workspace')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
            activeTab === 'workspace'
              ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Database className="w-4 h-4" />
          Workspace & Data
        </button>
      </div>

      {/* Tab 1: Personal Profile */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="panel" className="lg:col-span-2 p-6 space-y-4">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your public enterprise profile credentials</CardDescription>
            </CardHeader>

            {profileMsg && (
              <div
                className={`loop-card p-3 border-l-4 text-xs font-semibold flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-neutral-50 border-l-black text-neutral-900'
                    : 'bg-neutral-50 border-l-black text-neutral-900'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-neutral-900" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-neutral-900" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          </Card>

          <Card variant="panel" className="p-6 space-y-4">
            <CardHeader>
              <CardTitle>Role Summary</CardTitle>
              <CardDescription>Your system authorization details</CardDescription>
            </CardHeader>

            <div className="space-y-3 font-sans text-xs">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex justify-between items-center">
                <span className="text-neutral-600 font-medium">Account Role</span>
                <span className="font-bold text-neutral-900 font-mono-numbers">{user?.role || 'ADMIN'}</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex justify-between items-center">
                <span className="text-neutral-600 font-medium">User Identifier</span>
                <span className="font-bold text-neutral-900 font-mono-numbers truncate max-w-[140px]">{user?.id}</span>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex justify-between items-center">
                <span className="text-neutral-600 font-medium">Tenant Workspace</span>
                <span className="font-bold text-neutral-900 font-mono-numbers">ws_default</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Change Password Form */}
            <Card variant="panel" className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your enterprise access password</CardDescription>
              </CardHeader>

              {passwordMsg && (
                <div
                  className={`loop-card p-3 border-l-4 text-xs font-semibold flex items-center gap-2 ${
                    passwordMsg.type === 'success'
                      ? 'bg-neutral-50 border-l-black text-neutral-900'
                      : 'bg-neutral-50 border-l-black text-neutral-900'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-neutral-900" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-neutral-900" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>
                    {newPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-neutral-600">
                          <span>Strength:</span>
                          <span className="font-bold text-neutral-900">{passStrength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${passStrength.color}`}
                            style={{ width: `${(passStrength.score / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="secondary" size="sm" disabled={changingPass}>
                    {changingPass ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Active Sessions */}
            <Card variant="panel" className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Active Sessions & Devices</CardTitle>
                <CardDescription>Review locations where your account is currently signed in</CardDescription>
              </CardHeader>

              <div className="space-y-3 font-sans text-xs">
                <div className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-neutral-700" />
                    <div>
                      <p className="font-semibold text-neutral-900">Windows PC • Chrome Browser</p>
                      <p className="text-[10px] text-neutral-500 font-mono-numbers">IP: 192.168.1.105 (Current Session)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-neutral-900 text-white">Active</span>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-semibold text-neutral-900">iPhone 15 • Mobile Safari</p>
                      <p className="text-[10px] text-neutral-500 font-mono-numbers">Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Session revoked')}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: 2FA */}
          <div className="space-y-6">
            <Card variant="panel" className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Two-Factor Auth (2FA)</CardTitle>
                <CardDescription>Add an extra layer of authentication security</CardDescription>
              </CardHeader>

              <div className="space-y-4 font-sans text-xs">
                <div className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900">Authenticator App</p>
                    <p className="text-[10px] text-neutral-500">Use Google Authenticator or Authy</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </div>

                {twoFactorEnabled && (
                  <div className="p-3 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900">
                    <p className="font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-neutral-900" /> 2FA is Active
                    </p>
                    <p className="text-[10px] text-neutral-600 mt-1">Your account is secured with 2FA verification codes.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card variant="panel" className="p-6 space-y-4 border-l-4 border-l-black">
              <CardHeader>
                <CardTitle className="text-neutral-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Session Control
                </CardTitle>
                <CardDescription>Sign out of all sessions immediately</CardDescription>
              </CardHeader>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-neutral-900 border-neutral-300 hover:bg-neutral-100"
                onClick={logout}
              >
                Log Out All Sessions
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications & AI */}
      {activeTab === 'preferences' && (
        <Card variant="panel" className="p-6 space-y-6 max-w-3xl">
          <CardHeader>
            <CardTitle>Notifications & AI Preferences</CardTitle>
            <CardDescription>Control system alert thresholds and automated AI tagging behaviors</CardDescription>
          </CardHeader>

          {prefMsg && (
            <div className="p-3 bg-neutral-50 border-l-4 border-l-black text-xs text-neutral-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-900" />
              <span>{prefMsg}</span>
            </div>
          )}

          <div className="space-y-4 font-sans text-xs">
            <div className="border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-neutral-900 mb-2 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-neutral-700" /> Email Notifications
              </h3>

              <div className="space-y-3">
                <label className="loop-card p-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-semibold text-neutral-900">High-Priority Negative Alerts</p>
                    <p className="text-[10px] text-neutral-500">Immediate email notifications for severe negative feedback spikes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="loop-card p-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-semibold text-neutral-900">Weekly Executive Summary</p>
                    <p className="text-[10px] text-neutral-500">Automated Monday morning PDF intelligence digest email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-neutral-900 mb-2 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-700" /> AI Processing & Intelligence
              </h3>

              <div className="space-y-3">
                <label className="loop-card p-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-semibold text-neutral-900">Automated AI Theme Tagging</p>
                    <p className="text-[10px] text-neutral-500">Categorize incoming feedback tickets into themes upon ingestion</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiAutoTagging}
                    onChange={(e) => setAiAutoTagging(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="loop-card p-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-semibold text-neutral-900">Audio & Interface Sound Alerts</p>
                    <p className="text-[10px] text-neutral-500">Play subtle auditory click and event feedback</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={handleSavePreferences} variant="primary" size="sm">
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Appearance & Localization */}
      {activeTab === 'appearance' && (
        <Card variant="panel" className="p-6 space-y-6 max-w-3xl">
          <CardHeader>
            <CardTitle>Appearance & Localization</CardTitle>
            <CardDescription>Customize visual workspace theme, display language, and timezone settings</CardDescription>
          </CardHeader>

          <div className="space-y-4 font-sans text-xs">
            <div>
              <label className="block font-bold text-neutral-900 mb-2">Visual Theme</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setSelectedTheme('light')}
                  className={`loop-card p-4 cursor-pointer border-2 rounded-xl text-center transition-all ${
                    selectedTheme === 'light' ? 'border-black shadow-md' : 'border-neutral-200'
                  }`}
                >
                  <div className="w-full h-12 bg-white border border-neutral-300 rounded mb-2 flex items-center justify-center font-bold text-neutral-900">
                    Clean Light
                  </div>
                  <p className="font-semibold text-neutral-900">Monochrome Light</p>
                  <p className="text-[10px] text-neutral-500">High-contrast black & white workspace</p>
                </div>

                <div
                  onClick={() => setSelectedTheme('dark')}
                  className={`loop-card p-4 cursor-pointer border-2 rounded-xl text-center transition-all ${
                    selectedTheme === 'dark' ? 'border-black shadow-md' : 'border-neutral-200'
                  }`}
                >
                  <div className="w-full h-12 bg-neutral-900 border border-neutral-700 rounded mb-2 flex items-center justify-center font-bold text-white">
                    Dark Charcoal
                  </div>
                  <p className="font-semibold text-neutral-900">Monochrome Dark</p>
                  <p className="text-[10px] text-neutral-500">Low luminosity contrast</p>
                </div>

                <div
                  onClick={() => setSelectedTheme('monochrome')}
                  className={`loop-card p-4 cursor-pointer border-2 rounded-xl text-center transition-all ${
                    selectedTheme === 'monochrome' ? 'border-black shadow-md' : 'border-neutral-200'
                  }`}
                >
                  <div className="w-full h-12 bg-neutral-100 border border-neutral-300 rounded mb-2 flex items-center justify-center font-bold text-neutral-900">
                    Soft Neutral
                  </div>
                  <p className="font-semibold text-neutral-900">Neutral Canvas</p>
                  <p className="text-[10px] text-neutral-500">Balanced grayscale tones</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Platform Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                >
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish (Español)</option>
                  <option>French (Français)</option>
                  <option>German (Deutsch)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Timezone Location
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                >
                  <option>UTC-05:00 Eastern Time</option>
                  <option>UTC-08:00 Pacific Time</option>
                  <option>UTC+00:00 London (GMT)</option>
                  <option>UTC+05:30 India (IST)</option>
                  <option>UTC+09:00 Tokyo (JST)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Workspace & Data */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="panel" className="lg:col-span-2 p-6 space-y-4">
            <CardHeader>
              <CardTitle>Enterprise Workspace Information</CardTitle>
              <CardDescription>View tenant parameters and export raw system data</CardDescription>
            </CardHeader>

            <div className="space-y-4 font-sans text-xs">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-700">Workspace Name:</span>
                  <span className="font-mono-numbers text-neutral-900 font-bold">Project LOOP Enterprise</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-700">Tenant ID Code:</span>
                  <span className="font-mono-numbers text-neutral-900">LOOP-ENT-WS-99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-700">Database Backend:</span>
                  <span className="font-mono-numbers text-neutral-900 font-bold">PostgreSQL Active</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200">
                <h4 className="font-bold text-neutral-900 mb-1 text-sm">Data Backup & Export</h4>
                <p className="text-xs text-neutral-500 mb-3">
                  Download a complete backup JSON dataset containing user configurations and workspace metadata.
                </p>
                <Button
                  onClick={handleExportData}
                  variant="primary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                >
                  Export Workspace Backup JSON
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="panel" className="p-6 space-y-4 border-l-4 border-l-black">
            <CardHeader>
              <CardTitle className="text-neutral-900 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Danger Zone
              </CardTitle>
              <CardDescription>Irreversible workspace reset options</CardDescription>
            </CardHeader>

            <div className="space-y-3 font-sans text-xs">
              <p className="text-xs text-neutral-600">
                Resetting workspace cache will restore initial demo seeds without affecting your user profile.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-neutral-900 border-neutral-300 hover:bg-neutral-100"
                onClick={() => alert('Local cache cleared successfully.')}
              >
                Clear Local Application Cache
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-semibold text-neutral-500">
          Loading settings panel...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
