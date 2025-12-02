"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Eye, Film, Trophy, Loader2, Crown } from "lucide-react";

interface Community {
  id: string;
  name: string;
  iconUrl: string | null;
  totalMembers: number;
  totalViews: number;
  totalClips: number;
  isFeatured: boolean;
  topClipper?: {
    username: string;
    avatar: string;
    views: number;
  };
}

// Helper for compact number formatting
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
};

// Community Row Component
const CommunityRow = ({ community, rank }: { community: Community; rank: number }) => {
  const getRankStyle = () => {
    if (rank === 1) return "from-yellow-500/20 to-transparent border-yellow-500/60 shadow-[0_0_25px_rgba(234,179,8,0.4)]";
    if (rank === 2) return "from-gray-400/20 to-transparent border-gray-400/60 shadow-[0_0_20px_rgba(156,163,175,0.3)]";
    if (rank === 3) return "from-orange-700/20 to-transparent border-orange-700/60 shadow-[0_0_20px_rgba(194,65,12,0.3)]";
    return "from-transparent to-transparent border-gray-800/50 hover:border-gray-700";
  };

  const getRankIcon = () => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`relative flex items-center p-4 rounded-xl border bg-gradient-to-r transition-all hover:scale-[1.005] ${getRankStyle()}`}
    >
      {/* Rank */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0 ${
        rank <= 3 
          ? "bg-white/10 text-white" 
          : "bg-white/5 text-gray-500"
      }`}>
        {getRankIcon()}
      </div>

      {/* Community Icon */}
      <div className={`w-14 h-14 rounded-xl overflow-hidden mr-4 flex-shrink-0 ${
        rank <= 3 ? "ring-2 ring-white/20" : "border border-gray-700"
      }`}>
        {community.iconUrl ? (
          <img 
            src={community.iconUrl} 
            alt={community.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-orange-700/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-400" />
          </div>
        )}
      </div>

      {/* Community Info */}
      <div className="flex-grow min-w-0 mr-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-bold text-lg truncate">{community.name}</h3>
          {community.isFeatured && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-semibold uppercase">
              Featured
            </span>
          )}
        </div>
        
        {/* Top Clipper */}
        {community.topClipper && (
          <div className="flex items-center gap-2 mt-1.5">
            <Crown className="w-3 h-3 text-orange-400" />
            <div className="flex items-center gap-1.5">
              {community.topClipper.avatar && (
                <img 
                  src={community.topClipper.avatar} 
                  alt={community.topClipper.username}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span className="text-xs text-gray-400">
                <span className="text-orange-400">{community.topClipper.username}</span>
                <span className="mx-1">·</span>
                <span>{formatNumber(community.topClipper.views)} views</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6">
        <div className="text-right">
          <p className="font-black text-white text-xl tabular-nums">
            {formatNumber(community.totalViews)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center justify-end gap-1">
            <Eye className="w-3 h-3" /> Views
          </p>
        </div>
        <div className="text-right">
          <p className="font-black text-white text-xl tabular-nums">
            {formatNumber(community.totalMembers)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center justify-end gap-1">
            <Users className="w-3 h-3" /> Members
          </p>
        </div>
        <div className="text-right">
          <p className="font-black text-white text-xl tabular-nums">
            {formatNumber(community.totalClips)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center justify-end gap-1">
            <Film className="w-3 h-3" /> Clips
          </p>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="flex sm:hidden items-center gap-3">
        <div className="text-right">
          <p className="font-bold text-white text-sm tabular-nums">{formatNumber(community.totalViews)}</p>
          <p className="text-[8px] text-gray-500 uppercase">Views</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-white text-sm tabular-nums">{formatNumber(community.totalMembers)}</p>
          <p className="text-[8px] text-gray-500 uppercase">Members</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function CommunityLeaderboard() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/communities?leaderboard=true');
        if (!res.ok) throw new Error('Failed to fetch communities');
        const data = await res.json();
        setCommunities(data.communities || []);
      } catch (err: any) {
        console.error('[CommunityLeaderboard] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Communities Yet</h3>
        <p className="text-gray-400 text-sm">
          Communities will appear here as users pledge their allegiance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-bold text-white">Community Rankings</h3>
        </div>
        <p className="text-xs text-gray-500">
          {communities.length} communities competing
        </p>
      </div>

      {/* Community Rows */}
      {communities.map((community, index) => (
        <CommunityRow 
          key={community.id} 
          community={community} 
          rank={index + 1} 
        />
      ))}
    </div>
  );
}

