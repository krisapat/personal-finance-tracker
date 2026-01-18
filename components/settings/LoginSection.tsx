"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import SignOutLinks from "./settingsComponents/SignOutLinks"

const LoginSection = () => {
  return (
    <div className="group relative">
      <Card
        className="relative overflow-hidden backdrop-blur bg-white/70 dark:bg-gray-800/60 shadow-lg 
        transition-shadow duration-300 hover:shadow-2xl"
      >
        <div className="relative z-10 space-y-6">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="bg-[#00c950]/10 p-3 rounded-xl">
              <LogIn className="text-primary" size={20} />
            </div>
            <div>
              <CardTitle>ยืนยันตัวตน</CardTitle>
              <p className="text-sm text-muted-foreground">
                ล็อกอินหรือสร้างบัญชี
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary text-white font-medium
                    shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97]"
                  >
                    ล็อกอิน
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button
                    variant="outline"
                    className="flex-1 border border-[#00c950]/40 hover:border-[#00c950] 
                    transition-colors duration-300"
                  >
                    สร้างบัญชี
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  คุณล็อกอินแล้ว
                </p>
                <SignOutLinks />
              </div>
            </SignedIn>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default LoginSection
