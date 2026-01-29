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
  }).index("by_name", ["name"]),

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
      v.literal("applicant"),
      v.literal("shortlisted"),
      v.literal("negotiating"),
      v.literal("hired"),
      v.literal("completed")
    ),
    matchScore: v.number(),
    bidAmount: v.string(),
    bidCurrency: v.string(),
    contentDraftUrl: v.optional(v.string()),
    contentStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("revision_requested")
    )),
    notes: v.optional(v.string()),
  }).index("by_campaignId", ["campaignId"]).index("by_creatorId", ["creatorId"]),
});