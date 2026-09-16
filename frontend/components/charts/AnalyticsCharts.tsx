'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ComposedChart,
  Area
} from 'recharts';

/* 1. Stacked Bar Chart: Sentiment Breakdown per Integration Channel */
export const ChannelSentimentBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="channel" stroke="#71717A" tick={{ fill: '#71717A', fontSize: 11 }} />
        <YAxis stroke="#71717A" tick={{ fill: '#71717A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            color: '#09090B',
            fontFamily: 'Inter, sans-serif'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="positive" name="Positive" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
        <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
        <Bar dataKey="negative" name="Negative" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 2. Sentiment Trend Velocity Line Chart over 6 Weeks */
export const SentimentTrendLineChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="week" stroke="#71717A" tick={{ fill: '#71717A', fontSize: 11 }} />
        <YAxis stroke="#71717A" tick={{ fill: '#71717A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            color: '#09090B'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="positivePct" name="% Positive Share" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
        <Line type="monotone" dataKey="negativePct" name="% Negative Share" stroke="#EF4444" strokeWidth={3} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

/* 3. Theme Month-over-Month Comparison (Current Month vs Previous Month) */
export const ThemeComparisonBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="theme" stroke="#71717A" tick={{ fill: '#71717A', fontSize: 10 }} />
        <YAxis stroke="#71717A" tick={{ fill: '#71717A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            color: '#09090B'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="currentMonth" name="August (Current)" fill="#2563EB" radius={[4, 4, 0, 0]} />
        <Bar dataKey="prevMonth" name="July (Previous)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 4. Sentiment Score Distribution (0-100 Score Spread) */
export const SentimentDistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="range" stroke="#71717A" tick={{ fill: '#71717A', fontSize: 11 }} />
        <YAxis stroke="#71717A" tick={{ fill: '#71717A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            color: '#09090B'
          }}
        />
        <Area type="monotone" dataKey="count" name="Feedback Volume" fill="#3B82F6" fillOpacity={0.2} stroke="#3B82F6" strokeWidth={2} />
        <Bar dataKey="count" name="Ticket Count" fill="#18181B" radius={[4, 4, 0, 0]} barSize={24} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
