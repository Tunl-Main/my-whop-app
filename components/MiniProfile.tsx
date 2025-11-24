"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronDown, Star } from "lucide-react";
import { FrostedGlass } from "./FrostedGlass";
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
    };
    achievements: Achievement[];
}

interface MiniProfileProps {
    user: User;
    username: string;
}

const BADGES = [
    { name: "10k Views", threshold: 10000, icon: "🔥" },
    { name: "100k Views", threshold: 100000, icon: "🚀" },
    { name: "1M Views", threshold: 1000000, icon: "👑" },
    { name: "First $100", threshold: 100, type: "earnings", icon: "💰" },
];

export default function MiniProfile({ user, username }: MiniProfileProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate next achievement
    const nextBadge = BADGES.find(b => {
        const current = b.type === "earnings" ? (user.metrics.earnings || 0) : user.metrics.views;
        return current < b.threshold;
    });

    const progress = nextBadge
        ? Math.min(100, ((nextBadge.type === "earnings" ? (user.metrics.earnings || 0) : user.metrics.views) / nextBadge.threshold) * 100)
        : 100;

    const linkedAccount = user.linkedAccounts && user.linkedAccounts.length > 0 ? user.linkedAccounts[0] : null;
    const isSyncing = user.metrics.total_posts === 0 && linkedAccount; // Simple heuristic for syncing

    console.log("MiniProfile User Data (v1.1):", user);

    return (
        <div
            className="relative z-50 w-full max-w-md mx-auto mb-12 group"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Ambient Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

            <FrostedGlass variant="premium" className="relative rounded-3xl overflow-hidden transition-all duration-500">
                {/* Header / Collapsed View */}
                <div className="p-5 flex items-center gap-5 cursor-pointer relative z-10">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-inner">
                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        {/* Status Dot */}
                        <div className={clsx(
                            "absolute bottom-0 right-0 w-4 h-4 border-2 border-black rounded-full animate-pulse",
                            isSyncing ? "bg-yellow-500" : "bg-green-500"
                        )} />
                    </div>

                    <div className="flex-grow">
                        <h3 className="text-white font-bold text-xl tracking-tight">{username}</h3>
                        {linkedAccount && (
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                <span className="capitalize text-orange-400">{linkedAccount.platform}</span>
                                <span>{linkedAccount.handle.startsWith('@') ? linkedAccount.handle : `@${linkedAccount.handle}`}</span>
                                {isSyncing && <span className="text-yellow-500 ml-2 animate-pulse">(Syncing...)</span>}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-2">
                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                <Trophy className="w-3.5 h-3.5 text-orange-400" />
                                <span className="font-medium text-gray-300">{user.achievements.length}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                <span className="text-orange-400 font-bold">$</span>
                                <span className="font-mono text-gray-300">{user.metrics.earnings?.toLocaleString() || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <div className="flex -space-x-2">
                            {user.achievements.slice(0, 3).map((ach, i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-black/80 flex items-center justify-center text-xs border border-white/10 shadow-lg relative z-10" title={ach.name}>
                                    {ach.icon}
                                </div>
                            ))}
                        </div>
                        <ChevronDown className={clsx("w-5 h-5 text-gray-500 transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
                    </div>
                </div>

                {/* Expanded View */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-black/20"
                        >
                            <div className="px-5 pb-6 pt-2 space-y-5">
                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                {/* Detailed Metrics Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase">Total Views</p>
                                        <p className="text-white font-mono text-sm">{(user.metrics.views || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase">Total Likes</p>
                                        <p className="text-white font-mono text-sm">{(user.metrics.likes || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase">Avg Views</p>
                                        <p className="text-white font-mono text-sm">{(user.metrics.avg_views || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase">Avg Likes</p>
                                        <p className="text-white font-mono text-sm">{(user.metrics.avg_likes || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-lg text-center border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase">Posts</p>
                                        <p className="text-white font-mono text-sm">{(user.metrics.total_posts || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Next Achievement Progress */}
                                {nextBadge ? (
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Next Goal</p>
                                                <p className="text-sm text-white font-medium">{nextBadge.name}</p>
                                            </div>
                                            <span className="text-xs font-mono text-orange-400">{Math.round(progress)}%</span>
                                        </div>

                                        <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                            />
                                        </div>

                                        <p className="text-[10px] text-gray-500 mt-1.5 text-right font-mono">
                                            {nextBadge.type === "earnings" ? "$" : ""}{(nextBadge.type === "earnings" ? (user.metrics.earnings || 0) : user.metrics.views).toLocaleString()} <span className="text-gray-700">/</span> {nextBadge.threshold.toLocaleString()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-2">
                                        <p className="text-sm text-orange-400 font-medium">All achievements unlocked! 🏆</p>
                                    </div>
                                )}

                                {/* Recent Achievements Grid */}
                                {user.achievements.length > 0 && (
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3">Collection</p>
                                        <div className="grid grid-cols-4 gap-3">
                                            {user.achievements.map((ach) => (
                                                <div key={ach.id} className="group/badge flex flex-col items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-orange-500/30 transition-all cursor-help">
                                                    <span className="text-xl filter drop-shadow-lg group-hover/badge:scale-110 transition-transform">{ach.icon}</span>
                                                </div>
                                            ))}
                                            {/* Empty slots filler */}
                                            {[...Array(Math.max(0, 4 - user.achievements.length))].map((_, i) => (
                                                <div key={`empty-${i}`} className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 border-dashed opacity-30">
                                                    <div className="w-4 h-4 rounded-full bg-white/10" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </FrostedGlass>
            <div className="text-center mt-2 text-[10px] text-gray-600">v1.1</div>
        </div>
    );
}
