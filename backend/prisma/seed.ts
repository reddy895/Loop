/**
 * @file prisma/seed.ts
 * @description Database seeder populating initial workspace, enterprise user, themes, and members.
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/passwordUtils";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed or update primary enterprise user (Praveen Kumar)
  const praveenPasswordHash = hashPassword("password123");
  const user = await prisma.user.upsert({
    where: { email: "praveen@acmesaas.com" },
    update: {
      password: praveenPasswordHash,
      role: "ADMIN",
    },
    create: {
      id: "usr_praveen_1",
      email: "praveen@acmesaas.com",
      name: "Praveen Kumar",
      password: praveenPasswordHash,
      jobTitle: "Senior Staff Product Lead",
      role: "ADMIN",
      emailAlerts: true,
      weeklyDigest: true,
      aiAutoTagging: true,
    },
  });
  console.log("✓ Seeded primary user:", user.email);

  // 2. Seed primary enterprise workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: "ws_default" },
    update: {},
    create: {
      id: "ws_default",
      name: "Project LOOP Enterprise Workspace",
      code: "LOOP-ENT",
      ownerId: "usr_praveen_1",
      details: "Primary enterprise intelligence tenant environment.",
      settings: JSON.stringify({ autoCategorize: true, defaultLanguage: "en" }),
      membersCount: 5,
      feedbackCount: 5,
      reportsCount: 1,
    },
  });
  console.log("✓ Seeded workspace:", workspace.name);

  // 3. Seed workspace members
  const members = [
    { id: "mem_praveen", email: "praveen@acmesaas.com", name: "Praveen Kumar", role: "ADMIN", userId: "usr_praveen_1" },
    { id: "mem_alex", email: "alex.rivera@enterprise.com", name: "Alex Rivera", role: "OWNER", userId: undefined },
    { id: "mem_sarah", email: "sarah.chen@enterprise.com", name: "Sarah Chen", role: "ADMIN", userId: undefined },
    { id: "mem_david", email: "david.kim@enterprise.com", name: "David Kim", role: "ANALYST", userId: undefined },
    { id: "mem_emily", email: "emily.watson@enterprise.com", name: "Emily Watson", role: "VIEWER", userId: undefined },
  ];

  for (const m of members) {
    await prisma.member.upsert({
      where: { id: m.id },
      update: { role: m.role },
      create: {
        id: m.id,
        workspaceId: workspace.id,
        userId: m.userId,
        email: m.email,
        name: m.name,
        role: m.role,
        status: "ACTIVE",
      },
    });
  }
  console.log("✓ Seeded members:", members.length);

  // 4. Seed initial themes
  const themes = [
    { id: "thm_1", name: "UI & Usability", color: "#3B82F6", description: "User Interface smoothness, navigation clarity, and layout design feedback.", trend: "UP" },
    { id: "thm_2", name: "Performance & Speed", color: "#10B981", description: "App responsiveness, query speed, loading times, and crash reports.", trend: "STABLE" },
    { id: "thm_3", name: "Pricing & Billing", color: "#F59E0B", description: "Subscription tiers, invoice queries, payment gateways, and trial periods.", trend: "DOWN" },
    { id: "thm_4", name: "Customer Support", color: "#8B5CF6", description: "Helpdesk ticket resolution times, agent helpfulness, and FAQ clarity.", trend: "UP" },
  ];

  for (const t of themes) {
    await prisma.theme.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        workspaceId: workspace.id,
        name: t.name,
        color: t.color,
        description: t.description,
        trend: t.trend,
      },
    });
  }
  console.log("✓ Seeded themes:", themes.length);

  // 5. Seed initial feedback
  const feedbacks = [
    {
      id: "fb_1",
      workspaceId: workspace.id,
      content: "The new analytics dashboard is incredibly fast and responsive! Great work on the dark mode design.",
      channel: "Website",
      status: "NEW",
      customerLabel: "Enterprise User",
      source: "Web Application",
      sentiment: "POSITIVE",
      sentimentScore: 0.92,
      themeId: "thm_1",
      themeName: "UI & Usability",
    },
    {
      id: "fb_2",
      workspaceId: workspace.id,
      content: "Mobile app crashed twice when uploading customer feedback CSV files on iOS 17.",
      channel: "App Store",
      status: "UNDER_REVIEW",
      customerLabel: "VIP Client",
      source: "iOS Mobile",
      sentiment: "NEGATIVE",
      sentimentScore: -0.78,
      themeId: "thm_2",
      themeName: "Performance & Speed",
    },
    {
      id: "fb_3",
      workspaceId: workspace.id,
      content: "Pricing tier options for smaller teams are a bit confusing on the billing page.",
      channel: "Support Ticket",
      status: "IN_PROGRESS",
      customerLabel: "SMB Customer",
      source: "Zendesk Integration",
      sentiment: "NEUTRAL",
      sentimentScore: 0.05,
      themeId: "thm_3",
      themeName: "Pricing & Billing",
    },
    {
      id: "fb_4",
      workspaceId: workspace.id,
      content: "Support team resolved my inquiry within 10 minutes. Extremely satisfied with prompt service!",
      channel: "Survey",
      status: "RESOLVED",
      customerLabel: "Enterprise User",
      source: "Post-Chat Survey",
      sentiment: "POSITIVE",
      sentimentScore: 0.95,
      themeId: "thm_4",
      themeName: "Customer Support",
    },
    {
      id: "fb_5",
      workspaceId: workspace.id,
      content: "Love the automated sentiment analysis features! It saves our team hours every week.",
      channel: "Play Store",
      status: "NEW",
      customerLabel: "Pro Plan",
      source: "Android Mobile",
      sentiment: "POSITIVE",
      sentimentScore: 0.88,
      themeId: "thm_1",
      themeName: "UI & Usability",
    },
  ];

  for (const f of feedbacks) {
    await prisma.feedback.upsert({
      where: { id: f.id },
      update: {},
      create: f,
    });
  }
  console.log("✓ Seeded feedback records:", feedbacks.length);

  console.log("✅ Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
