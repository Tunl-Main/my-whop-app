"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, Heart, Flame, Settings } from "lucide-react";
import clsx from "clsx";

// All supported platforms (twitter is now X)
const ALL_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'x'] as const;

// App Store style platform icons - rounded square with app appearance
const AppIcon = ({ platform, isConnected, size = 28 }: { platform: string; isConnected: boolean; size?: number }) => {
    const baseStyle = {
        width: size,
        height: size,
        borderRadius: size * 0.22, // iOS app icon border radius ratio
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden' as const,
    };

    if (!isConnected) {
        return (
            <div style={{ ...baseStyle, background: '#2a2a2a', border: '1px solid #3a3a3a' }}>
                {platform === 'instagram' && (
                    <svg viewBox="0 0 24 24" fill="#666" width={size * 0.6} height={size * 0.6}>
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                )}
                {platform === 'tiktok' && (
                    <svg viewBox="0 0 24 24" fill="#666" width={size * 0.6} height={size * 0.6}>
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                )}
                {platform === 'youtube' && (
                    <svg viewBox="0 0 24 24" fill="#666" width={size * 0.6} height={size * 0.6}>
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                )}
                {platform === 'x' && (
                    <svg viewBox="0 0 24 24" fill="#666" width={size * 0.5} height={size * 0.5}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                )}
            </div>
        );
    }

    // Connected - show colorful app icon
    return (
        <div style={baseStyle}>
            {platform === 'instagram' && (
                <div style={{ 
                    ...baseStyle, 
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.65} height={size * 0.65}>
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                </div>
            )}
            {platform === 'tiktok' && (
                <div style={{ ...baseStyle, background: '#000' }}>
                    <svg viewBox="0 0 24 24" width={size * 0.65} height={size * 0.65}>
                        <path fill="#25F4EE" d="M9.37 23.5v-11.2l.02-5.15h3.6c-.03.62.1 1.28.42 1.86.32.58.81 1.05 1.4 1.35v3.34a7.07 7.07 0 01-3.78-.95v7.27a4.51 4.51 0 01-1.13 3c-.74.85-1.76 1.39-2.87 1.5a4.56 4.56 0 01-3.15-.87 4.51 4.51 0 01-1.68-2.73 4.46 4.46 0 01.53-3.12 4.52 4.52 0 012.43-2.02 4.6 4.6 0 013.13-.14v3.54a1.52 1.52 0 00-1.27.26c-.34.26-.58.63-.67 1.05-.1.42-.04.86.16 1.24.2.39.54.7.94.87.41.17.86.19 1.28.06.42-.13.78-.41 1.03-.79.24-.38.37-.83.36-1.28l.01-7.28z"/>
                        <path fill="#FE2C55" d="M10.33 23.5v-11.2l.03-5.15h3.59a4.48 4.48 0 001.82 3.21v3.34a7.07 7.07 0 01-3.78-.95v7.27c0 .78-.2 1.55-.58 2.23a4.5 4.5 0 01-3.42 2.27 4.56 4.56 0 01-3.15-.87 4.47 4.47 0 002.73.47 4.52 4.52 0 002.87-1.5c.5-.57.85-1.26 1.02-2 .17-.75.17-1.53 0-2.28l-.13-.84z"/>
                        <path fill="white" d="M15.77 10.36V7.02a4.44 4.44 0 01-1.4-1.35 4.38 4.38 0 01-.42-1.86h-3.6l-.02 12.35v.04a1.52 1.52 0 01-.36 1.28c-.25.38-.61.66-1.03.79a1.53 1.53 0 01-1.28-.06 1.51 1.51 0 01-.94-.87 1.5 1.5 0 01-.16-1.24c.09-.42.33-.79.67-1.05a1.52 1.52 0 011.27-.26v-3.54a4.6 4.6 0 00-3.13.14 4.52 4.52 0 00-2.43 2.02 4.46 4.46 0 00-.53 3.12 4.51 4.51 0 001.68 2.73c.9.71 2.01 1.06 3.15.87a4.5 4.5 0 003.42-2.27c.38-.68.58-1.45.58-2.23v-7.27a7.07 7.07 0 003.78.95v-3.34l-.25-.05z"/>
                    </svg>
                </div>
            )}
            {platform === 'youtube' && (
                <div style={{ ...baseStyle, background: '#FF0000' }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.55} height={size * 0.55}>
                        <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </div>
            )}
            {platform === 'x' && (
                <div style={{ ...baseStyle, background: '#000' }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.5} height={size * 0.5}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </div>
            )}
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
}

interface MiniProfileProps {
    user: User;
    username: string;
    onConnectAccount?: (platform: string) => void;
}

// Helper for compact number formatting
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(num);
};

export default function MiniProfile({ user, username, onConnectAccount }: MiniProfileProps) {
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
                            <h3 className="text-white font-bold text-lg truncate">{username}</h3>
                            
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
