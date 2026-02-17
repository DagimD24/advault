import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  creators: defineTable({
    userId: v.optional(v.string()), // <--- LINK TO AUTH SYSTEM (The User's Login ID)
    
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
  })
  .index("by_platform", ["platform"])
  .index("by_userId", ["userId"]), // <--- INDEX FOR FAST LOOKUPS

  brands: defineTable({
    userId: v.optional(v.string()), // <--- LINK TO AUTH SYSTEM
    
    name: v.string(),
    logo: v.string(),
    verified: v.boolean(),
    industry: v.string(),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    // Wallet fields
    walletBalance: v.number(), 
    walletCurrency: v.string(), 
  })
  .index("by_name", ["name"])
  .index("by_userId", ["userId"]), // <--- INDEX FOR FAST LOOKUPS

  walletTransactions: defineTable({
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
    createdAt: v.number(), 
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
      v.literal("pending_creator"), 
      v.literal("applicant"),       
      v.literal("shortlisted"),
      v.literal("negotiating"),
      v.literal("hired"),
      v.literal("completed"),
      v.literal("declined")         
    ),
    matchScore: v.number(),
    bidAmount: v.string(),
    bidCurrency: v.string(),
    initiatedBy: v.union(v.literal("brand"), v.literal("creator")),
    offeredAmount: v.optional(v.number()), 
    offeredCurrency: v.optional(v.string()),
    contentDraftUrl: v.optional(v.string()),
    contentStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("revision_requested")
    )),
    notes: v.optional(v.string()),
  }).index("by_campaignId", ["campaignId"]).index("by_creatorId", ["creatorId"]).index("by_status", ["status"]),

  messages: defineTable({
    applicationId: v.id("applications"), 
    senderId: v.string(), 
    senderType: v.union(v.literal("brand"), v.literal("creator")),
    content: v.string(),
    createdAt: v.number(),
    isRead: v.boolean(),
  }).index("by_applicationId", ["applicationId"]),
});