"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, UserPlus, MessageCircle, Lock } from "lucide-react";
import clsx from "clsx";
import TopClips from "./TopClips";
import RisingStars from "./RisingStars";
import UserProfileModal from "./UserProfileModal";

// App Store style mini platform icon for leaderboard rows
const PlatformAppIcon = ({ platform, size = 20 }: { platform: string; size?: number }) => {
    const normalizedPlatform = platform === 'twitter' ? 'x' : platform;
    const baseStyle = {
        width: size,
        height: size,
        borderRadius: size * 0.22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden' as const,
    };

    return (
        <div style={baseStyle}>
            {normalizedPlatform === 'instagram' && (
                <div style={{ 
                    ...baseStyle, 
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.6} height={size * 0.6}>
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                </div>
            )}
            {normalizedPlatform === 'tiktok' && (
                <div style={{ ...baseStyle, background: '#000' }}>
                    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}>
                        <path fill="#25F4EE" d="M9.37 23.5v-11.2l.02-5.15h3.6c-.03.62.1 1.28.42 1.86.32.58.81 1.05 1.4 1.35v3.34a7.07 7.07 0 01-3.78-.95v7.27a4.51 4.51 0 01-1.13 3c-.74.85-1.76 1.39-2.87 1.5a4.56 4.56 0 01-3.15-.87 4.51 4.51 0 01-1.68-2.73 4.46 4.46 0 01.53-3.12 4.52 4.52 0 012.43-2.02 4.6 4.6 0 013.13-.14v3.54a1.52 1.52 0 00-1.27.26c-.34.26-.58.63-.67 1.05-.1.42-.04.86.16 1.24.2.39.54.7.94.87.41.17.86.19 1.28.06.42-.13.78-.41 1.03-.79.24-.38.37-.83.36-1.28l.01-7.28z"/>
                        <path fill="#FE2C55" d="M10.33 23.5v-11.2l.03-5.15h3.59a4.48 4.48 0 001.82 3.21v3.34a7.07 7.07 0 01-3.78-.95v7.27c0 .78-.2 1.55-.58 2.23a4.5 4.5 0 01-3.42 2.27 4.56 4.56 0 01-3.15-.87 4.47 4.47 0 002.73.47 4.52 4.52 0 002.87-1.5c.5-.57.85-1.26 1.02-2 .17-.75.17-1.53 0-2.28l-.13-.84z"/>
                        <path fill="white" d="M15.77 10.36V7.02a4.44 4.44 0 01-1.4-1.35 4.38 4.38 0 01-.42-1.86h-3.6l-.02 12.35v.04a1.52 1.52 0 01-.36 1.28c-.25.38-.61.66-1.03.79a1.53 1.53 0 01-1.28-.06 1.51 1.51 0 01-.94-.87 1.5 1.5 0 01-.16-1.24c.09-.42.33-.79.67-1.05a1.52 1.52 0 011.27-.26v-3.54a4.6 4.6 0 00-3.13.14 4.52 4.52 0 00-2.43 2.02 4.46 4.46 0 00-.53 3.12 4.51 4.51 0 001.68 2.73c.9.71 2.01 1.06 3.15.87a4.5 4.5 0 003.42-2.27c.38-.68.58-1.45.58-2.23v-7.27a7.07 7.07 0 003.78.95v-3.34l-.25-.05z"/>
                    </svg>
                </div>
            )}
            {normalizedPlatform === 'youtube' && (
                <div style={{ ...baseStyle, background: '#FF0000' }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.5} height={size * 0.5}>
                        <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </div>
            )}
            {normalizedPlatform === 'x' && (
                <div style={{ ...baseStyle, background: '#000' }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.45} height={size * 0.45}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </div>
            )}
        </div>
    );
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
            {/* Row 1: Rank, Avatar, Name + Platforms */}
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

                {/* User Info - Name with Platform Icons Below */}
                <div className="flex flex-col min-w-0 flex-grow sm:flex-grow-0 sm:mr-4">
                    <span className="font-bold text-white text-xs sm:text-lg truncate max-w-[100px] sm:max-w-none">
                        {displayName}
                    </span>
                    {/* Platform icons below name - App Store style */}
                    <div className="flex items-center gap-1 mt-0.5">
                        {user.linkedAccounts?.slice(0, 4).map((acc, i) => (
                            <PlatformAppIcon key={i} platform={acc.platform} size={16} />
                        ))}
                    </div>
                </div>

                {/* Desktop: Action Buttons - Only visible on hover */}
                <div className="hidden sm:flex items-center gap-2 mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

            {/* Row 2 (Mobile only): Stats inline - Actions appear on tap (card click opens modal) */}
            <div className="flex sm:hidden items-center justify-end">
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

interface LeaderboardProps {
    isUserConnected?: boolean;
    onConnectClick?: () => void;
}

export default function Leaderboard({ isUserConnected = false, onConnectClick }: LeaderboardProps) {
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
                            {/* Leaderboard Rows - Show top 3 always, blur rest if not connected */}
                            <div className="space-y-3">
                                {/* Top 3 - Always visible */}
                                {users.slice(0, 3).map((user, index) => (
                                    <LeaderboardRow 
                                        key={user.id} 
                                        user={user} 
                                        rank={index + 1} 
                                        onUserClick={handleUserClick}
                                    />
                                ))}
                            </div>

                            {/* Rest of leaderboard - blurred if not connected */}
                            {users.length > 3 && (
                                <div className="relative mt-3">
                                    {/* Blurred content overlay for non-connected users */}
                                    {!isUserConnected && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-black/80 to-black/95 backdrop-blur-md rounded-2xl">
                                            <div className="text-center px-6 py-8">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                    <Lock className="w-8 h-8 text-orange-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">
                                                    Connect to See More
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-6 max-w-xs">
                                                    Link your social accounts to unlock the full leaderboard and start competing
                                                </p>
                                                <button
                                                    onClick={onConnectClick}
                                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
                                                >
                                                    Connect Your Socials
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Actual content (blurred or visible) */}
                                    <div className={clsx(
                                        "space-y-3",
                                        !isUserConnected && "blur-sm pointer-events-none select-none"
                                    )}>
                                        {users.slice(3).map((user, index) => (
                                            <LeaderboardRow 
                                                key={user.id} 
                                                user={user} 
                                                rank={index + 4} 
                                                onUserClick={handleUserClick}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

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
                        <RisingStars variant="full" timeRange={filter} />
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
