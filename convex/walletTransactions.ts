import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ WALLET TRANSACTIONS ============

// Get all transactions for a brand
export const getByBrandId = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("walletTransactions")
      .withIndex("by_brandId", (q) => q.eq("brandId", args.brandId))
      .order("desc")
      .collect();
  },
});

// Create a new transaction (deposit, withdrawal, etc.)
export const create = mutation({
  args: {
    brandId: v.id("brands"),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("escrow_lock"),
      v.literal("escrow_release"),
      v.literal("refund")
    ),
    amount: v.number(),
    currency: v.string(),
    description: v.string(),
    reference: v.optional(v.string()),
    campaignId: v.optional(v.id("campaigns")),
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert("walletTransactions", {
      ...args,
      createdAt: Date.now(),
    });
    return transactionId;
  },
});

// Top up wallet (deposit funds)
export const topUp = mutation({
  args: {
    brandId: v.id("brands"),
    amount: v.number(),
    currency: v.string(),
    reference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get current brand
    const brand = await ctx.db.get(args.brandId);
    if (!brand) throw new Error("Brand not found");

    // Update brand wallet balance
    const newBalance = (brand.walletBalance || 0) + args.amount;
    await ctx.db.patch(args.brandId, { 
      walletBalance: newBalance,
      walletCurrency: args.currency,
    });

    // Create transaction record
    const transactionId = await ctx.db.insert("walletTransactions", {
      brandId: args.brandId,
      type: "deposit",
      amount: args.amount,
      currency: args.currency,
      description: `Wallet top-up of ${(args.amount / 100).toFixed(2)} ${args.currency}`,
      reference: args.reference,
      createdAt: Date.now(),
    });

    return { transactionId, newBalance };
  },
});

// Lock funds in escrow for a campaign
export const lockEscrow = mutation({
  args: {
    brandId: v.id("brands"),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const brand = await ctx.db.get(args.brandId);
    if (!brand) throw new Error("Brand not found");
    if ((brand.walletBalance || 0) < args.amount) {
      throw new Error("Insufficient wallet balance");
    }

    // Deduct from available balance
    const newBalance = (brand.walletBalance || 0) - args.amount;
    await ctx.db.patch(args.brandId, { walletBalance: newBalance });

    // Record the escrow lock
    const transactionId = await ctx.db.insert("walletTransactions", {
      brandId: args.brandId,
      type: "escrow_lock",
      amount: args.amount,
      currency: args.currency,
      description: `Funds locked for campaign`,
      campaignId: args.campaignId,
      createdAt: Date.now(),
    });

    return { transactionId, newBalance };
  },
});

// Release escrow to creator (placeholder for future implementation)
export const releaseEscrow = mutation({
  args: {
    brandId: v.id("brands"),
    campaignId: v.id("campaigns"),
    amount: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    // Record the release
    const transactionId = await ctx.db.insert("walletTransactions", {
      brandId: args.brandId,
      type: "escrow_release",
      amount: args.amount,
      currency: args.currency,
      description: `Funds released to creator`,
      campaignId: args.campaignId,
      createdAt: Date.now(),
    });

    return { transactionId };
  },
});
