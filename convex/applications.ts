import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Application status type for type safety
const applicationStatus = v.union(
  v.literal("pending_creator"),
  v.literal("applicant"),
  v.literal("shortlisted"),
  v.literal("negotiating"),
  v.literal("hired"),
  v.literal("completed"),
  v.literal("declined")
);

const contentStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("revision_requested")
);

const initiatedBy = v.union(v.literal("brand"), v.literal("creator"));

// Get all applications for a campaign with creator data
export const getByCampaignId = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    return Promise.all(
      applications.map(async (app) => {
        const creator = await ctx.db.get(app.creatorId);
        return {
          ...app,
          creator,
        };
      })
    );
  },
});

// Get all applications by a creator
export const getByCreatorId = query({
  args: { creatorId: v.id("creators") },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_creatorId", (q) => q.eq("creatorId", args.creatorId))
      .collect();

    return Promise.all(
      applications.map(async (app) => {
        const campaign = await ctx.db.get(app.campaignId);
        return {
          ...app,
          campaign,
        };
      })
    );
  },
});

// Get all applications for a brand (across all campaigns)
export const getByBrandId = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    // Get all campaigns for this brand
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_brandId", (q) => q.eq("brandId", args.brandId))
      .collect();

    const campaignIds = campaigns.map((c) => c._id);

    // Get all applications for these campaigns
    const allApplications = [];
    for (const campaignId of campaignIds) {
      const applications = await ctx.db
        .query("applications")
        .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
        .collect();

      for (const app of applications) {
        const creator = await ctx.db.get(app.creatorId);
        const campaign = campaigns.find((c) => c._id === campaignId);
        allApplications.push({
          ...app,
          creator,
          campaign,
        });
      }
    }

    return allApplications;
  },
});

// Create a new application (creator-initiated)
export const create = mutation({
  args: {
    campaignId: v.id("campaigns"),
    creatorId: v.id("creators"),
    status: applicationStatus,
    matchScore: v.number(),
    bidAmount: v.string(),
    bidCurrency: v.string(),
    initiatedBy: v.optional(initiatedBy),
    contentDraftUrl: v.optional(v.string()),
    contentStatus: v.optional(contentStatus),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", {
      ...args,
      initiatedBy: args.initiatedBy || "creator",
    });
  },
});

// Create outreach from brand to creator
export const createOutreach = mutation({
  args: {
    campaignId: v.id("campaigns"),
    creatorId: v.id("creators"),
    offeredAmount: v.number(),
    offeredCurrency: v.string(),
    initialMessage: v.string(),
    brandId: v.id("brands"),
  },
  handler: async (ctx, args) => {
    // Check if application already exists
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    const alreadyExists = existing.some((app) => app.creatorId === args.creatorId);
    if (alreadyExists) {
      throw new Error("An offer to this creator for this campaign already exists");
    }

    // Create the application/deal
    const applicationId = await ctx.db.insert("applications", {
      campaignId: args.campaignId,
      creatorId: args.creatorId,
      status: "pending_creator",
      matchScore: 100, // Brand selected them directly
      bidAmount: (args.offeredAmount / 100).toString(),
      bidCurrency: args.offeredCurrency,
      initiatedBy: "brand",
      offeredAmount: args.offeredAmount,
      offeredCurrency: args.offeredCurrency,
    });

    // Create the initial message
    await ctx.db.insert("messages", {
      applicationId,
      senderId: args.brandId,
      senderType: "brand",
      content: args.initialMessage,
      createdAt: Date.now(),
      isRead: false,
    });

    return applicationId;
  },
});

// Accept an offer (creator accepts brand outreach)
export const acceptOffer = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);
    if (!app) throw new Error("Application not found");
    if (app.status !== "pending_creator") {
      throw new Error("This offer is not pending acceptance");
    }

    await ctx.db.patch(args.id, { status: "negotiating" });
    return await ctx.db.get(args.id);
  },
});

// Decline an offer
export const declineOffer = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);
    if (!app) throw new Error("Application not found");
    if (app.status !== "pending_creator") {
      throw new Error("This offer is not pending acceptance");
    }

    await ctx.db.patch(args.id, { status: "declined" });
    return await ctx.db.get(args.id);
  },
});

// Update application status (move between pipeline stages)
export const updateStatus = mutation({
  args: {
    id: v.id("applications"),
    status: applicationStatus,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return await ctx.db.get(args.id);
  },
});

// Submit content draft
export const submitContentDraft = mutation({
  args: {
    id: v.id("applications"),
    contentDraftUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      contentDraftUrl: args.contentDraftUrl,
      contentStatus: "pending",
    });
    return await ctx.db.get(args.id);
  },
});

// Update content status (approve or request revision)
export const updateContentStatus = mutation({
  args: {
    id: v.id("applications"),
    contentStatus: contentStatus,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: { contentStatus: typeof args.contentStatus; notes?: string } = {
      contentStatus: args.contentStatus,
    };
    if (args.notes !== undefined) {
      updates.notes = args.notes;
    }
    await ctx.db.patch(args.id, updates);
    return await ctx.db.get(args.id);
  },
});

// Update application (generic)
export const update = mutation({
  args: {
    id: v.id("applications"),
    status: v.optional(applicationStatus),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

// Delete an application
export const remove = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    // Also delete all messages for this application
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_applicationId", (q) => q.eq("applicationId", args.id))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    await ctx.db.delete(args.id);
  },
});
