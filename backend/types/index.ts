/**
 * @file types/index.ts
 * @description Consolidated domain types and interfaces contract for backend application.
 */

// Environment & Configuration Types
export type NodeEnvironment = "development" | "production" | "test";

export interface IEnvironmentVariables {
  DATABASE_URL: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  GEMINI_API_KEY?: string;
  OLLAMA_BASE_URL?: string;
  NODE_ENV: NodeEnvironment;
}

export interface IAppConfig {
  databaseUrl: string;
  nextAuthUrl: string;
  nextAuthSecret: string;
  geminiApiKey?: string;
  ollamaBaseUrl?: string;
  nodeEnv: NodeEnvironment;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

// API Response & Pagination Types
export interface IApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface IApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export type ApiResponse<T> = IApiSuccessResponse<T> | IApiErrorResponse;

export interface ISuccessPayload<T> {
  success: true;
  message: string;
  data: T;
}

export interface IErrorPayload {
  success: false;
  message: string;
  errors: string[];
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedData<T> {
  items: T[];
  pagination: IPaginationMeta;
}

// Utility Types
export type SortOrder = "asc" | "desc";

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface ISearchQuery extends IPaginationQuery {
  search?: string;
  filter?: Record<string, string | number | boolean>;
}

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

// Error Types
export interface IFieldError {
  field: string;
  message: string;
}

export interface IErrorDetails {
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
  path?: string;
}

// Logger Types
export interface ILogContext {
  requestId?: string;
  route?: string;
  method?: string;
  status?: number;
  executionTime?: number;
  [key: string]: unknown;
}

export interface ILogger {
  info(message: string, context?: ILogContext): void;
  warn(message: string, context?: ILogContext): void;
  error(message: string, error?: Error | unknown, context?: ILogContext): void;
  debug(message: string, context?: ILogContext): void;
}

// AI Provider & Core AI Types
export interface IClassificationResult {
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  sentimentScore: number;
  themes: string[];
  featureArea: string;
  summary: string;
}

export interface IThemeClusterResult {
  clusters: Array<{
    themeId?: string;
    themeName: string;
    feedbackIds: string[];
    confidenceScore: number;
    trend: "UP" | "DOWN" | "STABLE";
  }>;
}

export interface IVoiceOfCustomerReport {
  reportId: string;
  workspaceId: string;
  generatedAt: string;
  sections: {
    executiveSummary: string;
    topThemes: Array<{ name: string; count: number; sentimentScore: number }>;
    sentimentOverview: { positivePercentage: number; neutralPercentage: number; negativePercentage: number };
    customerQuotes: Array<{ quote: string; channel: string; customerLabel: string }>;
    recommendedActions: string[];
    riskAreas: string[];
    opportunities: string[];
    summary: string;
  };
}

export interface IAskLoopResponse {
  answer: string;
  evidence: Array<{ feedbackId: string; quote: string; channel: string }>;
  feedbackIds: string[];
  confidence: number;
}

export interface IAiAnalysisResult {
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  sentimentScore: number;
  extractedThemes: string[];
  summary: string;
  actionableInsights: string[];
}

export interface IAiProvider {
  readonly providerName: string;
  generateText(prompt: string): Promise<string>;
  classifyFeedback(content: string): Promise<IClassificationResult>;
  clusterThemes(
    feedbackItems: Array<{ id: string; content: string }>,
    existingThemes: Array<{ id: string; name: string }>
  ): Promise<IThemeClusterResult>;
  generateReport(data: unknown): Promise<IVoiceOfCustomerReport>;
  askQuestion(question: string, context: string[]): Promise<IAskLoopResponse>;
  generateEmbedding(text: string): Promise<number[]>;
  summarize(text: string): Promise<string>;
  analyzeSentiment(feedbackText: string): Promise<"POSITIVE" | "NEUTRAL" | "NEGATIVE">;
  extractThemes(feedbackText: string): Promise<string[]>;
  analyzeFeedback(feedbackText: string): Promise<IAiAnalysisResult>;
}


// Service Interface Contracts
// Domain Entity Models
export type FeedbackStatus = "NEW" | "UNDER_REVIEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
export type SentimentType = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
export type UserRole = "OWNER" | "ADMIN" | "ANALYST" | "MEMBER" | "VIEWER";
export type MemberStatus = "ACTIVE" | "PENDING" | "INACTIVE";

export interface IFeedback {
  id: string;
  workspaceId: string;
  content: string;
  channel: string;
  status: FeedbackStatus;
  customerLabel: string;
  source?: string;
  sentiment: SentimentType;
  sentimentScore?: number;
  themeId?: string;
  themeName?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITheme {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  description: string;
  feedbackCount: number;
  trend: "UP" | "DOWN" | "STABLE";
  createdAt: string;
}

export interface IWorkspace {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  details?: string;
  settings?: Record<string, unknown>;
  membersCount: number;
  feedbackCount: number;
  reportsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMember {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: UserRole;
  status: MemberStatus;
  createdDate: string;
}

// Request & Filter Interfaces
export interface IFeedbackFilterOptions extends ISearchQuery {
  channel?: string;
  status?: FeedbackStatus;
  sentiment?: SentimentType;
  themeId?: string;
  startDate?: string;
  endDate?: string;
  customer?: string;
}

export interface ICreateFeedbackInput {
  content: string;
  channel: string;
  customerLabel: string;
  source?: string;
  sentiment?: SentimentType;
  themeId?: string;
}

export interface IUpdateFeedbackInput {
  content?: string;
  status?: FeedbackStatus;
  channel?: string;
  customerLabel?: string;
  sentiment?: SentimentType;
  themeId?: string;
}

export interface ICsvRowError {
  row: number;
  message: string;
  field?: string;
}

export interface ICsvImportResult {
  importedCount: number;
  failedCount: number;
  totalProcessed: number;
  errors: ICsvRowError[];
  importedFeedback: IFeedback[];
}

export interface ISimulateFeedbackInput {
  count?: number;
  channels?: string[];
}

export interface IThemeDetailResult {
  theme: ITheme;
  associatedFeedback: IPaginatedData<IFeedback>;
  counts: {
    totalFeedback: number;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
  };
  statistics: {
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
  };
}

export interface IDashboardMetrics {
  totalFeedback: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  newThisWeek: number;
  topThemes: Array<{
    id: string;
    name: string;
    count: number;
    sentimentScore: number;
    color: string;
  }>;
  recentFeedback: IFeedback[];
  chartData: {
    volumeByDay: Array<{ date: string; count: number }>;
    sentimentTrend: Array<{ date: string; positive: number; neutral: number; negative: number }>;
  };
}

export interface IAnalyticsMetrics {
  volumeOverTime: Array<{ date: string; count: number }>;
  themeDistribution: Array<{ themeId: string; themeName: string; count: number; percentage: number; color: string }>;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
  };
  weeklyTrends: Array<{ week: string; total: number; positive: number; neutral: number; negative: number }>;
  monthlyTrends: Array<{ month: string; total: number; positive: number; neutral: number; negative: number }>;
}

// Auth Context
export interface IAuthContext {
  workspaceId: string;
  userId: string;
  userRole: UserRole;
}

// Service Interface Contracts
export interface IBaseService {
  readonly serviceName: string;
}

export interface IAuthService extends IBaseService {
  validateUserCredentials(email: string, pass: string): Promise<unknown>;
  registerUser(userData: unknown): Promise<unknown>;
  generateSessionToken(userId: string): Promise<string>;
}

export interface IFeedbackService extends IBaseService {
  createFeedback(workspaceId: string, data: ICreateFeedbackInput): Promise<IFeedback>;
  getFeedbackById(id: string, workspaceId: string): Promise<IFeedback>;
  updateFeedback(id: string, workspaceId: string, data: IUpdateFeedbackInput): Promise<IFeedback>;
  deleteFeedback(id: string, workspaceId: string): Promise<{ success: boolean; id: string }>;
  listFeedback(workspaceId: string, options: IFeedbackFilterOptions): Promise<IPaginatedData<IFeedback>>;
  simulateFeedback(workspaceId: string, options?: ISimulateFeedbackInput): Promise<IFeedback[]>;
}

export interface ICsvImportService extends IBaseService {
  importCsv(workspaceId: string, csvContent: string): Promise<ICsvImportResult>;
}

export interface IAnalyticsService extends IBaseService {
  getDashboardMetrics(workspaceId: string): Promise<IDashboardMetrics>;
  getAnalyticsBreakdown(workspaceId: string): Promise<IAnalyticsMetrics>;
  getWorkspaceMetrics(workspaceId: string): Promise<unknown>;
  getSentimentDistribution(workspaceId: string): Promise<unknown>;
}

export interface IThemeService extends IBaseService {
  getThemesByWorkspace(workspaceId: string, search?: string): Promise<ITheme[]>;
  getThemeById(id: string, workspaceId: string, queryOptions?: IPaginationQuery): Promise<IThemeDetailResult>;
  createTheme(workspaceId: string, data: { name: string; color?: string; description?: string }): Promise<ITheme>;
}

export interface IReportService extends IBaseService {
  generateReport(workspaceId: string, options: unknown): Promise<unknown>;
  getReportById(reportId: string): Promise<unknown>;
}

export interface IAiService extends IBaseService {
  processFeedbackIntelligence(feedbackText: string): Promise<IAiAnalysisResult>;
}

export interface IWorkspaceService extends IBaseService {
  getWorkspaceById(id: string): Promise<IWorkspace>;
  updateWorkspace(id: string, data: { name?: string; details?: string; settings?: Record<string, unknown> }): Promise<IWorkspace>;
  createWorkspace(data: unknown): Promise<unknown>;
}

export interface IMemberService extends IBaseService {
  getMembers(workspaceId: string, queryOptions?: ISearchQuery & { role?: UserRole }): Promise<IPaginatedData<IMember>>;
  addMemberToWorkspace(workspaceId: string, memberData: { email: string; role?: UserRole; name?: string }): Promise<IMember>;
  updateMemberRole(workspaceId: string, memberId: string, role: UserRole, status?: MemberStatus): Promise<IMember>;
  removeMemberFromWorkspace(workspaceId: string, memberId: string): Promise<{ success: boolean }>;
}

