'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ChevronDown, Check, Plus, Layers } from 'lucide-react';
import { mockWorkspace } from '@/lib/mockData';

export const WorkspaceSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(mockWorkspace.name);
  const menuRef = useRef<HTMLDivElement>(null);

  const workspaces = [
    { name: 'Acme SaaS Corp', plan: 'Enterprise Tier', active: true },
    { name: 'Stripe Analytics Lab', plan: 'Scale Tier', active: false },
    { name: 'Linear Global', plan: 'Enterprise Tier', active: false }
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-900 transition-all flex items-center gap-2.5 text-xs font-semibold shadow-2xs cursor-pointer group"
      >
        <div className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0">
          <Building2 className="w-3 h-3" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="truncate max-w-[130px] lg:max-w-[170px] text-neutral-950 font-bold">
              {selected}
            </span>
          </div>
        </div>
        <span className="sm:hidden font-bold truncate max-w-[90px]">{selected.split(' ')[0]}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-neutral-300 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-mono-numbers font-bold text-neutral-400 flex items-center justify-between border-b border-neutral-100">
            <span>Switch Workspace</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
              3 Workspaces
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {workspaces.map((ws) => {
              const isCurrent = selected === ws.name;
              return (
                <button
                  key={ws.name}
                  onClick={() => {
                    setSelected(ws.name);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'hover:bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${isCurrent ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'}`}>
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold truncate text-xs ${isCurrent ? 'text-white' : 'text-neutral-900'}`}>
                        {ws.name}
                      </p>
                      <p className={`text-[10px] font-mono-numbers ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {ws.plan}
                      </p>
                    </div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-neutral-200 pt-1 mt-1">
            <Link
              href="/workspace-creation"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-600" />
              <span>Create New Workspace</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
