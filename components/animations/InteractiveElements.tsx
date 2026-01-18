"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PulseButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "ghost";
}

export function PulseButton({
    children,
    className = "",
    onClick,
    disabled = false,
    type = "button",
    variant = "primary",
}: PulseButtonProps) {
    const variantClasses = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "bg-transparent hover:bg-accent",
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`relative px-4 py-2 rounded-lg font-medium transition-colors ${variantClasses[variant]} ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={false}
        >
            {/* Pulse ring on hover */}
            <motion.span
                className="absolute inset-0 rounded-lg bg-primary/20"
                initial={{ opacity: 0, scale: 1 }}
                whileHover={{
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.05, 1.1],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                }}
            />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}

interface FloatingActionButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export function FloatingActionButton({
    children,
    onClick,
    className = "",
}: FloatingActionButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center ${className}`}
            whileHover={{
                scale: 1.1,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
            }}
        >
            {children}
        </motion.button>
    );
}

interface GlowCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string;
}

export function GlowCard({
    children,
    className = "",
    glowColor = "var(--primary)",
}: GlowCardProps) {
    return (
        <motion.div
            className={`relative p-6 rounded-xl bg-card border border-border overflow-hidden ${className}`}
            whileHover="hover"
            initial="initial"
        >
            {/* Glow effect */}
            <motion.div
                className="absolute -inset-1 rounded-xl opacity-0 blur-xl"
                style={{ background: glowColor }}
                variants={{
                    initial: { opacity: 0 },
                    hover: { opacity: 0.15 },
                }}
                transition={{ duration: 0.3 }}
            />
            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

interface CountUpProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function CountUp({
    value,
    duration = 1,
    prefix = "",
    suffix = "",
    className = "",
}: CountUpProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {prefix}
            </motion.span>
            <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration,
                    type: "spring",
                    stiffness: 100,
                }}
            >
                {value.toLocaleString()}
            </motion.span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: duration }}
            >
                {suffix}
            </motion.span>
        </motion.span>
    );
}

interface ShimmerTextProps {
    children: ReactNode;
    className?: string;
}

export function ShimmerText({ children, className = "" }: ShimmerTextProps) {
    return (
        <motion.span
            className={`relative inline-block ${className}`}
            style={{
                background: "linear-gradient(90deg, var(--foreground) 0%, var(--primary) 50%, var(--foreground) 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
            }}
            animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {children}
        </motion.span>
    );
}
