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
    metrics: {
        views: number;
        shares: number;
        earnings?: number;
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

    return (
        <div
            className="relative z-50 w-full max-w-md mx-auto mb-12"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <FrostedGlass className="rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10">
                {/* Header / Collapsed View */}
                <div className="p-4 flex items-center gap-4 cursor-pointer">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/50">
                        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow">
                        <h3 className="text-white font-semibold text-lg">{username}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-orange-400" />
                                {user.achievements.length} Badges
                            </span>
                            <span>•</span>
                            <span className="font-mono text-orange-400 font-medium">
                                ${user.metrics.earnings?.toLocaleString() || 0}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {user.achievements.slice(0, 3).map((ach, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs border border-white/10" title={ach.name}>
                                {ach.icon}
                            </div>
                        ))}
                        <ChevronDown className={clsx("w-5 h-5 text-gray-500 transition-transform", isExpanded ? "rotate-180" : "")} />
                    </div>
                </div>

                {/* Expanded View */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-4">
                                {/* Next Achievement Progress */}
                                {nextBadge ? (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Next: {nextBadge.name}</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1 text-right">
                                            {nextBadge.type === "earnings" ? "$" : ""}{(nextBadge.type === "earnings" ? (user.metrics.earnings || 0) : user.metrics.views).toLocaleString()} / {nextBadge.threshold.toLocaleString()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-4 text-center text-sm text-orange-400 font-medium">
                                        All achievements unlocked! 🏆
                                    </div>
                                )}

                                {/* Recent Achievements */}
                                {user.achievements.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Badges</h4>
                                        <div className="grid grid-cols-4 gap-2">
                                            {user.achievements.map((ach) => (
                                                <div key={ach.id} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 border border-white/5">
                                                    <span className="text-lg">{ach.icon}</span>
                                                    <span className="text-[10px] text-gray-400 text-center leading-tight">{ach.name}</span>
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
        </div>
    );
}
