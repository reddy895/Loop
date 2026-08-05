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
        <CartesianGrid strokeDasharray="3 3" stroke="#CBCBCB" />
        <XAxis dataKey="channel" stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 11 }} />
        <YAxis stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFE3',
            borderColor: '#4A4A4A',
            borderRadius: '8px',
            color: '#4A4A4A',
            fontFamily: 'Inter, sans-serif'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="positive" name="Positive" stackId="a" fill="#6D8196" radius={[0, 0, 0, 0]} />
        <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#CBCBCB" radius={[0, 0, 0, 0]} />
        <Bar dataKey="negative" name="Negative" stackId="a" fill="#4A4A4A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 2. Sentiment Trend Velocity Line Chart over 6 Weeks */
export const SentimentTrendLineChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBCBCB" />
        <XAxis dataKey="week" stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 11 }} />
        <YAxis stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFE3',
            borderColor: '#4A4A4A',
            borderRadius: '8px',
            color: '#4A4A4A'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="positivePct" name="% Positive Share" stroke="#6D8196" strokeWidth={3} dot={{ r: 5 }} />
        <Line type="monotone" dataKey="negativePct" name="% Negative Share" stroke="#4A4A4A" strokeWidth={3} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

/* 3. Theme Month-over-Month Comparison (Current Month vs Previous Month) */
export const ThemeComparisonBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBCBCB" />
        <XAxis dataKey="theme" stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 10 }} />
        <YAxis stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFE3',
            borderColor: '#4A4A4A',
            borderRadius: '8px',
            color: '#4A4A4A'
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="currentMonth" name="August (Current)" fill="#6D8196" radius={[4, 4, 0, 0]} />
        <Bar dataKey="prevMonth" name="July (Previous)" fill="#CBCBCB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/* 4. Sentiment Score Distribution (0-100 Score Spread) */
export const SentimentDistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#CBCBCB" />
        <XAxis dataKey="range" stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 11 }} />
        <YAxis stroke="#4A4A4A" tick={{ fill: '#4A4A4A', fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFFFE3',
            borderColor: '#4A4A4A',
            borderRadius: '8px',
            color: '#4A4A4A'
          }}
        />
        <Area type="monotone" dataKey="count" name="Feedback Volume" fill="#6D8196" fillOpacity={0.25} stroke="#6D8196" strokeWidth={2} />
        <Bar dataKey="count" name="Ticket Count" fill="#4A4A4A" radius={[4, 4, 0, 0]} barSize={24} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
