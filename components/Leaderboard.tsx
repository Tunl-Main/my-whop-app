"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Twitter, Eye, Flame } from "lucide-react";
import clsx from "clsx";
import TopClips from "./TopClips";
import RisingStars from "./RisingStars";

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);

const getPlatformIcon = (platform: string, className: string = "w-4 h-4") => {
    switch (platform) {
        case 'instagram': return <Instagram className={className} />;
        case 'tiktok': return <TikTokIcon className={className} />;
        case 'youtube': return <Youtube className={className} />;
        case 'twitter': return <Twitter className={className} />;
        default: return null;
    }
};

interface LinkedAccount {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
    handle: string;
}

interface User {
    id: string;
    whopId: string;
    username?: string;
    linkedAccounts: LinkedAccount[];
    avatar: string;
    metrics: {
        views: number;
        likes: number;
        shares: number;
        earnings?: number;
        viral_clips?: number;
    };
    achievements?: { icon: string; name: string }[];
}

// Helper for compact number formatting
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(num);
};

// Leaderboard Row Component - Gaming Style
const LeaderboardRow = ({ user, rank }: { user: User; rank: number }) => {
    // Use Whop username, fallback to whopId if no username
    const displayName = user.username || user.whopId || "Unknown";

    // Orange theme glow for top 3, subtle for rest
    const getRankStyle = () => {
        if (rank <= 3) return "from-orange-500/10 to-transparent border-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.4),0_0_50px_rgba(249,115,22,0.2)]";
        return "from-transparent to-transparent border-gray-800/50 hover:border-gray-700";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.03 }}
            className={clsx(
                "relative flex items-center p-4 rounded-xl border bg-gradient-to-r transition-all hover:scale-[1.005] group",
                getRankStyle()
            )}
        >
            {/* Rank Number */}
            <div className={clsx(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0",
                rank <= 3 
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                    : "bg-white/5 text-gray-500 border border-white/5"
            )}>
                {rank}
            </div>

            {/* Avatar */}
            <div className={clsx(
                "w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 transition-all",
                rank <= 3 
                    ? "ring-2 ring-orange-500/50 ring-offset-1 ring-offset-black" 
                    : "border border-gray-700"
            )}>
                {user.avatar ? (
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs bg-white/10">?</div>
                )}
            </div>

            {/* User Info */}
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg truncate">
                        {displayName}
                    </span>
                    {(user.metrics.viral_clips || 0) > 0 && (
                        <Flame className="w-4 h-4 text-orange-400" />
                    )}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                    {user.linkedAccounts?.slice(0, 3).map((acc, i) => (
                        <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5">
                            {getPlatformIcon(acc.platform, "w-3 h-3 text-gray-500")}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats - Prominent */}
            <div className="flex items-center gap-8">
                <div className="text-right">
                    <p className="font-black text-white text-2xl md:text-3xl tabular-nums tracking-tight">
                        {formatNumber(user.metrics.views)}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Views</p>
                </div>
                <div className="text-right">
                    <p className="font-black text-white text-2xl md:text-3xl tabular-nums tracking-tight">
                        {formatNumber(user.metrics.likes)}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Likes</p>
                </div>
            </div>
        </motion.div>
    );
};

export default function Leaderboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<'week' | 'month' | 'all'>('week');
    const [view, setView] = useState<'creators' | 'clips'>('creators');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/leaderboard?range=${filter}`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }, [filter]);

    return (
        <div className="w-full">
            {/* Leaderboard Container */}
            <div className="bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-white/5">
                    <h2 className="text-2xl font-bold text-white text-center mb-6">Clipper Leaderboard</h2>
                    
                    {/* Tabs Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* View Toggle */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setView('creators')}
                        className={clsx(
                                    "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                            view === 'creators' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Clippers
                    </button>
                    <button
                        onClick={() => setView('clips')}
                        className={clsx(
                                    "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                            view === 'clips' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Top Clips
                    </button>
                </div>

                        {/* Time Filter */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            {(['week', 'month', 'all'] as const).map((f) => (
                        <button
                            key={f}
                                    onClick={() => setFilter(f)}
                            className={clsx(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                filter === f
                                            ? "bg-white/10 text-white"
                                            : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                                    {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
                        </button>
                    ))}
                        </div>
                </div>
            </div>

                {/* Content */}
                <div className="p-6">
                    {view === 'creators' ? (
                        <>
                            {/* Leaderboard Rows */}
                            <div className="space-y-3">
                            {users.map((user, index) => (
                                    <LeaderboardRow key={user.id} user={user} rank={index + 1} />
                                                ))}
                                            </div>

                            {users.length === 0 && !loading && (
                                <div className="text-center py-12 text-gray-500">
                                    No clippers found for this time period.
                                                    </div>
                                                )}

                            {loading && (
                                <div className="text-center py-12 text-gray-500">
                                    Loading...
                                            </div>
                            )}
                        </>
                    ) : (
                        <TopClips timeRange={filter} />
                    )}
                </div>
                </div>

            {/* Sidebar Section - Rising Stars */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Could add more content here */}
                </div>
                <div>
                    <RisingStars />
                </div>
            </div>
        </div>
    );
}
