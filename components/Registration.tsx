"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Loader2, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@whop/react/components";
import clsx from "clsx";
import BioVerification from "./BioVerification";

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);

const PLATFORMS = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: 'text-white' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
    // { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' }, // Twitter not supported yet
] as const;

export default function Registration({
    userId: propUserId,
    username: propUsername,
    avatar: propAvatar
}: {
    userId?: string;
    username?: string;
    avatar?: string;
} = {}) {
    const [selectedPlatform, setSelectedPlatform] = useState<typeof PLATFORMS[number]['id']>('instagram');
    const [otp, setOtp] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLinked, setIsLinked] = useState(false);
    const [showBioVerification, setShowBioVerification] = useState(false);

    const handleConnect = async () => {
        if (selectedPlatform === 'tiktok' || selectedPlatform === 'youtube') {
            setShowBioVerification(true);
        } else {
            // Instagram Flow (OTP)
            await handleRegister();
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const userId = propUserId || "user_" + Math.floor(Math.random() * 10000);
            const username = propUsername || "Demo User";
            const avatar = propAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    username,
                    avatar,
                    platform: selectedPlatform
                }),
            });
            const data = await res.json();
            setOtp(data.otp);

            // Poll for completion or listen to webhook? 
            // For now we just simulate or wait for user to do it.
            // In a real app, we'd poll an endpoint to check if linked.
            setTimeout(() => {
                // setIsLinked(true); // Don't auto-link for IG, wait for webhook
                // setOtp(null);
            }, 10000);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBioVerify = async (handle: string) => {
        const userId = propUserId || "user_" + Math.floor(Math.random() * 10000);
        const code = "WHOP-CODE"; // This should be passed from the modal, but for now the modal generates it.
        // Actually, the modal generates the code. We need to pass the code to the API?
        // The API expects 'code' to check against bio.
        // The modal generates the code internally. We should probably move code generation up or let the modal handle the API call?
        // The modal prop `onVerify` takes `handle`.
        // Let's update the modal to pass the code back or handle the API call internally?
        // No, `onVerify` is async.
        // The modal generates the code. The modal should probably pass the code to `onVerify` or `onVerify` should just take the handle and the modal sends the code it generated?
        // Ah, the modal generates the code, so the modal knows it.
        // But `onVerify` is defined here.
        // I should update `BioVerification` to pass `code` to `onVerify`.

        // Let's assume I'll update BioVerification to pass code.
        // For now, I'll just make the API call inside the modal? No, better here.
        // I will update BioVerification to pass code.
    };

    const copyToClipboard = () => {
        if (otp) {
            navigator.clipboard.writeText(otp);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Join the Leaderboard</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Sync your accounts to compete.
                </p>

                {/* Platform Selector */}
                {!otp && !isLinked && (
                    <div className="flex justify-center gap-3 mb-6">
                        {PLATFORMS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPlatform(p.id)}
                                className={clsx(
                                    "p-3 rounded-xl border transition-all",
                                    selectedPlatform === p.id
                                        ? "bg-white/10 border-white/30 scale-110"
                                        : "bg-transparent border-transparent hover:bg-white/5 opacity-50 hover:opacity-100"
                                )}
                                title={p.name}
                            >
                                <p.icon className={clsx("w-6 h-6", p.color)} />
                            </button>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isLinked ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center py-4"
                        >
                            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Account Linked!</h3>
                            <p className="text-gray-400 text-sm mt-1">You are now on the leaderboard.</p>
                        </motion.div>
                    ) : !otp ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Button
                                onClick={handleConnect}
                                disabled={loading}
                                size="4"
                                className="w-full font-semibold capitalize bg-orange-500 hover:bg-orange-600 text-white border-none"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                                    </span>
                                ) : (
                                    `Connect ${selectedPlatform}`
                                )}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">One-Time Password</p>
                                <div
                                    className="flex items-center justify-between bg-black/40 rounded-lg p-3 cursor-pointer hover:bg-black/50 transition-colors group"
                                    onClick={copyToClipboard}
                                >
                                    <code className="text-2xl font-mono font-bold text-white tracking-widest">
                                        {otp}
                                    </code>
                                    <div className="p-2 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
                                        {copied ? <Check className="w-4 h-4 text-orange-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                                    </div>
                                </div>
                            </div>

                            <div className="text-left text-sm text-gray-400 space-y-2 bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                                <p className="font-medium text-orange-400">Instructions:</p>
                                <ol className="list-decimal list-inside space-y-1 ml-1">
                                    <li>Copy the code above</li>
                                    <li>Click the button below to open Instagram</li>
                                    <li>Paste the code in the DM</li>
                                </ol>

                                <a
                                    href="https://ig.me/m/findgpt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-3"
                                >
                                    <Button
                                        variant="ghost"
                                        size="3"
                                        className="w-full border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                                    >
                                        <Instagram className="w-4 h-4 mr-2" />
                                        Click here to paste code
                                    </Button>
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bio Verification Modal */}
            {showBioVerification && (selectedPlatform === 'tiktok' || selectedPlatform === 'youtube') && (
                <BioVerification
                    isOpen={showBioVerification}
                    onClose={() => setShowBioVerification(false)}
                    platform={selectedPlatform}
                    onVerify={async (handle: string, code: string) => {
                        const userId = propUserId || "user_" + Math.floor(Math.random() * 10000);
                        const res = await fetch("/api/verify-bio", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId,
                                platform: selectedPlatform,
                                handle,
                                code
                            }),
                        });
                        const data = await res.json();
                        if (data.error) throw new Error(data.error);
                        setIsLinked(true);
                    }}
                />
            )}
        </div>
    );
}
