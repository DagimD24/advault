import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("creators").collect();
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const creatorId = ctx.db.normalizeId("creators", args.id);
    if (!creatorId) return null;
    return await ctx.db.get(creatorId);
  },
});
