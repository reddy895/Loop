import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-neutral-200/70 rounded-md", className)} />
);

export const StatsCardSkeleton: React.FC = () => (
  <div className="loop-card p-4 sm:p-5 space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2 w-full">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
    </div>
    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-3 w-28" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="loop-card p-4 sm:p-5 space-y-4">
    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-7 w-20 rounded-md" />
    </div>
    <div className="w-full flex items-end gap-2 pt-4" style={{ height }}>
      {[40, 65, 45, 80, 55, 90, 70, 85].map((pct, idx) => (
        <div key={idx} className="flex-1 flex flex-col justify-end h-full">
          <Skeleton className="w-full rounded-t" style={{ height: `${pct}%` }} />
        </div>
      ))}
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="loop-card p-4 sm:p-5 space-y-4">
    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-72" />
      </div>
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
    <div className="space-y-3 pt-2">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 font-sans">
    {/* Header Skeleton */}
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-neutral-200/60">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>

    {/* 4 KPI Skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>

    {/* Main Charts Skeletons */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ChartSkeleton height={280} />
      </div>
      <div>
        <ChartSkeleton height={280} />
      </div>
    </div>

    {/* Theme & Recent Table Skeletons */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <ChartSkeleton height={280} />
      </div>
      <div className="lg:col-span-2">
        <TableSkeleton rows={5} />
      </div>
    </div>
  </div>
);
