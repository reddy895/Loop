import {
  FeedbackItem,
  ThemeSummary,
  CustomerReport,
  SentimentType,
  FeedbackTheme,
  FeedbackChannel
} from '@/types';
import {
  mockFeedbackList as enterpriseFeedbackList,
  mockVolumeData as enterpriseVolumeData,
  mockSentimentPieData as enterpriseSentimentPieData,
  mockTopThemesBarData as enterpriseTopThemesBarData,
  mockChannelSentimentData as enterpriseChannelSentimentData,
  mockWeeklySentimentTrend as enterpriseWeeklySentimentTrend,
  mockThemeComparisonData as enterpriseThemeComparisonData,
  mockSentimentDistributionData as enterpriseSentimentDistributionData,
  mockChannelPerformanceList as enterpriseChannelPerformanceList,
  mockThemeSummaries as enterpriseThemeSummaries,
  mockReports as enterpriseReports
} from './mockData';

// -------------------------------------------------------------
// 1. App Store Dataset (Mobile Focus - 450 records)
// -------------------------------------------------------------
export const appStoreFeedbackList: FeedbackItem[] = [
  {
    id: 'AS-101',
    customerName: 'Marcus Vance (App Store)',
    customerEmail: 'marcus.v@gmail.com',
    channel: 'App Store',
    feedback: 'Mobile app crashes on iOS 18 when attempting to filter theme cards by negative sentiment. Unusable on iPad Air.',
    sentiment: 'Negative',
    sentimentScore: 12,
    theme: 'Mobile Responsiveness',
    status: 'New',
    date: '2026-08-05',
    features: ['iOS 18', 'Mobile App', 'Crash']
  },
  {
    id: 'AS-102',
    customerName: 'Claire Dupont (Google Play)',
    customerEmail: 'claire.d@android.net',
    channel: 'App Store',
    feedback: 'Biometric FaceID / fingerprint login fails 50% of the time after the v2.3 mobile update. Please fix authentication loop.',
    sentiment: 'Negative',
    sentimentScore: 22,
    theme: 'Security & Auth',
    status: 'Under Review',
    date: '2026-08-04',
    features: ['Biometrics', 'Android', 'Auth']
  },
  {
    id: 'AS-103',
    customerName: 'Liam O\'Connor (App Store)',
    customerEmail: 'liam@designstudio.io',
    channel: 'App Store',
    feedback: 'The dark mode OLED tactile feel on iPhone 15 Pro is gorgeous! Super responsive touch interactions.',
    sentiment: 'Positive',
    sentimentScore: 96,
    theme: 'UX Performance',
    status: 'Processed',
    date: '2026-08-04',
    features: ['Dark Mode', 'OLED UI']
  },
  {
    id: 'AS-104',
    customerName: 'Sophia Martinez (Google Play)',
    customerEmail: 'sophia.m@yahoo.com',
    channel: 'App Store',
    feedback: 'Tablet landscape layout cuts off rightmost table columns. Horizontal scrolling is sluggish on Galaxy Tab S9.',
    sentiment: 'Negative',
    sentimentScore: 28,
    theme: 'Mobile Responsiveness',
    status: 'New',
    date: '2026-08-03',
    features: ['Tablet', 'Layout']
  },
  {
    id: 'AS-105',
    customerName: 'Derek Taylor (App Store)',
    customerEmail: 'derek.t@techcorp.com',
    channel: 'App Store',
    feedback: 'Push notification badge icon count does not clear after reading tickets in mobile inbox.',
    sentiment: 'Negative',
    sentimentScore: 35,
    theme: 'Mobile Responsiveness',
    status: 'Under Review',
    date: '2026-08-02',
    features: ['Notifications', 'Mobile']
  },
  {
    id: 'AS-106',
    customerName: 'Elena Rostova (App Store)',
    customerEmail: 'elena.r@mobiledev.io',
    channel: 'App Store',
    feedback: 'Offline sync capability works surprisingly well when taking customer notes on flight mode!',
    sentiment: 'Positive',
    sentimentScore: 88,
    theme: 'UX Performance',
    status: 'Processed',
    date: '2026-08-01',
    features: ['Offline Sync', 'Mobile']
  }
];

