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
    <Card variant="panel" className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>

      <div className="w-full skeuo-inset p-3 bg-[#F4F4D6]/70 rounded-lg overflow-hidden">
        <div style={{ height, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

/* 1. Feedback Volume Area Chart */
export const FeedbackVolumeChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
      <defs>
        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6D8196" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#6D8196" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#CBCBCB" />
      <XAxis dataKey="date" stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 12 }} />
      <YAxis stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 12 }} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#FFFFE3',
          borderColor: '#4A4A4A',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          color: '#4A4A4A',
          fontFamily: 'Inter, sans-serif'
        }}
      />
      <Area
        type="monotone"
        dataKey="volume"
        stroke="#6D8196"
        strokeWidth={3}
        fillOpacity={1}
        fill="url(#colorVolume)"
        name="Feedback Volume"
      />
    </AreaChart>
  );
};

/* 2. Sentiment Breakdown Pie Chart */
export const SentimentPieChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={55}
        outerRadius={85}
        paddingAngle={4}
        dataKey="value"
        nameKey="name"
        stroke="#FFFFE3"
        strokeWidth={2}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          backgroundColor: '#FFFFE3',
          borderColor: '#4A4A4A',
          borderRadius: '8px',
          color: '#4A4A4A'
        }}
      />
      <Legend verticalAlign="bottom" height={36} iconType="circle" />
    </PieChart>
  );
};

/* 3. Top Themes Bar Chart */
export const TopThemesBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#CBCBCB" />
      <XAxis type="number" stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 12 }} />
      <YAxis dataKey="theme" type="category" stroke="#4A4A4A" width={110} tick={{ fill: '#4A4A4A', fontSize: 11 }} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#FFFFE3',
          borderColor: '#4A4A4A',
          borderRadius: '8px',
          color: '#4A4A4A'
        }}
      />
      <Bar dataKey="count" fill="#4A4A4A" radius={[0, 4, 4, 0]} name="Ticket Count" />
    </BarChart>
  );
};

/* 4. Theme Trend Line Chart */
export const ThemeTrendLineChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <LineChart data={data} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#CBCBCB" />
      <XAxis dataKey="week" stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 12 }} />
      <YAxis stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 12 }} />
      <Tooltip
        contentStyle={{
          backgroundColor: '#FFFFE3',
          borderColor: '#4A4A4A',
          borderRadius: '8px',
          color: '#4A4A4A'
        }}
      />
      <Legend verticalAlign="bottom" height={36} />
      <Line type="monotone" dataKey="UX" stroke="#6D8196" strokeWidth={2.5} dot={{ r: 4 }} />
      <Line type="monotone" dataKey="Integrations" stroke="#4A4A4A" strokeWidth={2.5} dot={{ r: 4 }} />
      <Line type="monotone" dataKey="Billing" stroke="#9E6B6B" strokeWidth={2.5} dot={{ r: 4 }} />
      <Line type="monotone" dataKey="Mobile" stroke="#7A8B7B" strokeWidth={2.5} dot={{ r: 4 }} />
    </LineChart>
  );
};
