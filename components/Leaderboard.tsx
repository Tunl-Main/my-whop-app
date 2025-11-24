"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Instagram, Youtube, Twitter, Eye, Share2 } from "lucide-react";
import clsx from "clsx";
import TopClips from "./TopClips";
import RisingStars from "./RisingStars";

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);

const getPlatformIcon = (platform: string) => {
    switch (platform) {
        case 'instagram': return <Instagram className="w-3 h-3" />;
        case 'tiktok': return <TikTokIcon className="w-3 h-3" />;
        case 'youtube': return <Youtube className="w-3 h-3" />;
        case 'twitter': return <Twitter className="w-3 h-3" />;
        default: return null;
    }
};

interface LinkedAccount {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
    handle: string;
}

interface User {
    id: string;
    whopId: string;
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
    }).format(num).toLowerCase();
};

export default function Leaderboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<'week' | 'month' | 'all'>('week');
    const [view, setView] = useState<'creators' | 'clips'>('creators');

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setView('creators')}
                        className={clsx(
                            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                            view === 'creators' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Clippers
                    </button>
                    <button
                        onClick={() => setView('clips')}
                        className={clsx(
                            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                            view === 'clips' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
                        )}
                    >
                        Top Clips
                    </button>
                </div>

                <div className="flex gap-2">
                    {['week', 'month', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                                filter === f
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "bg-transparent border-transparent text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {f === 'all' ? 'All Time' : `This ${f.charAt(0).toUpperCase() + f.slice(1)}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {view === 'creators' ? (
                        <div className="space-y-4">
                            {users.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={clsx(
                                        "relative flex items-center p-4 rounded-2xl border transition-all hover:scale-[1.01] group",
                                        index < 3
                                            ? "bg-gradient-to-r from-white/10 to-white/5 border-white/20 shadow-xl"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                    )}
                                >
                                    {/* Rank */}
                                    <div className="absolute -left-2 -top-2 flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full text-white font-bold text-sm shadow-lg">
                                        {index + 1}
                                    </div>

                                    {/* Avatar */}
                                    <a
                                        href={`https://whop.com/u/${user.whopId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mr-4 flex-shrink-0 hover:border-orange-500 transition-colors cursor-pointer"
                                        title="View Whop Profile"
                                    >
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs bg-white/10">?</div>
                                        )}
                                    </a>

                                    {/* User Info */}
                                    <div className="flex-grow grid grid-cols-6 items-center">
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-white text-lg">
                                                    {user.linkedAccounts?.[0]?.handle.startsWith('@') ? user.linkedAccounts[0].handle : `@${user.linkedAccounts?.[0]?.handle || "Unknown"}`}
                                                </span>
                                                {/* Achievements */}
                                                {user.achievements?.map((ach, i) => (
                                                    <div key={i} className="flex items-center justify-center w-5 h-5 bg-white/10 rounded-full text-xs" title={ach.name}>
                                                        {ach.icon}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-2 mt-1">
                                                {user.linkedAccounts?.map((acc, i) => {
                                                    const getPlatformUrl = (platform: string, handle: string) => {
                                                        const cleanHandle = handle.replace(/^@/, '');
                                                        switch (platform) {
                                                            case 'instagram': return `https://instagram.com/${cleanHandle}`;
                                                            case 'tiktok': return `https://tiktok.com/@${cleanHandle}`;
                                                            case 'youtube': return `https://youtube.com/@${cleanHandle}`;
                                                            case 'twitter': return `https://twitter.com/${cleanHandle}`;
                                                            default: return '#';
                                                        }
                                                    };

                                                    return (
                                                        <a
                                                            key={i}
                                                            href={getPlatformUrl(acc.platform, acc.handle)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-md hover:bg-white/10 hover:text-orange-400 transition-colors"
                                                        >
                                                            {getPlatformIcon(acc.platform)}
                                                            <span>{acc.platform}</span>
                                                        </a>
                                                    );
                                                })}
                                                {/* Viral Clips Badge */}
                                                {(user.metrics.viral_clips || 0) > 0 && (
                                                    <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-md border border-orange-500/20">
                                                        <span className="font-bold">🔥 {user.metrics.viral_clips}</span>
                                                        <span className="hidden sm:inline">Viral</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex flex-col items-end justify-center pr-2">
                                            <span className="text-2xl font-bold text-white tracking-tight">{formatNumber(user.metrics.views)}</span>
                                            <div className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">
                                                <Eye className="w-3 h-3" />
                                                <span>Views</span>
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex flex-col items-end justify-center">
                                            <span className="text-xl font-bold text-gray-300 tracking-tight">{formatNumber(user.metrics.likes)}</span>
                                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Likes</span>
                                        </div>

                                        <div className="col-span-1 flex flex-col items-end justify-center">
                                            <span className="text-xl font-bold text-orange-400 tracking-tight">${formatNumber(user.metrics.earnings || 0)}</span>
                                            <span className="text-xs font-medium text-orange-500/50 uppercase tracking-wider">Earned</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <TopClips />
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <RisingStars />

                    {/* Mini Stats Widget */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-white/10">
                        <h3 className="text-white font-bold mb-2">Weekly Challenge</h3>
                        <p className="text-sm text-gray-300 mb-4">Get 10k views on a single clip to unlock the "Viral" badge.</p>
                        <div className="w-full bg-black/30 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full w-3/4" />
                        </div>
                        <p className="text-xs text-right text-gray-400 mt-1">75% Complete</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
