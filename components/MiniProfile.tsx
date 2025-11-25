"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, Heart, TrendingUp, Flame, Instagram, Youtube } from "lucide-react";
import clsx from "clsx";

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);

const getPlatformIcon = (platform: string) => {
    switch (platform) {
        case 'instagram': return <Instagram className="w-4 h-4" />;
        case 'tiktok': return <TikTokIcon className="w-4 h-4" />;
        case 'youtube': return <Youtube className="w-4 h-4" />;
        default: return null;
    }
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
}

// Helper for compact number formatting
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(num);
};

export default function MiniProfile({ user, username }: MiniProfileProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const linkedAccount = user.linkedAccounts && user.linkedAccounts.length > 0 ? user.linkedAccounts[0] : null;

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
                            {linkedAccount && (
                                <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                                    {getPlatformIcon(linkedAccount.platform)}
                                    <span className="text-sm text-gray-500">
                                        {linkedAccount.handle.startsWith('@') ? linkedAccount.handle : `@${linkedAccount.handle}`}
                                    </span>
                    </div>
                            )}
                            
                            {/* Key Stats Row - Views & Viral */}
                            <div className="flex items-center gap-4 mt-3">
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
