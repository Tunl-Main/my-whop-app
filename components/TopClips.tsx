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

interface TopClipsProps {
    timeRange?: 'week' | 'month' | 'all';
    platform?: 'all' | 'instagram' | 'tiktok' | 'youtube' | 'x';
}

export default function TopClips({ timeRange = 'week', platform = 'all' }: TopClipsProps) {
    const [clips, setClips] = useState<Clip[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingClipId, setPlayingClipId] = useState<string | null>(null);

    const getEmbedUrl = (url: string) => {
        try {
            if (url.includes('instagram.com')) {
                // Handle /p/, /reel/, /tv/ URLs
                const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#&]+)/);
                if (match && match[1]) {
                    return `https://www.instagram.com/p/${match[1]}/embed/captioned/`;
                }
            } else if (url.includes('tiktok.com')) {
                // Extract video ID for TikTok
                const match = url.match(/video\/(\d+)/);
                if (match && match[1]) {
                    return `https://www.tiktok.com/embed/v2/${match[1]}`;
                }
            }
        } catch (e) {
            console.error("Error parsing embed URL:", e);
        }
        return null;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'm';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    useEffect(() => {
        setLoading(true);
        const platformParam = platform !== 'all' ? `&platform=${platform === 'x' ? 'twitter' : platform}` : '';
        fetch(`/api/clips?range=${timeRange}${platformParam}`)
            .then(res => res.json())
            .then(data => {
                setClips(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching clips:", err);
                setLoading(false);
            });
    }, [timeRange, platform]);

    if (loading) {
        return <div className="text-center text-gray-500 py-12">Loading top clips...</div>;
    }

    if (clips.length === 0) {
        return <div className="text-center text-gray-500 py-12">No clips found yet. Connect your account to get started!</div>;
    }

    return (
        <div className="space-y-8">
            {/* Top 3 Grid - Smaller with Orange Glow */}
            <div className="flex justify-center gap-4 mb-8">
                {clips.slice(0, 3).map((clip, index) => {
                    const isPlaying = playingClipId === clip.id;
                    const embedUrl = getEmbedUrl(clip.url);

                    return (
                        <div
                            key={clip.id}
                            className="group relative w-36 sm:w-44 aspect-[9/16] rounded-xl overflow-hidden bg-black/40 border border-orange-500/60 transition-all hover:scale-[1.02] shadow-[0_0_25px_rgba(249,115,22,0.4),0_0_50px_rgba(249,115,22,0.2)]"
                        >
                            {isPlaying && embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    className="absolute inset-0 w-full h-full z-20"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    scrolling="no"
                                />
                            ) : (
                                <>
                                    {/* Rank Badge */}
                                    <div className="absolute top-2 left-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xs shadow-lg pointer-events-none">
                                        {index + 1}
                                    </div>

                                    {/* Thumbnail */}
                                    <img
                                        src={`https://images.weserv.nl/?url=${encodeURIComponent(clip.thumbnail)}&w=400&h=700&fit=cover`}
                                        alt="Clip thumbnail"
                                        referrerPolicy="no-referrer"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPlayingClipId(clip.id);
                                        }}
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                                    {/* Play Button Overlay */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPlayingClipId(clip.id);
                                        }}
                                    >
                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 backdrop-blur-sm">
                                            <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <img src={clip.creator.avatar} className="w-5 h-5 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                                            <span className="text-xs font-medium text-white truncate">@{clip.creator.username.replace(/^@/, '')}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] font-medium text-white/90">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3 text-orange-400" />
                                                {formatNumber(clip.views)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3 h-3 text-pink-500" />
                                                {formatNumber(clip.likes)}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* External Link (Always visible) */}
                            <a
                                href={clip.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-2 right-2 z-30 p-1.5 bg-black/70 hover:bg-black/90 rounded-full text-white hover:text-orange-400 transition-colors shadow-lg"
                                title="View original"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        </div>
                    );
                })}
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
                    {clips.slice(3).map((clip, index) => {
                        const isPlaying = playingClipId === clip.id;
                        const embedUrl = getEmbedUrl(clip.url);

                        return (
                            <div
                                key={clip.id}
                                className="group block relative overflow-hidden hover:bg-white/5 transition-colors"
                            >
                                <div className="grid grid-cols-12 gap-4 p-4 items-center relative z-10">
                                    <div className="col-span-1 text-center font-bold text-gray-500 group-hover:text-white transition-colors">
                                        {index + 4}
                                    </div>
                                    <div className="col-span-7 flex items-center gap-3">
                                        {/* Small Thumbnail (always visible) */}
                                        <img
                                            src={`https://images.weserv.nl/?url=${encodeURIComponent(clip.thumbnail)}&w=100&h=100&fit=cover`}
                                            className="w-8 h-8 rounded-md object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                                            referrerPolicy="no-referrer"
                                        />

                                        <div className="flex flex-col">
                                            <a href={clip.url} target="_blank" rel="noopener noreferrer" className="text-white font-medium text-sm truncate group-hover:text-orange-400 transition-colors hover:underline">
                                                Clip #{clip.id.slice(0, 8)}...
                                            </a>
                                            <span className="text-xs text-gray-400">@{clip.creator.username.replace(/^@/, '')}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right text-gray-300 font-mono group-hover:text-white">
                                        {formatNumber(clip.views)}
                                    </div>
                                    <div className="col-span-2 text-right text-gray-300 font-mono group-hover:text-white">
                                        {formatNumber(clip.likes)}
                                    </div>
                                </div>

                                {/* Expanded Preview on Hover / Play */}
                                <div className={`transition-all duration-300 ease-out overflow-hidden bg-black/50 ${isPlaying ? 'h-[500px]' : 'h-0 group-hover:h-48'}`}>
                                    <div className="h-full w-full flex items-center justify-center relative">
                                        {isPlaying && embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                className="w-full h-full max-w-[300px]"
                                                frameBorder="0"
                                                allowFullScreen
                                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    src={`https://images.weserv.nl/?url=${encodeURIComponent(clip.thumbnail)}&w=400&h=700&fit=cover`}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
                                                    referrerPolicy="no-referrer"
                                                />
                                                <img
                                                    src={`https://images.weserv.nl/?url=${encodeURIComponent(clip.thumbnail)}&w=400&h=700&fit=contain`}
                                                    className="relative h-full object-contain z-10 shadow-xl cursor-pointer"
                                                    referrerPolicy="no-referrer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlayingClipId(clip.id);
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlayingClipId(clip.id);
                                                    }}
                                                >
                                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                        <Play className="w-5 h-5 text-white fill-current ml-1" />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
