"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronDown, Eye, Heart, TrendingUp, Flame, DollarSign } from "lucide-react";
import clsx from "clsx";

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
                className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden cursor-pointer group"
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
                                <p className="text-sm text-gray-400 truncate">
                                    <span className="capitalize text-orange-400">{linkedAccount.platform}</span>
                                    {' '}
                                    <span className="text-gray-500">{linkedAccount.handle.startsWith('@') ? linkedAccount.handle : `@${linkedAccount.handle}`}</span>
                                </p>
                            )}
                            
                            {/* Quick Stats Row */}
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                                        <Trophy className="w-3 h-3 text-orange-400" />
                                    </div>
                                    <span className="text-white font-semibold text-sm">{user.metrics.viral_clips || 0}</span>
                                    <span className="text-gray-500 text-xs">viral clips</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <DollarSign className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span className="text-white font-semibold text-sm">${user.metrics.earnings || 0}</span>
                                    <span className="text-gray-500 text-xs">earned</span>
                                </div>
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
                                
                                {/* Total Stats Label */}
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Total stats</p>
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="text-center">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.views || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Views</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.likes || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Likes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.avg_views || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Avg Views</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.avg_likes || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Avg Likes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-bold text-lg">{formatNumber(user.metrics.total_posts || 0)}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Posts</p>
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
