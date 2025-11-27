"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, UserPlus, MessageCircle, Lock } from "lucide-react";
import clsx from "clsx";
import TopClips from "./TopClips";
import RisingStars from "./RisingStars";
import UserProfileModal from "./UserProfileModal";

// Platform icon image paths
const PLATFORM_ICONS: Record<string, string> = {
    instagram: '/app-icon-instagram.png',
    tiktok: '/app-icon-tiktok.png',
    youtube: '/app-icon-youtube.webp',
    x: '/app-icon-x.webp',
};

// App Store style platform icon using actual app images
const PlatformAppIcon = ({ platform, size = 20 }: { platform: string; size?: number }) => {
    const normalizedPlatform = platform === 'twitter' ? 'x' : platform;
    const iconSrc = PLATFORM_ICONS[normalizedPlatform];
    
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: size * 0.22,
            overflow: 'hidden',
        }}>
            <img 
                src={iconSrc} 
                alt={normalizedPlatform} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                }} 
            />
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

// Platform filter options
const PLATFORM_FILTERS = [
    { id: 'all', label: 'All', fullLabel: 'All Platforms' },
    { id: 'instagram', label: 'Instagram', fullLabel: 'Instagram' },
    { id: 'tiktok', label: 'TikTok', fullLabel: 'TikTok' },
    { id: 'youtube', label: 'YouTube', fullLabel: 'YouTube' },
    { id: 'x', label: 'X', fullLabel: 'X' },
] as const;

// Mini platform icon for filter buttons - using actual app images
const FilterPlatformIcon = ({ platform, size = 14 }: { platform: string; size?: number }) => {
    if (platform === 'all') return null;
    
    const normalizedPlatform = platform === 'twitter' ? 'x' : platform;
    const iconSrc = PLATFORM_ICONS[normalizedPlatform];
    
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: size * 0.22,
            overflow: 'hidden',
        }}>
            <img 
                src={iconSrc} 
                alt={normalizedPlatform} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                }} 
            />
        </div>
    );
};

export default function Leaderboard({ isUserConnected = false, onConnectClick }: LeaderboardProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<'week' | 'month' | 'all'>('week');
    const [sortBy, setSortBy] = useState<'views' | 'likes' | 'earnings'>('views');
    const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok' | 'youtube' | 'x'>('all');
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
        const platformParam = platform !== 'all' ? `&platform=${platform === 'x' ? 'twitter' : platform}` : '';
        fetch(`/api/leaderboard?range=${filter}&sortBy=${sortBy}${platformParam}`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            });
    }, [filter, sortBy, platform]);

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
                                    {v === 'creators' ? 'Clippers' : v === 'clips' ? 'Clips' : 'Rising Stars'}
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
                                        filter === f ? "bg-orange-500 text-white" : "text-gray-400"
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

                {/* Platform Filter - Top Border of Content */}
                {(view === 'creators' || view === 'clips') && (
                    <div className="flex justify-center flex-wrap gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        {PLATFORM_FILTERS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPlatform(p.id as typeof platform)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                                    platform === p.id 
                                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-lg shadow-orange-500/10" 
                                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {p.id !== 'all' && <FilterPlatformIcon platform={p.id} size={22} />}
                                {p.id === 'all' && <span className="text-base sm:text-lg">🌐</span>}
                                <span className="hidden sm:inline">{p.fullLabel}</span>
                                <span className="sm:hidden">{p.label}</span>
                            </button>
                        ))}
                    </div>
                )}

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
                        <TopClips timeRange={filter} platform={platform} />
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
