"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Check, Briefcase, Send, Wallet, Loader2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Creator, Campaign, Brand } from "@/lib/types";

export default function OutreachPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.creatorId as string;

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch creator details
  const creator = useQuery(api.creators.getById, { id: creatorId }) as Creator | null | undefined;

  // Get brand (mock - using first brand)
  const brand = useQuery(api.brands.getFirst) as Brand | null | undefined;

  // Get brand's campaigns
  const campaigns = useQuery(
    api.campaigns.getByBrandId,
    brand?._id ? { brandId: brand._id } : "skip"
  ) as Campaign[] | undefined;

  const createOutreach = useMutation(api.applications.createOutreach);

  const isLoading = creator === undefined || brand === undefined;

  // Set default offer amount and auto-select campaign
  useEffect(() => {
    if (creator && !offerAmount) {
      // Remove commas for the input field to make it strictly numeric
      setOfferAmount(creator.startingPrice.replace(/,/g, ""));
    }

    if (campaigns && campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0]._id);
    }
  }, [creator, campaigns, offerAmount, selectedCampaignId]);

  const handleSubmit = async () => {
    // Clear previous errors
    setError("");

    if (!selectedCampaignId) {
      setError("Please select a campaign");
      return;
    }

    if (!offerAmount) {
      setError("Please enter an offer amount");
      return;
    }

    if (!message.trim()) {
      setError("Please write an introductory message");
      return;
    }

    if (!brand || !creator) {
      setError("Loading brand or creator data...");
      return;
    }

    const amountNum = parseFloat(offerAmount.replace(/,/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid offer amount");
      return;
    }

    setIsSubmitting(true);

    try {
      await createOutreach({
        campaignId: selectedCampaignId as any,
        creatorId: creator._id,
        offeredAmount: Math.round(amountNum * 100),
        offeredCurrency: creator.currency,
        initialMessage: message,
        brandId: brand._id,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to send offer");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-lime-400" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-moralana text-black mb-4">Creator Not Found</h1>
          <Link href="/" className="text-lime-600 hover:underline font-bold">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={`/creators/${creatorId}`}
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {creator.name}
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-moralana text-black mb-3">Send an Offer</h1>
          <p className="text-gray-500 text-lg">
            Invite <span className="font-bold text-black">{creator.name}</span> to collaborate on your campaign
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Selection */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-lime-500" />
                Select a Campaign
              </h2>

              {!campaigns || campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any active campaigns yet.</p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all"
                  >
                    Create a Campaign
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <button
                      key={campaign._id}
                      type="button"
                      onClick={() => setSelectedCampaignId(campaign._id)}
                      className={cn(
                        "w-full text-left p-5 rounded-2xl border-2 transition-all group",
                        selectedCampaignId === campaign._id
                          ? "border-lime-400 bg-lime-50"
                          : "border-gray-100 hover:border-gray-200 bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-black">{campaign.title}</p>
                          <p className="text-sm text-gray-500">{campaign.platform} • {campaign.campaignType}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-black">{campaign.budget} {campaign.currency}</p>
                            <p className="text-xs text-gray-400">{campaign.spots} spots left</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                            selectedCampaignId === campaign._id ? "border-lime-500 bg-lime-500" : "border-gray-300 bg-white"
                          )}>
                            {selectedCampaignId === campaign._id && <Check className="h-3 w-3 text-white stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offer Amount */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-lime-500" />
                Your Offer
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    Offer Amount ({creator.currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                      {creator.currency === "USD" ? "$" : creator.currency === "ETB" ? "ETB " : ""}
                    </span>
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                      placeholder={creator.startingPrice.replace(/,/g, "")}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Creator's starting price: <span className="font-bold text-black">{creator.startingPrice} {creator.currency}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <Send className="h-5 w-5 text-lime-500" />
                Your Message
              </h2>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent resize-none"
                placeholder={`Hi ${creator.name}, I'd love to collaborate with you on our upcoming campaign...`}
              />
            </div>
          </div>

          {/* Sidebar - Creator Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                <div className="text-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-gray-600">
                    {creator.avatar ? (
                      <img src={creator.avatar} alt={creator.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      creator.initials
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="font-bold text-black text-lg">{creator.name}</h3>
                    {creator.verified && (
                      <div className="relative flex items-center justify-center">
                        <BadgeCheck className="h-5 w-5 fill-lime-400 text-lime-400" />
                        <Check className="absolute h-2.5 w-2.5 text-black stroke-[4]" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{creator.category} Creator</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Platform</span>
                    <span className="font-bold text-black">{creator.platform}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Followers</span>
                    <span className="font-bold text-black">{creator.stats.followers}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Trust Score</span>
                    <span className="font-bold text-lime-600">{creator.trustScore}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Starting Price</span>
                    <span className="font-bold text-black">{creator.startingPrice} {creator.currency}</span>
                  </div>
                </div>
              </div>

              {/* Wallet Balance */}
              {brand && (
                <div className="bg-gradient-to-br from-black to-gray-800 rounded-[2rem] p-6 text-white shadow-lg">
                  <p className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-2">Your Wallet</p>
                  <p className="text-2xl font-bold">{formatCurrency(brand.walletBalance, brand.walletCurrency)}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transform"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Offer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
