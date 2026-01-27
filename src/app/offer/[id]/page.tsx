"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Flag, BadgeCheck, Star, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { notFound, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Creator, JoinedCampaign } from "@/lib/types";
import { Id } from "../../../../convex/_generated/dataModel";

export default function OfferDetail() {
  const params = useParams();
  const id = params.id as string;
  
  // Try to fetch as creator first, then as campaign
  const creatorOffer = useQuery(api.creators.getById, { id }) as Creator | null | undefined;
  const brandOffer = useQuery(api.campaigns.getById, { id }) as JoinedCampaign | null | undefined;
  
  const isLoading = creatorOffer === undefined && brandOffer === undefined;
  const offer = creatorOffer || brandOffer;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!offer) {
    notFound();
  }

  const isBrand = !!brandOffer;
  
  // Normalize data for display
  const displayImage = isBrand ? (brandOffer?.brand?.logo || "") : (creatorOffer?.avatar || "");
  const displayName = isBrand ? brandOffer?.brand?.name : creatorOffer?.name;
  const displayInitials = isBrand ? brandOffer?.brand?.name?.substring(0, 2).toUpperCase() : creatorOffer?.initials;
  const isVerified = isBrand ? brandOffer?.brand?.verified : creatorOffer?.verified;

  // For Brand offers, we show different stats
  const stats = isBrand ? [
     { label: "Min Followers", value: brandOffer?.minFollowers },
     { label: "Open Spots", value: brandOffer?.spots },
     { label: "Deadline", value: brandOffer?.deadline },
     { label: "Type", value: brandOffer?.campaignType }
  ] : [
     { label: "Followers", value: creatorOffer?.stats.followers },
     { label: "Avg Views", value: creatorOffer?.stats.views },
     { label: "Slots Left", value: creatorOffer?.availableSlots },
     { label: "Trust Score", value: creatorOffer?.trustScore }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        {/* Top Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl flex-shrink-0">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  displayInitials
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">
                    {displayName}
                  </h1>
                  {isVerified && (
                    <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-50/50" />
                  )}
                </div>
                <h2 className="text-gray-500 font-medium mb-3">{isBrand ? brandOffer?.title : creatorOffer?.category + " Creator"}</h2>
                
                <div className="flex items-center gap-4 text-sm">
                   <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg font-medium">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Trust Score: {isBrand ? brandOffer?.trustScore : creatorOffer?.trustScore}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-gray-500">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">4.9</span>
                      <span>(120 reviews)</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center md:border-l md:pl-8 border-gray-100">
               <div className="text-right">
                 <span className="block text-sm text-gray-500 font-medium mb-1">{isBrand ? "Budget" : "Starting Price"}</span>
                 <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">
                      {isBrand ? brandOffer?.budget : creatorOffer?.startingPrice}
                    </span>
                    <span className="text-lg font-medium text-gray-500">
                      {isBrand ? brandOffer?.currency : creatorOffer?.currency}
                    </span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  {isBrand ? "Campaign Details" : "Bio & Info"}
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  {isBrand ? "Creator Specs" : "Stats"}
                </button>
                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  {isBrand ? "Applicants" : "Reviews"}
                </button>
              </nav>
            </div>

            {/* Quick Stats Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white px-4 py-5 shadow-sm rounded-xl border border-gray-100 overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Platform</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{offer.platform}</dd>
              </div>
              <div className="bg-white px-4 py-5 shadow-sm rounded-xl border border-gray-100 overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                   {isBrand ? "Campaign Deadline" : "Available Slots"}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                   {isBrand ? brandOffer?.deadline : creatorOffer?.availableSlots}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 shadow-sm rounded-xl border border-gray-100 overflow-hidden sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Type</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {isBrand ? brandOffer?.campaignType : "Creator Profile"}
                </dd>
              </div>
            </dl>

            {/* Description & Requirements */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 mb-4">{isBrand ? "About This Campaign" : "Creator Bio"}</h3>
               <p className="text-gray-600 leading-relaxed mb-8">
                 {isBrand ? brandOffer?.description : creatorOffer?.bio}
               </p>
 
               <div className="border-t border-gray-100 pt-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Deliverables & Requirements</h3>
                 <ul className="space-y-4">
                   {isBrand && brandOffer?.requirements ? (
                      brandOffer.requirements.map((req, idx) => (
                         <li key={idx} className="flex items-start gap-4">
                           <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center mt-0.5">
                             <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                           </div>
                           <span className="text-gray-700 font-medium">{req}</span>
                         </li>
                       ))
                    ) : !isBrand ? (
                       <li className="text-gray-700 font-medium flex items-center gap-2">
                         <Clock className="h-4 w-4 text-indigo-600" />
                         <span>Available for direct bookings and custom campaigns.</span>
                       </li>
                    ) : (
                       <li className="text-gray-500 italic">No specific requirements listed.</li>
                    )}
                  </ul>
               </div>
            </div>
 
            {/* Audience Demographics */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 mb-6">Audience Demographics</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                     <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Location</p>
                     <p className="text-gray-900 font-medium">
                        {isBrand ? brandOffer?.audience?.location : "National / Urban"}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Age Range</p>
                     <p className="text-gray-900 font-medium">
                        {isBrand ? brandOffer?.audience?.age : "18 - 34"}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Gender Split</p>
                     <p className="text-gray-900 font-medium">
                        {isBrand ? brandOffer?.audience?.gender : "All Genders"}
                     </p>
                  </div>
               </div>
            </div>

            {/* Channel/Campaign Stats */}
             <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-gray-900">{isBrand ? "Campaign Specs" : "Channel Performance"}</h3>
                 <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {isBrand ? "Active" : "Live Verified Data"}
                 </span>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl text-center">
                       <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg shadow-gray-200/50">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Accept Offer</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                        <option>Telebirr</option>
                        <option>Chapa</option>
                        <option>Direct Transfer</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                      <textarea 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        rows={3}
                        placeholder="Hi, I'm interested in this offer..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-gray-900/10 transition-all transform active:scale-[0.98]">
                      {isBrand ? "Apply for Campaign" : "Buy Now"}
                    </button>
                     <button className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                      {isBrand ? "Message Brand" : "Contact Streamer"}
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                       <Clock className="h-3.5 w-3.5" />
                       <span>Avg. response time: <strong>1 hr</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 text-gray-400">
                   <button className="hover:text-gray-600 transition-colors flex items-center gap-1.5 text-sm">
                      <Share2 className="h-4 w-4" /> Share
                   </button>
                    <button className="hover:text-gray-600 transition-colors flex items-center gap-1.5 text-sm">
                      <Flag className="h-4 w-4" /> Report
                   </button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
