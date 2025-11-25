"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Twitter, Eye, Flame, UserPlus, MessageCircle } from "lucide-react";
import clsx from "clsx";
import TopClips from "./TopClips";
import RisingStars from "./RisingStars";
import UserProfileModal from "./UserProfileModal";

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
const LeaderboardRow = ({ user, rank, onUserClick }: { user: User; rank: number; onUserClick: (user: User) => void }) => {
    // Use Whop username, fallback to whopId if no username
    const displayName = user.username || user.whopId || "Unknown";

    // Orange theme glow for top 3, subtle for rest
    const getRankStyle = () => {
        if (rank <= 3) return "from-orange-500/10 to-transparent border-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.4),0_0_50px_rgba(249,115,22,0.2)]";
        return "from-transparent to-transparent border-gray-800/50 hover:border-gray-700";
    };

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUserClick(user);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.03 }}
            onClick={() => onUserClick(user)}
            className={clsx(
                "relative flex flex-col p-2.5 sm:p-4 rounded-xl border bg-gradient-to-r transition-all hover:scale-[1.005] group cursor-pointer gap-2 sm:gap-0",
                getRankStyle()
            )}
        >
            {/* Row 1: Rank, Avatar, Name + Fire */}
            <div className="flex items-center">
                {/* Rank Number */}
                <div className={clsx(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center font-bold text-[10px] sm:text-sm mr-1.5 sm:mr-4 flex-shrink-0",
                    rank <= 3 
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                        : "bg-white/5 text-gray-500 border border-white/5"
                )}>
                    {rank}
                </div>

                {/* Avatar */}
                <div className={clsx(
                    "w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-1.5 sm:mr-4 flex-shrink-0 transition-all",
                    rank <= 3 
                        ? "ring-2 ring-orange-500/50 ring-offset-1 ring-offset-black" 
                        : "border border-gray-700"
                )}>
                    {user.avatar ? (
                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-[8px] sm:text-xs bg-white/10">?</div>
                    )}
                </div>

                {/* User Info - Name + Fire */}
                <div className="flex items-center gap-1 min-w-0 flex-grow sm:flex-grow-0 sm:mr-4">
                    <span className="font-bold text-white text-xs sm:text-lg truncate max-w-[100px] sm:max-w-none">
                        {displayName}
                    </span>
                    {(user.metrics.viral_clips || 0) > 0 && (
                        <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                    )}
                </div>

                {/* Desktop: Platform icons */}
                <div className="hidden sm:flex items-center gap-1.5 mr-4">
                    {user.linkedAccounts?.slice(0, 3).map((acc, i) => (
                        <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5">
                            {getPlatformIcon(acc.platform, "w-4 h-4")}
                        </div>
                    ))}
                </div>

                {/* Desktop: Action Buttons */}
                <div className="hidden sm:flex items-center gap-2 mr-4">
                    <button
                        onClick={handleActionClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors shadow-lg shadow-orange-500/20"
                        title="Follow"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                    </button>
                    <button
                        onClick={handleActionClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10"
                        title="Message"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                    </button>
                </div>

                {/* Desktop: Stats */}
                <div className="hidden sm:flex items-center gap-6 md:gap-8 ml-auto">
                    <div className="text-right">
                        <p className="font-black text-white text-xl md:text-2xl tabular-nums tracking-tight">
                            {formatNumber(user.metrics.views)}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Views</p>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-white text-xl md:text-2xl tabular-nums tracking-tight">
                            {formatNumber(user.metrics.likes)}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Likes</p>
                    </div>
                    {(user.metrics.earnings !== undefined && user.metrics.earnings > 0) && (
                        <div className="text-right">
                            <p className="font-black text-green-400 text-xl md:text-2xl tabular-nums tracking-tight">
                                ${formatNumber(user.metrics.earnings)}
                            </p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Earned</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Row 2 (Mobile only): Actions + Stats inline */}
            <div className="flex sm:hidden items-center justify-between">
                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleActionClick}
                        className="flex items-center justify-center w-6 h-6 rounded bg-orange-500 text-white"
                        title="Follow"
                    >
                        <UserPlus className="w-3 h-3" />
                    </button>
                    <button
                        onClick={handleActionClick}
                        className="flex items-center justify-center w-6 h-6 rounded bg-white/10 text-white"
                        title="Message"
                    >
                        <MessageCircle className="w-3 h-3" />
                    </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="font-bold text-white text-sm tabular-nums">{formatNumber(user.metrics.views)}</p>
                        <p className="text-[8px] text-gray-500 uppercase">Views</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-white text-sm tabular-nums">{formatNumber(user.metrics.likes)}</p>
                        <p className="text-[8px] text-gray-500 uppercase">Likes</p>
                    </div>
                    {(user.metrics.earnings !== undefined && user.metrics.earnings > 0) && (
                        <div className="text-right">
                            <p className="font-bold text-green-400 text-sm tabular-nums">${formatNumber(user.metrics.earnings)}</p>
                            <p className="text-[8px] text-gray-500 uppercase">Earned</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default function Leaderboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<'week' | 'month' | 'all'>('week');
    const [sortBy, setSortBy] = useState<'views' | 'likes' | 'earnings'>('views');
    const [view, setView] = useState<'creators' | 'clips' | 'rising'>('creators');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    useEffect(() => {
        setLoading(true);
        fetch(`/api/leaderboard?range=${filter}&sortBy=${sortBy}`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }, [filter, sortBy]);

    return (
        <div className="w-full">
            {/* Leaderboard Container */}
            <div className="bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="p-3 sm:p-6 pb-3 sm:pb-4 border-b border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-2 sm:mb-4">Leaderboard data is updated daily</p>
                    
                    {/* Compact Navigation on Mobile */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                        {/* View Toggle */}
                        <div className="flex bg-white/5 p-0.5 sm:p-1 rounded-lg border border-white/10">
                            {(['creators', 'clips', 'rising'] as const).map((v) => (
                        <button
                                    key={v}
                                    onClick={() => setView(v)}
                            className={clsx(
                                        "px-2 sm:px-4 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all",
                                        view === v ? "bg-orange-500 text-white" : "text-gray-400"
                                    )}
                                >
                                    {v === 'creators' ? 'Clippers' : v === 'clips' ? 'Clips' : 'Rising'}
                        </button>
                    ))}
            </div>

                        {/* Time Filter */}
                        <div className="flex bg-white/5 p-0.5 sm:p-1 rounded-lg border border-white/10">
                            {(['week', 'month', 'all'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={clsx(
                                        "px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all",
                                        filter === f ? "bg-white/10 text-white" : "text-gray-500"
                                    )}
                                >
                                    {f === 'week' ? 'Week' : f === 'month' ? 'Month' : 'All'}
                                </button>
                            ))}
                                    </div>

                        {/* Sort By Toggle - Inline on mobile */}
                        {view === 'creators' && (
                            <div className="flex bg-white/5 p-0.5 sm:p-1 rounded-lg border border-white/10">
                                {(['views', 'likes', 'earnings'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSortBy(s)}
                                        className={clsx(
                                            "px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all",
                                            sortBy === s ? "bg-orange-500/20 text-orange-400" : "text-gray-500"
                                        )}
                                    >
                                        {s === 'views' ? '👁' : s === 'likes' ? '❤️' : '💰'}
                                        <span className="hidden sm:inline ml-1">{s}</span>
                                    </button>
                                ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                {/* Content */}
                <div className="p-6">
                    {view === 'creators' && (
                        <>
                            {/* Leaderboard Rows */}
                            <div className="space-y-3">
                                {users.map((user, index) => (
                                    <LeaderboardRow 
                                        key={user.id} 
                                        user={user} 
                                        rank={index + 1} 
                                        onUserClick={handleUserClick}
                                    />
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
                    )}
                    
                    {view === 'clips' && (
                        <TopClips timeRange={filter} />
                    )}
                    
                    {view === 'rising' && (
                        <RisingStars variant="full" />
                    )}
                </div>
            </div>

            {/* User Profile Modal */}
            <UserProfileModal 
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
