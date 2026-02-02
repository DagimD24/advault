"use client";

import { useState } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Creator } from "@/lib/types";

interface CreatorWalletTabProps {
  creator: Creator;
}

// Mock transaction data for now
const MOCK_TRANSACTIONS = [
  { id: "1", type: "earning", amount: 45000, currency: "ETB", description: "Campaign: TikTok Dance Challenge", date: "2024-01-28", status: "completed" },
  { id: "2", type: "withdrawal", amount: 30000, currency: "ETB", description: "Bank Transfer", date: "2024-01-25", status: "completed" },
  { id: "3", type: "earning", amount: 38000, currency: "ETB", description: "Campaign: Product Review", date: "2024-01-20", status: "completed" },
  { id: "4", type: "earning", amount: 25000, currency: "ETB", description: "Campaign: Story Promotion", date: "2024-01-15", status: "pending" },
];

export default function CreatorWalletTab({ creator }: CreatorWalletTabProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Calculate totals from mock data
  const balance = 78000; // Mock balance
  const pendingEarnings = 25000;
  const totalEarned = 108000;

  const formatCurrency = (amount: number, currency: string = "ETB") => {
    return new Intl.NumberFormat('en-US').format(amount) + " " + currency;
  };

  return (
    <div className="space-y-8">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-black to-gray-800 rounded-[2rem] p-8 text-white shadow-xl col-span-1 md:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-2">Available Balance</p>
              <p className="text-4xl font-bold">{formatCurrency(balance)}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-lime-400 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-black" />
            </div>
          </div>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="w-full py-4 bg-lime-400 text-black font-bold rounded-full hover:bg-lime-300 transition-all flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="h-5 w-5" />
            Withdraw Funds
          </button>
        </div>

        {/* Side Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase">Pending</p>
            </div>
            <p className="text-2xl font-bold text-black">{formatCurrency(pendingEarnings)}</p>
          </div>
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-lime-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-lime-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Earned</p>
            </div>
            <p className="text-2xl font-bold text-black">{formatCurrency(totalEarned)}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-black mb-6">Transaction History</h2>
        
        <div className="space-y-4">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div 
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center",
                  tx.type === "earning" ? "bg-lime-100" : "bg-gray-100"
                )}>
                  {tx.type === "earning" ? (
                    <ArrowDownLeft className="h-5 w-5 text-lime-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-black">{tx.description}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold",
                  tx.type === "earning" ? "text-lime-600" : "text-black"
                )}>
                  {tx.type === "earning" ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)}
                </p>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  tx.status === "completed" ? "bg-lime-100 text-lime-700" : "bg-yellow-100 text-yellow-700"
                )}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal Placeholder */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)} />
          <div className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-black mb-4">Withdraw Funds</h2>
            <p className="text-gray-500 mb-6">Withdrawal feature coming soon! You'll be able to withdraw your earnings to your bank account or mobile money.</p>
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="w-full py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
