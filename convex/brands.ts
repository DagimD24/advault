import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getFirst = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("brands").first();
  },
});

export const getBrandByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("brands")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const createBrand = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    logo: v.optional(v.string()),
    industry: v.optional(v.string()),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    walletCurrency: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if brand already exists for this user
    const existingBrand = await ctx.db
      .query("brands")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingBrand) {
      return existingBrand._id;
    }

    // Create new brand
    const brandId = await ctx.db.insert("brands", {
      userId: args.userId,
      name: args.name,
      logo: args.logo || "",
      verified: false,
      industry: args.industry || "",
      website: args.website || "",
      description: args.description || "",
      walletBalance: 0,
      walletCurrency: args.walletCurrency,
    });

    return brandId;
  },
});
