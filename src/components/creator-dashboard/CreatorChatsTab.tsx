"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MessageSquare, Send, BadgeCheck, Check, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Creator, Message, JoinedApplication } from "@/lib/types";
import { Id } from "../../../convex/_generated/dataModel";

interface CreatorChatsTabProps {
  creator: Creator;
  applications: JoinedApplication[];
}

export default function CreatorChatsTab({ creator, applications }: CreatorChatsTabProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<Id<"applications"> | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get messages for selected conversation
  const messages = useQuery(
    api.messages.getByApplicationId,
    selectedApplicationId ? { applicationId: selectedApplicationId } : "skip"
  ) as Message[] | undefined;

  const sendMessage = useMutation(api.messages.send);
  const markAsRead = useMutation(api.messages.markAsRead);

  // Auto-select first conversation with messages
  useEffect(() => {
    if (applications.length > 0 && !selectedApplicationId) {
      setSelectedApplicationId(applications[0]._id as Id<"applications">);
    }
  }, [applications, selectedApplicationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedApplicationId) {
      markAsRead({ applicationId: selectedApplicationId, readerType: "creator" });
    }
  }, [selectedApplicationId, markAsRead]);

  const selectedApp = applications.find((a) => a._id === selectedApplicationId);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedApplicationId) return;

    await sendMessage({
      applicationId: selectedApplicationId,
      senderId: creator._id,
      senderType: "creator",
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending_creator: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      applicant: { label: "Applied", color: "bg-gray-100 text-gray-800" },
      negotiating: { label: "Negotiating", color: "bg-blue-100 text-blue-800" },
      hired: { label: "Hired", color: "bg-green-100 text-green-800" },
      completed: { label: "Completed", color: "bg-gray-100 text-gray-800" },
      declined: { label: "Declined", color: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800" };
    return (
      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", config.color)}>
        {config.label}
      </span>
    );
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">No Conversations Yet</h2>
          <p className="text-gray-500 max-w-sm">
            Apply to campaigns or wait for brands to reach out to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
      {/* Conversation List */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-black text-lg">Messages</h2>
          <p className="text-sm text-gray-500">{applications.length} conversations</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {applications.map((app) => (
            <button
              key={app._id}
              onClick={() => setSelectedApplicationId(app._id as Id<"applications">)}
              className={cn(
                "w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 flex items-start gap-3",
                selectedApplicationId === app._id && "bg-lime-50 hover:bg-lime-50"
              )}
            >
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                {app.campaign?.title?.substring(0, 2).toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-black truncate">{app.campaign?.title || "Campaign"}</p>
                <p className="text-xs text-gray-500 truncate mb-1">{app.campaign?.platform}</p>
                {getStatusBadge(app.status)}
              </div>
              <ChevronRight className={cn(
                "h-5 w-5 text-gray-300 flex-shrink-0",
                selectedApplicationId === app._id && "text-lime-500"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedApp ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                  {selectedApp.campaign?.title?.substring(0, 2).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-bold text-black">{selectedApp.campaign?.title}</p>
                  <p className="text-xs text-gray-500">{selectedApp.campaign?.platform}</p>
                </div>
              </div>
              {getStatusBadge(selectedApp.status)}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={cn(
                    "flex",
                    msg.senderType === "creator" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3",
                      msg.senderType === "creator"
                        ? "bg-black text-white rounded-br-sm"
                        : "bg-gray-100 text-black rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      msg.senderType === "creator" ? "text-gray-400" : "text-gray-500"
                    )}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              
              {(!messages || messages.length === 0) && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
