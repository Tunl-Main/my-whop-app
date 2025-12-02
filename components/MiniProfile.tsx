"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, Heart, Flame, Settings } from "lucide-react";
import clsx from "clsx";

// All supported platforms (twitter is now X)
const ALL_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'x'] as const;

// Platform icon image paths
const PLATFORM_ICONS: Record<string, string> = {
    instagram: '/app-icon-instagram.png',
    tiktok: '/app-icon-tiktok.png',
    youtube: '/app-icon-youtube.webp',
    x: '/app-icon-x.webp',
};

// App Store style platform icons - using actual app icon images
const AppIcon = ({ platform, isConnected, size = 28 }: { platform: string; isConnected: boolean; size?: number }) => {
    const iconSrc = PLATFORM_ICONS[platform];
    
    const baseStyle: React.CSSProperties = {
        width: size,
        height: size,
        borderRadius: size * 0.22, // iOS app icon border radius ratio
        overflow: 'hidden',
    };

    if (!isConnected) {
        // Grey/dimmed version for unconnected
        return (
            <div style={{ ...baseStyle, background: '#2a2a2a', border: '1px solid #3a3a3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                    src={iconSrc} 
                    alt={platform} 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: 'grayscale(100%) opacity(0.4)',
                    }} 
                />
            </div>
        );
    }

    // Connected - show full color app icon
    return (
        <div style={baseStyle}>
            <img 
                src={iconSrc} 
                alt={platform} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                }} 
            />
        </div>
    );
};

// For backwards compatibility with 'twitter' in database
const normalizePlatform = (platform: string): string => {
    return platform === 'twitter' ? 'x' : platform;
};

interface Achievement {
    id: string;
    name: string;
    icon: string;
    date: number;
}

interface Community {
    id: string;
    name: string;
    iconUrl: string | null;
}

interface User {
    id: string;
    whopId: string;
    avatar?: string;
    linkedAccounts?: { platform: string; handle: string }[];
    metrics: {
        views: number;
        likes?: number;
        shares: number;
        earnings?: number;
        avg_views?: number;
        avg_likes?: number;
        total_posts?: number;
        viral_clips?: number;
    };
    achievements: Achievement[];
    pledgedCommunityId?: string;
}

interface MiniProfileProps {
    user: User;
    username: string;
    onConnectAccount?: (platform: string) => void;
    community?: Community | null;
    onChangeCommunity?: () => void;
}

// Helper for compact number formatting
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(num);
};

