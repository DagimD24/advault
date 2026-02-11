"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import Link from "next/link";
import {
  ArrowLeft, BadgeCheck, Check, Calendar, Users, Target,
  Clock, FileText, Send, Briefcase, MapPin, Loader2
} from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Campaign, Creator } from "@/lib/types";

interface CampaignWithBrand extends Campaign {
  brand?: {
    _id: string;
    name: string;
    logo?: string;
    verified?: boolean;
  } | null;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [bidAmount, setBidAmount] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch campaign details
  const campaign = useQuery(api.campaigns.getById, { id: campaignId }) as CampaignWithBrand | null | undefined;

  // Get demo creator
  const creator = useQuery(api.creators.getFirst) as Creator | null | undefined;

  const createApplication = useMutation(api.applications.create);

  const isLoading = campaign === undefined || creator === undefined;

  // Set default bid amount when campaign loads
  if (campaign && !bidAmount) {
    setBidAmount(campaign.budget.replace(/,/g, ""));
  }

  const handleApply = async () => {
    setError("");

    if (!bidAmount) {
      setError("Please enter your bid amount");
      return;
    }

    if (!coverLetter.trim()) {
      setError("Please write a cover letter");
      return;
    }

    if (!campaign || !creator) {
      setError("Loading data...");
      return;
    }

    const bidNum = parseFloat(bidAmount.replace(/,/g, ""));
    if (isNaN(bidNum) || bidNum <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      await createApplication({
        campaignId: campaign._id as any,
        creatorId: creator._id,
        status: "applicant",
        matchScore: 85, // Placeholder - would be calculated
        bidAmount: bidAmount,
        bidCurrency: campaign.currency,
        initiatedBy: "creator",
      });

      router.push("/creator/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-lime-400" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-moralana text-black mb-4">Campaign Not Found</h1>
          <Link href="/creator" className="text-lime-600 hover:underline font-bold">
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/creator"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Header */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                  {campaign.brand?.logo ? (
                    <img src={campaign.brand.logo} alt={campaign.brand.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-bold text-gray-400 text-lg">
                      {campaign.brand?.name?.substring(0, 2).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-500">{campaign.brand?.name}</span>
                    <div className="relative flex items-center justify-center">
                      <BadgeCheck className="h-4 w-4 fill-lime-400 text-lime-400" />
                      <Check className="absolute h-2 w-2 text-black stroke-[4]" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-moralana text-black">{campaign.title}</h1>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-4 py-1.5 bg-black text-white rounded-full text-xs font-bold">
                  {campaign.platform}
                </span>
                <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {campaign.campaignType}
                </span>
                <span className="px-4 py-1.5 bg-lime-100 text-lime-700 rounded-full text-xs font-bold">
                  {campaign.spots} spots left
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-8">{campaign.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-lime-500" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Budget</p>
                  </div>
                  <p className="text-xl font-bold text-black">{campaign.budget} <span className="text-sm text-gray-400">{campaign.currency}</span></p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Deadline</p>
                  </div>
                  <p className="text-xl font-bold text-black">{campaign.deadline}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Min Followers</p>
                  </div>
                  <p className="text-xl font-bold text-black">{campaign.minFollowers}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Location</p>
                  </div>
                  <p className="text-xl font-bold text-black">{campaign.audience?.location || "Global"}</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-lime-500" />
                Requirements
              </h2>
              <ul className="space-y-3">
                {campaign.requirements?.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-lime-600 stroke-[3]" />
                    </div>
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Apply Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <Send className="h-5 w-5 text-lime-500" />
                  Apply Now
                </h2>

                <div className="space-y-5">
                  {/* Bid Amount */}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">
                      Your Bid ({campaign.currency})
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                      placeholder={campaign.budget}
                    />
                    <p className="text-xs text-gray-400 mt-1">Campaign budget: {campaign.budget} {campaign.currency}</p>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent resize-none"
                      placeholder="Tell the brand why you're a great fit for this campaign..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleApply}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-black to-gray-800 rounded-[2rem] p-6 text-white shadow-lg">
                <p className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-4">Quick Stats</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Response</span>
                    <span className="font-bold">2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Applications</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hired</span>
                    <span className="font-bold text-lime-400">3 creators</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
