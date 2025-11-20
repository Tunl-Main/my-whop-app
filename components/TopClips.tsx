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

// Mock data for now
const MOCK_CLIPS: Clip[] = [
    {
        id: "1",
        thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
        views: 125000,
        likes: 12000,
        url: "#",
        creator: { username: "alex_clips", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" }
    },
    {
        id: "2",
        thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80",
        views: 98000,
        likes: 8500,
        url: "#",
        creator: { username: "sarah_vids", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" }
    },
    {
        id: "3",
        thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
        views: 45000,
        likes: 3200,
        url: "#",
        creator: { username: "mike_drops", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike" }
    }
];

export default function TopClips() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Top Clips
                    <span className="ml-2 text-sm font-normal text-gray-400 bg-white/10 px-2 py-1 rounded-full">This Week</span>
                </h2>
            </div>

            {/* Top 3 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {MOCK_CLIPS.slice(0, 3).map((clip, index) => (
                    <motion.a
                        key={clip.id}
                        href={clip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black/40 border border-white/10 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
                    >
                        {/* Rank Badge */}
                        <div className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold shadow-lg">
                            {index + 1}
                        </div>

                        {/* Thumbnail */}
                        <img
                            src={clip.thumbnail}
                            alt="Clip thumbnail"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Play className="w-5 h-5 text-white fill-current ml-1" />
                            </div>
                        </div>

                        {/* Content Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <img src={clip.creator.avatar} className="w-6 h-6 rounded-full border border-white/20" />
                                <span className="text-sm font-medium text-white shadow-black drop-shadow-md">@{clip.creator.username}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium text-white/90">
                                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                                    <Eye className="w-3 h-3 text-orange-400" />
                                    {(clip.views / 1000).toFixed(1)}k
                                </div>
                                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                                    <Heart className="w-3 h-3 text-pink-500" />
                                    {(clip.likes / 1000).toFixed(1)}k
                                </div>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>

            {/* Leaderboard List for Rest */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-7">Clip</div>
                    <div className="col-span-2 text-right">Views</div>
                    <div className="col-span-2 text-right">Likes</div>
                </div>
                <div className="divide-y divide-white/5">
                    {MOCK_CLIPS.slice(3).length === 0 && (
                        <div className="p-8 text-center text-gray-500">More clips coming soon...</div>
                    )}
                    {MOCK_CLIPS.slice(3).map((clip, index) => (
                        <div key={clip.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                            <div className="col-span-1 text-center font-bold text-gray-500">
                                {index + 4}
                            </div>
                            <div className="col-span-7 flex items-center gap-3">
                                <img src={clip.thumbnail} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex flex-col">
                                    <span className="text-white font-medium text-sm truncate">Amazing Clip Title #{clip.id}</span>
                                    <span className="text-xs text-gray-400">@{clip.creator.username}</span>
                                </div>
                            </div>
                            <div className="col-span-2 text-right text-gray-300 font-mono">
                                {(clip.views / 1000).toFixed(1)}k
                            </div>
                            <div className="col-span-2 text-right text-gray-300 font-mono">
                                {(clip.likes / 1000).toFixed(1)}k
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
