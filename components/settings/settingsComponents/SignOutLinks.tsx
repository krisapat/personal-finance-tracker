"use client"

import { SignOutButton } from "@clerk/nextjs"
import { toast } from "sonner"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const SignOutLinks = () => {
  const handleLogout = () => {
    toast("Logout", {
      description: "You have successfully logged out.",
    })
  }
  return (
    <SignOutButton redirectUrl="/">
      <Button
        className="w-full text-foreground border-primary! border-2" variant="outline"
        onClick={handleLogout}
      >
        Logout<LogOut />
      </Button>
    </SignOutButton>
  )
}
export default SignOutLinks
