"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Darkmode } from "../darkmode/darkmode"
import { SunMoon } from "lucide-react"

const DarkmodeSection = () => {
  return (
    <div className="group relative">
      <Card
        className="relative overflow-hidden backdrop-blur bg-background/70 dark:bg-gray-800/60 shadow-lg 
        transition-shadow duration-300 hover:shadow-2xl"
      >
        <div className="relative z-10 space-y-6">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="bg-[#00c950]/10 p-3 rounded-xl">
              <SunMoon className="text-primary" size={20} />
            </div>
            <div>
              <CardTitle>
                โหมดสว่าง / โหมดมืด
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                เปลี่ยนโหมดสว่าง / โหมดมืด
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="pl-2">
              <Darkmode />
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}

export default DarkmodeSection
