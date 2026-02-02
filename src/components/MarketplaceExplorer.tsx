"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import OfferCard from "@/components/OfferCard";

import { Creator } from "@/lib/types";

interface MarketplaceExplorerProps {
  initialOffers?: Creator[];
}

export default function MarketplaceExplorer({ initialOffers = [] }: MarketplaceExplorerProps) {
  const creatorsData = useQuery(api.creators.get) as Creator[] | undefined;

  const displayCreators = creatorsData ?? initialOffers;
  const isLoading = !creatorsData;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Header />
      <FilterBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-moralana text-black mb-2">
              Discover Creators
            </h2>
            <p className="text-gray-500">
              Find the perfect voice for your next campaign.
            </p>
          </div>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
             {displayCreators.length} creators
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
            {displayCreators.map((creator) => (
              <OfferCard
                key={creator._id}
                {...creator}
                id={creator._id}
                platform={creator.platform || "YouTube"}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
