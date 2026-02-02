"use client";

import { Users, UserCheck, MessageSquare, Briefcase, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { JoinedApplication, ApplicationStatus } from "@/lib/types";
import CandidateCard from "./CandidateCard";

interface KanbanBoardProps {
  applications: JoinedApplication[];
  onMoveToStage: (id: string, status: ApplicationStatus) => void;
  onChat: (id: string) => void;
  onViewDetails: (id: string) => void;
}

interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  icon: typeof Users;
  color: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: "pending_creator", title: "Pending Offers", icon: Clock, color: "border-t-yellow-400" },
  { id: "applicant", title: "Applicants", icon: Users, color: "border-t-gray-400" },
  { id: "shortlisted", title: "Shortlisted", icon: UserCheck, color: "border-t-blue-400" },
  { id: "negotiating", title: "Negotiating", icon: MessageSquare, color: "border-t-purple-400" },
  { id: "hired", title: "Hired / In Progress", icon: Briefcase, color: "border-t-orange-400" },
  { id: "completed", title: "Completed", icon: CheckCircle, color: "border-t-lime-400" },
];

export default function KanbanBoard({ applications, onMoveToStage, onChat, onViewDetails }: KanbanBoardProps) {
  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {COLUMNS.map((column) => {
          const columnApps = getApplicationsByStatus(column.id);
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className={cn(
                "w-80 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col min-h-[500px]",
                "border-t-4",
                column.color
              )}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <h3 className="font-bold text-black text-sm">{column.title}</h3>
                  </div>
                  <span className="h-6 min-w-6 px-2 bg-white rounded-full text-xs font-bold text-gray-600 flex items-center justify-center border border-gray-100">
                    {columnApps.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[600px]">
                {columnApps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <Icon className="h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">No candidates yet</p>
                  </div>
                ) : (
                  columnApps.map((app) => (
                    <CandidateCard
                      key={app._id}
                      application={app}
                      onMoveToStage={onMoveToStage}
                      onChat={onChat}
                      onViewDetails={onViewDetails}
                      currentStage={column.id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
