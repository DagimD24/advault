"use client";

import { LayoutDashboard, Briefcase, Wallet, MessageSquare, User, Settings, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CreatorSidebarProps {
  activeTab: 'deals' | 'chats' | 'wallet' | 'profile';
  onTabChange: (tab: 'deals' | 'chats' | 'wallet' | 'profile') => void;
}

export default function CreatorSidebar({ activeTab, onTabChange }: CreatorSidebarProps) {
  const menuItems = [
    { id: 'deals' as const, icon: Briefcase, label: 'Deals' },
    { id: 'chats' as const, icon: MessageSquare, label: 'Chats' },
    { id: 'wallet' as const, icon: Wallet, label: 'Wallet' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <aside className="fixed top-24 left-6 z-[60] flex flex-col items-center h-[calc(100vh-7.5rem)] pb-4">
      {/* Invisible spacer to push the main pill to the center */}
      <div className="flex-1" />

      {/* Main Navigation Pill */}
      <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/50 flex flex-col items-center gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "p-4 rounded-full transition-all duration-300 relative group",
              activeTab === item.id 
                ? "bg-black text-white shadow-lg shadow-black/20" 
                : "text-gray-400 hover:text-black hover:bg-gray-50"
            )}
          >
            <item.icon className="h-6 w-6" />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
              {item.label}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black"></span>
            </span>
          </button>
        ))}
      </div>

      {/* Invisible spacer to push the main pill to the center and actions to bottom */}
      <div className="flex-1" />

      {/* Bottom Actions Pill */}
      <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/50 flex flex-col items-center gap-2">
        <Link 
          href="/creator"
          className="p-4 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all group relative"
        >
          <Home className="h-6 w-6" />
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
            Marketplace
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black"></span>
          </span>
        </Link>
        <button className="p-4 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-all group relative">
          <Settings className="h-6 w-6" />
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
            Settings
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black"></span>
          </span>
        </button>
      </div>
    </aside>
  );
}
