"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, Heart } from "lucide-react";
import clsx from "clsx";

interface RisingStar {
    id: string;
    username: string;
    avatar: string;
    growthPercent: number;
    newFollowers: number;
    views?: number;
    likes?: number;
}

interface RisingStarsProps {
    variant?: 'sidebar' | 'full';
}

export default function RisingStars({ variant = 'sidebar' }: RisingStarsProps) {
    const [stars, setStars] = useState<RisingStar[]>([]);
    const [loading, setLoading] = useState(true);

    const isFull = variant === 'full';

    useEffect(() => {
        fetch('/api/rising-stars')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setStars(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch rising stars:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={clsx(
                "text-gray-500 text-center",
                isFull ? "py-12" : "p-4 text-sm"
            )}>
                Loading rising stars...
            </div>
        );
    }

    if (stars.length === 0) {
        return (
            <div className={clsx(
                isFull ? "" : "bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
            )}>
                {!isFull && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Rising Stars</h2>
                    </div>
                )}
                <p className={clsx(
                    "text-gray-400",
                    isFull ? "text-center py-12" : "text-sm"
                )}>
                    Not enough data yet. Check back soon!
                </p>
            </div>
        );
    }

    // Full-width tab view (gaming leaderboard style)
    if (isFull) {
        return (
            <div className="space-y-3">
                {stars.map((star, index) => (
                    <motion.div
                        key={star.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={clsx(
                            "relative flex items-center p-4 rounded-xl border bg-gradient-to-r transition-all hover:scale-[1.005] group",
                            index < 3
                                ? "from-green-500/10 to-transparent border-green-500/40 shadow-[0_0_25px_rgba(34,197,94,0.3)]"
                                : "from-transparent to-transparent border-gray-800/50 hover:border-gray-700"
                        )}
                    >
                        {/* Rank Number */}
                        <div className={clsx(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0",
                            index < 3
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-white/5 text-gray-500 border border-white/5"
                        )}>
                            {index + 1}
                        </div>

                        {/* Avatar */}
                        <div className={clsx(
                            "w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 transition-all",
                            index < 3
                                ? "ring-2 ring-green-500/50 ring-offset-1 ring-offset-black"
                                : "border border-gray-700"
                        )}>
                            <img
                                src={star.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${star.username}`}
                                alt={star.username}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-lg truncate">
                                    @{star.username}
                                </span>
                                <TrendingUp className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    +{star.newFollowers.toLocaleString()} new followers
                                </div>
                            </div>
                        </div>

                        {/* Growth Stats */}
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="font-black text-green-400 text-2xl md:text-3xl tabular-nums tracking-tight">
                                    +{star.growthPercent}%
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Growth</p>
                            </div>
                            {star.views && (
                                <div className="text-right">
                                    <p className="font-bold text-white text-xl tabular-nums">
                                        {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(star.views)}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Views</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // Sidebar view (compact)
    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Rising Stars</h2>
            </div>

            <div className="space-y-4">
                {stars.map((star, index) => (
                    <motion.div
                        key={star.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <img src={star.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${star.username}`} className="w-10 h-10 rounded-full border border-white/10" />
                            <div>
                                <p className="font-medium text-white text-sm">@{star.username}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Users className="w-3 h-3" />
                                    +{star.newFollowers.toLocaleString()} new
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-green-400 font-bold text-sm flex items-center justify-end gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {star.growthPercent}%
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Growth</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
