import Link from "next/link"
import Menu from "./nav_com/Menu"
import MenuMoblie from "./nav_com/MenuMoblie"

const Navbar = async () => {
  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden sm:flex fixed top-1 left-1 right-1 z-100 backdrop-blur-3xl bg-white/80 dark:bg-black/50
        rounded-xl overflow-hidden border-2 border-zinc-200/80 dark:border-white/20"
      >
        <div className="w-full flex items-center justify-between px-4 h-15">
            <Link href="/" className="text-primary font-extrabold text-xl md:text-2xl">
              สมุดบัญชีหนังสุนัข
            </Link>
            <Menu />
          </div>
      </div>

      {/* Moblie Menu */}
      <div className="sm:hidden fixed bottom-1 left-1 right-1 z-100 bg-white/80 dark:bg-black/50 
        rounded-xl overflow-hidden border-2 border-zinc-200/80 dark:border-white/20 backdrop-blur-3xl">
        <MenuMoblie />
      </div>
    </>
  )
}

export default Navbar
