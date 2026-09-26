'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/MiscUI';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSkeleton } from '@/components/ui/FeedbackStates';
import { mockWorkspace, mockMembers } from '@/lib/mockData';
import { WorkspaceMember, MemberRole } from '@/types';
import {
  Building2,
  Users,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  Globe
} from 'lucide-react';

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'details' | 'members'>('details');
  const [membersList, setMembersList] = useState<WorkspaceMember[]>(mockMembers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('Analyst');

  useEffect(() => {
    if (searchParams.get('tab') === 'members') {
      setActiveTab('members');
    }
  }, [searchParams]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: WorkspaceMember = {
      id: `usr_${Date.now()}`,
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setMembersList((prev) => [...prev, newMember]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleRoleChange = (id: string, newRole: MemberRole) => {
    setMembersList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  const handleRemoveMember = (id: string) => {
    setMembersList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="loop-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Workspace & Team Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans mt-1">
            Manage organization details, team invitations, and role-based access permissions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite Team Member
        </Button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-1">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
            activeTab === 'details'
              ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> Workspace Details
          </div>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-neutral-900 text-white shadow-2xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Team Members ({membersList.length})
          </div>
        </button>
      </div>

      {/* Tab 1: Workspace Details */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="panel" className="lg:col-span-2 space-y-4">
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Primary profile and workspace identifiers</CardDescription>
            </CardHeader>

            <div className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  defaultValue={mockWorkspace.name}
                  className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Slug ID
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue={mockWorkspace.slug}
                    className="w-full bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-lg px-3 py-2 text-sm font-mono-numbers cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Subscription Tier
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue={mockWorkspace.plan}
                    className="w-full bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-lg px-3 py-2 text-sm font-sans cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Primary Contact Domain
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    defaultValue="acmesaas.com"
                    className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          {/* Subscription Summary Side Panel */}
          <Card variant="panel" className="space-y-3">
            <CardHeader>
              <CardTitle>Workspace Statistics</CardTitle>
              <CardDescription>Usage quota and active seats</CardDescription>
            </CardHeader>

            <div className="space-y-3 text-xs font-sans">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Active Seat Count:</span>
                  <span className="font-mono-numbers font-bold text-neutral-900">{membersList.length} / 25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Processed Tickets:</span>
                  <span className="font-mono-numbers font-bold text-neutral-900">1,482 / 5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Ask LOOP Queries:</span>
                  <span className="font-mono-numbers font-bold text-neutral-900">342 / Unlimited</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-neutral-900 shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-800">
                  Enterprise SLA & Security Active
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Members Table */}
      {activeTab === 'members' && (
        <div className="loop-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Organization Members ({membersList.length})
            </h3>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsInviteModalOpen(true)}
            >
              Invite User
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersList.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={m.name} size="sm" />
                      <span className="font-bold text-xs text-neutral-900">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono-numbers text-xs text-neutral-600">
                    {m.email}
                  </TableCell>
                  <TableCell>
                    <select
                      value={m.role}
                      disabled={m.role === 'Owner'}
                      onChange={(e) => handleRoleChange(m.id, e.target.value as MemberRole)}
                      className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-sans text-neutral-900 cursor-pointer disabled:opacity-50"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono-numbers ${
                        m.status === 'Active'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono-numbers text-xs text-neutral-600">
                    {m.joinedDate}
                  </TableCell>
                  <TableCell className="text-right">
                    {m.role !== 'Owner' && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Revoke access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Invite Member Dialog Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite User to Workspace"
        description="Send an email invitation link with customized role-based access controls"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleInviteSubmit}>
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleInviteSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">User Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Sophia Williams"
              className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="sophia@company.com"
                className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg pl-9 pr-3 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Assign Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as MemberRole)}
              className="w-full bg-white text-neutral-900 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="Admin">Admin – Full workspace configuration privileges</option>
              <option value="Analyst">Analyst – Create reports & query Ask LOOP AI</option>
              <option value="Viewer">Viewer – Read-only dashboard access</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={5} />}>
      <WorkspaceContent />
    </Suspense>
  );
}
