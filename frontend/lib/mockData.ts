import {
  FeedbackItem,
  ThemeSummary,
  CustomerReport,
  WorkspaceMember,
  ChatMessage,
  WorkspaceInfo,
  RetrievedSource
} from '@/types';

export const mockWorkspace: WorkspaceInfo = {
  id: 'ws-001',
  name: 'Acme SaaS Corp',
  slug: 'acme-saas',
  plan: 'Enterprise Tier',
  totalFeedbackCount: 1482,
  createdDate: '2025-01-15'
};

export const mockFeedbackList: FeedbackItem[] = [
  {
    id: 'FB-9021',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@stripe.com',
    channel: 'Zendesk',
    feedback: 'The bulk export feature constantly times out when trying to download more than 5,000 feedback records at once. Needs stream response support.',
    sentiment: 'Negative',
    sentimentScore: 24,
    theme: 'UX Performance',
    status: 'New',
    date: '2026-08-04',
    features: ['Export', 'Data Pipeline']
  },
  {
    id: 'FB-9022',
    customerName: 'David Chen',
    customerEmail: 'd.chen@linear.app',
    channel: 'Intercom',
    feedback: 'Asking Ask LOOP about quarterly theme drift saves our product team at least 10 hours of manual data tagging every week. Super crisp insights!',
    sentiment: 'Positive',
    sentimentScore: 94,
    theme: 'Feature Request',
    status: 'Processed',
    date: '2026-08-04',
    features: ['Ask LOOP', 'AI Tagging']
  },
  {
    id: 'FB-9023',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus@datadog.com',
    channel: 'App Store',
    feedback: 'Mobile app crashes on iOS 18 when attempting to filter theme cards by negative sentiment. Unusable on iPad.',
    sentiment: 'Negative',
    sentimentScore: 12,
    theme: 'Mobile Responsiveness',
    status: 'Under Review',
    date: '2026-08-03',
    features: ['iOS App', 'Filters']
  },
  {
    id: 'FB-9024',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@notion.so',
    channel: 'Email',
    feedback: 'We need native SAML SSO integration with Okta before we can deploy this to our 500+ global workforce.',
    sentiment: 'Neutral',
    sentimentScore: 50,
    theme: 'Security & Auth',
    status: 'New',
    date: '2026-08-03',
    features: ['SSO', 'Okta']
  },
  {
    id: 'FB-9025',
    customerName: 'Alex Thorne',
    customerEmail: 'alex@vercel.com',
    channel: 'Discourse',
    feedback: 'Annual pricing renewal rates feel steep given the lack of customizable dashboard widgets for executive reporting.',
    sentiment: 'Negative',
    sentimentScore: 35,
    theme: 'Billing & Pricing',
    status: 'Under Review',
    date: '2026-08-02',
    features: ['Pricing', 'Billing']
  },
  {
    id: 'FB-9026',
    customerName: 'Jessica Miller',
    customerEmail: 'jessica.m@figma.com',
    channel: 'Zendesk',
    feedback: 'The automatic classification of UI responsiveness bugs is accurate 95% of the time. Huge upgrade over manual spreadsheet tagging.',
    sentiment: 'Positive',
    sentimentScore: 88,
    theme: 'UX Performance',
    status: 'Processed',
    date: '2026-08-02',
    features: ['Auto Classification']
  },
  {
    id: 'FB-9027',
    customerName: 'Robert Sterling',
    customerEmail: 'robert@snowflake.com',
    channel: 'CSV Import',
    feedback: 'Can we get webhook notifications for critical high-priority negative feedback trends?',
    sentiment: 'Neutral',
    sentimentScore: 58,
    theme: 'Integration Request',
    status: 'New',
    date: '2026-08-01',
    features: ['Webhooks', 'Alerts']
  },
  {
    id: 'FB-9028',
    customerName: 'Amanda Lewis',
    customerEmail: 'amanda@slack.com',
    channel: 'Intercom',
    feedback: 'Dark mode contrast needs adjustment on table headers. The subtle gray border gets lost on high resolution monitors.',
    sentiment: 'Negative',
    sentimentScore: 42,
    theme: 'UX Performance',
    status: 'Archived',
    date: '2026-08-01',
    features: ['UI Theme', 'Tables']
  },
  {
    id: 'FB-9029',
    customerName: 'Brian K.',
    customerEmail: 'brian@atlassian.com',
    channel: 'Email',
    feedback: 'Jira integration sync delay is around 15 minutes. It should ideally be real-time via websockets.',
    sentiment: 'Neutral',
    sentimentScore: 48,
    theme: 'Integration Request',
    status: 'Under Review',
    date: '2026-07-31',
    features: ['Jira Integration']
  },
  {
    id: 'FB-9030',
    customerName: 'Claire Dupont',
    customerEmail: 'claire@algolia.com',
    channel: 'App Store',
    feedback: 'The skeuomorphic layout is stunning! Feels tactile and incredibly polished compared to flat web apps.',
    sentiment: 'Positive',
    sentimentScore: 98,
    theme: 'UX Performance',
    status: 'Processed',
    date: '2026-07-30',
    features: ['Design Aesthetic']
  },
  {
    id: 'FB-9031',
    customerName: 'Daniel Kim',
    customerEmail: 'dkim@mongodb.com',
    channel: 'Zendesk',
    feedback: 'Billing invoice PDF lacks breakdown of tax itemization required for EU VAT compliance.',
    sentiment: 'Negative',
    sentimentScore: 28,
    theme: 'Billing & Pricing',
    status: 'New',
    date: '2026-07-30',
    features: ['Invoicing', 'Tax Compliance']
  },
  {
    id: 'FB-9032',
    customerName: 'Hannah Abbott',
    customerEmail: 'hannah@hubspot.com',
    channel: 'Intercom',
    feedback: 'Requesting permission granularities so junior analysts can view feedback without exporting raw customer emails.',
    sentiment: 'Neutral',
    sentimentScore: 62,
    theme: 'Security & Auth',
    status: 'Under Review',
    date: '2026-07-29',
    features: ['RBAC', 'Permissions']
  }
];

