import { BadgeCheck, Eye, Users, BarChart3, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Creator } from "@/lib/types";

interface OfferCardProps extends Creator {
  id: string; // explicitly passed _id
}

export default function OfferCard({
  id,
  name,
  initials,
  verified,
  avatar,
  bio,
  category,
  platform,
  stats,
  startingPrice,
  currency,
  availableSlots,
}: OfferCardProps) {
  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 font-bold border border-gray-100 p-0.5">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-black text-base">
                {name}
              </h3>
              {verified && (
                <div className="relative flex items-center justify-center ml-1">
                  <BadgeCheck className="h-5 w-5 fill-lime-400 text-lime-400 rotate-12 opacity-95" />
                  <Check className="absolute h-2.5 w-2.5 text-black stroke-[4] mt-0" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
               <span className="text-gray-500">{category}</span>
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
            {startingPrice}
          </span>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">{currency}</span>
        </div>
        <h4 className="text-sm font-medium text-gray-600 line-clamp-3 leading-relaxed">
          {bio}
        </h4>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-gray-100 transition-colors">
          <Eye className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-sm font-bold text-black">
            {stats.views}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Avg Views
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-gray-100 transition-colors">
          <Users className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-sm font-bold text-black">
            {stats.followers}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Followers
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-gray-100 transition-colors">
          <BarChart3 className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-sm font-bold text-black">
            {availableSlots}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Slots
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/offer/${id}`}
        className="w-full block text-center py-4 px-6 bg-black text-white font-bold rounded-full transition-all duration-300 shadow-sm"
      >
        View Details
      </Link>
    </div>
  );
}
