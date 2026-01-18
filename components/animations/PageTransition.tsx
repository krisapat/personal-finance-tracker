"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export function SlideInFromRight({ children, className = "" }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ScaleIn({ children, className = "", delay = 0 }: PageTransitionProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = "" }: PageTransitionProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.4,
                        ease: "easeOut",
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
