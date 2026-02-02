"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Flag, BadgeCheck, Star, ShieldCheck, Clock, CheckCircle2, Check } from "lucide-react";
import Header from "@/components/Header";
import { notFound, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Creator, JoinedCampaign } from "@/lib/types";

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
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
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
    <div className="min-h-screen bg-[#F3F4F6] pb-12">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        {/* Top Summary Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
            <div className="flex gap-6">
              <div className="h-24 w-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-600 font-bold text-2xl flex-shrink-0 border border-gray-100">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName || "Offer Image"}
                    className="h-full w-full rounded-[2rem] object-cover"
                  />
                ) : (
                  displayInitials
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-moralana font-bold text-black">
                    {displayName}
                  </h1>
                  {isVerified && (
                    <div className="relative flex items-center justify-center ml-1">
                      <BadgeCheck className="h-8 w-8 fill-lime-400 text-lime-400 rotate-12 opacity-95" />
                      <Check className="absolute h-3.5 w-3.5 text-black stroke-[4] mt-0" />
                    </div>
                  )}
                </div>
                <h2 className="text-gray-500 font-medium mb-4 text-lg">{isBrand ? brandOffer?.title : creatorOffer?.category + " Creator"}</h2>
                
                <div className="flex items-center gap-4 text-sm">
                   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-lime-100 text-lime-900 rounded-full font-bold shadow-sm">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Trust Score: {isBrand ? brandOffer?.trustScore : creatorOffer?.trustScore}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-gray-800 font-bold">
                      <Star className="h-4 w-4 text-black fill-black" />
                      <span>4.9</span>
                      <span className="text-gray-400 font-medium">(120 reviews)</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center md:border-l md:pl-10 border-gray-100">
               <div className="text-right">
                 <span className="block text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">{isBrand ? "Budget" : "Starting Price"}</span>
                 <div className="flex items-baseline justify-end gap-1">
                    <span className="text-5xl font-moralana text-black">
                      {isBrand ? brandOffer?.budget : creatorOffer?.startingPrice}
                    </span>
                    <span className="text-xl font-bold text-gray-400">
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
                <button className="border-black text-black whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm">
                  {isBrand ? "Campaign Details" : "Bio & Info"}
                </button>
                <button className="border-transparent text-gray-500 hover:text-black hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
                  {isBrand ? "Creator Specs" : "Stats"}
                </button>
                <button className="border-transparent text-gray-500 hover:text-black hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
                  {isBrand ? "Applicants" : "Reviews"}
                </button>
              </nav>
            </div>

            {/* Quick Stats Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white px-4 py-6 shadow-sm rounded-[2rem] border border-gray-100 overflow-hidden sm:p-8 hover:shadow-md transition-shadow">
                <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">Platform</dt>
                <dd className="mt-2 text-2xl font-bold text-black">{offer.platform}</dd>
              </div>
              <div className="bg-white px-4 py-6 shadow-sm rounded-[2rem] border border-gray-100 overflow-hidden sm:p-8 hover:shadow-md transition-shadow">
                <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">
                   {isBrand ? "Deadline" : "Slots"}
                </dt>
                <dd className="mt-2 text-2xl font-bold text-black">
                   {isBrand ? brandOffer?.deadline : creatorOffer?.availableSlots}
                </dd>
              </div>
              <div className="bg-white px-4 py-6 shadow-sm rounded-[2rem] border border-gray-100 overflow-hidden sm:p-8 hover:shadow-md transition-shadow">
                <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">Type</dt>
                <dd className="mt-2 text-2xl font-bold text-black">
                  {isBrand ? brandOffer?.campaignType : "Creator"}
                </dd>
              </div>
            </dl>

            {/* Description & Requirements */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <h3 className="text-2xl font-moralana font-bold text-black mb-6">{isBrand ? "About This Campaign" : "Creator Bio"}</h3>
               <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                 {isBrand ? brandOffer?.description : creatorOffer?.bio}
               </p>
 
               <div className="border-t border-gray-100 pt-8">
                 <h3 className="text-xl font-bold text-black mb-6">Deliverables & Requirements</h3>
                 <ul className="space-y-4">
                   {isBrand && brandOffer?.requirements ? (
                      brandOffer.requirements.map((req, idx) => (
                         <li key={idx} className="flex items-start gap-4">
                           <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center mt-0.5">
                             <CheckCircle2 className="h-4 w-4 text-lime-600" />
                           </div>
                           <span className="text-gray-700 font-medium">{req}</span>
                         </li>
                       ))
                    ) : !isBrand ? (
                       <li className="text-gray-700 font-medium flex items-center gap-2">
                         <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                            <Clock className="h-4 w-4 text-lime-400" />
                         </div>
                         <span>Available for direct bookings and custom campaigns.</span>
                       </li>
                    ) : (
                       <li className="text-gray-500 italic">No specific requirements listed.</li>
                    )}
                  </ul>
               </div>
            </div>
 
            {/* Audience Demographics */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <h3 className="text-2xl font-moralana font-bold text-black mb-6">Audience Demographics</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-2">Location</p>
                     <p className="text-black font-bold text-lg">
                        {isBrand ? brandOffer?.audience?.location : "National / Urban"}
                     </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-2">Age Range</p>
                     <p className="text-black font-bold text-lg">
                        {isBrand ? brandOffer?.audience?.age : "18 - 34"}
                     </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-2">Gender Split</p>
                     <p className="text-black font-bold text-lg">
                        {isBrand ? brandOffer?.audience?.gender : "All Genders"}
                     </p>
                  </div>
               </div>
            </div>

            {/* Channel/Campaign Stats */}
             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-moralana font-bold text-black">{isBrand ? "Campaign Specs" : "Channel Performance"}</h3>
                 <span className="inline-flex items-center rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-900 shadow-sm border border-lime-200">
                    <span className="w-2 h-2 rounded-full bg-lime-500 mr-2 animate-pulse"></span>
                    {isBrand ? "Active" : "Live Data"}
                 </span>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="p-5 bg-gray-50 rounded-[1.5rem] text-center border border-gray-100 hover:border-lime-200 transition-colors">
                       <p className="text-3xl font-moralana text-black mb-2">{stat.value}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
                  <h3 className="font-moralana font-bold text-black mb-6 text-2xl">Accept Offer</h3>
                  
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Payment Method</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all">
                        <option>Telebirr</option>
                        <option>Chapa</option>
                        <option>Direct Transfer</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Message (Optional)</label>
                      <textarea 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all resize-none"
                        rows={3}
                        placeholder="Hi, I'm interested in this offer..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link 
                      href={isBrand ? "#" : `/outreach/${id}`}
                      className="block w-full py-4 bg-black hover:bg-lime-400 hover:text-black text-white font-bold rounded-full shadow-lg shadow-black/10 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center"
                    >
                      {isBrand ? "Apply for Campaign" : "Reach Out"}
                    </Link>
                     <button className="w-full py-4 bg-white border border-gray-200 text-black font-bold rounded-full hover:bg-gray-50 transition-colors">
                      {isBrand ? "Message Brand" : "Contact Streamer"}
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold justify-center uppercase tracking-wide">
                       <Clock className="h-3.5 w-3.5" />
                       <span>Avg. response time: <span className="text-black">1 hr</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 text-gray-400">
                   <button className="hover:text-black transition-colors flex items-center gap-1.5 text-sm font-bold">
                      <Share2 className="h-4 w-4" /> Share
                   </button>
                    <button className="hover:text-black transition-colors flex items-center gap-1.5 text-sm font-bold">
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
