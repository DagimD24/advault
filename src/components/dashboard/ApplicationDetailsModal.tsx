"use client";

import { useState } from "react";
import { X, Play, CheckCircle2, ChevronDown, FileVideo, MessageCircle, Info, TrendingUp, DollarSign, Calendar, Target, User, ShieldCheck, Loader2, Save, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { JoinedApplication, ContentStatus, ApplicationStatus } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JoinedApplication | null;
  onStatusChange: (status: ApplicationStatus) => void;
}

export default function ApplicationDetailsModal({ isOpen, onClose, application, onStatusChange }: ApplicationDetailsModalProps) {
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // New state for buffered changes
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);
  const [internalNotes, setInternalNotes] = useState("");

  const updateContentStatus = useMutation(api.applications.updateContentStatus);
  const updateApplication = useMutation(api.applications.update);

  // Initialize buffered state when application changes
  useState(() => {
    if (application) {
      setPendingStatus(application.status);
      setInternalNotes(application.notes || "");
    }
  });

  const hasChanges = application && (
    (pendingStatus && pendingStatus !== application.status) ||
    internalNotes !== (application.notes || "")
  );

  const handleSave = async () => {
    if (!application || !pendingStatus) return;
    setIsSubmitting(true);
    try {
      await updateApplication({
        id: application._id,
        status: pendingStatus,
        notes: internalNotes,
      });
      // Optionally notify user or just close
      onClose();
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
    setIsSubmitting(false);
  };

  const handleContentAction = async (status: ContentStatus) => {
    if (!application) return;
    setIsSubmitting(true);
    try {
      await updateContentStatus({
        id: application._id,
        contentStatus: status,
        notes: status === "revision_requested" ? revisionNotes : undefined,
      });
      // Optionally don't close, just update state. But for now close is fine.
      onClose();
      setRevisionNotes("");
    } catch (error) {
      console.error("Failed to update content status:", error);
    }
    setIsSubmitting(false);
  };

  if (!isOpen || !application) return null;

  const { creator } = application;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-[#F3F4F6] rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white/20">
        
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
              {creator?.avatar ? (
                <img src={creator.avatar} alt={creator.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-2xl text-gray-400">{creator?.initials}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-moralana text-black">{creator?.name}</h2>
                {creator?.verified && <ShieldCheck className="h-5 w-5 text-lime-500 fill-lime-50" />}
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-100 transition-all border border-gray-100 ml-2">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-lime-100 text-lime-700 rounded-full text-[10px] font-black ring-1 ring-lime-200 uppercase tracking-widest">
                  {pendingStatus || application.status}
                </span>
                <span className="text-xs font-medium text-gray-400">Match: {application.matchScore}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-black rounded-full text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100 active:scale-95"
              >
                Actions
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showStatusDropdown && "rotate-180")} />
              </button>

              {showStatusDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Move to Stage</p>
                  {(["applicant", "shortlisted", "negotiating", "hired", "completed"] as ApplicationStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setPendingStatus(status);
                        setShowStatusDropdown(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors",
                        (pendingStatus || application.status) === status 
                          ? "bg-lime-50 text-lime-700" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      )}
                    >
                      <span className="capitalize">{status}</span>
                      {(pendingStatus || application.status) === status && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-gray-100 mx-1" />

            <button
              onClick={handleSave}
              disabled={isSubmitting || !hasChanges}
              className={cn(
                "flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                hasChanges 
                  ? "bg-black text-white hover:bg-lime-400 hover:text-black" 
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Creator & Application Info */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Creator Bio & Stats */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  Creator Profile
                </h3>
                <p className="text-gray-500 leading-relaxed mb-8">{creator?.bio}</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Followers</p>
                    <p className="text-xl font-bold text-black">{creator?.stats.followers}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Avg Views</p>
                    <p className="text-xl font-bold text-black">{creator?.stats.views}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Success Rate</p>
                    <p className="text-xl font-bold text-lime-600">{creator?.stats.completion}</p>
                  </div>
                </div>
              </div>

              {/* Content Review Section (Only for Hired/Completed) */}
              {(application.status === "hired" || application.status === "completed") && (
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm overflow-hidden relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-black flex items-center gap-2">
                      <FileVideo className="h-5 w-5 text-gray-400" />
                      Content Approval
                    </h3>
                    {application.contentStatus && (
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold",
                        application.contentStatus === "approved" ? "bg-lime-100 text-lime-700" : 
                        application.contentStatus === "pending" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                      )}>
                        {application.contentStatus.replace("_", " ").toUpperCase()}
                      </span>
                    )}
                  </div>

                  {application.contentDraftUrl ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Direct Draft Link</p>
                        <a 
                          href={application.contentDraftUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-lime-600 font-bold hover:underline break-all block"
                        >
                          {application.contentDraftUrl}
                        </a>
                      </div>

                      {application.contentStatus === "pending" && (
                        <div className="space-y-4">
                          <textarea
                            value={revisionNotes}
                            onChange={(e) => setRevisionNotes(e.target.value)}
                            placeholder="Add revision notes here if needed..."
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200/50 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all text-sm resize-none h-24"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => handleContentAction("revision_requested")}
                              className="flex items-center justify-center gap-2 py-4 px-6 bg-red-50 text-red-700 font-bold rounded-2xl hover:bg-red-100 transition-all"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Request Revision
                            </button>
                            <button
                              onClick={() => handleContentAction("approved")}
                              className="flex items-center justify-center gap-2 py-4 px-6 bg-black text-white font-bold rounded-2xl hover:bg-lime-400 hover:text-black transition-all shadow-xl"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                              Approve & Release ETB
                            </button>
                          </div>
                        </div>
                      )}

                      {application.notes && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                          <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Previous Revision Notes</p>
                          <p className="text-sm text-blue-900">{application.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-center">
                      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <FileVideo className="h-8 w-8 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-medium italic">Creator hasn't submitted a draft yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Application Details & Actions */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Bid Breakdown */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  Application Deal
                </h3>
                
                <div className="space-y-4">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Creator Bid</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-moralana text-black">{application.bidAmount}</span>
                        <span className="text-sm font-bold text-gray-500">{application.bidCurrency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Platform</p>
                        <p className="text-sm font-bold text-black">{creator?.platform}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Applied On</p>
                        <p className="text-sm font-bold text-black">
                          {new Date(application._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* internal notes (placeholder) */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-gray-400" />
                  Internal Brand Notes
                </h3>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Only visible to your team..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/50 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all text-sm resize-none h-32"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
