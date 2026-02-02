"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Lock, Unlock, RotateCcw, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand, WalletTransaction } from "@/lib/types";

interface WalletTabProps {
  brand: Brand;
}

export default function WalletTab({ brand }: WalletTabProps) {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const transactions = useQuery(api.walletTransactions.getByBrandId, { brandId: brand._id }) as WalletTransaction[] | undefined;
  const topUp = useMutation(api.walletTransactions.topUp);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100);
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsLoading(true);
    try {
      await topUp({
        brandId: brand._id,
        amount: Math.round(amount * 100), // Convert to cents
        currency: brand.walletCurrency || "USD",
        reference: `TOPUP-${Date.now()}`,
      });
      setTopUpAmount("");
      setShowTopUpModal(false);
    } catch (error) {
      console.error("Failed to top up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-4 w-4" />;
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4" />;
      case 'escrow_lock': return <Lock className="h-4 w-4" />;
      case 'escrow_release': return <Unlock className="h-4 w-4" />;
      case 'refund': return <RotateCcw className="h-4 w-4" />;
      default: return <Wallet className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-600 bg-green-50';
      case 'withdrawal': return 'text-red-600 bg-red-50';
      case 'escrow_lock': return 'text-orange-600 bg-orange-50';
      case 'escrow_release': return 'text-blue-600 bg-blue-50';
      case 'refund': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-moralana text-black mb-2">Wallet</h1>
          <p className="text-gray-500">Manage your funds and view transaction history</p>
        </div>
        <button
          onClick={() => setShowTopUpModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all shadow-lg active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Top Up
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-black to-gray-800 rounded-[2rem] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-lime-400 mb-4">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Available Balance</span>
            </div>
            <p className="text-4xl font-bold mb-2">
              {formatCurrency(brand.walletBalance || 0, brand.walletCurrency || 'USD')}
            </p>
            <p className="text-sm text-gray-400">Ready to spend on campaigns</p>
          </div>
        </div>

        {/* Escrow Locked */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-orange-500 mb-4">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">In Escrow</span>
          </div>
          <p className="text-4xl font-bold text-black mb-2">
            {formatCurrency(0, brand.walletCurrency || 'USD')}
          </p>
          <p className="text-sm text-gray-400">Locked for active campaigns</p>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 mb-4">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Total Spent</span>
          </div>
          <p className="text-4xl font-bold text-black mb-2">
            {formatCurrency(
              (transactions?.filter(t => t.type === 'escrow_release').reduce((sum, t) => sum + t.amount, 0)) || 0,
              brand.walletCurrency || 'USD'
            )}
          </p>
          <p className="text-sm text-gray-400">Paid to creators</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-black">Transaction History</h2>
        </div>
        
        {!transactions || transactions.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">No Transactions Yet</h3>
            <p className="text-gray-500 mb-6">Start by topping up your wallet to fund campaigns.</p>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-6 py-3 bg-lime-400 text-black font-bold rounded-full hover:bg-lime-500 transition-all"
            >
              Add Funds
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <div key={tx._id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", getTransactionColor(tx.type))}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-bold text-black">{tx.description}</p>
                    <p className="text-sm text-gray-400">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold text-lg",
                    tx.type === 'deposit' || tx.type === 'refund' ? 'text-green-600' : 'text-gray-900'
                  )}>
                    {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}
                    {formatCurrency(tx.amount, tx.currency)}
                  </p>
                  {tx.reference && (
                    <p className="text-xs text-gray-400 font-mono">{tx.reference}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-black mb-2">Top Up Wallet</h2>
            <p className="text-gray-500 mb-6">Add funds to your wallet to start running campaigns.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Amount ({brand.walletCurrency || 'USD'})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="100.00"
                  className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-2xl font-bold"
                />
              </div>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-3 mb-8">
              {[50, 100, 250, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopUpAmount(amount.toString())}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="flex-1 py-4 border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={isLoading || !topUpAmount}
                className="flex-1 py-4 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Top Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
