"use client";

import { motion } from "framer-motion";
import { Play, Heart, Eye } from "lucide-react";

interface Clip {
    id: string;
    thumbnail: string;
    views: number;
    likes: number;
    url: string;
    creator: {
        username: string;
        avatar: string;
    };
}

import { useState, useEffect } from "react";

export default function TopClips() {
    const [clips, setClips] = useState<Clip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/clips')
            .then(res => res.json())
            .then(data => {
                setClips(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching clips:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500 py-12">Loading top clips...</div>;
    }

    if (clips.length === 0) {
        return <div className="text-center text-gray-500 py-12">No clips found yet. Connect your account to get started!</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Top Clips
                    <span className="ml-2 text-sm font-normal text-gray-400 bg-white/10 px-2 py-1 rounded-full">All Time</span>
                </h2>
            </div>

            {/* Top 3 Grid - Compact */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {clips.slice(0, 3).map((clip, index) => (
                    <motion.a
                        key={clip.id}
                        href={clip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-black/40 border border-white/10 hover:border-orange-500/50 transition-all hover:scale-[1.02] shadow-2xl"
                    >
                        {/* Rank Badge */}
                        <div className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xs shadow-lg">
                            {index + 1}
                        </div>

                        {/* Thumbnail */}
                        <img
                            src={clip.thumbnail}
                            alt="Clip thumbnail"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 backdrop-blur-sm">
                                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                            </div>
                        </div>

                        {/* Content Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                                <img src={clip.creator.avatar} className="w-5 h-5 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                                <span className="text-xs font-medium text-white truncate">@{clip.creator.username}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-medium text-white/90">
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-orange-400" />
                                    {(clip.views / 1000).toFixed(1)}k
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-pink-500" />
                                    {(clip.likes / 1000).toFixed(1)}k
                                </div>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>

            {/* Leaderboard List for Rest - Interactive */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-7">Clip</div>
                    <div className="col-span-2 text-right">Views</div>
                    <div className="col-span-2 text-right">Likes</div>
                </div>
                <div className="divide-y divide-white/5">
                    {clips.slice(3).length === 0 && (
                        <div className="p-8 text-center text-gray-500">More clips coming soon...</div>
                    )}
                    {clips.slice(3).map((clip, index) => (
                        <motion.a
                            key={clip.id}
                            href={clip.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block relative overflow-hidden hover:bg-white/5 transition-colors"
                            initial={false}
                        >
                            <div className="grid grid-cols-12 gap-4 p-4 items-center relative z-10">
                                <div className="col-span-1 text-center font-bold text-gray-500 group-hover:text-white transition-colors">
                                    {index + 4}
                                </div>
                                <div className="col-span-7 flex items-center gap-3">
                                    {/* Small Thumbnail (always visible) */}
                                    <img src={clip.thumbnail} className="w-8 h-8 rounded-md object-cover opacity-50 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />

                                    <div className="flex flex-col">
                                        <span className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors">
                                            Clip #{clip.id.slice(0, 8)}...
                                        </span>
                                        <span className="text-xs text-gray-400">@{clip.creator.username}</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-right text-gray-300 font-mono group-hover:text-white">
                                    {(clip.views / 1000).toFixed(1)}k
                                </div>
                                <div className="col-span-2 text-right text-gray-300 font-mono group-hover:text-white">
                                    {(clip.likes / 1000).toFixed(1)}k
                                </div>
                            </div>

                            {/* Expanded Preview on Hover */}
                            <div className="h-0 group-hover:h-48 transition-all duration-300 ease-out overflow-hidden bg-black/50">
                                <div className="h-full w-full flex items-center justify-center relative">
                                    <img src={clip.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" referrerPolicy="no-referrer" />
                                    <img src={clip.thumbnail} className="relative h-full object-contain z-10 shadow-xl" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="w-5 h-5 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </div>
    );
}
