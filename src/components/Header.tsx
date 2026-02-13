"use client";

import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');
  const isCreatorMode = pathname === '/creator' || pathname.startsWith('/creator/') || pathname.startsWith('/campaigns/');

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo - Always Visible */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center group">
              <span className="font-austrisa text-5xl bg-gradient-to-br from-black from-[15%] via-black/80 to-lime-400 to-[85%] bg-clip-text text-transparent inline-block px-4 py-3 leading-normal translate-y-1.5">AV</span>
            </Link>
          </div>

          {/* Center Navigation (Desktop) - Dashboard Design Style */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200/50 flex items-center font-medium text-sm">
              <Link
                href={isCreatorMode ? "/creator" : "/"}
                className={cn(
                  "px-6 py-2.5 rounded-full transition-all duration-300 font-bold",
                  (!isDashboard && !pathname.includes('/creator/dashboard'))
                    ? "text-white bg-black shadow-lg shadow-black/10"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                )}
              >
                {isCreatorMode ? "Discover Campaigns" : "Discover Creators"}
              </Link>
              <Link
                href={isCreatorMode ? "/creator/dashboard" : "/dashboard"}
                className={cn(
                  "px-6 py-2.5 rounded-full transition-all duration-300 font-bold",
                  (isDashboard || pathname.includes('/creator/dashboard'))
                    ? "text-white bg-black shadow-lg shadow-black/10"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                )}
              >
                {isCreatorMode ? "My Dashboard" : "My Campaigns"}
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="p-2.5 text-gray-500 hover:text-black hover:bg-white rounded-full transition-all relative">
              <span className="sr-only">Notifications</span>
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-lime-400 rounded-full border border-white"></span>
            </button>

            {/* Profile */}
            <button className="flex items-center gap-2 pl-2 group">
              <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-lime-400 font-bold text-sm border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                BR
              </div>
            </button>

            {/* Mobile Menu */}
            <button className="md:hidden p-2 text-gray-500 hover:text-black">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
