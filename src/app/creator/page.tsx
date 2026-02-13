"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import CampaignCard from "@/components/CampaignCard";
import { Campaign } from "@/lib/types";

interface CampaignWithBrand extends Campaign {
  brand?: {
    _id: string;
    name: string;
    logo?: string;
    verified?: boolean;
  } | null;
}

export default function CreatorMarketplacePage() {
  const campaignsData = useQuery(api.campaigns.get) as CampaignWithBrand[] | undefined;

  const isLoading = campaignsData === undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FilterBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-moralana text-black mb-2">
              Discover Campaigns
            </h2>
            <p className="text-gray-500">
              Find your next brand collaboration opportunity.
            </p>
          </div>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
             {campaignsData?.length || 0} campaigns
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] h-96 border border-gray-100/50 shadow-sm" />
            ))}
          </div>
        ) : campaignsData && campaignsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {campaignsData.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                id={campaign._id}
                title={campaign.title}
                platform={campaign.platform}
                campaignType={campaign.campaignType}
                budget={campaign.budget}
                currency={campaign.currency}
                deadline={campaign.deadline}
                spots={campaign.spots}
                brand={campaign.brand ? {
                  name: campaign.brand.name,
                  logo: campaign.brand.logo,
                  initials: campaign.brand.name.substring(0, 2).toUpperCase(),
                  verified: true,
                } : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📢</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">No Campaigns Yet</h3>
            <p className="text-gray-500">Check back soon for new opportunities!</p>
          </div>
        )}
      </main>
    </div>
  );
}
