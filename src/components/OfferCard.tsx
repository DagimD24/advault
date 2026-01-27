import { BadgeCheck, Eye, Users, BarChart3 } from "lucide-react";
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
    <div className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
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
              <h3 className="font-semibold text-gray-900 text-sm">
                {name}
              </h3>
              {verified && (
                <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-50/50" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
               <span className="text-gray-500">{category}</span>
               <span className="w-1 h-1 rounded-full bg-gray-300"></span>
               <span className="text-indigo-600">{platform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-6 flex-1">
        <p className="text-gray-500 text-sm mb-1 font-medium">Starting Price</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {startingPrice}
          </span>
          <span className="text-sm font-medium text-gray-500">{currency}</span>
        </div>
        <h4 className="mt-2 text-sm font-medium text-gray-700 line-clamp-2">
          {bio}
        </h4>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <Eye className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-xs font-semibold text-gray-900">
            {stats.views}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            Avg Views
          </span>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <Users className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-xs font-semibold text-gray-900">
            {stats.followers}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            Followers
          </span>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <BarChart3 className="h-4 w-4 text-gray-400 mb-1" />
          <span className="block text-xs font-semibold text-gray-900">
            {availableSlots}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wide">
            Slots Left
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/offer/${id}`}
        className="w-full block text-center py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
      >
        View Details
      </Link>
    </div>
  );
}