export const mockThemeSummaries: ThemeSummary[] = [
  {
    id: 'thm-1',
    name: 'UX Performance',
    count: 542,
    sentimentBreakdown: { positive: 65, negative: 25, neutral: 10 },
    trendChange: '+18% this month',
    description: 'Feedback related to page render speeds, table interactions, export load times, and visual polish.',
    topQuotes: [
      'The bulk export feature constantly times out when trying to download more than 5,000 records.',
      'The skeuomorphic layout is stunning! Feels tactile and polished.',
      'Automatic classification of UI bugs is accurate 95% of the time.'
    ]
  },
  {
    id: 'thm-2',
    name: 'Billing & Pricing',
    count: 284,
    sentimentBreakdown: { positive: 20, negative: 60, neutral: 20 },
    trendChange: '-5% this month',
    description: 'Comments regarding subscription tiers, annual contract renewals, tax compliance, and invoice details.',
    topQuotes: [
      'Annual pricing renewal rates feel steep given the lack of customizable widgets.',
      'Billing invoice PDF lacks breakdown of tax itemization required for EU VAT compliance.'
    ]
  },
  {
    id: 'thm-3',
    name: 'Integration Request',
    count: 310,
    sentimentBreakdown: { positive: 40, negative: 30, neutral: 30 },
    trendChange: '+22% this month',
    description: 'Requests for third-party SaaS connectors like Jira, Slack, Zendesk, Salesforce, and Okta.',
    topQuotes: [
      'Can we get webhook notifications for critical high-priority negative feedback trends?',
      'Jira integration sync delay is around 15 minutes. It should ideally be real-time.'
    ]
  },
  {
    id: 'thm-4',
    name: 'Mobile Responsiveness',
    count: 198,
    sentimentBreakdown: { positive: 30, negative: 55, neutral: 15 },
    trendChange: '+8% this month',
    description: 'User reports on mobile app navigation, tablet viewports, and mobile filtering.',
    topQuotes: [
      'Mobile app crashes on iOS 18 when attempting to filter theme cards by negative sentiment.'
    ]
  },
  {
    id: 'thm-5',
    name: 'Security & Auth',
    count: 148,
    sentimentBreakdown: { positive: 50, negative: 20, neutral: 30 },
    trendChange: '+12% this month',
    description: 'Enterprise security, SAML SSO, Role-based Access Control (RBAC), and compliance queries.',
    topQuotes: [
      'We need native SAML SSO integration with Okta before enterprise rollout.',
      'Requesting permission granularities so junior analysts can view feedback without raw email exports.'
    ]
  }
];

