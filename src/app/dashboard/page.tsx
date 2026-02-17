"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Header from "@/components/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import OverviewTab from "@/components/dashboard/OverviewTab";
import CampaignsTab from "@/components/dashboard/CampaignsTab";
import WalletTab from "@/components/dashboard/WalletTab";
import ChatsTab from "@/components/dashboard/ChatsTab";
import ProfileTab from "@/components/dashboard/ProfileTab";
import CreateCampaignModal from "@/components/dashboard/CreateCampaignModal";
import { authClient } from "@/lib/auth-client";
import { Brand, Campaign } from "@/lib/types";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'wallet' | 'chats' | 'profile'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Get current user session
  const { data: session } = authClient.useSession();

  // Get the brand associated with the logged-in user
  const userBrand = useQuery(
    api.brands.getBrandByUserId,
    session?.user?.id ? { userId: session.user.id } : "skip"
  );

  // Fallback to getting the first brand if no user brand found or loading
  const firstBrand = useQuery(api.brands.getFirst);

  // Use the authenticated brand, or the first one as fallback
  const brand = (userBrand || firstBrand) as Brand | null | undefined;

  // Get campaigns for this brand
  const campaigns = useQuery(
    api.campaigns.getByBrandId,
    brand?._id ? { brandId: brand._id } : "skip"
  ) as Campaign[] | undefined;

  const isLoading = (session === undefined) || (brand === undefined);

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-moralana text-black mb-4">No Brand Found</h1>
          <p className="text-gray-500">Please add a brand to the database first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-jost bg-background">
      <Header />

      <div className="flex pl-20">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeTab === 'overview' && (
            <OverviewTab campaigns={campaigns || []} />
          )}
          {activeTab === 'campaigns' && (
            <CampaignsTab
              campaigns={campaigns || []}
              brand={brand}
              onCreateCampaign={handleCreateCampaign}
              onEditCampaign={handleEditCampaign}
            />
          )}
          {activeTab === 'wallet' && (
            <WalletTab brand={brand} />
          )}
          {activeTab === 'chats' && (
            <ChatsTab brand={brand} />
          )}
          {activeTab === 'profile' && (
            <ProfileTab brand={brand} />
          )}
        </main>
      </div>

      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCampaign(null); }}
        brand={brand}
        editingCampaign={editingCampaign}
      />
    </div>
  );
}
