"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Wallet, Users, Target, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { api } from "../../../../../convex/_generated/api";
import { Campaign, JoinedApplication, ApplicationStatus, Brand } from "@/lib/types";
import Header from "@/components/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ApplicationsTable from "@/components/dashboard/ApplicationsTable";
import ApplicationDetailsModal from "@/components/dashboard/ApplicationDetailsModal";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JoinedApplication | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Get campaign data
  const campaign = useQuery(api.campaigns.getById, { id: campaignId }) as (Campaign & { brand: Brand | null }) | null | undefined;
  
  // Get brand for header
  const brand = useQuery(api.brands.getFirst);

  // Get applications for this campaign
  const applications = useQuery(
    api.applications.getByCampaignId,
    campaign?._id ? { campaignId: campaign._id } : "skip"
  ) as JoinedApplication[] | undefined;

  // Mutations
  const updateStatus = useMutation(api.applications.updateStatus);

  const handleMoveToStage = async (applicationId: string, status: ApplicationStatus) => {
    try {
      await updateStatus({
        id: applicationId as Id<"applications">,
        status,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleChat = (applicationId: string) => {
    // TODO: Implement chat functionality
    console.log("Open chat for:", applicationId);
  };

  const handleViewDetails = (applicationId: string) => {
    const app = applications?.find((a) => a._id === applicationId);
    if (app) {
      setSelectedApplication(app);
      setDetailsModalOpen(true);
    }
  };

  const isLoading = campaign === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-moralana text-black mb-4">Campaign Not Found</h1>
          <Link href="/dashboard" className="text-lime-600 hover:underline font-bold">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Count applications pending review
  const pendingReviewApps = applications?.filter(
    (a) => a.status === "hired" && a.contentStatus === "pending"
  ) || [];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Header />
      
      <div className="flex pl-20">
        <Sidebar 
          activeTab="campaigns" 
          onTabChange={() => router.push("/dashboard")} 
        />
        
        <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>

          {/* Campaign Header */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-moralana text-black mb-2">{campaign.title}</h1>
                  <p className="text-gray-500 max-w-2xl">{campaign.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-50 rounded-2xl px-5 py-3 border border-gray-100 flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Budget</p>
                      <p className="text-lg font-bold text-black">{campaign.budget} {campaign.currency}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl px-5 py-3 border border-gray-100 flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Spots</p>
                      <p className="text-lg font-bold text-black">{campaign.spots}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl px-5 py-3 border border-gray-100 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Deadline</p>
                      <p className="text-lg font-bold text-black">{campaign.deadline}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl px-5 py-3 border border-gray-100 flex items-center gap-3">
                    <Target className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Min Followers</p>
                      <p className="text-lg font-bold text-black">{campaign.minFollowers}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Review Queue Alert */}
          {pendingReviewApps.length > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-orange-800">Content Pending Review</p>
                  <p className="text-sm text-orange-600">{pendingReviewApps.length} creator{pendingReviewApps.length > 1 ? 's have' : ' has'} submitted content for approval</p>
                </div>
              </div>
              <button 
                onClick={() => handleViewDetails(pendingReviewApps[0]._id)}
                className="px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded-full hover:bg-orange-200 transition-colors text-sm"
              >
                Review Now
              </button>
            </div>
          )}

          {/* View Toggle & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-black uppercase tracking-widest text-[11px] mb-1">Candidate Pipeline</h2>
              <p className="text-xs text-gray-400 font-medium">Manage and track all campaign participants</p>
            </div>
            
            <div className="flex bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-gray-100 shadow-sm self-start">
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  viewMode === "kanban" 
                    ? "bg-black text-white shadow-lg" 
                    : "text-gray-400 hover:text-black hover:bg-gray-50"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  viewMode === "table" 
                    ? "bg-black text-white shadow-lg" 
                    : "text-gray-400 hover:text-black hover:bg-gray-50"
                )}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>

          {/* Board or Table */}
          <div className="mb-8 overflow-hidden min-h-[600px]">
            {viewMode === "kanban" ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both">
                <KanbanBoard
                  applications={applications || []}
                  onMoveToStage={handleMoveToStage}
                  onChat={handleChat}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
                <ApplicationsTable
                  applications={applications || []}
                  onMoveToStage={handleMoveToStage}
                  onChat={handleChat}
                  onViewDetails={handleViewDetails}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <ApplicationDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => { setDetailsModalOpen(false); setSelectedApplication(null); }}
        application={selectedApplication}
        onStatusChange={(status) => handleMoveToStage(selectedApplication?._id || "", status)}
      />
    </div>
  );
}
