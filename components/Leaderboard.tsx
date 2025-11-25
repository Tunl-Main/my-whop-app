"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Twitter, Eye, Flame, Trophy } from "lucide-react";
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
    const handle = user.linkedAccounts?.[0]?.handle || "Unknown";
    const displayHandle = handle.startsWith('@') ? handle : `@${handle}`;

    // Special styling for top 3
    const getRankStyle = () => {
        if (rank === 1) return "from-yellow-500/20 to-yellow-500/5 border-yellow-500/40 shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)]";
        if (rank === 2) return "from-gray-400/20 to-gray-400/5 border-gray-400/40 shadow-[0_0_20px_-5px_rgba(156,163,175,0.3)]";
        if (rank === 3) return "from-orange-600/20 to-orange-600/5 border-orange-600/40 shadow-[0_0_20px_-5px_rgba(234,88,12,0.3)]";
        return "from-white/5 to-transparent border-white/10 hover:border-orange-500/30";
    };

    const getRankBadgeStyle = () => {
        if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30";
        if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-lg shadow-gray-400/30";
        if (rank === 3) return "bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/30";
        return "bg-white/10 text-gray-400";
    };

    const getAvatarRingStyle = () => {
        if (rank === 1) return "ring-2 ring-yellow-500 ring-offset-2 ring-offset-black";
        if (rank === 2) return "ring-2 ring-gray-400 ring-offset-2 ring-offset-black";
        if (rank === 3) return "ring-2 ring-orange-500 ring-offset-2 ring-offset-black";
        return "border-2 border-white/20";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.03 }}
            className={clsx(
                "relative flex items-center p-4 rounded-xl border bg-gradient-to-r transition-all hover:scale-[1.01] group",
                getRankStyle()
            )}
        >
            {/* Rank Badge */}
            <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0",
                getRankBadgeStyle()
            )}>
                {rank}
            </div>

            {/* Avatar */}
            <div className={clsx(
                "w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 transition-all",
                getAvatarRingStyle()
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
                    <span className={clsx(
                        "font-bold truncate",
                        rank <= 3 ? "text-white text-lg" : "text-white"
                    )}>
                        {displayHandle}
                    </span>
                    {(user.metrics.viral_clips || 0) > 0 && (
                        <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    )}
                    {rank === 1 && <Trophy className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    {user.linkedAccounts?.slice(0, 3).map((acc, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                            {getPlatformIcon(acc.platform, "w-3 h-3 text-gray-400")}
                            <span className="text-[10px] text-gray-500">{acc.platform}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
                <div className="text-right">
                    <p className={clsx(
                        "font-bold font-mono",
                        rank <= 3 ? "text-2xl text-white" : "text-xl text-white"
                    )}>
                        {formatNumber(user.metrics.views)}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center justify-end gap-1">
                        <Eye className="w-3 h-3" /> Views
                    </p>
                </div>
                <div className="text-right min-w-[80px]">
                    <p className={clsx(
                        "font-bold font-mono",
                        rank <= 3 ? "text-xl text-orange-400" : "text-lg text-orange-400"
                    )}>
                        ${formatNumber(user.metrics.earnings || 0)}
                    </p>
                    <p className="text-[10px] text-orange-500/60 uppercase tracking-wider">Earned</p>
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
