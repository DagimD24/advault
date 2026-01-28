"use client";

import { Bell, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Brand } from "@/lib/types";

interface DashboardHeaderProps {
  brand: Brand | null;
  activeTab: 'overview' | 'campaigns' | 'profile';
  onTabChange: (tab: 'overview' | 'campaigns' | 'profile') => void;
}

export default function DashboardHeader({ brand, activeTab, onTabChange }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#F3F4F6]/80 backdrop-blur-md border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center group">
              <span className="font-austrisa text-5xl bg-gradient-to-br from-black from-[15%] via-black/80 to-lime-400 to-[85%] bg-clip-text text-transparent inline-block px-4 py-3 leading-normal translate-y-1.5">AV</span>
            </Link>
          </div>

          {/* Center Tab Switcher (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200/50 flex items-center font-medium text-sm">
              <button
                onClick={() => onTabChange('overview')}
                className={cn(
                  "px-6 py-2.5 rounded-full transition-all duration-300 font-bold",
                  activeTab === 'overview' 
                    ? "text-white bg-black shadow-lg shadow-black/10" 
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => onTabChange('campaigns')}
                className={cn(
                  "px-6 py-2.5 rounded-full transition-all duration-300 font-bold",
                  activeTab === 'campaigns' 
                    ? "text-white bg-black shadow-lg shadow-black/10" 
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                )}
              >
                Campaigns
              </button>
              <button
                onClick={() => onTabChange('profile')}
                className={cn(
                  "px-6 py-2.5 rounded-full transition-all duration-300 font-bold",
                  activeTab === 'profile' 
                    ? "text-white bg-black shadow-lg shadow-black/10" 
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                )}
              >
                Profile
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-500 hover:text-black hover:bg-white rounded-full transition-all">
              <span className="sr-only">Settings</span>
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2.5 text-gray-500 hover:text-black hover:bg-white rounded-full transition-all">
              <span className="sr-only">Notifications</span>
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-2 pl-2 group">
              <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-lime-400 font-bold text-sm border-2 border-white shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                {brand?.logo ? (
                  <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
                ) : (
                  brand?.name?.substring(0, 2).toUpperCase() || "BR"
                )}
              </div>
            </button>
             <button className="md:hidden p-2 text-gray-500 hover:text-black">
               <Menu className="h-6 w-6" />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
