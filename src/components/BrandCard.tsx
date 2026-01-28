import { BadgeCheck, Clock, Users, Briefcase, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Brand } from "@/lib/types";

interface BrandCardProps {
  id: string;
  title: string;
  budget: string;
  currency: string;
  brand: Brand | null;
  platform: string;
  campaignType: string;
  minFollowers: string;
  spots: number;
  deadline: string;
}

export default function BrandCard({
  id,
  title,
  budget,
  currency,
  brand,
  platform,
  campaignType,
  minFollowers,
  spots,
  deadline,
}: BrandCardProps) {
  if (!brand) return <div className="bg-white rounded-[2rem] border border-gray-100 p-6 h-full animate-pulse flex items-center justify-center text-gray-400">Loading brand info...</div>;

  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 font-bold border border-gray-100">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              brand.name?.substring(0, 2).toUpperCase() || "??"
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-black text-base">
                {brand.name}
              </h3>
              {brand.verified && (
                <div className="relative flex items-center justify-center ml-1">
                  <BadgeCheck className="h-5 w-5 fill-lime-400 text-lime-400 rotate-12 opacity-95" />
                  <Check className="absolute h-2.5 w-2.5 text-black stroke-[4] mt-0" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
               <span className="text-gray-500 uppercase tracking-wider">{brand.industry}</span>
               <span className="w-1 h-1 rounded-full bg-gray-300"></span>
               <span className="text-lime-600 font-bold">{platform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 flex-1">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-moralana text-black">
            {budget}
          </span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">{currency}</span>
        </div>
        <h4 className="text-lg font-medium text-gray-800 line-clamp-2 leading-relaxed group-hover:text-black transition-colors">
          {title}
        </h4>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-gray-100 transition-colors">
          <Users className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-sm font-bold text-black">
            {minFollowers}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Min
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-gray-100 transition-colors">
          <Briefcase className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-sm font-bold text-black">
            {spots}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Spots
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-gray-100 transition-colors">
          <Clock className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-sm font-bold text-black truncate w-full">
            {deadline}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            End
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/offer/${id}`}
        className="w-full block text-center py-4 px-6 bg-black text-white font-bold rounded-full shadow-sm hover:shadow-md transition-shadow transition-transform transition-duration-300"
      >
        Apply Now
      </Link>
    </div>
  );
}