export const appStoreVolumeData = [
  { date: 'Jul 29', volume: 45, positive: 18, negative: 22, neutral: 5 },
  { date: 'Jul 30', volume: 55, positive: 22, negative: 26, neutral: 7 },
  { date: 'Jul 31', volume: 62, positive: 25, negative: 30, neutral: 7 },
  { date: 'Aug 01', volume: 70, positive: 30, negative: 32, neutral: 8 },
  { date: 'Aug 02', volume: 68, positive: 28, negative: 32, neutral: 8 },
  { date: 'Aug 03', volume: 72, positive: 30, negative: 34, neutral: 8 },
  { date: 'Aug 04', volume: 78, positive: 36, negative: 35, neutral: 7 }
];

export const appStoreSentimentPieData = [
  { name: 'Positive', value: 42, color: '#6D8196' },
  { name: 'Negative', value: 45, color: '#4A4A4A' },
  { name: 'Neutral', value: 13, color: '#CBCBCB' }
];

export const appStoreTopThemesBarData = [
  { theme: 'Mobile Resp.', count: 210 },
  { theme: 'UX Performance', count: 120 },
  { theme: 'Security & Auth', count: 60 },
  { theme: 'Feature Request', count: 45 },
  { theme: 'Billing & Pricing', count: 15 }
];

export const appStoreChannelSentimentData = [
  { channel: 'App Store (iOS)', positive: 120, neutral: 35, negative: 145 },
  { channel: 'Google Play (Android)', positive: 69, neutral: 23, negative: 58 }
];

export const appStoreWeeklySentimentTrend = [
  { week: 'Wk 27', positivePct: 52, negativePct: 35 },
  { week: 'Wk 28', positivePct: 48, negativePct: 40 },
  { week: 'Wk 29', positivePct: 45, negativePct: 42 },
  { week: 'Wk 30', positivePct: 40, negativePct: 48 },
  { week: 'Wk 31', positivePct: 41, negativePct: 46 },
  { week: 'Wk 32', positivePct: 42, negativePct: 45 }
];

export const appStoreThemeComparisonData = [
  { theme: 'Mobile Responsiveness', currentMonth: 210, prevMonth: 140 },
  { theme: 'UX Performance', currentMonth: 120, prevMonth: 130 },
  { theme: 'Security & Auth', currentMonth: 60, prevMonth: 45 },
  { theme: 'Feature Request', currentMonth: 45, prevMonth: 40 },
  { theme: 'Billing & Pricing', currentMonth: 15, prevMonth: 20 }
];

export const appStoreSentimentDistributionData = [
  { range: '0-20 (Critical)', count: 95 },
  { range: '21-40 (Negative)', count: 108 },
  { range: '41-60 (Neutral)', count: 58 },
  { range: '61-80 (Positive)', count: 110 },
  { range: '81-100 (Delighted)', count: 79 }
];

export const appStoreChannelPerformanceList = [
  { channel: 'Apple App Store (iOS)', total: 300, positivePct: '40.0%', negativePct: '48.3%', csat: '5.8/10', avgRes: '6.2 hrs' },
  { channel: 'Google Play Store (Android)', total: 150, positivePct: '46.0%', negativePct: '38.7%', csat: '6.8/10', avgRes: '5.4 hrs' }
];

export const appStoreThemeSummaries: ThemeSummary[] = [
  {
    id: 'thm-as-1',
    name: 'Mobile Responsiveness',
    count: 210,
    sentimentBreakdown: { positive: 25, negative: 65, neutral: 10 },
    trendChange: '+42% spikes after iOS 18 release',
    description: 'Mobile tablet layouts, landscape mode columns cutoff, and iOS 18 filtering crash reports.',
    topQuotes: [
      'Mobile app crashes on iOS 18 when attempting to filter theme cards.',
      'Tablet landscape layout cuts off rightmost table columns on iPad.',
      'Push notification badge icon count does not clear.'
    ]
  },
  {
    id: 'thm-as-2',
    name: 'UX Performance',
    count: 120,
    sentimentBreakdown: { positive: 70, negative: 20, neutral: 10 },
    trendChange: '+8% this month',
    description: 'OLED dark mode, touch gesture response, and offline note taking.',
    topQuotes: [
      'The dark mode OLED tactile feel on iPhone 15 Pro is gorgeous!',
      'Offline sync capability works surprisingly well on flight mode.'
    ]
  }
];