export const mockReports: CustomerReport[] = [
  {
    id: 'rep-aug-2026-w1',
    title: 'Voice of Customer Report – August 2026 (Week 1)',
    type: 'Weekly',
    generatedDate: '2026-08-04',
    author: 'AI Synthesis Engine',
    totalFeedbackAnalyzed: 342,
    npsScore: +42,
    topPositives: [
      'Ask LOOP AI response velocity and context retrieval precision appreciated by senior PMs.',
      'Skeuomorphic tactile UI design receives high marks for readability and distinct corporate brand identity.'
    ],
    topNegatives: [
      'Export timeouts on datasets exceeding 5k records.',
      'iOS 18 app crash on theme filtering.'
    ],
    keyTakeaways: [
      'UX Performance remains the dominant conversation topic, accounting for 36% of all incoming tickets.',
      'Negative sentiment in Billing & Pricing decreased by 5% following the introduction of transparent tiered breakdown disclosures.'
    ],
    recommendations: [
      'Prioritize streaming CSV backend optimization to address export timeouts.',
      'Deploy patch release for iOS 18 theme filter crash.',
      'Accelerate Okta SAML SSO implementation to unlock pipeline enterprise deals.'
    ]
  },
  {
    id: 'rep-jul-2026-m',
    title: 'Voice of Customer Monthly Executive Brief – July 2026',
    type: 'Monthly',
    generatedDate: '2026-08-01',
    author: 'Chief Product Officer',
    totalFeedbackAnalyzed: 1482,
    npsScore: +38,
    topPositives: [
      'Automated theme clustering reduced customer ops triage time by 40%.',
      'High satisfaction with Intercom and Zendesk automated sync pipelines.'
    ],
    topNegatives: [
      'Enterprise customers requesting granular RBAC and audit logging.',
      'Lack of real-time websocket sync for Jira issues.'
    ],
    keyTakeaways: [
      'Total feedback volume grew by 24% month-over-month.',
      'Positive sentiment ratio stands strong at 62% across all channels.'
    ],
    recommendations: [
      'Finalize enterprise RBAC role matrix in Q3 roadmap.',
      'Establish webhook framework for high-priority negative sentiment alerts.'
    ]
  }
];

export const mockMembers: WorkspaceMember[] = [
  {
    id: 'usr-001',
    name: 'Praveen Kumar',
    email: 'praveen@acmesaas.com',
    role: 'Owner',
    status: 'Active',
    joinedDate: '2025-01-15'
  },
  {
    id: 'usr-002',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@acmesaas.com',
    role: 'Admin',
    status: 'Active',
    joinedDate: '2025-02-01'
  },
  {
    id: 'usr-003',
    name: 'Marcus Brody',
    email: 'marcus.brody@acmesaas.com',
    role: 'Analyst',
    status: 'Active',
    joinedDate: '2025-03-10'
  },
  {
    id: 'usr-004',
    name: 'Sophia Williams',
    email: 'sophia.w@acmesaas.com',
    role: 'Viewer',
    status: 'Pending',
    joinedDate: '2026-08-02'
  }
];

export const mockRetrievedSources: RetrievedSource[] = [
  {
    id: 'src-1',
    customer: 'Sarah Jenkins (Stripe)',
    channel: 'Zendesk',
    quote: 'The bulk export feature constantly times out when trying to download more than 5,000 feedback records at once.',
    date: '2026-08-04',
    sentiment: 'Negative',
    theme: 'UX Performance'
  },
  {
    id: 'src-2',
    customer: 'Alex Thorne (Vercel)',
    channel: 'Discourse',
    quote: 'Annual pricing renewal rates feel steep given the lack of customizable dashboard widgets for executive reporting.',
    date: '2026-08-02',
    sentiment: 'Negative',
    theme: 'Billing & Pricing'
  },
  {
    id: 'src-3',
    customer: 'David Chen (Linear)',
    channel: 'Intercom',
    quote: 'Asking Ask LOOP about quarterly theme drift saves our product team at least 10 hours of manual data tagging every week.',
    date: '2026-08-04',
    sentiment: 'Positive',
    theme: 'Feature Request'
  }
];

export const mockInitialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Welcome to **LOOP**. I am your customer feedback intelligence assistant. Ask me questions about recent sentiment trends, major themes, customer pain points, or export requests.',
    timestamp: '10:00 AM'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'What are the biggest negative drivers affecting enterprise customer sentiment this week?',
    timestamp: '10:02 AM'
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: 'Based on 342 analyzed feedback items from the past 7 days, the primary negative sentiment drivers are:\n\n1. **Data Export Timeouts (UX Performance)**: Customers with large accounts (e.g. Stripe) report 5,000+ row exports timing out.\n2. **Billing & Pricing Renewal Transparency**: Enterprise clients feel annual renewals need customizable reporting widgets.\n3. **iOS 18 Crash**: App Store feedback notes a crash when filtering theme cards on mobile.',
    timestamp: '10:03 AM',
    sources: mockRetrievedSources
  }
];

