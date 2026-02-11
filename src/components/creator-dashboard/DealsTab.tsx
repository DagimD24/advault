"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Clock, CheckCircle, XCircle, MessageSquare, ChevronRight, BadgeCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { JoinedApplication, ApplicationStatus } from "@/lib/types";
import Link from "next/link";

interface DealsTabProps {
  applications: JoinedApplication[];
}

export default function DealsTab({ applications }: DealsTabProps) {
  const acceptOffer = useMutation(api.applications.acceptOffer);
  const declineOffer = useMutation(api.applications.declineOffer);

  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case "pending_creator":
        return { label: "Pending Your Response", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock };
      case "applicant":
        return { label: "Applied", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock };
      case "shortlisted":
        return { label: "Shortlisted", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle };
      case "negotiating":
        return { label: "Negotiating", color: "bg-purple-100 text-purple-700 border-purple-200", icon: MessageSquare };
      case "hired":
        return { label: "Hired", color: "bg-black text-white border-gray-800", icon: CheckCircle };
      case "completed":
        return { label: "Completed", color: "bg-lime-100 text-lime-700 border-lime-200", icon: CheckCircle };
      case "declined":
        return { label: "Declined", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle };
      default:
        return { label: status, color: "bg-gray-100 text-gray-600 border-gray-200", icon: Clock };
    }
  };

  const handleAccept = async (id: string) => {
    await acceptOffer({ id: id as any });
  };

  const handleDecline = async (id: string) => {
    await declineOffer({ id: id as any });
  };

  // Group by status
  const pendingOffers = applications.filter(a => a.status === "pending_creator");
  const activeDeals = applications.filter(a => ["applicant", "shortlisted", "negotiating", "hired"].includes(a.status));
  const completedDeals = applications.filter(a => ["completed", "declined"].includes(a.status));

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📂</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">No Deals Yet</h2>
          <p className="text-gray-500 mb-6 max-w-sm">
            Start applying to campaigns to see your deals here.
          </p>
          <Link
            href="/creator"
            className="inline-flex items-center px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all"
          >
            Browse Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const DealCard = ({ deal }: { deal: JoinedApplication }) => {
    const statusConfig = getStatusConfig(deal.status);
    const StatusIcon = statusConfig.icon;
    const isPendingOffer = deal.status === "pending_creator" && deal.initiatedBy === "brand";

    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
              <span className="font-bold text-gray-400">
                {deal.campaign?.title?.substring(0, 2).toUpperCase() || "?"}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-black">{deal.campaign?.title || "Campaign"}</h3>
              <p className="text-sm text-gray-500">{deal.campaign?.platform}</p>
            </div>
          </div>
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5",
            statusConfig.color
          )}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </span>
        </div>

        {isPendingOffer && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <p className="text-sm text-yellow-800 font-medium mb-1">
              Brand sent you an offer!
            </p>
            <p className="text-2xl font-bold text-black">
              {deal.offeredAmount ? (deal.offeredAmount / 100).toLocaleString() : deal.bidAmount} {deal.offeredCurrency || deal.bidCurrency}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>Bid: <span className="font-bold text-black">{deal.bidAmount} {deal.bidCurrency}</span></span>
          <span>Match: <span className="font-bold text-lime-600">{deal.matchScore}%</span></span>
        </div>

        {isPendingOffer ? (
          <div className="flex gap-3">
            <button
              onClick={() => handleDecline(deal._id)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Decline
            </button>
            <button
              onClick={() => handleAccept(deal._id)}
              className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-lime-400 hover:text-black transition-all"
            >
              Accept Offer
            </button>
          </div>
        ) : (
          <Link
            href={`/campaigns/${deal.campaignId}`}
            className="w-full py-3 bg-gray-50 text-black font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-moralana text-black mb-2">Welcome back!</h1>
          <p className="text-gray-500 text-lg">Here's what's happening with your deals today.</p>
        </div>
      </div>
      {/* Pending Offers */}
      {pendingOffers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Offers
            <span className="ml-2 px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              {pendingOffers.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOffers.map((deal) => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
        </div>
      )}

      {/* Active Deals */}
      {activeDeals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-lime-500" />
            Active Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDeals.map((deal) => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
        </div>
      )}

      {/* Completed/Declined */}
      {completedDeals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-gray-400" />
            Past Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedDeals.map((deal) => (
              <DealCard key={deal._id} deal={deal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
