'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  height?: number;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  action,
  height = 300
}) => {
  return (
    <div className="loop-card p-4 sm:p-5 w-full flex flex-col justify-between transition-all duration-150">
      <div className="flex flex-row items-center justify-between pb-2.5 mb-2 border-b border-neutral-100">
        <div>
          <h3 className="font-heading text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-neutral-500 font-sans mt-0.5">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="w-full flex-1 pt-1" style={{ height, minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* 1. Feedback Volume Area Chart */
export const FeedbackVolumeChart: React.FC<{ data: Record<string, unknown>[] }> = ({ data }) => {
  return (
    <AreaChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#09090B" stopOpacity={0.15} />
          <stop offset="95%" stopColor="#09090B" stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F2" vertical={false} />
      <XAxis dataKey="date" stroke="#A1A1AA" tick={{ fill: '#71717A', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E4E4E7' }} />
      <YAxis stroke="#A1A1AA" tick={{ fill: '#71717A', fontSize: 11 }} tickLine={false} axisLine={false} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#09090B',
          borderColor: '#27272A',
          borderRadius: '8px',
          boxShadow: '0 8px 16px -2px rgba(0,0,0,0.2)',
          color: '#FFFFFF',
          fontSize: '12px',
          fontFamily: 'var(--font-jetbrains), monospace'
        }}
        itemStyle={{ color: '#FFFFFF' }}
      />
      <Area
        type="monotone"
        dataKey="volume"
        stroke="#09090B"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorVolume)"
        name="Feedback Volume"
      />
    </AreaChart>
  );
};

/* 2. Sentiment Breakdown Pie Chart */
export const SentimentPieChart: React.FC<{ data: Array<{ name: string; value: number; color?: string }> }> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const isZeroState = total === 0;

  // Fallback ring for clean 0-baseline representation
  const chartData = isZeroState
    ? [{ name: 'Awaiting Data', value: 1, color: '#E4E4E7' }]
    : data;

  return (
    <PieChart>
      <Pie
        data={chartData}
        cx="50%"
        cy="48%"
        innerRadius={58}
        outerRadius={86}
        paddingAngle={isZeroState ? 0 : 3}
        dataKey="value"
        nameKey="name"
        stroke="#FFFFFF"
        strokeWidth={2}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      {!isZeroState && (
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090B',
            borderColor: '#27272A',
            borderRadius: '8px',
            boxShadow: '0 8px 16px -2px rgba(0,0,0,0.2)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontFamily: 'var(--font-jetbrains), monospace'
          }}
          formatter={(value: any, name: any) => [
            `${value} items (${Math.round((Number(value) / total) * 100)}%)`,
            name
          ]}
          itemStyle={{ color: '#FFFFFF' }}
        />
      )}
      <Legend
        verticalAlign="bottom"
        height={32}
        iconType="circle"
        formatter={(value) => <span className="text-xs font-sans text-neutral-600 font-medium">{value}</span>}
      />
    </PieChart>
  );
};

/* 3. Top Themes Bar Chart */
export const TopThemesBarChart: React.FC<{ data: Record<string, unknown>[] }> = ({ data }) => {
  return (
    <BarChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 45 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F2" vertical={false} />
      <XAxis
        dataKey="theme"
        stroke="#A1A1AA"
        tick={{ fill: '#71717A', fontSize: 11 }}
        angle={-30}
        textAnchor="end"
        interval={0}
        tickLine={false}
        axisLine={{ stroke: '#E4E4E7' }}
      />
      <YAxis stroke="#A1A1AA" tick={{ fill: '#71717A', fontSize: 11 }} tickLine={false} axisLine={false} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#09090B',
          borderColor: '#27272A',
          borderRadius: '8px',
          boxShadow: '0 8px 16px -2px rgba(0,0,0,0.2)',
          color: '#FFFFFF',
          fontSize: '12px',
          fontFamily: 'var(--font-jetbrains), monospace'
        }}
        formatter={(val: any) => [`${val} items`, 'Feedback Volume']}
        itemStyle={{ color: '#FFFFFF' }}
      />
      <Bar dataKey="count" fill="#18181B" radius={[4, 4, 0, 0]} name="Ticket Count" />
    </BarChart>
  );
};

/* 4. Theme Trend Line Chart */
export const ThemeTrendLineChart: React.FC<{ data: Record<string, unknown>[] }> = ({ data }) => {
  return (
    <LineChart data={data} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis dataKey="week" stroke="#71717A" tick={{ fill: '#71717A', fontSize: 12 }} />
      <YAxis stroke="#71717A" tick={{ fill: '#71717A', fontSize: 12 }} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          color: '#09090B'
        }}
      />
      <Legend verticalAlign="bottom" height={36} />
      <Line type="monotone" dataKey="UX" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} />
      <Line type="monotone" dataKey="Integrations" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 4 }} />
      <Line type="monotone" dataKey="Billing" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4 }} />
      <Line type="monotone" dataKey="Mobile" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
    </LineChart>
  );
};
