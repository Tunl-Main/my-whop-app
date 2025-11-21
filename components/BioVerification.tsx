"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Loader2, ExternalLink } from "lucide-react";
import { FrostedGlass } from "./FrostedGlass";

interface BioVerificationProps {
    isOpen: boolean;
    onClose: () => void;
    platform: "tiktok" | "youtube";
    onVerify: (handle: string, code: string) => Promise<void>;
}

export default function BioVerification({
    isOpen,
    onClose,
    platform,
    onVerify,
}: BioVerificationProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [handle, setHandle] = useState("");
    const [code, setCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const generateCode = () => {
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCode(`WHOP-${random}`);
        setStep(2);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        setError("");
        try {
            await onVerify(handle, code);
            onClose();
        } catch (err) {
            setError("Could not verify code. Please make sure it's in your bio and try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const platformName = platform === "tiktok" ? "TikTok" : "YouTube";
    const profileUrl =
        platform === "tiktok"
            ? `https://www.tiktok.com/@${handle.replace("@", "")}`
            : `https://www.youtube.com/${handle}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md z-10"
                    >
                        <FrostedGlass className="p-6 border border-white/10 rounded-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Verify {platformName}</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {step === 1 ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Enter your {platformName} handle
                                        </label>
                                        <input
                                            type="text"
                                            value={handle}
                                            onChange={(e) => setHandle(e.target.value)}
                                            placeholder={platform === "tiktok" ? "@username" : "@channel"}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                        />
                                    </div>
                                    <button
                                        onClick={generateCode}
                                        disabled={!handle}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm text-gray-400">1. Copy this code</span>
                                                <button
                                                    onClick={handleCopy}
                                                    className="text-orange-500 hover:text-orange-400 transition-colors"
                                                >
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <div className="font-mono text-xl font-bold text-white tracking-wider">
                                                {code}
                                            </div>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-400">
                                                    2. Add it to your bio
                                                </span>
                                                <a
                                                    href={profileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-400 transition-colors"
                                                >
                                                    Go to profile <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Navigate to your {platformName} profile settings and paste the code into your bio.
                                            </p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleVerify}
                                        disabled={isVerifying}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            "Verify Account"
                                        )}
                                    </button>
                                </div>
                            )}
                        </FrostedGlass>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
