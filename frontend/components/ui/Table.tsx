import React from 'react';
import { cn } from '@/lib/utils';

export const Table: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className="w-full overflow-x-auto rounded-lg border border-neutral-200 bg-white">
    <table className={cn('w-full text-left border-collapse font-sans text-xs text-neutral-800', className)}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <thead className={cn('bg-neutral-50 border-b border-neutral-200 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider select-none', className)}>
    {children}
  </thead>
);

export const TableBody: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <tbody className={cn('divide-y divide-neutral-200 bg-white', className)}>
    {children}
  </tbody>
);

export const TableRow: React.FC<{ className?: string; children: React.ReactNode; onClick?: () => void }> = ({ className, children, onClick }) => (
  <tr
    onClick={onClick}
    className={cn(
      'transition-colors duration-150 hover:bg-neutral-50/80',
      onClick && 'cursor-pointer',
      className
    )}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <th className={cn('px-3.5 py-2.5 font-semibold text-neutral-700 whitespace-nowrap', className)}>
    {children}
  </th>
);

export const TableCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <td className={cn('px-3.5 py-2.5 text-xs font-normal text-neutral-800 align-middle font-sans', className)}>
    {children}
  </td>
);
