"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Header from "@/components/Header";
import CreatorSidebar from "@/components/creator-dashboard/CreatorSidebar";
import DealsTab from "@/components/creator-dashboard/DealsTab";
import CreatorChatsTab from "@/components/creator-dashboard/CreatorChatsTab";
import CreatorWalletTab from "@/components/creator-dashboard/CreatorWalletTab";
import CreatorProfileTab from "@/components/creator-dashboard/CreatorProfileTab";
import { Creator, JoinedApplication, Campaign } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface ApplicationWithCampaign extends JoinedApplication {
  campaign?: Campaign | null;
}

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState<'deals' | 'chats' | 'wallet' | 'profile'>('deals');

  // Get demo creator
  const creator = useQuery(api.creators.getFirst) as Creator | null | undefined;

  // Get creator's applications
  const applications = useQuery(
    api.applications.getByCreatorId,
    creator?._id ? { creatorId: creator._id } : "skip"
  ) as ApplicationWithCampaign[] | undefined;

  const isLoading = creator === undefined || (creator && applications === undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-lime-400" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-moralana text-black mb-4">Creator Not Found</h1>
          <p className="text-gray-500">Please set up your creator profile first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-jost bg-background">
      <Header />

      <div className="flex pl-20">
        <CreatorSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeTab === 'deals' && (
            <DealsTab applications={applications || []} />
          )}

          {activeTab === 'chats' && (
            <CreatorChatsTab creator={creator} applications={applications || []} />
          )}

          {activeTab === 'wallet' && (
            <CreatorWalletTab creator={creator} />
          )}

          {activeTab === 'profile' && (
            <CreatorProfileTab creator={creator} />
          )}
        </main>
      </div>
    </div>
  );
}
