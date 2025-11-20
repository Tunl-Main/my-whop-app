"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";

interface RisingStar {
    id: string;
    username: string;
    avatar: string;
    growthPercent: number;
    newFollowers: number;
}

export default function RisingStars() {
    const [stars, setStars] = useState<RisingStar[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-white/50 text-sm p-4">Loading stars...</div>;
    if (stars.length === 0) return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Rising Stars</h2>
            </div>
            <p className="text-gray-400 text-sm">Not enough data yet. Check back soon!</p>
        </div>
    );

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