export const appStoreReports: CustomerReport[] = [
  {
    id: 'rep-as-001',
    title: 'Mobile App Store & iOS 18 Stability Brief',
    type: 'Weekly',
    generatedDate: '2026-08-05',
    author: 'Mobile Lead (App Intelligence)',
    totalFeedbackAnalyzed: 450,
    npsScore: -3,
    topPositives: [
      'High approval rating for OLED Dark Mode aesthetic on mobile devices.',
      'Offline note taking sync praised by field representatives.'
    ],
    topNegatives: [
      'Critical crash on iOS 18 when filtering negative sentiment cards.',
      'Biometric authentication loop failing on Android 14 devices.'
    ],
    keyTakeaways: [
      'Mobile sentiment dropped by 18% following the v2.3 release due to iOS 18 memory leaks.',
      'iPad landscape layout requires urgent breakpoint adjustment.'
    ],
    recommendations: [
      'Deploy v2.3.1 emergency patch fixing iOS 18 filter crash.',
      'Refactor tablet table container to enable native horizontal swipe gestures.'
    ]
  }
];

// -------------------------------------------------------------
// 2. Support Tickets & Live Chat Dataset (Support Focus - 340 records)
// -------------------------------------------------------------
export const zendeskFeedbackList: FeedbackItem[] = [
  {
    id: 'ZD-301',
    customerName: 'Sarah Jenkins (Stripe)',
    customerEmail: 's.jenkins@stripe.com',
    channel: 'Zendesk',
    feedback: 'Ticket #8901: Customer support resolved our webhook payload schema query in under 12 minutes! World class service.',
    sentiment: 'Positive',
    sentimentScore: 98,
    theme: 'Integration Request',
    status: 'Processed',
    date: '2026-08-05',
    features: ['Webhooks', 'Zendesk Ticket']
  },
  {
    id: 'ZD-302',
    customerName: 'David Chen (Linear)',
    customerEmail: 'd.chen@linear.app',
    channel: 'Intercom',
    feedback: 'Intercom Live Chat: Asking about SAML Okta integration guides. Support agent provided direct step-by-step setup docs.',
    sentiment: 'Positive',
    sentimentScore: 92,
    theme: 'Security & Auth',
    status: 'Processed',
    date: '2026-08-04',
    features: ['Okta SSO', 'Intercom Chat']
  },
  {
    id: 'ZD-303',
    customerName: 'Daniel Kim (MongoDB)',
    customerEmail: 'dkim@mongodb.com',
    channel: 'Zendesk',
    feedback: 'Ticket #8905: Billing invoice PDF lacks breakdown of tax itemization required for EU VAT compliance.',
    sentiment: 'Negative',
    sentimentScore: 28,
    theme: 'Billing & Pricing',
    status: 'New',
    date: '2026-08-04',
    features: ['VAT Tax', 'Invoicing']
  },
  {
    id: 'ZD-304',
    customerName: 'Hannah Abbott (HubSpot)',
    customerEmail: 'hannah@hubspot.com',
    channel: 'Intercom',
    feedback: 'Intercom Chat: Can we configure automated email summaries for unresolved high priority support escalations?',
    sentiment: 'Neutral',
    sentimentScore: 65,
    theme: 'Integration Request',
    status: 'Under Review',
    date: '2026-08-03',
    features: ['Escalations', 'Email']
  },
  {
    id: 'ZD-305',
    customerName: 'Brian K. (Atlassian)',
    customerEmail: 'brian@atlassian.com',
    channel: 'Zendesk',
    feedback: 'Ticket #8910: Jira integration sync delay is around 15 minutes. Can support accelerate websocket sync rate?',
    sentiment: 'Neutral',
    sentimentScore: 50,
    theme: 'Integration Request',
    status: 'Under Review',
    date: '2026-08-02',
    features: ['Jira Sync', 'Websockets']
  }
];

