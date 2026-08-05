export type SentimentType = 'Positive' | 'Negative' | 'Neutral';
export type FeedbackChannel = 'Zendesk' | 'Intercom' | 'App Store' | 'Discourse' | 'Email' | 'CSV Import';
export type FeedbackStatus = 'New' | 'Under Review' | 'Processed' | 'Archived';
export type FeedbackTheme = 
  | 'UX Performance' 
  | 'Billing & Pricing' 
  | 'Integration Request' 
  | 'Mobile Responsiveness' 
  | 'Feature Request'
  | 'Security & Auth';

export interface FeedbackItem {
  id: string;
  customerName: string;
  customerEmail: string;
  avatarUrl?: string;
  channel: FeedbackChannel;
  feedback: string;
  sentiment: SentimentType;
  sentimentScore: number; // 0 to 100
  theme: FeedbackTheme;
  status: FeedbackStatus;
  date: string;
  features: string[];
}

export interface ThemeSummary {
  id: string;
  name: FeedbackTheme;
  count: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  trendChange: string; // e.g. "+14% this week"
  description: string;
  topQuotes: string[];
}

export interface CustomerReport {
  id: string;
  title: string;
  type: 'Weekly' | 'Monthly' | 'Custom';
  generatedDate: string;
  author: string;
  totalFeedbackAnalyzed: number;
  npsScore: number;
  topPositives: string[];
  topNegatives: string[];
  keyTakeaways: string[];
  recommendations: string[];
}

export type MemberRole = 'Owner' | 'Admin' | 'Analyst' | 'Viewer';

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarUrl?: string;
  status: 'Active' | 'Pending';
  joinedDate: string;
}

export interface RetrievedSource {
  id: string;
  customer: string;
  channel: string;
  quote: string;
  date: string;
  sentiment: SentimentType;
  theme: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: RetrievedSource[];
}

export interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  plan: string;
  totalFeedbackCount: number;
  createdDate: string;
}
