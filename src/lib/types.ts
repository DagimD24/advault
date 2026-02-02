import { Id } from "../../convex/_generated/dataModel";

export interface Creator {
  _id: Id<"creators">;
  _creationTime: number;
  name: string;
  initials: string;
  verified: boolean;
  avatar?: string;
  bio: string;
  category: string;
  platform: string;
  stats: {
    views: string;
    followers: string;
    completion: string;
  };
  startingPrice: string;
  currency: string;
  availableSlots: number;
  trustScore: string;
}

export interface Brand {
  _id: Id<"brands">;
  _creationTime: number;
  name: string;
  logo: string;
  verified: boolean;
  industry: string;
  walletBalance: number;
  walletCurrency: string;
}

export type WalletTransactionType = "deposit" | "withdrawal" | "escrow_lock" | "escrow_release" | "refund";

export interface WalletTransaction {
  _id: Id<"walletTransactions">;
  _creationTime: number;
  brandId: Id<"brands">;
  type: WalletTransactionType;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  campaignId?: Id<"campaigns">;
  createdAt: number;
}

export interface Campaign {
  _id: Id<"campaigns">;
  _creationTime: number;
  brandId: Id<"brands">;
  title: string;
  budget: string;
  currency: string;
  platform: string;
  campaignType: string;
  minFollowers: string;
  spots: number;
  deadline: string;
  description: string;
  requirements: string[];
  audience: {
    location: string;
    age: string;
    gender: string;
  };
  trustScore: string;
}

export interface JoinedCampaign extends Campaign {
  brand: Brand | null;
}

export type ApplicationStatus = "pending_creator" | "applicant" | "shortlisted" | "negotiating" | "hired" | "completed" | "declined";
export type ContentStatus = "pending" | "approved" | "revision_requested";
export type InitiatedBy = "brand" | "creator";

export interface Application {
  _id: Id<"applications">;
  _creationTime: number;
  campaignId: Id<"campaigns">;
  creatorId: Id<"creators">;
  status: ApplicationStatus;
  matchScore: number;
  bidAmount: string;
  bidCurrency: string;
  initiatedBy: InitiatedBy;
  offeredAmount?: number;
  offeredCurrency?: string;
  contentDraftUrl?: string;
  contentStatus?: ContentStatus;
  notes?: string;
}

export interface JoinedApplication extends Application {
  creator: Creator | null;
  campaign?: Campaign | null;
}

export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  applicationId: Id<"applications">;
  senderId: string;
  senderType: "brand" | "creator";
  content: string;
  createdAt: number;
  isRead: boolean;
}
