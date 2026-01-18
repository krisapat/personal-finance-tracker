import { Home, TextAlignJustify, ChartNoAxesCombined  } from "lucide-react"
type NavLink = {
  name: string
  path: string
  icon: React.ComponentType<{ size?: number }>
}

export const menuLink: NavLink[] = [
  { path: "/", name: "หน้าหลัก", icon: Home },
  { path: "/overview", name: "ภาพรวม", icon: ChartNoAxesCombined  },
  { path: "/more", name: "เพิ่มเติม", icon: TextAlignJustify },
]