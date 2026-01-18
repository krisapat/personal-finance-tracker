'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function Darkmode() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {theme === 'dark' ? 'โหมดมืด' : 'โหมดสว่าง'}
        </p>
        <p className="text-xs text-muted-foreground/70">
          กดปุ่มเพื่อเปลี่ยนโหมด
        </p>
      </div>

      <Button
        onClick={toggleTheme}
        size="icon"
        className="
          relative w-14 h-8 rounded-full 
          bg-linear-to-r from-[#00c950] to-[#00aaff]
          transition-all duration-300
          hover:from-[#00aaff] hover:to-[#00c950]
          shadow-md hover:shadow-lg
          border border-white/20 overflow-hidden
        "
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1 flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-1 flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-yellow-300" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ตัวกลมสไลด์ */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            absolute w-6 h-6 rounded-full bg-white shadow-md
            ${theme === "dark" ? "right-1" : "left-1"}
          `}
        />
      </Button>
    </div>
  )
}
