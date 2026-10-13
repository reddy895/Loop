'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  FeedbackItem,
  ThemeSummary,
  CustomerReport
} from '@/types';
import {
  getDatasetBundle
} from '@/lib/datasetGenerator';

// Zero-state data constants for new user initialization
const zeroVolumeData = [
  { date: 'Jul 29', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Jul 30', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Jul 31', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 01', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 02', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 03', volume: 0, positive: 0, negative: 0, neutral: 0 },
  { date: 'Aug 04', volume: 0, positive: 0, negative: 0, neutral: 0 }
];

const zeroSentimentPieData = [
  { name: 'Positive', value: 0, color: '#10B981' },
  { name: 'Negative', value: 0, color: '#EF4444' },
  { name: 'Neutral', value: 0, color: '#F59E0B' }
];

const zeroTopThemesBarData = [
  { theme: 'UX Performance', count: 0 },
  { theme: 'Integration Request', count: 0 },
  { theme: 'Billing & Pricing', count: 0 },
  { theme: 'Mobile Resp.', count: 0 },
  { theme: 'Security & Auth', count: 0 }
];

const zeroChannelSentimentData = [
  { channel: 'Zendesk', positive: 0, neutral: 0, negative: 0 },
  { channel: 'Intercom', positive: 0, neutral: 0, negative: 0 },
  { channel: 'App Store', positive: 0, neutral: 0, negative: 0 },
  { channel: 'Discourse', positive: 0, neutral: 0, negative: 0 },
  { channel: 'Email', positive: 0, neutral: 0, negative: 0 }
];

const zeroWeeklySentimentTrend = [
  { week: 'Wk 27', positivePct: 0, negativePct: 0 },
  { week: 'Wk 28', positivePct: 0, negativePct: 0 },
  { week: 'Wk 29', positivePct: 0, negativePct: 0 },
  { week: 'Wk 30', positivePct: 0, negativePct: 0 },
  { week: 'Wk 31', positivePct: 0, negativePct: 0 },
  { week: 'Wk 32', positivePct: 0, negativePct: 0 }
];

const zeroThemeComparisonData = [
  { theme: 'UX Performance', currentMonth: 0, prevMonth: 0 },
  { theme: 'Integration Request', currentMonth: 0, prevMonth: 0 },
  { theme: 'Billing & Pricing', currentMonth: 0, prevMonth: 0 },
  { theme: 'Mobile Responsiveness', currentMonth: 0, prevMonth: 0 },
  { theme: 'Security & Auth', currentMonth: 0, prevMonth: 0 }
];

const zeroSentimentDistributionData = [
  { range: '0-20 (Critical)', count: 0 },
  { range: '21-40 (Negative)', count: 0 },
  { range: '41-60 (Neutral)', count: 0 },
  { range: '61-80 (Positive)', count: 0 },
  { range: '81-100 (Delighted)', count: 0 }
];

const zeroChannelPerformanceList = [
  { channel: 'Zendesk Support', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'Intercom Live Chat', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'App Store Reviews', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'Discourse Forum', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' },
  { channel: 'Direct Email', total: 0, positivePct: '0.0%', negativePct: '0.0%', csat: '0.0/10', avgRes: '0 hrs' }
];

export type DatasetType = 'enterprise' | 'appstore' | 'zendesk' | 'custom';

interface FeedbackContextType {
  isRetrieved: boolean;
  isServerMode: boolean; // true when data lives in DB (large CSV uploaded)
  activeDatasetType: DatasetType;
  datasetName: string;
  feedbackList: FeedbackItem[];
  stats: {
    totalFeedback: number;
    negativePct: string;
    positivePct: string;
    newThisWeek: number;
    csat?: string;
    nps?: string;
  };
  volumeData: Record<string, unknown>[];
  sentimentPieData: Array<{ name: string; value: number; color?: string }>;
  topThemesBarData: Record<string, unknown>[];
  channelSentimentData: Record<string, unknown>[];
  weeklySentimentTrend: Record<string, unknown>[];
  themeComparisonData: Record<string, unknown>[];
  sentimentDistributionData: Record<string, unknown>[];
  channelPerformanceList: Record<string, unknown>[];
  themeSummaries: ThemeSummary[];
  reportsList: CustomerReport[];
  isRetrieveModalOpen: boolean;
  openRetrieveModal: () => void;
  closeRetrieveModal: () => void;
  retrieveCSV: (datasetType?: DatasetType, customCsvText?: string) => void;
  resetToZero: () => void;
  addFeedbackItem: (item: FeedbackItem) => void;
  lastRetrievedTime: string | null;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

interface ServerStatsState {
  totalFeedback: number;
  positivePct: string;
  negativePct: string;
  newThisWeek: number;
  csat: string;
  nps: string;
}

interface ServerRawFeedback {
  id: string;
  customerLabel?: string;
  customerEmail?: string;
  channel?: string;
  content: string;
  sentiment?: string;
  themeName?: string;
  createdAt?: string;
}

interface ServerVolumeItem {
  date: string;
  count: number;
}

interface ServerThemeItem {
  name: string;
  count: number;
}

interface DashboardApiPayload {
  totalFeedback?: number;
  newThisWeek?: number;
  sentimentBreakdown?: {
    positive?: number;
    negative?: number;
    neutral?: number;
  };
  recentFeedback?: ServerRawFeedback[];
  volumeTrend?: ServerVolumeItem[];
  topThemes?: ServerThemeItem[];
}

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRetrieved, setIsRetrieved] = useState<boolean>(true);
  const [isServerMode, setIsServerMode] = useState<boolean>(false); // true = data is in DB
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeDatasetType, setActiveDatasetType] = useState<DatasetType>('enterprise');
  const [currentBundle, setCurrentBundle] = useState<ReturnType<typeof getDatasetBundle> | null>(() => getDatasetBundle('enterprise'));
  const [serverStats, setServerStats] = useState<ServerStatsState | null>(null);
  const [serverFeedback, setServerFeedback] = useState<FeedbackItem[]>([]);
  const [serverVolumeData, setServerVolumeData] = useState<Record<string, unknown>[] | null>(null);
  const [serverSentimentPie, setServerSentimentPie] = useState<Array<{ name: string; value: number; color?: string }> | null>(null);
  const [serverTopThemes, setServerTopThemes] = useState<Record<string, unknown>[] | null>(null);
  const [isRetrieveModalOpen, setIsRetrieveModalOpen] = useState<boolean>(false);
  const [lastRetrievedTime, setLastRetrievedTime] = useState<string | null>('Just now');
  const [customItemsList, setCustomItemsList] = useState<FeedbackItem[] | null>(null);

  const openRetrieveModal = () => setIsRetrieveModalOpen(true);
  const closeRetrieveModal = () => setIsRetrieveModalOpen(false);

  // Live Server Synchronization
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const { api } = await import('@/lib/api');
      const res = await api.get<DashboardApiPayload>('/dashboard');
      if (res.success && res.data) {
        const d = res.data;
        if (typeof d.totalFeedback === 'number' && d.totalFeedback > 0) {
          setIsServerMode(true);
          setIsRetrieved(true);
          const total = d.totalFeedback || 1;
          const pos = d.sentimentBreakdown?.positive || 0;
          const neg = d.sentimentBreakdown?.negative || 0;

          setServerStats({
            totalFeedback: d.totalFeedback,
            positivePct: `${Math.round((pos / total) * 100)}%`,
            negativePct: `${Math.round((neg / total) * 100)}%`,
            newThisWeek: d.newThisWeek || 0,
            csat: '8.6 / 10',
            nps: '+42 NPS'
          });

          if (d.recentFeedback && Array.isArray(d.recentFeedback)) {
            const mappedRecent: FeedbackItem[] = d.recentFeedback.map((f: ServerRawFeedback) => ({
              id: f.id.slice(0, 8),
              customerName: f.customerLabel || 'Verified Customer',
              customerEmail: f.customerEmail || 'user@example.com',
              channel: (f.channel as FeedbackItem['channel']) || 'CSV Import',
              feedback: f.content,
              sentiment: (f.sentiment === 'POSITIVE' ? 'Positive' : f.sentiment === 'NEGATIVE' ? 'Negative' : 'Neutral') as FeedbackItem['sentiment'],
              theme: (f.themeName as FeedbackItem['theme']) || 'UX Performance',
              status: 'New',
              date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Today'
            }));
            setServerFeedback(mappedRecent);
          }

          if (d.volumeTrend && Array.isArray(d.volumeTrend)) {
            setServerVolumeData(d.volumeTrend.map((v: ServerVolumeItem) => ({ date: v.date, volume: v.count })));
          }

          if (d.sentimentBreakdown) {
            setServerSentimentPie([
              { name: 'Positive', value: d.sentimentBreakdown.positive || 0, color: '#10B981' },
              { name: 'Negative', value: d.sentimentBreakdown.negative || 0, color: '#EF4444' },
              { name: 'Neutral', value: d.sentimentBreakdown.neutral || 0, color: '#F59E0B' }
            ]);
          }

          if (d.topThemes && Array.isArray(d.topThemes)) {
            setServerTopThemes(d.topThemes.map((t: ServerThemeItem) => ({ theme: t.name, count: t.count })));
          }

          setLastRetrievedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch {
      // Graceful fallback to local cache
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveCSV = (datasetType: DatasetType = 'enterprise', customCsvText?: string) => {
    // Special sentinel value '__server__' means the data was streamed to the DB
    if (customCsvText === '__server__') {
      setActiveDatasetType('custom');
      setIsServerMode(true);
      setCurrentBundle(null);
      setCustomItemsList(null);
      setIsRetrieved(true);
      setLastRetrievedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRetrieveModalOpen(false);
      refreshData();
      return;
    }

    const bundle = getDatasetBundle(datasetType, customCsvText);
    setActiveDatasetType(datasetType);
    setCurrentBundle(bundle);
    setServerStats(null);
    setServerFeedback([]);
    setServerVolumeData(null);
    setServerSentimentPie(null);
    setServerTopThemes(null);
    setCustomItemsList(null);
    setIsServerMode(false);
    setIsRetrieved(true);
    setLastRetrievedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsRetrieveModalOpen(false);
  };

  const resetToZero = () => {
    setIsRetrieved(false);
    setIsServerMode(false);
    setActiveDatasetType('enterprise');
    setCurrentBundle(null);
    setCustomItemsList(null);
    setLastRetrievedTime(null);
  };

  const addFeedbackItem = (item: FeedbackItem) => {
    if (!isRetrieved) {
      retrieveCSV('enterprise');
    }
    setCustomItemsList((prev) => [item, ...(prev || currentBundle?.feedbackList || [])]);
  };

  const activeFeedbackList = serverFeedback.length > 0
    ? serverFeedback
    : (customItemsList || currentBundle?.feedbackList || []);

  const stats = serverStats || {
    totalFeedback: isServerMode
      ? (currentBundle?.stats?.totalFeedback || 0)
      : isRetrieved
        ? Math.max(currentBundle?.stats?.totalFeedback || 0, activeFeedbackList.length)
        : 0,
    negativePct: isRetrieved ? (currentBundle?.stats?.negativePct || '0.0%') : '0.0%',
    positivePct: isRetrieved ? (currentBundle?.stats?.positivePct || '0.0%') : '0.0%',
    newThisWeek: isRetrieved ? (currentBundle?.stats?.newThisWeek || activeFeedbackList.length) : 0,
    csat: isRetrieved ? (currentBundle?.stats?.csat || '8.4 / 10') : '0.0 / 10',
    nps: isRetrieved ? (currentBundle?.stats?.nps || '+48 NPS') : '0 NPS'
  };

  const datasetName = isServerMode
    ? 'PostgreSQL / SQLite Database'
    : (currentBundle?.datasetName || 'Enterprise Customer Feedback Dataset (Q3)');

  const volumeData = serverVolumeData || (isRetrieved ? (currentBundle?.volumeData || []) : zeroVolumeData);
  const sentimentPieData = serverSentimentPie || (isRetrieved ? (currentBundle?.sentimentPieData || []) : zeroSentimentPieData);
  const topThemesBarData = serverTopThemes || (isRetrieved ? (currentBundle?.topThemesBarData || []) : zeroTopThemesBarData);
  const channelSentimentData = isRetrieved ? (currentBundle?.channelSentimentData || []) : zeroChannelSentimentData;
  const weeklySentimentTrend = isRetrieved ? (currentBundle?.weeklySentimentTrend || []) : zeroWeeklySentimentTrend;
  const themeComparisonData = isRetrieved ? (currentBundle?.themeComparisonData || []) : zeroThemeComparisonData;
  const sentimentDistributionData = isRetrieved ? (currentBundle?.sentimentDistributionData || []) : zeroSentimentDistributionData;
  const channelPerformanceList = isRetrieved ? (currentBundle?.channelPerformanceList || []) : zeroChannelPerformanceList;
  const themeSummaries = isRetrieved ? (currentBundle?.themeSummaries || []) : [];
  const reportsList = isRetrieved ? (currentBundle?.reportsList || []) : [];

  return (
    <FeedbackContext.Provider
      value={{
        isRetrieved,
        isServerMode,
        isLoading,
        activeDatasetType,
        datasetName,
        feedbackList: activeFeedbackList,
        stats,
        volumeData,
        sentimentPieData,
        topThemesBarData,
        channelSentimentData,
        weeklySentimentTrend,
        themeComparisonData,
        sentimentDistributionData,
        channelPerformanceList,
        themeSummaries,
        reportsList,
        isRetrieveModalOpen,
        openRetrieveModal,
        closeRetrieveModal,
        retrieveCSV,
        resetToZero,
        addFeedbackItem,
        lastRetrievedTime,
        refreshData
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackContext must be used within a FeedbackProvider');
  }
  return context;
};