export default function MiniProfile({ user, username, onConnectAccount, community, onChangeCommunity }: MiniProfileProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAccountsDropdown, setShowAccountsDropdown] = useState(false);

    // Get list of connected platform names (normalize twitter -> x)
    const connectedPlatforms = new Set(user.linkedAccounts?.map(acc => normalizePlatform(acc.platform)) || []);

    const handleConnectAccount = (platform: string) => {
        if (onConnectAccount) {
            // Convert 'x' back to 'twitter' for backwards compatibility with API
            onConnectAccount(platform === 'x' ? 'twitter' : platform);
        }
    };

    return (
        <div className="w-full max-w-sm">
            {/* Main Card */}
            <div 
                className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden cursor-pointer group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Header Section */}
                <div className="relative p-5">
                    <div className="flex items-start gap-4">
                        {/* Avatar with orange ring */}
                        <div className="relative flex-shrink-0">
                            {/* Outer glow */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full blur-sm opacity-60" />
                            {/* Orange ring */}
                            <div className="relative w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
                                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                    <img 
                                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                            </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-bold text-lg truncate">{username}</h3>
                                {/* Community Badge */}
                                {community && (
                                    <div 
                                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30"
                                        title={`Representing ${community.name}`}
                                    >
                                        {community.iconUrl ? (
                                            <img 
                                                src={community.iconUrl} 
                                                alt={community.name}
                                                className="w-4 h-4 rounded-sm object-cover"
                                            />
                                        ) : (
                                            <div className="w-4 h-4 rounded-sm bg-orange-500/30 flex items-center justify-center">
                                                <span className="text-[8px] text-orange-400 font-bold">
                                                    {community.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-xs text-orange-400 font-medium truncate max-w-[80px]">
                                            {community.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Connected Platforms Row - App Store Style Icons */}
                            <div className="flex items-center gap-2 mt-2">
                                {ALL_PLATFORMS.map((platform) => {
                                    const isConnected = connectedPlatforms.has(platform);
                                    return (
                                        <button 
                                            key={platform}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isConnected) {
                                                    handleConnectAccount(platform);
                                                }
                                            }}
                                            className={clsx(
                                                "relative transition-all",
                                                !isConnected && "opacity-40 hover:opacity-70 cursor-pointer"
                                            )}
                                            title={isConnected ? `${platform === 'x' ? 'X' : platform} connected` : `Click to connect ${platform === 'x' ? 'X' : platform}`}
                                        >
                                            <AppIcon platform={platform} isConnected={isConnected} size={28} />
                                            {isConnected && (
                                                <div 
                                                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: '#22c55e', border: '1px solid #111', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                    </div>

                            {/* Key Stats Row - Views & Viral */}
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-white font-bold text-sm">{formatNumber(user.metrics.views || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                                    <span className="text-white font-bold text-sm">{formatNumber(user.metrics.likes || 0)}</span>
                                </div>
                                {(user.metrics.viral_clips || 0) > 0 && (
                                    <div className="flex items-center gap-1.5 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-orange-400 font-bold text-sm">{user.metrics.viral_clips}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expand Arrow */}
                        <ChevronDown className={clsx(
                            "w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0",
                            isExpanded && "rotate-180"
                        )} />
                    </div>
                </div>

                {/* Expanded Stats Section */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 pb-5">
                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.avg_views || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Views</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.avg_likes || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Likes</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.total_posts || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Posts</p>
                                    </div>
                                </div>

                                {/* Manage Connected Accounts Dropdown */}
                                <div className="mt-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAccountsDropdown(!showAccountsDropdown);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Settings className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-300">Manage Connected Accounts</span>
                                        </div>
                                        <ChevronDown className={clsx(
                                            "w-4 h-4 text-gray-500 transition-transform",
                                            showAccountsDropdown && "rotate-180"
                                        )} />
                                    </button>

                                    <AnimatePresence>
                                        {showAccountsDropdown && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-2 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                                                {ALL_PLATFORMS.map((platform) => {
                                                        const isConnected = connectedPlatforms.has(platform);
                                                        // Find linked account (handle twitter -> x conversion)
                                                        const linkedAccount = user.linkedAccounts?.find(acc => normalizePlatform(acc.platform) === platform);
                                                        const displayName = platform === 'x' ? 'X' : platform;
                                                        
                                                        return (
                                                            <div
                                                                key={platform}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!isConnected) {
                                                                        handleConnectAccount(platform);
                                                                    }
                                                                }}
                                                                className={clsx(
                                                                    "flex items-center justify-between p-3 rounded-lg transition-all",
                                                                    isConnected 
                                                                        ? "bg-white/5 border border-white/10" 
                                                                        : "bg-white/5 border border-dashed border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative">
                                                                        <AppIcon platform={platform} isConnected={isConnected} size={32} />
                                                                        {isConnected && (
                                                                            <div 
                                                                                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                                                                                style={{ backgroundColor: '#22c55e', border: '1px solid #111', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className={clsx(
                                                                            "font-medium capitalize",
                                                                            isConnected ? "text-white" : "text-gray-500"
                                                                        )}>
                                                                            {displayName}
                                                                        </p>
                                                                        {isConnected && linkedAccount && (
                                                                            <p className="text-xs text-gray-500">
                                                                                @{linkedAccount.handle.replace(/^@/, '')}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                        </div>

                                                                {isConnected ? (
                                                                    <span className="text-xs text-green-400 font-medium px-2 py-1 bg-green-500/10 rounded-full">
                                                                        Connected
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs text-orange-400 font-medium px-2 py-1 bg-orange-500/10 rounded-full border border-orange-500/30">
                                                                        + Connect
                                                                    </span>
                                                                )}
                                    </div>
                                                        );
                                                    })}
                                    </div>
                                            </motion.div>
                                )}
                                    </AnimatePresence>
                                </div>

                                {/* Community Allegiance Section */}
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                                {community?.iconUrl ? (
                                                    <img 
                                                        src={community.iconUrl} 
                                                        alt={community.name}
                                                        className="w-full h-full rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg">🏴</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Representing</p>
                                                <p className="text-sm font-medium text-white">
                                                    {community?.name || 'No community selected'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onChangeCommunity?.();
                                            }}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-colors"
                                        >
                                            {community ? 'Change' : 'Select'}
                                        </button>
                                    </div>
                                </div>

                                {/* Achievements */}
                                {user.achievements.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {user.achievements.slice(0, 5).map((ach) => (
                                                <div 
                                                    key={ach.id} 
                                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm border border-white/10 hover:scale-110 transition-transform cursor-help"
                                                    title={ach.name}
                                                >
                                                    {ach.icon}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
