"use client";

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
                    className="absolute inset-0 blur-xl opacity-60 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(249,115,22,0.5) 0%, rgba(249,115,22,0) 70%)"
                    }}
                />
            )}
            
            {/* Actual logo image */}
            <img 
                src="/crown-logo.png" 
                alt="Clipper Leaderboard Logo" 
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            />
        </div>
    );
}
