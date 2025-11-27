"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, MessageCircle, ExternalLink, Eye, Heart, Flame } from "lucide-react";

// Platform icon image paths
const PLATFORM_ICONS: Record<string, string> = {
    instagram: '/app-icon-instagram.png',
    tiktok: '/app-icon-tiktok.png',
    youtube: '/app-icon-youtube.webp',
    x: '/app-icon-x.webp',
};

// App Store style platform icon using actual app images
const PlatformAppIcon = ({ platform, size = 24 }: { platform: string; size?: number }) => {
    const normalizedPlatform = platform === 'twitter' ? 'x' : platform;
    const iconSrc = PLATFORM_ICONS[normalizedPlatform];
    
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: size * 0.22,
            overflow: 'hidden',
        }}>
            <img 
                src={iconSrc} 
                alt={normalizedPlatform} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                }} 
            />
        </div>
    );
};

const getPlatformUrl = (platform: string, handle: string) => {
    const normalizedPlatform = platform === 'twitter' ? 'x' : platform;
    switch (normalizedPlatform) {
        case 'instagram': return `https://instagram.com/${handle}`;
        case 'tiktok': return `https://tiktok.com/@${handle}`;
        case 'youtube': return `https://youtube.com/@${handle}`;
        case 'x': return `https://x.com/${handle}`;
        default: return '#';
    }
};

interface LinkedAccount {
    platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
    handle: string;
}

interface UserProfile {
    id: string;
    whopId: string;
    username?: string;
    avatar?: string;
    linkedAccounts?: LinkedAccount[];
    metrics?: {
        views: number;
        likes: number;
        shares?: number;
        viral_clips?: number;
    };
    achievements?: { icon: string; name: string }[];
}

interface UserProfileModalProps {
    user: UserProfile | null;
    isOpen: boolean;
    onClose: () => void;
}

// Helper for compact number formatting
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(num);
};

export default function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
    if (!user) return null;

    const displayName = user.username || user.whopId || "Unknown User";
    const whopProfileUrl = `https://whop.com/@${user.username || user.whopId}`;

    const handleFollow = () => {
        // Open native Whop profile for follow functionality
        window.open(whopProfileUrl, '_blank', 'noopener,noreferrer');
    };

    const handleDM = () => {
        // Open native Whop profile for messaging
        window.open(whopProfileUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Header Background */}
                            <div className="relative h-32 bg-gradient-to-br from-orange-600/30 via-orange-500/20 to-transparent">
                                {/* Decorative elements */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                                </div>
                                
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Avatar & Name */}
                            <div className="relative px-6 pb-6">
                                {/* Avatar */}
                                <div className="relative -mt-16 mb-4">
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-900 ring-2 ring-orange-500/50 shadow-xl mx-auto">
                                        <img
                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                                            alt={displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name & Username */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">{displayName}</h2>
                                    <a
                                        href={whopProfileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                                    >
                                        @{displayName}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {/* Stats */}
                                {user.metrics && (
                                    <div className="flex justify-center gap-8 mb-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-white font-bold text-xl">
                                                <Eye className="w-4 h-4 text-blue-400" />
                                                {formatNumber(user.metrics.views)}
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase">Views</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-white font-bold text-xl">
                                                <Heart className="w-4 h-4 text-pink-400" />
                                                {formatNumber(user.metrics.likes)}
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase">Likes</p>
                                        </div>
                                        {(user.metrics.viral_clips || 0) > 0 && (
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-white font-bold text-xl">
                                                    <Flame className="w-4 h-4 text-orange-400" />
                                                    {user.metrics.viral_clips}
                                                </div>
                                                <p className="text-xs text-gray-500 uppercase">Viral</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Linked Accounts */}
                                {user.linkedAccounts && user.linkedAccounts.length > 0 && (
                                    <div className="flex justify-center flex-wrap gap-3 mb-6">
                                        {user.linkedAccounts.map((acc, i) => (
                                            <a
                                                key={i}
                                                href={getPlatformUrl(acc.platform, acc.handle.replace(/^@/, ''))}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                                            >
                                                <PlatformAppIcon platform={acc.platform} size={20} />
                                                <span className="text-sm text-gray-300">@{acc.handle.replace(/^@/, '')}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* Achievements */}
                                {user.achievements && user.achievements.length > 0 && (
                                    <div className="flex justify-center gap-2 mb-6">
                                        {user.achievements.slice(0, 5).map((ach, i) => (
                                            <div
                                                key={i}
                                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg"
                                                title={ach.name}
                                            >
                                                {ach.icon}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleFollow}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors shadow-lg shadow-orange-500/20"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        Follow
                                    </button>
                                    <button
                                        onClick={handleDM}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Message
                                    </button>
                                </div>

                                {/* Whop Profile Link */}
                                <a
                                    href={whopProfileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    View full profile on Whop
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

