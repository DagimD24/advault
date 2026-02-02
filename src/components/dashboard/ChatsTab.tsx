"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MessageSquare, Send, BadgeCheck, Check, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand, Message } from "@/lib/types";
import { Id } from "../../../convex/_generated/dataModel";

interface ChatsTabProps {
  brand: Brand;
}

interface ConversationWithDetails {
  _id: Id<"applications">;
  creatorId: Id<"creators">;
  campaignId: Id<"campaigns">;
  status: string;
  initiatedBy: string;
  offeredAmount?: number;
  offeredCurrency?: string;
  creator: {
    _id: Id<"creators">;
    name: string;
    initials: string;
    avatar?: string;
    verified: boolean;
    platform: string;
  } | null;
  campaign: {
    _id: Id<"campaigns">;
    title: string;
  } | null;
  lastMessage?: Message;
  unreadCount: number;
}

export default function ChatsTab({ brand }: ChatsTabProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<Id<"applications"> | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all applications for this brand
  const applications = useQuery(api.applications.getByBrandId, { brandId: brand._id });
  
  // Get messages for selected conversation
  const messages = useQuery(
    api.messages.getByApplicationId,
    selectedConversationId ? { applicationId: selectedConversationId } : "skip"
  ) as Message[] | undefined;

  const sendMessage = useMutation(api.messages.send);
  const markAsRead = useMutation(api.messages.markAsRead);

  // Build conversation list with last message and unread count
  const conversations: ConversationWithDetails[] = (applications || []).map((app: any) => {
    return {
      ...app,
      lastMessage: undefined, // Would need to fetch separately in a real app
      unreadCount: 0,
    };
  });

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead({ applicationId: selectedConversationId, readerType: "brand" });
    }
  }, [selectedConversationId, markAsRead]);

  const selectedConversation = conversations.find((c) => c._id === selectedConversationId);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    await sendMessage({
      applicationId: selectedConversationId,
      senderId: brand._id,
      senderType: "brand",
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
            Start by sending an offer to a creator from the marketplace to begin a conversation.
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
          <p className="text-sm text-gray-500">{conversations.length} conversations</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => setSelectedConversationId(conv._id)}
              className={cn(
                "w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 flex items-start gap-3",
                selectedConversationId === conv._id && "bg-lime-50 hover:bg-lime-50"
              )}
            >
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                {conv.creator?.avatar ? (
                  <img src={conv.creator.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  conv.creator?.initials || "?"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-black truncate">{conv.creator?.name || "Unknown"}</span>
                  {conv.creator?.verified && (
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="h-4 w-4 fill-lime-400 text-lime-400" />
                      <Check className="absolute h-2 w-2 text-black stroke-[4]" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mb-1">{conv.campaign?.title || "Campaign"}</p>
                {getStatusBadge(conv.status)}
              </div>
              <ChevronRight className={cn(
                "h-5 w-5 text-gray-300 flex-shrink-0",
                selectedConversationId === conv._id && "text-lime-500"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                  {selectedConversation.creator?.avatar ? (
                    <img src={selectedConversation.creator.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    selectedConversation.creator?.initials || "?"
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-black">{selectedConversation.creator?.name}</span>
                    {selectedConversation.creator?.verified && (
                      <div className="relative flex items-center justify-center">
                        <BadgeCheck className="h-4 w-4 fill-lime-400 text-lime-400" />
                        <Check className="absolute h-2 w-2 text-black stroke-[4]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{selectedConversation.campaign?.title}</p>
                </div>
              </div>
              {getStatusBadge(selectedConversation.status)}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={cn(
                    "flex",
                    msg.senderType === "brand" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3",
                      msg.senderType === "brand"
                        ? "bg-black text-white rounded-br-sm"
                        : "bg-gray-100 text-black rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn(
                      "text-[10px] mt-1",
                      msg.senderType === "brand" ? "text-gray-400" : "text-gray-500"
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
