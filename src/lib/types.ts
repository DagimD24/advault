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