export const zendeskVolumeData = [
  { date: 'Jul 29', volume: 30, positive: 22, negative: 5, neutral: 3 },
  { date: 'Jul 30', volume: 42, positive: 32, negative: 6, neutral: 4 },
  { date: 'Jul 31', volume: 48, positive: 36, negative: 8, neutral: 4 },
  { date: 'Aug 01', volume: 55, positive: 40, negative: 10, neutral: 5 },
  { date: 'Aug 02', volume: 50, positive: 36, negative: 9, neutral: 5 },
  { date: 'Aug 03', volume: 58, positive: 42, negative: 10, neutral: 6 },
  { date: 'Aug 04', volume: 57, positive: 41, negative: 10, neutral: 6 }
];

export const zendeskSentimentPieData = [
  { name: 'Positive', value: 72, color: '#6D8196' },
  { name: 'Negative', value: 19, color: '#4A4A4A' },
  { name: 'Neutral', value: 9, color: '#CBCBCB' }
];

export const zendeskTopThemesBarData = [
  { theme: 'Integration Request', count: 140 },
  { theme: 'UX Performance', count: 90 },
  { theme: 'Security & Auth', count: 70 },
  { theme: 'Billing & Pricing', count: 40 }
];

export const zendeskChannelSentimentData = [
  { channel: 'Zendesk Support Desk', positive: 160, neutral: 20, negative: 40 },
  { channel: 'Intercom Live Chat', positive: 86, neutral: 10, negative: 24 }
];

export const zendeskWeeklySentimentTrend = [
  { week: 'Wk 27', positivePct: 65, negativePct: 24 },
  { week: 'Wk 28', positivePct: 68, negativePct: 22 },
  { week: 'Wk 29', positivePct: 70, negativePct: 20 },
  { week: 'Wk 30', positivePct: 72, negativePct: 19 },
  { week: 'Wk 31', positivePct: 74, negativePct: 18 },
  { week: 'Wk 32', positivePct: 73, negativePct: 19 }
];

export const zendeskThemeComparisonData = [
  { theme: 'Integration Request', currentMonth: 140, prevMonth: 110 },
  { theme: 'UX Performance', currentMonth: 90, prevMonth: 85 },
  { theme: 'Security & Auth', currentMonth: 70, prevMonth: 50 },
  { theme: 'Billing & Pricing', currentMonth: 40, prevMonth: 45 }
];

export const zendeskSentimentDistributionData = [
  { range: '0-20 (Critical)', count: 15 },
  { range: '21-40 (Negative)', count: 49 },
  { range: '41-60 (Neutral)', count: 31 },
  { range: '61-80 (Positive)', count: 105 },
  { range: '81-100 (Delighted)', count: 140 }
];

export const zendeskChannelPerformanceList = [
  { channel: 'Zendesk Support Desk', total: 220, positivePct: '72.7%', negativePct: '18.2%', csat: '9.2/10', avgRes: '1.8 hrs' },
  { channel: 'Intercom Live Chat', total: 120, positivePct: '71.6%', negativePct: '20.0%', csat: '8.9/10', avgRes: '0.4 hrs' }
];

export const zendeskThemeSummaries: ThemeSummary[] = [
  {
    id: 'thm-zd-1',
    name: 'Integration Request',
    count: 140,
    sentimentBreakdown: { positive: 75, negative: 15, neutral: 10 },
    trendChange: '+28% support queries',
    description: 'Questions regarding Webhook payload schemas, Jira sync speed, and API connectors.',
    topQuotes: [
      'Customer support resolved our webhook payload schema query in under 12 minutes!',
      'Jira integration sync delay is around 15 minutes. Can support accelerate websocket rate?'
    ]
  },
  {
    id: 'thm-zd-2',
    name: 'Security & Auth',
    count: 70,
    sentimentBreakdown: { positive: 80, negative: 10, neutral: 10 },
    trendChange: '+40% Okta queries',
    description: 'Okta SAML SSO walkthroughs and role-based access permission setups.',
    topQuotes: [
      'Support agent provided direct step-by-step SAML setup docs over Intercom chat.'
    ]
  }
];

