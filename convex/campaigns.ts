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
