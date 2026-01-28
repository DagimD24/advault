"use client";

import { Megaphone, Users, TrendingUp, Wallet, Activity, Clock } from "lucide-react";
import StatCard from "./StatCard";
import { Campaign } from "@/lib/types";

interface OverviewTabProps {
  campaigns: Campaign[];
}

export default function OverviewTab({ campaigns }: OverviewTabProps) {
  // Calculate stats from campaigns
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => new Date(c.deadline) > new Date()).length;
  const totalBudget = campaigns.reduce((sum, c) => {
    const budget = parseFloat(c.budget.replace(/[^0-9.]/g, '')) || 0;
    return sum + budget;
  }, 0);
  const totalSpots = campaigns.reduce((sum, c) => sum + c.spots, 0);

  // Mock activity data
  const recentActivity = [
    { id: 1, type: "application", message: "New application from @TechCreator", time: "2 hours ago" },
    { id: 2, type: "campaign", message: "Campaign 'Summer Launch' is ending soon", time: "5 hours ago" },
    { id: 3, type: "application", message: "Creator @LifestyleVlogger accepted your offer", time: "1 day ago" },
    { id: 4, type: "milestone", message: "You've reached 50 total applications!", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-moralana text-black mb-2">Welcome back!</h1>
          <p className="text-gray-500 text-lg">Here's what's happening with your campaigns today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Megaphone} 
          label="Total Campaigns" 
          value={totalCampaigns}
          trend={{ value: "12%", positive: true }}
        />
        <StatCard 
          icon={Activity} 
          label="Active Campaigns" 
          value={activeCampaigns}
        />
        <StatCard 
          icon={Users} 
          label="Open Spots" 
          value={totalSpots}
          trend={{ value: "8%", positive: true }}
        />
        <StatCard 
          icon={Wallet} 
          label="Total Budget" 
          value={`${totalBudget.toLocaleString()} ETB`}
        />
      </div>

      {/* Performance & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">Campaign Performance</h3>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black rounded-full hover:bg-gray-50 transition-colors">7D</button>
              <button className="px-4 py-2 text-sm font-bold text-white bg-black rounded-full">30D</button>
              <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black rounded-full hover:bg-gray-50 transition-colors">90D</button>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">Performance chart coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">Recent Activity</h3>
            <button className="text-sm font-bold text-lime-600 hover:text-lime-700 transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{activity.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
