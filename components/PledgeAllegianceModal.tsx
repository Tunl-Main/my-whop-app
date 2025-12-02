"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, Check, Users, Eye, Loader2 } from "lucide-react";

interface Community {
  id: string;
  name: string;
  iconUrl: string | null;
  totalMembers: number;
  totalViews: number;
}

interface PledgeAllegianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPledge: (communityId: string) => void;
  whopId: string;
  currentCommunityId?: string | null;
  currentExperienceId?: string;
  currentExperienceName?: string;
  currentExperienceIcon?: string | null;
}

// Format number compactly (1.2K, 3.4M, etc.)
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

export default function PledgeAllegianceModal({
  isOpen,
  onClose,
  onPledge,
  whopId,
  currentCommunityId,
  currentExperienceId,
  currentExperienceName,
  currentExperienceIcon,
}: PledgeAllegianceModalProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [pledging, setPledging] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(currentCommunityId || null);
  const [error, setError] = useState<string | null>(null);

  // Fetch communities on mount
  useEffect(() => {
    if (!isOpen) return;

    const fetchCommunities = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/communities');
        if (!res.ok) throw new Error('Failed to fetch communities');
        const data = await res.json();
        
        let fetchedCommunities = data.communities || [];

        // If current experience isn't in the list, add it
        if (currentExperienceId && !fetchedCommunities.find((c: Community) => c.id === currentExperienceId)) {
          fetchedCommunities = [
            {
              id: currentExperienceId,
              name: currentExperienceName || 'Current Community',
              iconUrl: currentExperienceIcon || null,
              totalMembers: 0,
              totalViews: 0,
            },
            ...fetchedCommunities,
          ];
        }

        setCommunities(fetchedCommunities);
      } catch (err: any) {
        console.error('[PledgeAllegianceModal] Failed to fetch communities:', err);
        setError(err.message);
        
        // If we have current experience, show it as fallback
        if (currentExperienceId) {
          setCommunities([{
            id: currentExperienceId,
            name: currentExperienceName || 'Current Community',
            iconUrl: currentExperienceIcon || null,
            totalMembers: 0,
            totalViews: 0,
          }]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [isOpen, currentExperienceId, currentExperienceName, currentExperienceIcon]);

  // Handle pledge
  const handlePledge = async () => {
    if (!selectedId) return;

    setPledging(true);
    setError(null);
    try {
      const res = await fetch('/api/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whopId,
          communityId: selectedId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to pledge');
      }

      onPledge(selectedId);
      onClose();
    } catch (err: any) {
      console.error('[PledgeAllegianceModal] Pledge failed:', err);
      setError(err.message);
    } finally {
      setPledging(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Flag className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pledge Your Allegiance</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Which community do you represent?
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : error && communities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {communities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setSelectedId(community.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      selectedId === community.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    {/* Community Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {community.iconUrl ? (
                        <img
                          src={community.iconUrl}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Community Info */}
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-white">{community.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {formatNumber(community.totalMembers)} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {formatNumber(community.totalViews)} views
                        </span>
                      </div>
                    </div>

                    {/* Selected Check */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedId === community.id
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-600'
                    }`}>
                      {selectedId === community.id && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {error && communities.length > 0 && (
              <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-gray-800">
            <button
              onClick={handlePledge}
              disabled={!selectedId || pledging}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedId && !pledging
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {pledging ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Pledging...
                </>
              ) : (
                <>
                  <Flag size={18} />
                  Pledge Allegiance
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              You can change your allegiance at any time
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

