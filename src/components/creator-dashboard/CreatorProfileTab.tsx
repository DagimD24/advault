"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { User, Save, Loader2, Link as LinkIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Creator } from "@/lib/types";

interface CreatorProfileTabProps {
  creator: Creator;
}

export default function CreatorProfileTab({ creator }: CreatorProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState(creator.name);
  const [bio, setBio] = useState(creator.bio || "");
  const [category, setCategory] = useState(creator.category);
  const [platform, setPlatform] = useState(creator.platform);
  const [startingPrice, setStartingPrice] = useState(creator.startingPrice);
  const [availableSlots, setAvailableSlots] = useState(creator.availableSlots);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement update mutation when backend is ready
    await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
    setIsSaving(false);
    setIsEditing(false);
  };

  const platforms = ["YouTube", "TikTok", "Instagram", "Telegram", "Twitter"];
  const categories = ["Gaming", "Lifestyle", "Tech", "Travel", "Finance", "Entertainment", "Education", "Food"];

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-moralana text-black mb-2">Profile Settings</h1>
          <p className="text-gray-500">Manage how brands see you</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-lime-400 hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Preview */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
        <div className="flex items-start gap-6 mb-8">
          <div className="h-24 w-24 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden">
            {creator.avatar ? (
              <img src={creator.avatar} alt={name} className="h-full w-full object-cover" />
            ) : (
              creator.initials
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold text-black bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            ) : (
              <h2 className="text-2xl font-bold text-black mb-1">{name}</h2>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">{platform}</span>
              <span className="px-3 py-1 bg-lime-100 rounded-full text-xs font-bold text-lime-700">{category}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-500 mb-2">Bio</label>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none"
              placeholder="Tell brands about yourself..."
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">{bio || "No bio yet"}</p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">Primary Platform</label>
            {isEditing ? (
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            ) : (
              <p className="text-black font-bold">{platform}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">Category</label>
            {isEditing ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <p className="text-black font-bold">{category}</p>
            )}
          </div>

          {/* Starting Price */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">Starting Price ({creator.currency})</label>
            {isEditing ? (
              <input
                type="text"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            ) : (
              <p className="text-black font-bold">{startingPrice} {creator.currency}</p>
            )}
          </div>

          {/* Available Slots */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">Available Slots</label>
            {isEditing ? (
              <input
                type="number"
                value={availableSlots}
                onChange={(e) => setAvailableSlots(parseInt(e.target.value) || 0)}
                min={0}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            ) : (
              <p className="text-black font-bold">{availableSlots} slots</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-6">Your Stats</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-2xl">
            <p className="text-3xl font-bold text-black">{creator.stats.followers}</p>
            <p className="text-sm text-gray-500 font-medium">Followers</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-2xl">
            <p className="text-3xl font-bold text-black">{creator.stats.views}</p>
            <p className="text-sm text-gray-500 font-medium">Avg Views</p>
          </div>
          <div className="text-center p-4 bg-lime-50 rounded-2xl">
            <p className="text-3xl font-bold text-lime-600">{creator.stats.completion}</p>
            <p className="text-sm text-gray-500 font-medium">Completion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
