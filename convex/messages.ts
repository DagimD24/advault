import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all messages for an application/deal
export const getByApplicationId = query({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_applicationId", (q) => q.eq("applicationId", args.applicationId))
      .order("asc")
      .collect();
  },
});

// Send a message in a deal thread
export const send = mutation({
  args: {
    applicationId: v.id("applications"),
    senderId: v.string(),
    senderType: v.union(v.literal("brand"), v.literal("creator")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      applicationId: args.applicationId,
      senderId: args.senderId,
      senderType: args.senderType,
      content: args.content,
      createdAt: Date.now(),
      isRead: false,
    });

    // Automatically transition from pending_creator to negotiating if creator replies
    if (args.senderType === "creator") {
      const application = await ctx.db.get(args.applicationId);
      if (application?.status === "pending_creator") {
        await ctx.db.patch(args.applicationId, { status: "negotiating" });
      }
    }

    return messageId;
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: {
    applicationId: v.id("applications"),
    readerType: v.union(v.literal("brand"), v.literal("creator")),
  },
  handler: async (ctx, args) => {
    // Get all unread messages sent by the other party
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_applicationId", (q) => q.eq("applicationId", args.applicationId))
      .collect();

    // Mark messages from the other party as read
    const otherPartyType = args.readerType === "brand" ? "creator" : "brand";
    for (const message of messages) {
      if (message.senderType === otherPartyType && !message.isRead) {
        await ctx.db.patch(message._id, { isRead: true });
      }
    }
  },
});

// Get unread message count for all applications of a brand
export const getUnreadCountForBrand = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, args) => {
    // Get all campaigns for this brand
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_brandId", (q) => q.eq("brandId", args.brandId))
      .collect();

    const campaignIds = campaigns.map((c) => c._id);

    // Get all applications for these campaigns
    let totalUnread = 0;
    for (const campaignId of campaignIds) {
      const applications = await ctx.db
        .query("applications")
        .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
        .collect();

      for (const app of applications) {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_applicationId", (q) => q.eq("applicationId", app._id))
          .collect();

        // Count unread messages from creators
        totalUnread += messages.filter((m) => m.senderType === "creator" && !m.isRead).length;
      }
    }

    return totalUnread;
  },
});