export const zendeskReports: CustomerReport[] = [
  {
    id: 'rep-zd-001',
    title: 'Support Desk Resolution & SLA Benchmark Brief',
    type: 'Weekly',
    generatedDate: '2026-08-04',
    author: 'Support Operations VP',
    totalFeedbackAnalyzed: 340,
    npsScore: +54,
    topPositives: [
      'Intercom live chat average response time under 25 minutes.',
      'High CSAT rating (9.2/10) for webhook API integration troubleshooting.'
    ],
    topNegatives: [
      'EU VAT invoice itemization queries require accounting manual response.',
      'Jira sync polling rate requested to upgrade to real-time websockets.'
    ],
    keyTakeaways: [
      'Support ticket resolution velocity improved by 35% following agent AI prompt assistant roll out.',
      'Customer satisfaction index reached a record high of 9.1/10.'
    ],
    recommendations: [
      'Automate EU VAT tax breakdown PDF generation on billing checkout.',
      'Publish websocket streaming connector guide for Jira integration.'
    ]
  }
];

// -------------------------------------------------------------
// 3. Custom CSV Dynamic Parser & Calculator
// -------------------------------------------------------------
// Max rows to parse client-side. Beyond this, streaming upload (streamingCsvUploader.ts) should be used.
export const MAX_CLIENT_SIDE_ROWS = 10_000;

