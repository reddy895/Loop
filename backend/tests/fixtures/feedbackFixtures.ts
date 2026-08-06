/**
 * @file tests/fixtures/feedbackFixtures.ts
 * @description Standardized data fixtures for unit and integration testing.
 */

import { IFeedback, ITheme, IWorkspace, IMember } from "@/types";

export const MOCK_FEEDBACK_ITEMS: IFeedback[] = [
  {
    id: "fb_fixture_1",
    workspaceId: "ws_default",
    content: "The analytics dashboard loads in under 200ms. Exceptional speed!",
    channel: "Website",
    status: "NEW",
    customerLabel: "Enterprise VIP",
    source: "Web Application",
    sentiment: "POSITIVE",
    sentimentScore: 0.95,
    themeId: "thm_1",
    themeName: "Performance",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fb_fixture_2",
    workspaceId: "ws_default",
    content: "Mobile app crashes when exporting CSV files on Android 14.",
    channel: "App Store",
    status: "UNDER_REVIEW",
    customerLabel: "Free User",
    source: "Android Mobile",
    sentiment: "NEGATIVE",
    sentimentScore: -0.85,
    themeId: "thm_2",
    themeName: "Stability",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_THEMES: ITheme[] = [
  {
    id: "thm_1",
    workspaceId: "ws_default",
    name: "Performance",
    color: "#10B981",
    description: "App loading speed and query performance.",
    feedbackCount: 5,
    trend: "UP",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_WORKSPACE: IWorkspace = {
  id: "ws_default",
  name: "Project LOOP Enterprise Workspace",
  code: "LOOP-ENT",
  ownerId: "usr_owner_1",
  details: "Primary tenant environment",
  membersCount: 3,
  feedbackCount: 10,
  reportsCount: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_MEMBERS: IMember[] = [
  {
    id: "mem_1",
    workspaceId: "ws_default",
    name: "Test Admin",
    email: "admin@loop.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdDate: new Date().toISOString(),
  },
];
