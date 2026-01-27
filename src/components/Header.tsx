"use client";

import { Bell, User, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeTab?: 'sponsorships' | 'creators';
  onTabChange?: (tab: 'sponsorships' | 'creators') => void;
}

export default function Header({ activeTab = 'sponsorships', onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center gap-2">
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">AdSpace</span>
            </Link>
          </div>

          {/* Center Tab Switcher (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="bg-gray-100/80 p-1 rounded-2xl flex items-center font-medium text-sm">
              <button
                onClick={() => onTabChange?.('sponsorships')}
                className={cn(
                  "px-6 py-2 rounded-xl transition-all duration-200",
                  activeTab === 'sponsorships' 
                    ? "text-gray-900 shadow-sm bg-white" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Find Sponsorships
              </button>
              <button
                onClick={() => onTabChange?.('creators')}
                className={cn(
                  "px-6 py-2 rounded-xl transition-all duration-200",
                  activeTab === 'creators' 
                    ? "text-gray-900 shadow-sm bg-white" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Find Creators
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <span className="sr-only">Notifications</span>
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-2 pl-2">
              <div className="h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                AG
              </div>
            </button>
             <button className="md:hidden p-2 text-gray-500">
               <Menu className="h-6 w-6" />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
