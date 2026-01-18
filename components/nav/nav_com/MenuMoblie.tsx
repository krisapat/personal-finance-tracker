"use client"

import { menuLink } from "@/utils/links"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const MenuMobile = () => {
    const pathname = usePathname()

    return (
        <nav className="flex justify-between items-center px-2 py-1">
            {menuLink.map((item) => {
                const Icon = item.icon
                const isActive =
                    item.path === "/"
                        ? pathname === "/" || /^\/\d{2}-\d{2}-\d{4}/.test(pathname)
                        : pathname.startsWith(item.path)

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                            "flex flex-col items-center flex-1 py-1 transition-colors",
                            isActive
                                ? "text-primary font-semibold"
                                : "text-gray-700 dark:text-gray-200 hover:text-primary"
                        )}
                    >
                        <Icon size={22} />
                        <span className="text-[11px] mt-1">{item.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default MenuMobile
