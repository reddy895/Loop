'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/MiscUI';
import { LoadingSkeleton } from '@/components/ui/FeedbackStates';
import { mockMembers, mockWorkspace } from '@/lib/mockData';
import { WorkspaceMember, MemberRole } from '@/types';
import {
  Building2,
  Users,
  UserPlus,
  Shield,
  Globe,
  Mail,
  Trash2
} from 'lucide-react';

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'members' ? 'members' : 'details';

  const [activeTab, setActiveTab] = useState<'details' | 'members'>(initialTab);
  const [membersList, setMembersList] = useState<WorkspaceMember[]>(mockMembers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite member form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('Analyst');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: WorkspaceMember = {
      id: `usr-${Date.now()}`,
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setMembersList([...membersList, newMember]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleRoleChange = (memberId: string, newRole: MemberRole) => {
    setMembersList(
      membersList.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setMembersList(membersList.filter((m) => m.id !== memberId));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="skeuo-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#4A4A4A]">
            Workspace & Team Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A4A]/80 font-sans mt-1">
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
      <div className="flex items-center gap-2 border-b border-[#4A4A4A]/20 pb-1">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all ${
            activeTab === 'details'
              ? 'bg-[#CBCBCB] text-[#4A4A4A] border-t-2 border-x border-[#4A4A4A]/30 shadow-xs'
              : 'text-[#4A4A4A]/70 hover:text-[#4A4A4A]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> Workspace Details
          </div>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all ${
            activeTab === 'members'
              ? 'bg-[#CBCBCB] text-[#4A4A4A] border-t-2 border-x border-[#4A4A4A]/30 shadow-xs'
              : 'text-[#4A4A4A]/70 hover:text-[#4A4A4A]'
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
                <label className="block font-semibold text-[#4A4A4A] mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  defaultValue={mockWorkspace.name}
                  className="w-full skeuo-input px-3 py-2 text-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A4A4A] mb-1">
                    Slug ID
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue={mockWorkspace.slug}
                    className="w-full skeuo-input px-3 py-2 text-sm font-mono-numbers bg-[#CBCBCB]/40 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4A4A4A] mb-1">
                    Subscription Tier
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue={mockWorkspace.plan}
                    className="w-full skeuo-input px-3 py-2 text-sm font-sans bg-[#CBCBCB]/40 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A4A4A] mb-1">
                  Primary Contact Domain
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
                  <input
                    type="text"
                    defaultValue="acmesaas.com"
                    className="w-full skeuo-input pl-9 pr-3 py-2 text-sm font-sans"
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
              <div className="skeuo-inset p-3 space-y-2">
                <div className="flex justify-between">
                  <span>Active Seat Count:</span>
                  <span className="font-mono-numbers font-bold">{membersList.length} / 25</span>
                </div>
                <div className="flex justify-between">
                  <span>Processed Tickets:</span>
                  <span className="font-mono-numbers font-bold">1,482 / 5,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Ask LOOP Queries:</span>
                  <span className="font-mono-numbers font-bold">342 / Unlimited</span>
                </div>
              </div>

              <div className="p-3 bg-[#E2ECD8] border border-[#B4CE9F] rounded flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-700 shrink-0" />
                <span className="text-[11px] font-semibold text-[#2D4E2A]">
                  Enterprise SLA & Security Active
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Members Table */}
      {activeTab === 'members' && (
        <div className="skeuo-panel p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#4A4A4A]/10">
            <h3 className="font-heading font-bold text-base text-[#4A4A4A]">
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
                      <span className="font-bold text-xs">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono-numbers text-xs">
                    {m.email}
                  </TableCell>
                  <TableCell>
                    <select
                      value={m.role}
                      disabled={m.role === 'Owner'}
                      onChange={(e) => handleRoleChange(m.id, e.target.value as MemberRole)}
                      className="skeuo-input px-2 py-1 text-xs bg-[#FFFFE3] cursor-pointer disabled:opacity-60"
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
                          ? 'bg-green-200 text-green-800 border border-green-400'
                          : 'bg-yellow-200 text-yellow-800 border border-yellow-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono-numbers text-xs">
                    {m.joinedDate}
                  </TableCell>
                  <TableCell className="text-right">
                    {m.role !== 'Owner' && (
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1 rounded text-red-700 hover:bg-red-100 transition-colors"
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
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">User Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Sophia Williams"
              className="w-full skeuo-input px-3 py-1.5 text-xs font-sans"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/60" />
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="sophia@company.com"
                className="w-full skeuo-input pl-9 pr-3 py-1.5 text-xs font-sans"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#4A4A4A] mb-1">Assign Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as MemberRole)}
              className="w-full skeuo-input px-2 py-1.5 text-xs bg-[#FFFFE3]"
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
