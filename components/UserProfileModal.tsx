"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, MessageCircle, ExternalLink, Eye, Heart, Flame } from "lucide-react";

// App Store style platform icon for modal
const PlatformAppIcon = ({ platform, size = 24 }: { platform: string; size?: number }) => {
    const normalizedPlatform = platform === 'twitter' ? 'x' : platform;
    const baseStyle = {
        width: size,
        height: size,
        borderRadius: size * 0.22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden' as const,
    };

    return (
        <div style={baseStyle}>
            {normalizedPlatform === 'instagram' && (
                <div style={{ 
                    ...baseStyle, 
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.6} height={size * 0.6}>
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                </div>
            )}
            {normalizedPlatform === 'tiktok' && (
                <div style={{ ...baseStyle, background: '#000' }}>
                    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}>
                        <path fill="#25F4EE" d="M9.37 23.5v-11.2l.02-5.15h3.6c-.03.62.1 1.28.42 1.86.32.58.81 1.05 1.4 1.35v3.34a7.07 7.07 0 01-3.78-.95v7.27a4.51 4.51 0 01-1.13 3c-.74.85-1.76 1.39-2.87 1.5a4.56 4.56 0 01-3.15-.87 4.51 4.51 0 01-1.68-2.73 4.46 4.46 0 01.53-3.12 4.52 4.52 0 012.43-2.02 4.6 4.6 0 013.13-.14v3.54a1.52 1.52 0 00-1.27.26c-.34.26-.58.63-.67 1.05-.1.42-.04.86.16 1.24.2.39.54.7.94.87.41.17.86.19 1.28.06.42-.13.78-.41 1.03-.79.24-.38.37-.83.36-1.28l.01-7.28z"/>
                        <path fill="#FE2C55" d="M10.33 23.5v-11.2l.03-5.15h3.59a4.48 4.48 0 001.82 3.21v3.34a7.07 7.07 0 01-3.78-.95v7.27c0 .78-.2 1.55-.58 2.23a4.5 4.5 0 01-3.42 2.27 4.56 4.56 0 01-3.15-.87 4.47 4.47 0 002.73.47 4.52 4.52 0 002.87-1.5c.5-.57.85-1.26 1.02-2 .17-.75.17-1.53 0-2.28l-.13-.84z"/>
                        <path fill="white" d="M15.77 10.36V7.02a4.44 4.44 0 01-1.4-1.35 4.38 4.38 0 01-.42-1.86h-3.6l-.02 12.35v.04a1.52 1.52 0 01-.36 1.28c-.25.38-.61.66-1.03.79a1.53 1.53 0 01-1.28-.06 1.51 1.51 0 01-.94-.87 1.5 1.5 0 01-.16-1.24c.09-.42.33-.79.67-1.05a1.52 1.52 0 011.27-.26v-3.54a4.6 4.6 0 00-3.13.14 4.52 4.52 0 00-2.43 2.02 4.46 4.46 0 00-.53 3.12 4.51 4.51 0 001.68 2.73c.9.71 2.01 1.06 3.15.87a4.5 4.5 0 003.42-2.27c.38-.68.58-1.45.58-2.23v-7.27a7.07 7.07 0 003.78.95v-3.34l-.25-.05z"/>
                    </svg>
                </div>
            )}
            {normalizedPlatform === 'youtube' && (
                <div style={{ ...baseStyle, background: '#FF0000' }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.5} height={size * 0.5}>
                        <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </div>
            )}
            {normalizedPlatform === 'x' && (
                <div style={{ ...baseStyle, background: '#000' }}>
                    <svg viewBox="0 0 24 24" fill="white" width={size * 0.45} height={size * 0.45}>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </div>
            )}
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

