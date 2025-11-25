"use client";

import { motion } from "framer-motion";

interface CrownLogoProps {
    className?: string;
    size?: number;
    showGlow?: boolean;
}

export default function CrownLogo({ className = "", size = 80, showGlow = true }: CrownLogoProps) {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            {/* Glow effect */}
            {showGlow && (
                <div 
                    className="absolute inset-0 blur-xl opacity-60"
                    style={{
                        background: "radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(249,115,22,0) 70%)"
                    }}
                />
            )}
            
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"
            >
                {/* Crown */}
                <defs>
                    <linearGradient id="crownGradient" x1="50" y1="5" x2="50" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#FFA500" />
                        <stop offset="100%" stopColor="#FF8C00" />
                    </linearGradient>
                    <linearGradient id="wGradient" x1="50" y1="35" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#FFE4C4" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Crown shape */}
                <path
                    d="M25 38 L35 15 L50 28 L65 15 L75 38 L70 40 L65 25 L50 35 L35 25 L30 40 Z"
                    fill="url(#crownGradient)"
                    filter="url(#glow)"
                />
                {/* Crown jewel */}
                <path
                    d="M50 20 L53 26 L50 24 L47 26 Z"
                    fill="#FF6B00"
                />
                {/* Crown base band */}
                <rect x="28" y="36" width="44" height="6" rx="2" fill="url(#crownGradient)" />
                
                {/* W shape */}
                <path
                    d="M15 50 
                       L30 85 
                       Q32 90 35 85
                       L50 55 
                       L65 85 
                       Q68 90 70 85
                       L85 50 
                       Q87 45 82 47
                       L70 78 
                       L55 50 
                       Q50 42 45 50
                       L30 78 
                       L18 47 
                       Q13 45 15 50 Z"
                    fill="url(#wGradient)"
                    filter="url(#glow)"
                    stroke="rgba(255,165,0,0.3)"
                    strokeWidth="0.5"
                />
            </svg>
        </div>
    );
}

