"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <motion.div
            className={`bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md ${className}`}
            animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{
                backgroundSize: "200% 100%",
            }}
        />
    );
}

export function CardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-xl bg-card border border-border space-y-4"
        >
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </motion.div>
    );
}

export function TransactionSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border"
        >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-16" />
        </motion.div>
    );
}

export function CalendarSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-border space-y-4"
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                    >
                        <Skeleton className="aspect-square w-full rounded-lg" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export function PageLoadingSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
            >
                {/* Animated logo/icon */}
                <motion.div
                    className="relative w-20 h-20"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary/50 to-primary"
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute inset-2 rounded-full bg-background"
                    />
                    <motion.div
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-primary/50"
                        animate={{
                            scale: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    />
                </motion.div>

                {/* Loading text with typing effect */}
                <motion.div className="flex items-center gap-1">
                    <span className="text-lg font-medium text-muted-foreground">กำลังโหลด</span>
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="text-lg font-medium text-primary"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        >
                            .
                        </motion.span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
