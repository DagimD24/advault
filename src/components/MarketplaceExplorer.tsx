"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import OfferCard from "@/components/OfferCard";
import BrandCard from "@/components/BrandCard";

import { Creator, JoinedCampaign } from "@/lib/types";

interface MarketplaceExplorerProps {
  initialOffers?: Creator[];
  initialCompanyOffers?: JoinedCampaign[];
}

export default function MarketplaceExplorer({ initialOffers = [], initialCompanyOffers = [] }: MarketplaceExplorerProps) {
  const [activeTab, setActiveTab] = useState<'sponsorships' | 'creators'>('sponsorships');

  const creatorsData = useQuery(api.creators.get) as Creator[] | undefined;
  const campaignsData = useQuery(api.campaigns.get) as JoinedCampaign[] | undefined;

  const displayOffers = activeTab === 'creators' ? (creatorsData ?? initialOffers) : [];
  const displayCampaigns = activeTab === 'sponsorships' ? (campaignsData ?? initialCompanyOffers) : [];

  const isLoading = (activeTab === 'creators' && !creatorsData) || (activeTab === 'sponsorships' && !campaignsData);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <FilterBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-moralana text-black mb-2">
              {activeTab === 'sponsorships' ? 'Campaigns for Creators' : 'Active Creators'}
            </h2>
            <p className="text-gray-500">
              Browse the best opportunities curated for you.
            </p>
          </div>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
             {activeTab === 'sponsorships' ? displayCampaigns.length : displayOffers.length} results
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] h-96 border border-gray-100/50 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {activeTab === 'sponsorships' ? (
              (displayCampaigns as JoinedCampaign[]).map((offer) => (
                <BrandCard
                  key={offer._id}
                  {...offer}
                  id={offer._id}
                />
              ))
            ) : (
              (displayOffers as Creator[]).map((offer) => (
                <OfferCard
                  key={offer._id}
                  {...offer}
                  id={offer._id}
                  platform={offer.platform || "YouTube"}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
