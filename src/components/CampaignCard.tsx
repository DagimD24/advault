"use client";

import Link from "next/link";
import { Calendar, Users, BadgeCheck, Check, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
  id: string;
  title: string;
  platform: string;
  campaignType: string;
  budget: string;
  currency: string;
  deadline: string;
  spots: number;
  brand?: {
    name: string;
    logo?: string;
    initials?: string;
    verified?: boolean;
  } | null;
}

export default function CampaignCard({
  id,
  title,
  platform,
  campaignType,
  budget,
  currency,
  deadline,
  spots,
  brand,
}: CampaignCardProps) {
  const getPlatformColor = (p: string) => {
    switch (p.toLowerCase()) {
      case "youtube": return "bg-red-50 text-red-600 border-red-100";
      case "tiktok": return "bg-black text-white border-gray-800";
      case "instagram": return "bg-pink-50 text-pink-600 border-pink-100";
      case "telegram": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <Link href={`/creator/campaign/${id}`} className="block group">
      <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
            {brand?.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-bold text-gray-400 text-sm">{brand?.initials || "?"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-bold text-black text-sm truncate">{brand?.name || "Unknown Brand"}</p>
              {brand?.verified && (
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="h-4 w-4 fill-lime-400 text-lime-400" />
                  <Check className="absolute h-2 w-2 text-black stroke-[4]" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">Verified Brand</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-lime-500 transition-colors" />
        </div>

        {/* Campaign Title */}
        <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 group-hover:text-lime-600 transition-colors">
          {title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            getPlatformColor(platform)
          )}>
            {platform}
          </span>
          <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-100">
            {campaignType}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Budget</p>
            <p className="text-sm font-bold text-black">{budget} <span className="text-gray-400 font-medium">{currency}</span></p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Deadline</p>
            <p className="text-sm font-bold text-black flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              {deadline}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Spots</p>
            <p className="text-sm font-bold text-black flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-400" />
              {spots} left
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">View Details</span>
            <div className="h-10 w-10 rounded-full bg-black group-hover:bg-lime-400 flex items-center justify-center transition-all">
              <Briefcase className="h-4 w-4 text-white group-hover:text-black transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
