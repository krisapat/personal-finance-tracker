"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

export default function LoadingSpinner({
    size = "md",
    text = "กำลังโหลด...",
    className = "",
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-16 h-16",
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            {/* Animated spinner with gradient */}
            <div className="relative">
                <motion.div
                    className={`${sizeClasses[size]} rounded-full border-4 border-primary/20`}
                    style={{ borderTopColor: "var(--primary)" }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                {/* Inner pulse */}
                <motion.div
                    className="absolute inset-2 rounded-full bg-primary/30"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>
            {text && (
                <motion.p
                    className="text-sm text-muted-foreground"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}
