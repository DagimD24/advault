import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Application status type for type safety
const applicationStatus = v.union(
  v.literal("applicant"),
  v.literal("shortlisted"),
  v.literal("negotiating"),
  v.literal("hired"),
  v.literal("completed")
);

const contentStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("revision_requested")
);

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

// Create a new application
export const create = mutation({
  args: {
    campaignId: v.id("campaigns"),
    creatorId: v.id("creators"),
    status: applicationStatus,
    matchScore: v.number(),
    bidAmount: v.string(),
    bidCurrency: v.string(),
    contentDraftUrl: v.optional(v.string()),
    contentStatus: v.optional(contentStatus),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", args);
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
    // Add other fields as they become editable
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
    await ctx.db.delete(args.id);
  },
});
