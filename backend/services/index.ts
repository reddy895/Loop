import {
  IAiService,
  IAnalyticsService,
  IAuthService,
  IFeedbackService,
  ICsvImportService,
  IMemberService,
  IReportService,
  IThemeService,
  IWorkspaceService,
  IPaginatedData,
  IAiAnalysisResult,
  IAiProvider,
  IFeedback,
  ITheme,
  IWorkspace,
  IMember,
  IFeedbackFilterOptions,
  ICreateFeedbackInput,
  IUpdateFeedbackInput,
  ICsvImportResult,
  ISimulateFeedbackInput,
  IThemeDetailResult,
  IDashboardMetrics,
  IAnalyticsMetrics,
  UserRole,
  MemberStatus,
  SentimentType,
  ISearchQuery,
  IPaginationQuery,
} from "@/types";
import { getAiProvider } from "@/providers";
import { logger } from "@/logger/appLogger";
import { calculatePagination, NotFoundError, ValidationError, ConflictError, ForbiddenError } from "@/utils";
import { parseCsvString, validateCsvRow } from "@/utils/csvUtils";
import { classificationService } from "@/ai";

// In-memory data store with default demo workspace seed state
const INITIAL_THEMES: Record<string, ITheme[]> = {
  ws_default: [
    {
      id: "thm_1",
      workspaceId: "ws_default",
      name: "UI & Usability",
      color: "#3B82F6",
      description: "User Interface smoothness, navigation clarity, and layout design feedback.",
      feedbackCount: 14,
      trend: "UP",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: "thm_2",
      workspaceId: "ws_default",
      name: "Performance & Speed",
      color: "#10B981",
      description: "App responsiveness, query speed, loading times, and crash reports.",
      feedbackCount: 9,
      trend: "STABLE",
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: "thm_3",
      workspaceId: "ws_default",
      name: "Pricing & Billing",
      color: "#F59E0B",
      description: "Subscription tiers, invoice queries, payment gateways, and trial periods.",
      feedbackCount: 7,
      trend: "DOWN",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "thm_4",
      workspaceId: "ws_default",
      name: "Customer Support",
      color: "#8B5CF6",
      description: "Helpdesk ticket resolution times, agent helpfulness, and FAQ clarity.",
      feedbackCount: 11,
      trend: "UP",
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
  ],
};

const INITIAL_WORKSPACES: Record<string, IWorkspace> = {
  ws_default: {
    id: "ws_default",
    name: "Project LOOP Enterprise Workspace",
    code: "LOOP-ENT",
    ownerId: "usr_owner_1",
    details: "Primary enterprise intelligence tenant environment.",
    settings: { autoCategorize: true, defaultLanguage: "en" },
    membersCount: 4,
    feedbackCount: 20,
    reportsCount: 5,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const INITIAL_MEMBERS: Record<string, IMember[]> = {
  ws_default: [
    {
      id: "mem_1",
      workspaceId: "ws_default",
      name: "Alex Rivera",
      email: "alex.rivera@enterprise.com",
      role: "OWNER",
      status: "ACTIVE",
      createdDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: "mem_2",
      workspaceId: "ws_default",
      name: "Sarah Chen",
      email: "sarah.chen@enterprise.com",
      role: "ADMIN",
      status: "ACTIVE",
      createdDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
    {
      id: "mem_3",
      workspaceId: "ws_default",
      name: "David Kim",
      email: "david.kim@enterprise.com",
      role: "ANALYST",
      status: "ACTIVE",
      createdDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "mem_4",
      workspaceId: "ws_default",
      name: "Emily Watson",
      email: "emily.watson@enterprise.com",
      role: "VIEWER",
      status: "ACTIVE",
      createdDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
  ],
};

const INITIAL_FEEDBACK: Record<string, IFeedback[]> = {
  ws_default: [
    {
      id: "fb_1",
      workspaceId: "ws_default",
      content: "The new analytics dashboard is incredibly fast and responsive! Great work on the dark mode design.",
      channel: "Website",
      status: "NEW",
      customerLabel: "Enterprise User",
      source: "Web Application",
      sentiment: "POSITIVE",
      sentimentScore: 0.92,
      themeId: "thm_1",
      themeName: "UI & Usability",
      isDeleted: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: "fb_2",
      workspaceId: "ws_default",
      content: "Mobile app crashed twice when uploading customer feedback CSV files on iOS 17.",
      channel: "App Store",
      status: "UNDER_REVIEW",
      customerLabel: "VIP Client",
      source: "iOS Mobile",
      sentiment: "NEGATIVE",
      sentimentScore: -0.78,
      themeId: "thm_2",
      themeName: "Performance & Speed",
      isDeleted: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "fb_3",
      workspaceId: "ws_default",
      content: "Pricing tier options for smaller teams are a bit confusing on the billing page.",
      channel: "Support Ticket",
      status: "IN_PROGRESS",
      customerLabel: "SMB Customer",
      source: "Zendesk Integration",
      sentiment: "NEUTRAL",
      sentimentScore: 0.05,
      themeId: "thm_3",
      themeName: "Pricing & Billing",
      isDeleted: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "fb_4",
      workspaceId: "ws_default",
      content: "Support team resolved my inquiry within 10 minutes. Extremely satisfied with prompt service!",
      channel: "Survey",
      status: "RESOLVED",
      customerLabel: "Enterprise User",
      source: "Post-Chat Survey",
      sentiment: "POSITIVE",
      sentimentScore: 0.95,
      themeId: "thm_4",
      themeName: "Customer Support",
      isDeleted: false,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: "fb_5",
      workspaceId: "ws_default",
      content: "Love the automated sentiment analysis features! It saves our team hours every week.",
      channel: "Play Store",
      status: "NEW",
      customerLabel: "Pro Plan",
      source: "Android Mobile",
      sentiment: "POSITIVE",
      sentimentScore: 0.88,
      themeId: "thm_1",
      themeName: "UI & Usability",
      isDeleted: false,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ],
};

// State Store Accessors
const getWorkspaceFeedback = (wsId: string): IFeedback[] => {
  if (!INITIAL_FEEDBACK[wsId]) {
    INITIAL_FEEDBACK[wsId] = [];
  }
  return INITIAL_FEEDBACK[wsId];
};

const getWorkspaceThemes = (wsId: string): ITheme[] => {
  if (!INITIAL_THEMES[wsId]) {
    INITIAL_THEMES[wsId] = [];
  }
  return INITIAL_THEMES[wsId];
};

const getWorkspaceMembers = (wsId: string): IMember[] => {
  if (!INITIAL_MEMBERS[wsId]) {
    INITIAL_MEMBERS[wsId] = [];
  }
  return INITIAL_MEMBERS[wsId];
};

const getWorkspaceRecord = (wsId: string): IWorkspace => {
  if (!INITIAL_WORKSPACES[wsId]) {
    INITIAL_WORKSPACES[wsId] = {
      id: wsId,
      name: `Workspace (${wsId})`,
      code: wsId.toUpperCase().slice(0, 8),
      ownerId: "usr_owner_default",
      details: "Standard Workspace",
      settings: {},
      membersCount: getWorkspaceMembers(wsId).length,
      feedbackCount: getWorkspaceFeedback(wsId).filter((f) => !f.isDeleted).length,
      reportsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return INITIAL_WORKSPACES[wsId];
};

export class AiService implements IAiService {
  public readonly serviceName = "AiService";

  private getProvider(): IAiProvider {
    return getAiProvider();
  }

  public async processFeedbackIntelligence(feedbackText: string): Promise<IAiAnalysisResult> {
    logger.info(`${this.serviceName}: Processing feedback intelligence request`);
    const provider = this.getProvider();
    return await provider.analyzeFeedback(feedbackText);
  }
}

export class FeedbackService implements IFeedbackService {
  public readonly serviceName = "FeedbackService";

  public async listFeedback(workspaceId: string, options: IFeedbackFilterOptions): Promise<IPaginatedData<IFeedback>> {
    logger.info(`${this.serviceName}: Listing feedback with filtering/sorting`, { workspaceId, options });
    let items = getWorkspaceFeedback(workspaceId).filter((f) => !f.isDeleted);

    // Apply Keyword Search (content, customerLabel, source)
    if (options.search) {
      const q = options.search.toLowerCase().trim();
      items = items.filter(
        (f) =>
          f.content.toLowerCase().includes(q) ||
          f.customerLabel.toLowerCase().includes(q) ||
          (f.source && f.source.toLowerCase().includes(q))
      );
    }

    // Apply Channel Filter
    if (options.channel) {
      const ch = options.channel.toLowerCase().trim();
      items = items.filter((f) => f.channel.toLowerCase() === ch);
    }

    // Apply Status Filter
    if (options.status) {
      items = items.filter((f) => f.status === options.status);
    }

    // Apply Sentiment Filter
    if (options.sentiment) {
      items = items.filter((f) => f.sentiment === options.sentiment);
    }

    // Apply Theme Filter
    if (options.themeId) {
      items = items.filter((f) => f.themeId === options.themeId);
    }

    // Apply Customer Filter
    if (options.customer) {
      const cust = options.customer.toLowerCase().trim();
      items = items.filter((f) => f.customerLabel.toLowerCase().includes(cust));
    }

    // Apply Date Range Filter
    if (options.startDate) {
      const startMs = new Date(options.startDate).getTime();
      if (!isNaN(startMs)) {
        items = items.filter((f) => new Date(f.createdAt).getTime() >= startMs);
      }
    }
    if (options.endDate) {
      const endMs = new Date(options.endDate).getTime();
      if (!isNaN(endMs)) {
        items = items.filter((f) => new Date(f.createdAt).getTime() <= endMs);
      }
    }

    // Apply Sorting
    const sortBy = options.sortBy || "newest";
    const sortOrder = options.sortOrder || "desc";

    items.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "newest" || sortBy === "createdAt") {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "sentiment") {
        const rank = { POSITIVE: 3, NEUTRAL: 2, NEGATIVE: 1 };
        comparison = rank[b.sentiment] - rank[a.sentiment];
      } else if (sortBy === "channel") {
        comparison = a.channel.localeCompare(b.channel);
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === "customer") {
        comparison = a.customerLabel.localeCompare(b.customerLabel);
      } else {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });

    const page = options.page || 1;
    const limit = options.limit || 10;
    const { skip, take, meta } = calculatePagination({ page, limit, totalItems: items.length });
    const paginatedItems = items.slice(skip, skip + take);

    return {
      items: paginatedItems,
      pagination: meta,
    };
  }

  public async getFeedbackById(id: string, workspaceId: string): Promise<IFeedback> {
    logger.info(`${this.serviceName}: Fetching feedback by ID`, { id, workspaceId });
    const item = getWorkspaceFeedback(workspaceId).find((f) => f.id === id && !f.isDeleted);
    if (!item) {
      throw new NotFoundError(`Feedback record with ID '${id}' not found in workspace.`);
    }
    return item;
  }

  public async createFeedback(workspaceId: string, data: ICreateFeedbackInput): Promise<IFeedback> {
    logger.info(`${this.serviceName}: Creating new feedback record`, { workspaceId });

    // AI Auto-Classification for new feedback
    let sentiment: SentimentType = data.sentiment || "NEUTRAL";
    let sentimentScore = 0.0;

    if (!data.sentiment) {
      try {
        const aiClass = await classificationService.classifyFeedback(data.content);
        sentiment = aiClass.sentiment;
        sentimentScore = aiClass.sentimentScore;
      } catch (err) {
        logger.warn("AI Auto-classification failed during createFeedback, falling back to heuristics", { err });
        const lower = data.content.toLowerCase();
        if (lower.includes("love") || lower.includes("great") || lower.includes("fast") || lower.includes("excellent")) {
          sentiment = "POSITIVE";
          sentimentScore = 0.85;
        } else if (lower.includes("crash") || lower.includes("slow") || lower.includes("bug") || lower.includes("issue")) {
          sentiment = "NEGATIVE";
          sentimentScore = -0.75;
        }
      }
    } else {
      sentimentScore = sentiment === "POSITIVE" ? 0.8 : sentiment === "NEGATIVE" ? -0.7 : 0.0;
    }

    // Match Theme
    const themes = getWorkspaceThemes(workspaceId);
    let themeId = data.themeId;
    let themeName = themes.find((t) => t.id === themeId)?.name;

    if (!themeId && themes.length > 0) {
      themeId = themes[0].id;
      themeName = themes[0].name;
    }

    const newFeedback: IFeedback = {
      id: `fb_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      workspaceId,
      content: data.content,
      channel: data.channel,
      status: "NEW", // Automatically assign NEW
      customerLabel: data.customerLabel,
      source: data.source || "API Ingestion",
      sentiment,
      sentimentScore,
      themeId,
      themeName,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    getWorkspaceFeedback(workspaceId).unshift(newFeedback);

    // Update Theme feedback count
    if (themeId) {
      const theme = themes.find((t) => t.id === themeId);
      if (theme) theme.feedbackCount++;
    }

    return newFeedback;
  }

  public async updateFeedback(id: string, workspaceId: string, data: IUpdateFeedbackInput): Promise<IFeedback> {
    logger.info(`${this.serviceName}: Updating feedback record`, { id, workspaceId });
    const item = getWorkspaceFeedback(workspaceId).find((f) => f.id === id && !f.isDeleted);
    if (!item) {
      throw new NotFoundError(`Feedback record with ID '${id}' not found in workspace.`);
    }

    if (data.content !== undefined) item.content = data.content;
    if (data.status !== undefined) item.status = data.status;
    if (data.channel !== undefined) item.channel = data.channel;
    if (data.customerLabel !== undefined) item.customerLabel = data.customerLabel;
    if (data.sentiment !== undefined) {
      item.sentiment = data.sentiment;
      item.sentimentScore = data.sentiment === "POSITIVE" ? 0.85 : data.sentiment === "NEGATIVE" ? -0.8 : 0.0;
    }
    if (data.themeId !== undefined) {
      item.themeId = data.themeId;
      const theme = getWorkspaceThemes(workspaceId).find((t) => t.id === data.themeId);
      item.themeName = theme ? theme.name : undefined;
    }

    item.updatedAt = new Date().toISOString();
    return item;
  }

  public async deleteFeedback(id: string, workspaceId: string): Promise<{ success: boolean; id: string }> {
    logger.info(`${this.serviceName}: Soft deleting feedback record`, { id, workspaceId });
    const item = getWorkspaceFeedback(workspaceId).find((f) => f.id === id && !f.isDeleted);
    if (!item) {
      throw new NotFoundError(`Feedback record with ID '${id}' not found in workspace.`);
    }

    item.isDeleted = true;
    item.updatedAt = new Date().toISOString();
    return { success: true, id };
  }

  public async simulateFeedback(workspaceId: string, options?: ISimulateFeedbackInput): Promise<IFeedback[]> {
    logger.info(`${this.serviceName}: Generating simulated demo channel feedback`, { workspaceId, options });
    const count = options?.count || 5;
    const channels = options?.channels || ["Play Store", "App Store", "Website", "Support Ticket", "Survey"];

    const sampleFeedbacks = [
      { text: "App crashes every time I try to open settings menu on Android.", sentiment: "NEGATIVE" as SentimentType, score: -0.82 },
      { text: "Incredible user interface and seamless search filters!", sentiment: "POSITIVE" as SentimentType, score: 0.94 },
      { text: "The subscription pricing plans are slightly unclear for annual billing.", sentiment: "NEUTRAL" as SentimentType, score: 0.02 },
      { text: "Support team resolved my billing issue in under 5 minutes.", sentiment: "POSITIVE" as SentimentType, score: 0.91 },
      { text: "Very slow response time when filtering large feedback datasets.", sentiment: "NEGATIVE" as SentimentType, score: -0.65 },
      { text: "Love the recent update! Exporting CSV reports is super fast now.", sentiment: "POSITIVE" as SentimentType, score: 0.89 },
      { text: "Please add dark mode support to the mobile web app interface.", sentiment: "NEUTRAL" as SentimentType, score: 0.10 },
    ];

    const customerLabels = ["Enterprise User", "VIP Client", "Free Tier User", "SMB Customer", "Beta Tester"];
    const themes = getWorkspaceThemes(workspaceId);

    const generated: IFeedback[] = [];

    for (let i = 0; i < count; i++) {
      const sample = sampleFeedbacks[i % sampleFeedbacks.length];
      const channel = channels[i % channels.length];
      const customerLabel = customerLabels[i % customerLabels.length];
      const theme = themes.length > 0 ? themes[i % themes.length] : undefined;

      const feedback: IFeedback = {
        id: `fb_sim_${Date.now()}_${i}`,
        workspaceId,
        content: `${sample.text} (Simulated Demo Record #${i + 1})`,
        channel,
        status: "NEW", // Automatically assign NEW
        customerLabel,
        source: `Simulated Channel [${channel}]`,
        sentiment: sample.sentiment,
        sentimentScore: sample.score,
        themeId: theme?.id,
        themeName: theme?.name,
        isDeleted: false,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
      };

      getWorkspaceFeedback(workspaceId).unshift(feedback);
      if (theme) theme.feedbackCount++;
      generated.push(feedback);
    }

    return generated;
  }
}

export class CsvImportService implements ICsvImportService {
  public readonly serviceName = "CsvImportService";

  public async importCsv(workspaceId: string, csvContent: string): Promise<ICsvImportResult> {
    logger.info(`${this.serviceName}: Ingesting CSV feedback payload`, { workspaceId });

    if (!csvContent || !csvContent.trim()) {
      throw new ValidationError("CSV content string is empty or invalid.");
    }

    const rows = parseCsvString(csvContent);
    if (rows.length === 0) {
      throw new ValidationError("No data rows found in CSV file.");
    }

    const errors: Array<{ row: number; message: string; field?: string }> = [];
    const importedFeedback: IFeedback[] = [];

    const feedbackService = new FeedbackService();

    for (let index = 0; index < rows.length; index++) {
      const rowIndex = index + 2; // header is line 1
      const validation = validateCsvRow(rows[index], rowIndex);

      if (!validation.valid && validation.error) {
        errors.push(validation.error);
        continue;
      }

      if (validation.data) {
        try {
          const created = await feedbackService.createFeedback(workspaceId, {
            content: validation.data.content,
            channel: validation.data.channel,
            customerLabel: validation.data.customerLabel,
            source: validation.data.source || "CSV Import",
            sentiment: validation.data.sentiment as SentimentType | undefined,
          });
          importedFeedback.push(created);
        } catch (err) {
          errors.push({
            row: rowIndex,
            message: err instanceof Error ? err.message : "Failed to import row record.",
          });
        }
      }
    }

    return {
      importedCount: importedFeedback.length,
      failedCount: errors.length,
      totalProcessed: rows.length,
      errors,
      importedFeedback,
    };
  }
}

export class ThemeService implements IThemeService {
  public readonly serviceName = "ThemeService";

  public async getThemesByWorkspace(workspaceId: string, search?: string): Promise<ITheme[]> {
    logger.info(`${this.serviceName}: Fetching themes for workspace`, { workspaceId, search });
    let themes = getWorkspaceThemes(workspaceId);

    // Update feedback counts dynamically
    const feedbackList = getWorkspaceFeedback(workspaceId).filter((f) => !f.isDeleted);
    themes.forEach((theme) => {
      theme.feedbackCount = feedbackList.filter((f) => f.themeId === theme.id).length;
    });

    if (search) {
      const q = search.toLowerCase().trim();
      themes = themes.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    return themes;
  }

  public async getThemeById(id: string, workspaceId: string, queryOptions?: IPaginationQuery): Promise<IThemeDetailResult> {
    logger.info(`${this.serviceName}: Fetching theme details by ID`, { id, workspaceId });
    const themes = await this.getThemesByWorkspace(workspaceId);
    const theme = themes.find((t) => t.id === id);

    if (!theme) {
      throw new NotFoundError(`Theme record with ID '${id}' not found in workspace.`);
    }

    const allFeedback = getWorkspaceFeedback(workspaceId).filter((f) => f.themeId === id && !f.isDeleted);

    const positiveCount = allFeedback.filter((f) => f.sentiment === "POSITIVE").length;
    const neutralCount = allFeedback.filter((f) => f.sentiment === "NEUTRAL").length;
    const negativeCount = allFeedback.filter((f) => f.sentiment === "NEGATIVE").length;
    const totalFeedback = allFeedback.length;

    const positivePercentage = totalFeedback > 0 ? Math.round((positiveCount / totalFeedback) * 100) : 0;
    const neutralPercentage = totalFeedback > 0 ? Math.round((neutralCount / totalFeedback) * 100) : 0;
    const negativePercentage = totalFeedback > 0 ? Math.round((negativeCount / totalFeedback) * 100) : 0;

    const page = queryOptions?.page || 1;
    const limit = queryOptions?.limit || 10;
    const { skip, take, meta } = calculatePagination({ page, limit, totalItems: totalFeedback });

    const paginatedFeedback = allFeedback.slice(skip, skip + take);

    return {
      theme,
      associatedFeedback: {
        items: paginatedFeedback,
        pagination: meta,
      },
      counts: {
        totalFeedback,
        positiveCount,
        neutralCount,
        negativeCount,
      },
      statistics: {
        positivePercentage,
        neutralPercentage,
        negativePercentage,
      },
    };
  }

  public async createTheme(workspaceId: string, data: { name: string; color?: string; description?: string }): Promise<ITheme> {
    logger.info(`${this.serviceName}: Creating new theme topic`, { workspaceId, data });
    const themes = getWorkspaceThemes(workspaceId);

    const existing = themes.find((t) => t.name.toLowerCase() === data.name.toLowerCase().trim());
    if (existing) {
      throw new ConflictError(`Theme with name '${data.name}' already exists in workspace.`);
    }

    const newTheme: ITheme = {
      id: `thm_${Date.now()}`,
      workspaceId,
      name: data.name.trim(),
      color: data.color || "#6366F1",
      description: data.description || "Custom feedback cluster theme.",
      feedbackCount: 0,
      trend: "STABLE",
      createdAt: new Date().toISOString(),
    };

    themes.push(newTheme);
    return newTheme;
  }
}

export class WorkspaceService implements IWorkspaceService {
  public readonly serviceName = "WorkspaceService";

  public async getWorkspaceById(id: string): Promise<IWorkspace> {
    logger.info(`${this.serviceName}: Fetching workspace details`, { workspaceId: id });
    const workspace = getWorkspaceRecord(id);
    workspace.membersCount = getWorkspaceMembers(id).length;
    workspace.feedbackCount = getWorkspaceFeedback(id).filter((f) => !f.isDeleted).length;
    return workspace;
  }

  public async updateWorkspace(
    id: string,
    data: { name?: string; details?: string; settings?: Record<string, unknown> }
  ): Promise<IWorkspace> {
    logger.info(`${this.serviceName}: Updating workspace configuration`, { workspaceId: id });
    const workspace = getWorkspaceRecord(id);

    if (data.name !== undefined) workspace.name = data.name;
    if (data.details !== undefined) workspace.details = data.details;
    if (data.settings !== undefined) workspace.settings = { ...workspace.settings, ...data.settings };
    workspace.updatedAt = new Date().toISOString();

    return workspace;
  }

  public async createWorkspace(data: unknown): Promise<unknown> {
    logger.info(`${this.serviceName}: Provisioning new workspace`);
    return { id: "ws_" + Date.now(), createdAt: new Date() };
  }
}

export class MemberService implements IMemberService {
  public readonly serviceName = "MemberService";

  public async getMembers(workspaceId: string, queryOptions?: ISearchQuery & { role?: UserRole }): Promise<IPaginatedData<IMember>> {
    logger.info(`${this.serviceName}: Listing workspace members`, { workspaceId, queryOptions });
    let members = getWorkspaceMembers(workspaceId);

    if (queryOptions?.search) {
      const q = queryOptions.search.toLowerCase().trim();
      members = members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }

    if (queryOptions?.role) {
      members = members.filter((m) => m.role === queryOptions.role);
    }

    const page = queryOptions?.page || 1;
    const limit = queryOptions?.limit || 10;
    const { skip, take, meta } = calculatePagination({ page, limit, totalItems: members.length });

    return {
      items: members.slice(skip, skip + take),
      pagination: meta,
    };
  }

  public async addMemberToWorkspace(
    workspaceId: string,
    memberData: { email: string; role?: UserRole; name?: string }
  ): Promise<IMember> {
    logger.info(`${this.serviceName}: Inviting new member to workspace`, { workspaceId, email: memberData.email });
    const members = getWorkspaceMembers(workspaceId);

    const existing = members.find((m) => m.email.toLowerCase() === memberData.email.toLowerCase().trim());
    if (existing) {
      throw new ConflictError(`User with email '${memberData.email}' is already a member of this workspace.`);
    }

    const newMember: IMember = {
      id: `mem_${Date.now()}`,
      workspaceId,
      name: memberData.name || memberData.email.split("@")[0],
      email: memberData.email.toLowerCase().trim(),
      role: memberData.role || "MEMBER",
      status: "ACTIVE",
      createdDate: new Date().toISOString(),
    };

    members.push(newMember);

    // Update workspace member count
    const ws = getWorkspaceRecord(workspaceId);
    ws.membersCount = members.length;

    return newMember;
  }

  public async updateMemberRole(workspaceId: string, memberId: string, role: UserRole, status?: MemberStatus): Promise<IMember> {
    logger.info(`${this.serviceName}: Updating workspace member role`, { workspaceId, memberId, role });
    const members = getWorkspaceMembers(workspaceId);
    const member = members.find((m) => m.id === memberId);

    if (!member) {
      throw new NotFoundError(`Member with ID '${memberId}' not found in workspace.`);
    }

    if (member.role === "OWNER") {
      throw new ForbiddenError("Cannot alter the primary Workspace Owner role.");
    }

    member.role = role;
    if (status) member.status = status;

    return member;
  }

  public async removeMemberFromWorkspace(workspaceId: string, memberId: string): Promise<{ success: boolean }> {
    logger.info(`${this.serviceName}: Removing member from workspace`, { workspaceId, memberId });
    const members = getWorkspaceMembers(workspaceId);
    const index = members.findIndex((m) => m.id === memberId);

    if (index === -1) {
      throw new NotFoundError(`Member with ID '${memberId}' not found in workspace.`);
    }

    if (members[index].role === "OWNER") {
      throw new ForbiddenError("Cannot remove the primary Workspace Owner from the workspace.");
    }

    members.splice(index, 1);

    // Update workspace member count
    const ws = getWorkspaceRecord(workspaceId);
    ws.membersCount = members.length;

    return { success: true };
  }
}

export class AnalyticsService implements IAnalyticsService {
  public readonly serviceName = "AnalyticsService";

  public async getDashboardMetrics(workspaceId: string): Promise<IDashboardMetrics> {
    logger.info(`${this.serviceName}: Computing aggregate dashboard analytics`, { workspaceId });
    const feedbackList = getWorkspaceFeedback(workspaceId).filter((f) => !f.isDeleted);

    const totalFeedback = feedbackList.length;
    const positiveCount = feedbackList.filter((f) => f.sentiment === "POSITIVE").length;
    const negativeCount = feedbackList.filter((f) => f.sentiment === "NEGATIVE").length;
    const neutralCount = feedbackList.filter((f) => f.sentiment === "NEUTRAL").length;

    const oneWeekAgoMs = Date.now() - 7 * 86400000;
    const newThisWeek = feedbackList.filter((f) => new Date(f.createdAt).getTime() >= oneWeekAgoMs).length;

    const themes = getWorkspaceThemes(workspaceId);
    const topThemes = themes.map((t) => {
      const themeFeedback = feedbackList.filter((f) => f.themeId === t.id);
      const scoreSum = themeFeedback.reduce((acc, f) => acc + (f.sentimentScore || 0), 0);
      const avgScore = themeFeedback.length > 0 ? scoreSum / themeFeedback.length : 0;
      return {
        id: t.id,
        name: t.name,
        count: themeFeedback.length,
        sentimentScore: Number(avgScore.toFixed(2)),
        color: t.color,
      };
    }).sort((a, b) => b.count - a.count);

    const recentFeedback = feedbackList.slice(0, 5);

    // Dynamic Chart Data Generation
    const days = 7;
    const volumeByDay: Array<{ date: string; count: number }> = [];
    const sentimentTrend: Array<{ date: string; positive: number; neutral: number; negative: number }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const dayFeedback = feedbackList.filter((f) => f.createdAt.startsWith(dateStr));
      volumeByDay.push({ date: dateStr, count: dayFeedback.length });
      sentimentTrend.push({
        date: dateStr,
        positive: dayFeedback.filter((f) => f.sentiment === "POSITIVE").length,
        neutral: dayFeedback.filter((f) => f.sentiment === "NEUTRAL").length,
        negative: dayFeedback.filter((f) => f.sentiment === "NEGATIVE").length,
      });
    }

    return {
      totalFeedback,
      positiveCount,
      neutralCount,
      negativeCount,
      newThisWeek,
      topThemes,
      recentFeedback,
      chartData: {
        volumeByDay,
        sentimentTrend,
      },
    };
  }

  public async getAnalyticsBreakdown(workspaceId: string): Promise<IAnalyticsMetrics> {
    logger.info(`${this.serviceName}: Computing comprehensive analytics distribution`, { workspaceId });
    const feedbackList = getWorkspaceFeedback(workspaceId).filter((f) => !f.isDeleted);
    const total = feedbackList.length;

    const positive = feedbackList.filter((f) => f.sentiment === "POSITIVE").length;
    const neutral = feedbackList.filter((f) => f.sentiment === "NEUTRAL").length;
    const negative = feedbackList.filter((f) => f.sentiment === "NEGATIVE").length;

    const sentimentDistribution = {
      positive,
      neutral,
      negative,
      positivePercentage: total > 0 ? Math.round((positive / total) * 100) : 0,
      neutralPercentage: total > 0 ? Math.round((neutral / total) * 100) : 0,
      negativePercentage: total > 0 ? Math.round((negative / total) * 100) : 0,
    };

    const themes = getWorkspaceThemes(workspaceId);
    const themeDistribution = themes.map((t) => {
      const count = feedbackList.filter((f) => f.themeId === t.id).length;
      return {
        themeId: t.id,
        themeName: t.name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: t.color,
      };
    });

    const volumeOverTime: Array<{ date: string; count: number }> = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const count = feedbackList.filter((f) => f.createdAt.startsWith(dateStr)).length;
      volumeOverTime.push({ date: dateStr, count });
    }

    const weeklyTrends = [
      { week: "Week 1", total: Math.round(total * 0.2), positive: Math.round(positive * 0.2), neutral: Math.round(neutral * 0.2), negative: Math.round(negative * 0.2) },
      { week: "Week 2", total: Math.round(total * 0.25), positive: Math.round(positive * 0.25), neutral: Math.round(neutral * 0.25), negative: Math.round(negative * 0.25) },
      { week: "Week 3", total: Math.round(total * 0.25), positive: Math.round(positive * 0.25), neutral: Math.round(neutral * 0.25), negative: Math.round(negative * 0.25) },
      { week: "Current Week", total: Math.round(total * 0.3), positive: Math.round(positive * 0.3), neutral: Math.round(neutral * 0.3), negative: Math.round(negative * 0.3) },
    ];

    const monthlyTrends = [
      { month: "Previous Month", total: Math.round(total * 0.8), positive: Math.round(positive * 0.8), neutral: Math.round(neutral * 0.8), negative: Math.round(negative * 0.8) },
      { month: "Current Month", total, positive, neutral, negative },
    ];

    return {
      volumeOverTime,
      themeDistribution,
      sentimentDistribution,
      weeklyTrends,
      monthlyTrends,
    };
  }

  public async getWorkspaceMetrics(workspaceId: string): Promise<unknown> {
    const dashboard = await this.getDashboardMetrics(workspaceId);
    return {
      totalFeedbackCount: dashboard.totalFeedback,
      averageSentimentScore: dashboard.positiveCount > dashboard.negativeCount ? 0.75 : 0.25,
      activeThemesCount: dashboard.topThemes.length,
    };
  }

  public async getSentimentDistribution(workspaceId: string): Promise<unknown> {
    const analytics = await this.getAnalyticsBreakdown(workspaceId);
    return analytics.sentimentDistribution;
  }
}

export class AuthService implements IAuthService {
  public readonly serviceName = "AuthService";

  public async validateUserCredentials(email: string, pass: string): Promise<unknown> {
    logger.info(`${this.serviceName}: Validating credentials for user`, { email });
    return { id: "usr_123", email, name: "Sample User" };
  }

  public async registerUser(userData: unknown): Promise<unknown> {
    logger.info(`${this.serviceName}: Registering new user account`);
    return { id: "usr_" + Date.now(), createdAt: new Date() };
  }

  public async generateSessionToken(userId: string): Promise<string> {
    logger.info(`${this.serviceName}: Generating session token`, { userId });
    return "session_token_placeholder_" + userId;
  }
}

export class ReportService implements IReportService {
  public readonly serviceName = "ReportService";

  public async generateReport(workspaceId: string, options: unknown): Promise<unknown> {
    logger.info(`${this.serviceName}: Triggering executive report generation`, { workspaceId });
    return { reportId: "rep_" + Date.now(), status: "GENERATING" };
  }

  public async getReportById(reportId: string): Promise<unknown> {
    logger.info(`${this.serviceName}: Fetching report status`, { reportId });
    return { reportId, status: "COMPLETED" };
  }
}

// Export Singleton Instances
export const aiService = new AiService();
export const analyticsService = new AnalyticsService();
export const authService = new AuthService();
export const feedbackService = new FeedbackService();
export const csvImportService = new CsvImportService();
export const memberService = new MemberService();
export const reportService = new ReportService();
export const themeService = new ThemeService();
export const workspaceService = new WorkspaceService();

