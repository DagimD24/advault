"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand, Campaign } from "@/lib/types";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  editingCampaign?: Campaign | null;
}

const PLATFORMS = ["YouTube", "TikTok", "Instagram", "Twitter", "Podcast"];
const CAMPAIGN_TYPES = ["Sponsored Video", "Product Review", "Brand Ambassador", "Social Post", "Affiliate"];

export default function CreateCampaignModal({ isOpen, onClose, brand, editingCampaign }: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    platform: "YouTube",
    campaignType: "Sponsored Video",
    budget: "",
    currency: "ETB",
    spots: 1,
    deadline: "",
    minFollowers: "10K",
    description: "",
    requirements: [""],
    audience: {
      location: "Ethiopia",
      age: "18-35",
      gender: "All",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCampaign = useMutation(api.campaigns.create);
  const updateCampaign = useMutation(api.campaigns.update);

  useEffect(() => {
    if (editingCampaign) {
      setFormData({
        title: editingCampaign.title,
        platform: editingCampaign.platform,
        campaignType: editingCampaign.campaignType,
        budget: editingCampaign.budget,
        currency: editingCampaign.currency,
        spots: editingCampaign.spots,
        deadline: editingCampaign.deadline,
        minFollowers: editingCampaign.minFollowers,
        description: editingCampaign.description,
        requirements: editingCampaign.requirements.length > 0 ? editingCampaign.requirements : [""],
        audience: editingCampaign.audience,
      });
    } else {
      // Reset form for new campaign
      setFormData({
        title: "",
        platform: "YouTube",
        campaignType: "Sponsored Video",
        budget: "",
        currency: "ETB",
        spots: 1,
        deadline: "",
        minFollowers: "10K",
        description: "",
        requirements: [""],
        audience: {
          location: "Ethiopia",
          age: "18-35",
          gender: "All",
        },
      });
    }
  }, [editingCampaign, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand) return;

    setIsSubmitting(true);
    try {
      const filteredRequirements = formData.requirements.filter(r => r.trim() !== "");
      
      if (editingCampaign) {
        await updateCampaign({
          id: editingCampaign._id,
          ...formData,
          requirements: filteredRequirements,
        });
      } else {
        await createCampaign({
          brandId: brand._id,
          ...formData,
          requirements: filteredRequirements,
          trustScore: "95%",
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save campaign:", error);
    }
    setIsSubmitting(false);
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const removeRequirement = (index: number) => {
    const newReqs = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newReqs.length > 0 ? newReqs : [""] });
  };

  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...formData.requirements];
    newReqs[index] = value;
    setFormData({ ...formData, requirements: newReqs });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-moralana text-black">
            {editingCampaign ? "Edit Campaign" : "Create Campaign"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Product Launch"
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm appearance-none cursor-pointer"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Type</label>
                <select
                  value={formData.campaignType}
                  onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm appearance-none cursor-pointer"
                >
                  {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Budget & Slots */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Budget & Availability</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="50,000"
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm appearance-none cursor-pointer"
                >
                  <option value="ETB">ETB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Spots</label>
                <input
                  type="number"
                  value={formData.spots}
                  onChange={(e) => setFormData({ ...formData, spots: parseInt(e.target.value) || 1 })}
                  min="1"
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Min Followers</label>
                <input
                  type="text"
                  value={formData.minFollowers}
                  onChange={(e) => setFormData({ ...formData, minFollowers: e.target.value })}
                  placeholder="10K"
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you're looking for in this campaign..."
              rows={3}
              required
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm resize-none"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">Requirements</label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                  className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="flex items-center gap-2 text-sm font-bold text-lime-600 hover:text-lime-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Requirement
            </button>
          </div>

          {/* Target Audience */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Target Audience</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.audience.location}
                  onChange={(e) => setFormData({ ...formData, audience: { ...formData.audience, location: e.target.value } })}
                  placeholder="Ethiopia"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Age Range</label>
                <input
                  type="text"
                  value={formData.audience.age}
                  onChange={(e) => setFormData({ ...formData, audience: { ...formData.audience, age: e.target.value } })}
                  placeholder="18-35"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.audience.gender}
                  onChange={(e) => setFormData({ ...formData, audience: { ...formData.audience, gender: e.target.value } })}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200/50 rounded-full text-black focus:outline-none focus:ring-4 focus:ring-lime-400/10 focus:border-lime-400 transition-all font-medium text-sm appearance-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : editingCampaign ? "Save Changes" : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}