export function parseCustomCsvContent(csvText: string): FeedbackItem[] {
  if (!csvText || !csvText.trim()) return [];
  // Detect streaming upload sentinel — data is already in DB
  if (csvText === '__server__' || csvText.startsWith('[Large file selected:')) return [];

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  // Safety cap: client-side parsing is limited to MAX_CLIENT_SIDE_ROWS data rows
  // Larger files should use the streaming uploader in streamingCsvUploader.ts
  const dataRowCount = lines.length - 1; // subtract header
  if (dataRowCount > MAX_CLIENT_SIDE_ROWS) {
    console.warn(
      `[datasetGenerator] CSV has ${dataRowCount.toLocaleString()} rows — exceeds client-side limit of ${MAX_CLIENT_SIDE_ROWS.toLocaleString()}. ` +
      'Only the first 10,000 rows will be parsed. Use streaming upload for large files.'
    );
    lines.splice(MAX_CLIENT_SIDE_ROWS + 1); // keep header + first 10k rows
  }



  // Helper to parse line handling quotes
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const firstLineCols = parseLine(lines[0]);
  const hasHeader = firstLineCols.some((c) =>
    ['customer', 'name', 'email', 'channel', 'feedback', 'text', 'sentiment', 'theme', 'message'].includes(
      c.toLowerCase().replace(/[^a-z]/g, '')
    )
  );

  const headers = hasHeader
    ? firstLineCols.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))
    : ['customername', 'channel', 'feedback', 'sentiment', 'theme'];

  const dataRows = hasHeader ? lines.slice(1) : lines;
  const parsedItems: FeedbackItem[] = [];

  dataRows.forEach((rowStr, idx) => {
    const vals = parseLine(rowStr);
    if (vals.every((v) => !v)) return;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, i) => {
      rowObj[h] = vals[i] || '';
    });

    const customerName = rowObj['customername'] || rowObj['customer'] || rowObj['name'] || `Customer #${idx + 1}`;
    const customerEmail = rowObj['customeremail'] || rowObj['email'] || `${customerName.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    const channelRaw = rowObj['channel'] || rowObj['source'] || 'CSV Import';
    const feedback = rowObj['feedback'] || rowObj['text'] || rowObj['message'] || rowObj['content'] || rowStr;

    // Detect Sentiment
    let sentiment: SentimentType = 'Neutral';
    const rawSent = (rowObj['sentiment'] || '').toUpperCase();
    if (rawSent.includes('POS')) sentiment = 'Positive';
    else if (rawSent.includes('NEG')) sentiment = 'Negative';
    else {
      const txt = feedback.toLowerCase();
      if (txt.match(/great|love|awesome|fantastic|perfect|fast|excellent|good|stunning|crisp|upgrade/)) {
        sentiment = 'Positive';
      } else if (txt.match(/crash|bug|terrible|slow|bad|broken|fail|timeout|steep|unusable|issue|error/)) {
        sentiment = 'Negative';
      }
    }

    // Detect Theme
    let theme: FeedbackTheme = 'UX Performance';
    const rawTheme = rowObj['theme'] || '';
    if (rawTheme.match(/mobile|phone|ios|android|ipad/i)) theme = 'Mobile Responsiveness';
    else if (rawTheme.match(/bill|price|cost|tax|invoice/i)) theme = 'Billing & Pricing';
    else if (rawTheme.match(/integration|webhook|jira|api/i)) theme = 'Integration Request';
    else if (rawTheme.match(/security|auth|sso|okta|login/i)) theme = 'Security & Auth';
    else {
      const txt = feedback.toLowerCase();
      if (txt.match(/mobile|ios|android|ipad|tablet/)) theme = 'Mobile Responsiveness';
      else if (txt.match(/price|cost|bill|invoice|tax/)) theme = 'Billing & Pricing';
      else if (txt.match(/webhook|api|jira|connector|integration/)) theme = 'Integration Request';
      else if (txt.match(/sso|okta|login|auth|saml|password/)) theme = 'Security & Auth';
    }

    const channel: FeedbackChannel = channelRaw.includes('Zendesk')
      ? 'Zendesk'
      : channelRaw.includes('Intercom')
      ? 'Intercom'
      : channelRaw.includes('App Store')
      ? 'App Store'
      : channelRaw.includes('Discourse')
      ? 'Discourse'
      : channelRaw.includes('Email')
      ? 'Email'
      : 'CSV Import';

    parsedItems.push({
      id: `CSV-${1000 + idx}`,
      customerName,
      customerEmail,
      channel,
      feedback,
      sentiment,
      sentimentScore: sentiment === 'Positive' ? 88 : sentiment === 'Negative' ? 22 : 50,
      theme,
      status: idx % 3 === 0 ? 'New' : idx % 3 === 1 ? 'Under Review' : 'Processed',
      date: new Date().toISOString().split('T')[0],
      features: ['Custom CSV', theme]
    });
  });

  return parsedItems;
}

// -------------------------------------------------------------
// 4. Dynamic Dashboard Bundle Calculator for Custom CSV
// -------------------------------------------------------------
export function calculateCustomDatasetBundle(items: FeedbackItem[], filename = 'Custom Uploaded CSV') {
  const total = items.length;
  if (total === 0) return null;

  const posCount = items.filter((i) => i.sentiment === 'Positive').length;
  const negCount = items.filter((i) => i.sentiment === 'Negative').length;
  const neuCount = items.filter((i) => i.sentiment === 'Neutral').length;

  const posPct = ((posCount / total) * 100).toFixed(1) + '%';
  const negPct = ((negCount / total) * 100).toFixed(1) + '%';
  const neuPct = ((neuCount / total) * 100).toFixed(1) + '%';

  // Volume over past 7 days
  const baseVol = Math.max(1, Math.round(total / 7));
  const volumeData = [
    { date: 'Jul 29', volume: Math.round(baseVol * 0.8), positive: Math.round(baseVol * 0.5), negative: Math.round(baseVol * 0.2), neutral: Math.round(baseVol * 0.1) },
    { date: 'Jul 30', volume: Math.round(baseVol * 0.9), positive: Math.round(baseVol * 0.6), negative: Math.round(baseVol * 0.2), neutral: Math.round(baseVol * 0.1) },
    { date: 'Jul 31', volume: baseVol, positive: Math.round(baseVol * 0.6), negative: Math.round(baseVol * 0.3), neutral: Math.round(baseVol * 0.1) },
    { date: 'Aug 01', volume: Math.round(baseVol * 1.2), positive: Math.round(baseVol * 0.7), negative: Math.round(baseVol * 0.3), neutral: Math.round(baseVol * 0.2) },
    { date: 'Aug 02', volume: Math.round(baseVol * 1.1), positive: Math.round(baseVol * 0.7), negative: Math.round(baseVol * 0.3), neutral: Math.round(baseVol * 0.1) },
    { date: 'Aug 03', volume: Math.round(baseVol * 1.3), positive: Math.round(baseVol * 0.8), negative: Math.round(baseVol * 0.4), neutral: Math.round(baseVol * 0.1) },
    { date: 'Aug 04', volume: Math.round(baseVol * 1.4), positive: Math.round(baseVol * 0.9), negative: Math.round(baseVol * 0.4), neutral: Math.round(baseVol * 0.1) }
  ];

  const sentimentPieData = [
    { name: 'Positive', value: Math.round((posCount / total) * 100), color: '#6D8196' },
    { name: 'Negative', value: Math.round((negCount / total) * 100), color: '#4A4A4A' },
    { name: 'Neutral', value: Math.round((neuCount / total) * 100), color: '#CBCBCB' }
  ];

  // Theme counts
  const themeCounts: Record<string, number> = {};
  items.forEach((i) => {
    themeCounts[i.theme] = (themeCounts[i.theme] || 0) + 1;
  });

  const topThemesBarData = Object.entries(themeCounts).map(([theme, count]) => ({ theme, count }));

  // Channels
  const channelCounts: Record<string, { pos: number; neu: number; neg: number }> = {};
  items.forEach((i) => {
    if (!channelCounts[i.channel]) channelCounts[i.channel] = { pos: 0, neu: 0, neg: 0 };
    if (i.sentiment === 'Positive') channelCounts[i.channel].pos++;
    else if (i.sentiment === 'Negative') channelCounts[i.channel].neg++;
    else channelCounts[i.channel].neu++;
  });

  const channelSentimentData = Object.entries(channelCounts).map(([channel, c]) => ({
    channel,
    positive: c.pos,
    neutral: c.neu,
    negative: c.neg
  }));

  const channelPerformanceList = Object.entries(channelCounts).map(([channel, c]) => {
    const chTotal = c.pos + c.neu + c.neg;
    return {
      channel,
      total: chTotal,
      positivePct: ((c.pos / chTotal) * 100).toFixed(1) + '%',
      negativePct: ((c.neg / chTotal) * 100).toFixed(1) + '%',
      csat: (7.5 + (c.pos / chTotal) * 2.0).toFixed(1) + '/10',
      avgRes: '2.5 hrs'
    };
  });

  const themeSummaries: ThemeSummary[] = Object.entries(themeCounts).map(([name, count], idx) => {
    const tItems = items.filter((i) => i.theme === name);
    const tPos = tItems.filter((i) => i.sentiment === 'Positive').length;
    const tNeg = tItems.filter((i) => i.sentiment === 'Negative').length;
    const tNeu = tItems.filter((i) => i.sentiment === 'Neutral').length;

    return {
      id: `thm-custom-${idx}`,
      name: name as FeedbackTheme,
      count,
      sentimentBreakdown: {
        positive: Math.round((tPos / Math.max(1, count)) * 100),
        negative: Math.round((tNeg / Math.max(1, count)) * 100),
        neutral: Math.round((tNeu / Math.max(1, count)) * 100)
      },
      trendChange: `+${Math.round(count * 3.5)}% extracted from CSV`,
      description: `Analysis derived from custom CSV records tagged as ${name}.`,
      topQuotes: tItems.slice(0, 3).map((i) => i.feedback)
    };
  });

  const reports: CustomerReport[] = [
    {
      id: `rep-custom-${Date.now()}`,
      title: `Custom CSV Intelligence Brief (${filename})`,
      type: 'Weekly',
      generatedDate: new Date().toISOString().split('T')[0],
      author: 'LOOP AI Data Engine',
      totalFeedbackAnalyzed: total,
      npsScore: Math.round(((posCount - negCount) / total) * 100),
      topPositives: items.filter((i) => i.sentiment === 'Positive').slice(0, 2).map((i) => i.feedback),
      topNegatives: items.filter((i) => i.sentiment === 'Negative').slice(0, 2).map((i) => i.feedback),
      keyTakeaways: [
        `Processed ${total} records from ${filename} with automated sentiment extraction.`,
        `Identified ${posPct} positive feedback share and ${negPct} negative share.`
      ],
      recommendations: [
        'Review top negative feedback items for immediate resolution.',
        'Share CSV synthesis report with product leadership.'
      ]
    }
  ];

  return {
    totalRecords: total,
    posPct,
    negPct,
    neuPct,
    volumeData,
    sentimentPieData,
    topThemesBarData,
    channelSentimentData,
    channelPerformanceList,
    themeSummaries,
    reports
  };
}

// -------------------------------------------------------------
// 5. Default Preset Export Resolver
// -------------------------------------------------------------
export function getDatasetBundle(datasetType: 'enterprise' | 'appstore' | 'zendesk' | 'custom', customCsvText?: string) {
  if (datasetType === 'appstore') {
    return {
      datasetName: 'App Store Mobile iOS/Android Reviews',
      feedbackList: appStoreFeedbackList,
      stats: {
        totalFeedback: 450,
        positivePct: '42.0%',
        negativePct: '45.0%',
        newThisWeek: 180,
        csat: '6.2 / 10',
        nps: '-3 NPS'
      },
      volumeData: appStoreVolumeData,
      sentimentPieData: appStoreSentimentPieData,
      topThemesBarData: appStoreTopThemesBarData,
      channelSentimentData: appStoreChannelSentimentData,
      weeklySentimentTrend: appStoreWeeklySentimentTrend,
      themeComparisonData: appStoreThemeComparisonData,
      sentimentDistributionData: appStoreSentimentDistributionData,
      channelPerformanceList: appStoreChannelPerformanceList,
      themeSummaries: appStoreThemeSummaries,
      reportsList: appStoreReports
    };
  }

  if (datasetType === 'zendesk') {
    return {
      datasetName: 'Support Tickets & Live Chat Influx',
      feedbackList: zendeskFeedbackList,
      stats: {
        totalFeedback: 340,
        positivePct: '72.5%',
        negativePct: '18.5%',
        newThisWeek: 120,
        csat: '9.1 / 10',
        nps: '+54 NPS'
      },
      volumeData: zendeskVolumeData,
      sentimentPieData: zendeskSentimentPieData,
      topThemesBarData: zendeskTopThemesBarData,
      channelSentimentData: zendeskChannelSentimentData,
      weeklySentimentTrend: zendeskWeeklySentimentTrend,
      themeComparisonData: zendeskThemeComparisonData,
      sentimentDistributionData: zendeskSentimentDistributionData,
      channelPerformanceList: zendeskChannelPerformanceList,
      themeSummaries: zendeskThemeSummaries,
      reportsList: zendeskReports
    };
  }

  if (datasetType === 'custom' && customCsvText) {
    const items = parseCustomCsvContent(customCsvText);
    const bundle = calculateCustomDatasetBundle(items, 'Custom Uploaded CSV');

    if (bundle) {
      return {
        datasetName: 'Custom CSV Dataset',
        feedbackList: items,
        stats: {
          totalFeedback: bundle.totalRecords,
          positivePct: bundle.posPct,
          negativePct: bundle.negPct,
          newThisWeek: bundle.totalRecords,
          csat: '7.8 / 10',
          nps: `${Math.round(((items.filter(i => i.sentiment === 'Positive').length - items.filter(i => i.sentiment === 'Negative').length) / items.length) * 100)} NPS`
        },
        volumeData: bundle.volumeData,
        sentimentPieData: bundle.sentimentPieData,
        topThemesBarData: bundle.topThemesBarData,
        channelSentimentData: bundle.channelSentimentData,
        weeklySentimentTrend: enterpriseWeeklySentimentTrend,
        themeComparisonData: enterpriseThemeComparisonData,
        sentimentDistributionData: enterpriseSentimentDistributionData,
        channelPerformanceList: bundle.channelPerformanceList,
        themeSummaries: bundle.themeSummaries,
        reportsList: bundle.reports
      };
    }
  }

  // Default: Enterprise Dataset (Q3)
  return {
    datasetName: 'Enterprise Customer Feedback Dataset (Q3)',
    feedbackList: enterpriseFeedbackList,
    stats: {
      totalFeedback: 1482,
      positivePct: '61.8%',
      negativePct: '24.2%',
      newThisWeek: 342,
      csat: '8.4 / 10',
      nps: '+48 NPS'
    },
    volumeData: enterpriseVolumeData,
    sentimentPieData: enterpriseSentimentPieData,
    topThemesBarData: enterpriseTopThemesBarData,
    channelSentimentData: enterpriseChannelSentimentData,
    weeklySentimentTrend: enterpriseWeeklySentimentTrend,
    themeComparisonData: enterpriseThemeComparisonData,
    sentimentDistributionData: enterpriseSentimentDistributionData,
    channelPerformanceList: enterpriseChannelPerformanceList,
    themeSummaries: enterpriseThemeSummaries,
    reportsList: enterpriseReports
  };
}
