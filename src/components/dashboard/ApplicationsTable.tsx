"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { JoinedApplication, ApplicationStatus } from "@/lib/types";
import { BadgeCheck, Check, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationsTableProps {
  applications: JoinedApplication[];
  onMoveToStage: (id: string, status: ApplicationStatus) => void;
  onChat: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export default function ApplicationsTable({ applications, onViewDetails }: ApplicationsTableProps) {
  
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-lime-100 text-lime-700";
    if (score >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "completed": return "bg-lime-50 text-lime-700";
      case "hired": return "bg-black text-white";
      case "negotiating": return "bg-blue-50 text-blue-700";
      case "shortlisted": return "bg-orange-50 text-orange-700";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="h-10 text-[10px]">Creator</TableHead>
            <TableHead className="h-10 text-[10px]">Match</TableHead>
            <TableHead className="h-10 text-[10px]">Bid</TableHead>
            <TableHead className="h-10 text-[10px]">Followers</TableHead>
            <TableHead className="h-10 text-[10px]">Stage</TableHead>
            <TableHead className="h-10 text-[10px]">Content</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-400 italic text-sm">
                No applications found for this campaign.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => {
              const { creator } = app;
              if (!creator) return null;

              return (
                <TableRow 
                  key={app._id} 
                  className="cursor-pointer hover:bg-gray-50/50 transition-colors" 
                  onClick={() => onViewDetails(app._id)}
                >
                  {/* Creator Info */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                        {creator.avatar ? (
                          <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-bold text-gray-400 text-xs">{creator.initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-black text-xs truncate">{creator.name}</p>
                          {creator.verified && (
                            <div className="relative flex items-center justify-center flex-shrink-0">
                              <BadgeCheck className="h-3 w-3 fill-lime-400 text-lime-400" />
                              <Check className="absolute h-1.5 w-1.5 text-black stroke-[4]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-gray-400 font-medium truncate">
                          {creator.platform} • {creator.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Match Score */}
                  <TableCell className="py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold",
                      getMatchScoreColor(app.matchScore)
                    )}>
                      {app.matchScore}%
                    </span>
                  </TableCell>

                  {/* Bid Amount */}
                  <TableCell className="py-3">
                    <p className="font-bold text-black text-xs">
                      {app.bidAmount} <span className="text-[9px] text-gray-400 font-medium">{app.bidCurrency}</span>
                    </p>
                  </TableCell>

                  {/* Audience Stats */}
                  <TableCell className="py-3">
                    <p className="text-xs font-bold text-black">{creator.stats.followers}</p>
                  </TableCell>

                  {/* Status / Stage */}
                  <TableCell className="py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                      getStatusColor(app.status)
                    )}>
                      {app.status}
                    </span>
                  </TableCell>

                  {/* Content Status */}
                  <TableCell className="py-3">
                    {app.contentDraftUrl ? (
                      <div className="flex items-center gap-1.5">
                        <FileVideo className={cn(
                          "h-3.5 w-3.5",
                          app.contentStatus === "approved" ? "text-lime-500" : 
                          app.contentStatus === "pending" ? "text-orange-500" : "text-red-500"
                        )} />
                        <span className="text-[9px] font-medium text-gray-500">Draft</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-gray-300 font-medium">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
