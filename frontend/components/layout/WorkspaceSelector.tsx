'use client';

import React, { useState } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { mockWorkspace } from '@/lib/mockData';

export const WorkspaceSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(mockWorkspace.name);

  const workspaces = [
    { name: 'Acme SaaS Corp', plan: 'Enterprise Tier' },
    { name: 'Stripe Analytics Lab', plan: 'Pro Tier' },
    { name: 'Linear Global', plan: 'Enterprise Tier' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="skeuo-button-secondary px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-neutral-800"
      >
        <Building2 className="w-4 h-4 text-neutral-900" />
        <span className="truncate max-w-[120px] sm:max-w-[180px]">{selected}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-56 skeuo-panel p-2 z-50 shadow-lg space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-mono-numbers font-bold text-neutral-500 border-b border-neutral-200">
            Select Workspace
          </div>
          {workspaces.map((ws) => (
            <button
              key={ws.name}
              onClick={() => {
                setSelected(ws.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs hover:bg-neutral-100 transition-colors"
            >
              <div>
                <p className="font-semibold text-neutral-900">{ws.name}</p>
                <p className="text-[10px] text-neutral-500">{ws.plan}</p>
              </div>
              {selected === ws.name && <Check className="w-4 h-4 text-black" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
