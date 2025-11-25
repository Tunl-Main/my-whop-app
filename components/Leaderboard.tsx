"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Instagram, Youtube, Twitter, Eye, Flame } from "lucide-react";
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

// Podium Card Component for Top 3
const PodiumCard = ({ user, rank, isCenter }: { user: User; rank: number; isCenter?: boolean }) => {
    const badges = {
        1: { label: "Gold", color: "from-yellow-400 to-yellow-600", textColor: "text-yellow-400", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/50" },
        2: { label: "Silver", color: "from-gray-300 to-gray-500", textColor: "text-gray-300", bgColor: "bg-gray-400/20", borderColor: "border-gray-400/50" },
        3: { label: "Rising stars", color: "from-orange-400 to-orange-600", textColor: "text-orange-400", bgColor: "bg-orange-500/20", borderColor: "border-orange-500/50" },
    };

    const badge = badges[rank as keyof typeof badges];
    const handle = user.linkedAccounts?.[0]?.handle || "Unknown";
    const displayHandle = handle.startsWith('@') ? handle.slice(1) : handle;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
            className={clsx(
                "relative flex flex-col items-center",
                isCenter ? "order-2 -mt-4 z-10" : rank === 2 ? "order-1" : "order-3"
            )}
        >
            {/* Rank Badge */}
            <div className={clsx(
                "absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-xs font-bold",
                rank === 1 ? "bg-yellow-500 text-black" : 
                rank === 2 ? "bg-gray-400 text-black" : 
                "bg-orange-500 text-white"
            )}>
                {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
            </div>

            {/* Card */}
            <div className={clsx(
                "relative w-44 rounded-2xl overflow-hidden border backdrop-blur-sm",
                isCenter ? "bg-gradient-to-b from-yellow-500/10 to-black/80 border-yellow-500/30 shadow-[0_0_30px_-5px_rgba(234,179,8,0.4)]" :
                rank === 2 ? "bg-gradient-to-b from-gray-500/10 to-black/80 border-gray-500/30 shadow-[0_0_30px_-5px_rgba(156,163,175,0.3)]" :
                "bg-gradient-to-b from-orange-500/10 to-black/80 border-orange-500/30 shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]"
            )}>
                <div className="p-4 pt-6">
                    {/* Avatar */}
                    <div className="relative mx-auto w-16 h-16 mb-3">
                        <div className={clsx(
                            "absolute -inset-1 rounded-full blur-sm opacity-60",
                            rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-orange-500"
                        )} />
                        <div className={clsx(
                            "relative w-full h-full rounded-full p-[2px]",
                            rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                            rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                            "bg-gradient-to-br from-orange-400 to-orange-600"
                        )}>
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs bg-white/10">?</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Platform Icons */}
                    <div className="flex justify-center gap-1.5 mb-2">
                        {user.linkedAccounts?.slice(0, 3).map((acc, i) => (
                            <div key={i} className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                                {getPlatformIcon(acc.platform, "w-3.5 h-3.5 text-white")}
                            </div>
                        ))}
                    </div>

                    {/* Username */}
                    <p className="text-white font-semibold text-center text-sm truncate mb-1">
                        @{displayHandle}
                    </p>

                    {/* Badge */}
                    <div className="flex justify-center mb-3">
                        <span className={clsx(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1",
                            badge.bgColor, badge.textColor
                        )}>
                            {rank === 1 && <span>⭐</span>}
                            {rank === 3 && <span>⭐</span>}
                            {badge.label}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                            <p className="text-white font-bold text-sm">{formatNumber(user.metrics.views)}</p>
                            <p className="text-[9px] text-gray-500 uppercase">Views</p>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">{formatNumber(user.metrics.likes)}</p>
                            <p className="text-[9px] text-gray-500 uppercase">Likes</p>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">{user.metrics.viral_clips || 0}</p>
                            <p className="text-[9px] text-gray-500 uppercase">Viral</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Regular Leaderboard Row
const LeaderboardRow = ({ user, rank }: { user: User; rank: number }) => {
    const handle = user.linkedAccounts?.[0]?.handle || "Unknown";
    const displayHandle = handle.startsWith('@') ? handle : `@${handle}`;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.03 }}
            className="relative flex items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-orange-500/30 transition-all group"
        >
            {/* Rank Number */}
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm mr-3">
                {rank}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 mr-3 flex-shrink-0 group-hover:border-orange-500/50 transition-colors">
                {user.avatar ? (
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs bg-white/10">?</div>
                )}
            </div>

            {/* User Info */}
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">{displayHandle}</span>
                    {(user.metrics.viral_clips || 0) > 0 && (
                        <Flame className="w-4 h-4 text-orange-400" />
                    )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {user.linkedAccounts?.slice(0, 3).map((acc, i) => (
                        <div key={i} className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                            {getPlatformIcon(acc.platform, "w-2.5 h-2.5 text-gray-400")}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-right">
                <div>
                    <p className="text-white font-bold">{formatNumber(user.metrics.views)}</p>
                    <p className="text-[10px] text-gray-500 uppercase">Views</p>
                </div>
                <div className="w-20">
                    <p className="text-orange-400 font-bold">${formatNumber(user.metrics.earnings || 0)}</p>
                    <p className="text-[10px] text-orange-500/50 uppercase">Earned</p>
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

    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

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
                            {/* Podium - Top 3 (or less) */}
                            {top3.length > 0 && (
                                <div className="flex justify-center items-end gap-4 mb-8 pt-6">
                                    {top3.length >= 2 && <PodiumCard user={top3[1]} rank={2} />}
                                    {top3.length >= 1 && <PodiumCard user={top3[0]} rank={1} isCenter />}
                                    {top3.length >= 3 && <PodiumCard user={top3[2]} rank={3} />}
                                    </div>
                            )}

                            {/* Rest of Leaderboard */}
                            <div className="space-y-2">
                                {rest.map((user, index) => (
                                    <LeaderboardRow key={user.id} user={user} rank={index + 4} />
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
