import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("brands").collect();
  },
});

// Get a single brand by ID
export const getById = query({
  args: { id: v.id("brands") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get the first brand (for mock/demo purposes)
export const getFirst = query({
  handler: async (ctx) => {
    const brands = await ctx.db.query("brands").take(1);
    return brands[0] || null;
  },
});

// Update brand profile
export const update = mutation({
  args: {
    id: v.id("brands"),
    name: v.optional(v.string()),
    logo: v.optional(v.string()),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
    return await ctx.db.get(id);
  },
});
