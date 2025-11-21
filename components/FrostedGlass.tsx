import clsx from "clsx";
import { ReactNode } from "react";

interface FrostedGlassProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "dark" | "premium";
}

export function FrostedGlass({ children, className, variant = "default" }: FrostedGlassProps) {
    const variants = {
        default: "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl",
        dark: "bg-black/40 backdrop-blur-md border border-white/5 shadow-xl",
        premium: "bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-orange-500/5"
    };

    return (
        <div
            className={clsx(
                variants[variant],
                className
            )}
        >
            {children}
        </div>
    );
}
