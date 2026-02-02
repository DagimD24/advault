"use client";

import { BadgeCheck, Check, MessageCircle, ChevronRight, ChevronLeft, FileVideo, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { JoinedApplication, ApplicationStatus } from "@/lib/types";

interface CandidateCardProps {
  application: JoinedApplication;
  onMoveToStage: (id: string, status: ApplicationStatus) => void;
  onChat: (id: string) => void;
  onViewDetails: (id: string) => void;
  currentStage: ApplicationStatus;
}

const STAGE_ORDER: ApplicationStatus[] = ["pending_creator", "applicant", "shortlisted", "negotiating", "hired", "completed", "declined"];

export default function CandidateCard({ 
  application, 
  onMoveToStage, 
  onChat, 
  onViewDetails,
  currentStage 
}: CandidateCardProps) {
  const { creator } = application;
  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  const nextStage = STAGE_ORDER[currentIndex + 1];
  const prevStage = STAGE_ORDER[currentIndex - 1];

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-lime-100 text-lime-700 border-lime-200";
    if (score >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  if (!creator) {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 text-center text-gray-400 text-sm italic">
        Creator profile missing
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-100 overflow-hidden flex-shrink-0">
          {creator.avatar ? (
            <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover" />
          ) : (
            creator.initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h4 className="font-bold text-black text-sm truncate">{creator.name}</h4>
            {creator.verified && (
              <div className="relative flex items-center justify-center">
                <BadgeCheck className="h-4 w-4 fill-lime-400 text-lime-400" />
                <Check className="absolute h-2 w-2 text-black stroke-[4]" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-gray-500 truncate">{creator.category} • {creator.platform}</p>
            {application.initiatedBy === "brand" && (
              <span className="px-1.5 py-0.5 bg-black text-[#BFFF07] rounded text-[8px] font-black uppercase tracking-tighter">
                Direct Offer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Match Score & Bid */}
      <div className="flex items-center gap-2 mb-4">
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold border",
          getMatchScoreColor(application.matchScore)
        )}>
          {application.matchScore}% MATCH
        </span>
        <span className="px-2.5 py-1 bg-gray-50 rounded-full text-[10px] font-black text-black border border-gray-100 uppercase">
          {application.bidAmount} {application.bidCurrency}
        </span>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3 mb-5 py-3 border-y border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Followers</p>
          <p className="text-xs font-bold text-black">{creator.stats.followers}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Avg Views</p>
          <p className="text-xs font-bold text-black">{creator.stats.views}</p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2">
        {prevStage && currentStage !== "pending_creator" && currentStage !== "declined" && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveToStage(application._id, prevStage); }}
            className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl border border-gray-100 transition-all active:scale-95"
            title={`Move back to ${prevStage}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetails(application._id); }}
          className="flex-1 py-2.5 px-4 bg-black text-white font-bold text-[11px] rounded-xl hover:bg-lime-400 hover:text-black transition-all shadow-sm active:scale-95 uppercase tracking-wider"
        >
          View Details
        </button>

        {nextStage && currentStage !== "pending_creator" && currentStage !== "declined" && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveToStage(application._id, nextStage); }}
            className="p-2.5 bg-lime-400 text-black rounded-xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-95 border border-lime-400 hover:border-black"
            title={`Move to ${nextStage}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
