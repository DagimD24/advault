"use client";

import { useState, useEffect } from "react";
import { Camera, BadgeCheck, Check, Building2, Briefcase, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ProfileTabProps {
  brand: Brand | null;
}

export default function ProfileTab({ brand }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    logo: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateBrand = useMutation(api.brands.update);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        industry: brand.industry || "",
        logo: brand.logo || "",
      });
    }
  }, [brand]);

  const handleSave = async () => {
    if (!brand) return;
    setIsSaving(true);
    try {
      await updateBrand({
        id: brand._id,
        name: formData.name,
        industry: formData.industry,
        logo: formData.logo,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    setIsSaving(false);
  };

  if (!brand) {
    return (
      <div className="bg-white rounded-[2rem] border border-gray-100 p-16 shadow-sm text-center">
        <p className="text-gray-500">Loading brand profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-moralana text-black">Brand Profile</h2>
        <p className="text-gray-500 mt-1">Manage your brand's public information and settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Section */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-6">Brand Logo</h3>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-600 font-bold text-2xl border border-gray-100 overflow-hidden">
                  {formData.logo ? (
                    <img src={formData.logo} alt={formData.name} className="h-full w-full object-cover" />
                  ) : (
                    formData.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <button className="absolute inset-0 bg-black/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-6">Basic Information</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Building2 className="inline h-4 w-4 mr-2 text-gray-400" />
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your brand name"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Briefcase className="inline h-4 w-4 mr-2 text-gray-400" />
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Technology, Fashion, Food & Beverage"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-full transition-all duration-300 shadow-md",
              saveSuccess
                ? "bg-lime-400 text-black"
                : "bg-black text-white hover:bg-lime-400 hover:text-black hover:shadow-lg"
            )}
          >
            {saveSuccess ? (
              <>
                <Check className="h-5 w-5" />
                Saved Successfully!
              </>
            ) : isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-4">Verification Status</h3>
            {brand.verified ? (
              <div className="flex items-center gap-3 p-4 bg-lime-50 rounded-2xl border border-lime-100">
                <div className="relative">
                  <BadgeCheck className="h-10 w-10 fill-lime-400 text-lime-400" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-black stroke-[3]" />
                </div>
                <div>
                  <p className="font-bold text-black">Verified Brand</p>
                  <p className="text-sm text-gray-500">Your brand is trusted</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-black">Not Verified</p>
                    <p className="text-sm text-gray-500">Get verified to build trust</p>
                  </div>
                </div>
                <button className="w-full py-3 px-4 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all duration-300">
                  Request Verification
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-4">Account Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm font-bold text-black">
                  {new Date(brand._creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500">Brand ID</span>
                <span className="text-xs font-mono text-gray-400 truncate max-w-[120px]">{brand._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
