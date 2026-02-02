import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  creators: defineTable({
    type: v.optional(v.string()),
    name: v.string(),
    initials: v.string(),
    verified: v.boolean(),
    avatar: v.optional(v.string()),
    bio: v.string(),
    category: v.string(),
    platform: v.string(),
    stats: v.object({
      views: v.string(),
      followers: v.string(),
      completion: v.string(),
    }),
    startingPrice: v.string(),
    currency: v.string(),
    availableSlots: v.number(),
    trustScore: v.string(),
  }).index("by_platform", ["platform"]),

  brands: defineTable({
    name: v.string(),
    logo: v.string(),
    verified: v.boolean(),
    industry: v.string(),
    // Wallet fields
    walletBalance: v.number(), // Balance in cents/smallest currency unit
    walletCurrency: v.string(), // e.g., "USD", "ETB"
  }).index("by_name", ["name"]),

  walletTransactions: defineTable({
    brandId: v.id("brands"),
    type: v.union(
      v.literal("deposit"),      // Top-up
      v.literal("withdrawal"),   // Cash out
      v.literal("escrow_lock"),  // Funds locked for a campaign/order
      v.literal("escrow_release"), // Funds released to creator
      v.literal("refund")        // Funds returned from escrow
    ),
    amount: v.number(), // Amount in cents/smallest currency unit
    currency: v.string(),
    description: v.string(),
    reference: v.optional(v.string()), // External payment reference or campaign ID
    campaignId: v.optional(v.id("campaigns")), // Related campaign if applicable
    createdAt: v.number(), // Timestamp
  }).index("by_brandId", ["brandId"]).index("by_type", ["type"]),

  campaigns: defineTable({
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
  }).index("by_brandId", ["brandId"]).index("by_platform", ["platform"]),

  applications: defineTable({
    campaignId: v.id("campaigns"),
    creatorId: v.id("creators"),
    status: v.union(
      v.literal("pending_creator"), // Brand sent offer, waiting for creator response
      v.literal("applicant"),       // Creator applied (existing flow)
      v.literal("shortlisted"),
      v.literal("negotiating"),
      v.literal("hired"),
      v.literal("completed"),
      v.literal("declined")         // Creator declined the offer
    ),
    matchScore: v.number(),
    bidAmount: v.string(),
    bidCurrency: v.string(),
    // New fields for brand-initiated outreach
    initiatedBy: v.union(v.literal("brand"), v.literal("creator")),
    offeredAmount: v.optional(v.number()), // Amount in cents
    offeredCurrency: v.optional(v.string()),
    // Content fields
    contentDraftUrl: v.optional(v.string()),
    contentStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("revision_requested")
    )),
    notes: v.optional(v.string()),
  }).index("by_campaignId", ["campaignId"]).index("by_creatorId", ["creatorId"]).index("by_status", ["status"]),

  messages: defineTable({
    applicationId: v.id("applications"), // The deal/application this chat belongs to
    senderId: v.string(), // Brand ID or Creator ID
    senderType: v.union(v.literal("brand"), v.literal("creator")),
    content: v.string(),
    createdAt: v.number(),
    isRead: v.boolean(),
  }).index("by_applicationId", ["applicationId"]),
});