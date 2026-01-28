import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    const campaigns = await ctx.db.query("campaigns").collect();
    return Promise.all(
      campaigns.map(async (campaign) => {
        const brand = await ctx.db.get(campaign.brandId);
        return {
          ...campaign,
          brand,
        };
      })
    );
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const campaignId = ctx.db.normalizeId("campaigns", args.id);
    if (!campaignId) return null;
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) return null;
    const brand = await ctx.db.get(campaign.brandId);
    return {
      ...campaign,
      brand,
    };
  },
});



export const createByBrandName = mutation({
  args: {
    brandName: v.string(),
    campaign: v.object({
      title: v.string(),
      budget: v.string(),
      currency: v.string(),
      platform: v.string(),
      campaignType: v.string(),
      minFollowers: v.string(),
      spots: v.number(),
      deadline: v.string(),
      description: v.string(),
      requirements: v.array(v.string()),
      audience: v.object({
        location: v.string(),
        age: v.string(),
        gender: v.string(),
      }),
      trustScore: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const brand = await ctx.db
      .query("brands")
      .withIndex("by_name", (q) => q.eq("name", args.brandName))
      .unique();

    if (!brand) {
      throw new Error(`Brand not found: ${args.brandName}`);
    }

    return await ctx.db.insert("campaigns", {
      ...args.campaign,
      brandId: brand._id,
    });
  },
});

// Get all campaigns for a specific brand
export const getByBrandId = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_brandId", (q) => q.eq("brandId", args.brandId))
      .collect();
    return campaigns;
  },
});

// Create a new campaign
export const create = mutation({
  args: {
    brandId: v.id("brands"),
    title: v.string(),
    budget: v.string(),
    currency: v.string(),
    platform: v.string(),
    campaignType: v.string(),
    minFollowers: v.string(),
    spots: v.number(),
    deadline: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    audience: v.object({
      location: v.string(),
      age: v.string(),
      gender: v.string(),
    }),
    trustScore: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("campaigns", args);
  },
});

// Update a campaign
export const update = mutation({
  args: {
    id: v.id("campaigns"),
    title: v.optional(v.string()),
    budget: v.optional(v.string()),
    currency: v.optional(v.string()),
    platform: v.optional(v.string()),
    campaignType: v.optional(v.string()),
    minFollowers: v.optional(v.string()),
    spots: v.optional(v.number()),
    deadline: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    audience: v.optional(v.object({
      location: v.string(),
      age: v.string(),
      gender: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, val]) => val !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
    return await ctx.db.get(id);
  },
});

// Delete a campaign
export const remove = mutation({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

