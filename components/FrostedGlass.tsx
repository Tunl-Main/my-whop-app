import clsx from "clsx";
import { ReactNode } from "react";

interface FrostedGlassProps {
    children: ReactNode;
    className?: string;
}

export function FrostedGlass({ children, className }: FrostedGlassProps) {
    return (
        <div
            className={clsx(
                "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl",
                className
            )}
        >
            {children}
        </div>
    );
}
