"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  index: number
}

export default function AnimatedCard({ children, index }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  )
}
