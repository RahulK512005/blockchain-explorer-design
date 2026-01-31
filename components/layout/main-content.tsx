"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import type { ReactNode } from "react"

export function MainContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <main 
      className={cn(
        "min-h-[calc(100vh-64px)] flex-1 transition-all duration-300",
        collapsed ? "md:pl-16" : "md:pl-56",
        "max-md:pl-0"
      )}
    >
      {children}
    </main>
  )
}
