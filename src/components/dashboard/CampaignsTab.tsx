"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Calendar, Users, Wallet, Edit, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Campaign, Brand } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface CampaignsTabProps {
  campaigns: Campaign[];
  brand: Brand | null;
  onCreateCampaign: () => void;
  onEditCampaign: (campaign: Campaign) => void;
}

export default function CampaignsTab({ campaigns, brand, onCreateCampaign, onEditCampaign }: CampaignsTabProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const removeCampaign = useMutation(api.campaigns.remove);

  const handleDelete = async (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      try {
        await removeCampaign({ id: campaignId as any });
      } catch (error) {
        console.error("Failed to delete campaign:", error);
      }
    }
    setActiveMenu(null);
  };

  const getCampaignStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    if (deadlineDate < now) return { label: "Completed", color: "bg-gray-100 text-gray-600" };
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) return { label: "Ending Soon", color: "bg-orange-100 text-orange-700" };
    return { label: "Active", color: "bg-lime-100 text-lime-700" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-moralana text-black">Your Campaigns</h2>
          <p className="text-gray-500 mt-1">Manage and track all your sponsorship campaigns.</p>
        </div>
        <button
          onClick={onCreateCampaign}
          className="flex items-center gap-2 px-6 py-3.5 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Create Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 shadow-sm text-center">
          <div className="max-w-md mx-auto">
            <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
              <Plus className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-moralana text-black mb-3">No campaigns yet</h3>
            <p className="text-gray-500 mb-8">Create your first campaign to start connecting with creators and growing your brand.</p>
            <button
              onClick={onCreateCampaign}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              Create Your First Campaign
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const status = getCampaignStatus(campaign.deadline);
            return (
              <div
                key={campaign._id}
                className="group bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold", status.color)}>
                    {status.label}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === campaign._id ? null : campaign._id)}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {activeMenu === campaign._id && (
                      <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                        <button
                          onClick={() => { onEditCampaign(campaign); setActiveMenu(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(campaign._id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Campaign Title */}
                <h3 className="text-lg font-bold text-black mb-2 line-clamp-2 group-hover:text-black transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">
                  {campaign.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <Wallet className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <span className="block text-sm font-bold text-black">{campaign.budget}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{campaign.currency}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <Users className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <span className="block text-sm font-bold text-black">{campaign.spots}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Spots</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <Calendar className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                    <span className="block text-sm font-bold text-black truncate">{campaign.deadline}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Deadline</span>
                  </div>
                </div>

                {/* View Button */}
                <button className="w-full py-3 px-4 bg-gray-50 text-black font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
