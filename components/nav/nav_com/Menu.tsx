"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { menuLink } from "@/utils/links"


const Menu = () => {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-4">
      {menuLink
        .map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/" || /^\/\d{2}-\d{2}-\d{4}/.test(pathname)
              : pathname.startsWith(item.path)

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative overflow-hidden px-3 py-1 rounded-md transition-colors duration-300",
                isActive
                  ? "text-primary font-semibold"
                  : "text-foreground",
                // before = bg layer
                "before:absolute before:inset-0 before:bg-primary",
                "before:origin-left before:scale-x-0 before:transition-transform before:duration-300",
                "hover:before:scale-x-100 hover:text-white"
              )}
            >
              <span className="relative z-10">{item.name}</span>
            </Link>

          )
        })}
    </nav>
  )
}

export default Menu
