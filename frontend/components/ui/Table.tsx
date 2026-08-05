import React from 'react';
import { cn } from '@/lib/utils';

export const Table: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className="w-full overflow-x-auto skeuo-inset p-1">
    <table className={cn('w-full text-left border-collapse font-sans text-xs text-[#4A4A4A]', className)}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <thead className={cn('bg-[#CBCBCB] border-b border-[#4A4A4A]/20 text-[11px] font-semibold text-[#4A4A4A] uppercase tracking-wider select-none', className)}>
    {children}
  </thead>
);

export const TableBody: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <tbody className={cn('divide-y divide-[#4A4A4A]/10 bg-[#FFFFE3]/80', className)}>
    {children}
  </tbody>
);

export const TableRow: React.FC<{ className?: string; children: React.ReactNode; onClick?: () => void }> = ({ className, children, onClick }) => (
  <tr
    onClick={onClick}
    className={cn(
      'transition-colors duration-150 hover:bg-[#CBCBCB]/30',
      onClick && 'cursor-pointer',
      className
    )}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <th className={cn('px-3.5 py-2.5 font-semibold text-[#4A4A4A] whitespace-nowrap', className)}>
    {children}
  </th>
);

export const TableCell: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <td className={cn('px-3.5 py-2.5 text-xs font-normal text-[#4A4A4A] align-middle font-sans', className)}>
    {children}
  </td>
);