// Recharts datasets for Dashboard
export const mockVolumeData = [
  { date: 'Jul 29', volume: 42, positive: 28, negative: 10, neutral: 4 },
  { date: 'Jul 30', volume: 58, positive: 38, negative: 14, neutral: 6 },
  { date: 'Jul 31', volume: 65, positive: 45, negative: 12, neutral: 8 },
  { date: 'Aug 01', volume: 80, positive: 52, negative: 18, neutral: 10 },
  { date: 'Aug 02', volume: 74, positive: 48, negative: 16, neutral: 10 },
  { date: 'Aug 03', volume: 92, positive: 60, negative: 22, neutral: 10 },
  { date: 'Aug 04', volume: 110, positive: 72, negative: 26, neutral: 12 }
];

export const mockSentimentPieData = [
  { name: 'Positive', value: 62, color: '#6D8196' },
  { name: 'Negative', value: 24, color: '#4A4A4A' },
  { name: 'Neutral', value: 14, color: '#CBCBCB' }
];

export const mockTopThemesBarData = [
  { theme: 'UX Performance', count: 542 },
  { theme: 'Integration Request', count: 310 },
  { theme: 'Billing & Pricing', count: 284 },
  { theme: 'Mobile Resp.', count: 198 },
  { theme: 'Security & Auth', count: 148 }
];

export const mockThemeTrendLineData = [
  { week: 'Wk 1', UX: 90, Integrations: 45, Billing: 60, Mobile: 30 },
  { week: 'Wk 2', UX: 110, Integrations: 55, Billing: 52, Mobile: 35 },
  { week: 'Wk 3', UX: 135, Integrations: 70, Billing: 48, Mobile: 40 },
  { week: 'Wk 4', UX: 160, Integrations: 85, Billing: 55, Mobile: 45 }
];

// Dedicated Analytics Page Datasets
export const mockChannelSentimentData = [
  { channel: 'Zendesk', positive: 320, neutral: 85, negative: 142 },
  { channel: 'Intercom', positive: 280, neutral: 60, negative: 78 },
  { channel: 'App Store', positive: 95, neutral: 25, negative: 110 },
  { channel: 'Discourse', positive: 140, neutral: 45, negative: 35 },
  { channel: 'Email', positive: 82, neutral: 30, negative: 35 }
];

export const mockWeeklySentimentTrend = [
  { week: 'Wk 27', positivePct: 54, negativePct: 32 },
  { week: 'Wk 28', positivePct: 58, negativePct: 29 },
  { week: 'Wk 29', positivePct: 56, negativePct: 30 },
  { week: 'Wk 30', positivePct: 62, negativePct: 25 },
  { week: 'Wk 31', positivePct: 64, negativePct: 23 },
  { week: 'Wk 32', positivePct: 68, negativePct: 20 }
];

export const mockThemeComparisonData = [
  { theme: 'UX Performance', currentMonth: 542, prevMonth: 460 },
  { theme: 'Integration Request', currentMonth: 310, prevMonth: 254 },
  { theme: 'Billing & Pricing', currentMonth: 284, prevMonth: 298 },
  { theme: 'Mobile Responsiveness', currentMonth: 198, prevMonth: 182 },
  { theme: 'Security & Auth', currentMonth: 148, prevMonth: 132 }
];

export const mockSentimentDistributionData = [
  { range: '0-20 (Critical)', count: 48 },
  { range: '21-40 (Negative)', count: 184 },
  { range: '41-60 (Neutral)', count: 210 },
  { range: '61-80 (Positive)', count: 540 },
  { range: '81-100 (Delighted)', count: 500 }
];

export const mockChannelPerformanceList = [
  { channel: 'Zendesk Support', total: 547, positivePct: '58.5%', negativePct: '26.0%', csat: '8.2/10', avgRes: '3.4 hrs' },
  { channel: 'Intercom Live Chat', total: 418, positivePct: '67.0%', negativePct: '18.6%', csat: '8.9/10', avgRes: '1.2 hrs' },
  { channel: 'Apple App Store', total: 230, positivePct: '41.3%', negativePct: '47.8%', csat: '6.4/10', avgRes: '12.0 hrs' },
  { channel: 'Discourse Community', total: 220, positivePct: '63.6%', negativePct: '15.9%', csat: '8.6/10', avgRes: '4.8 hrs' },
  { channel: 'Direct Email Support', total: 147, positivePct: '55.8%', negativePct: '23.8%', csat: '7.8/10', avgRes: '6.1 hrs' }
];
