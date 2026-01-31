"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Blocks, 
  ArrowRightLeft, 
  Wallet, 
  Coins, 
  FileCode, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./sidebar-context"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/blocks", label: "Blocks", icon: Blocks },
  { href: "/transactions", label: "Transactions", icon: ArrowRightLeft },
  { href: "/addresses", label: "Addresses", icon: Wallet },
  { href: "/tokens", label: "Tokens", icon: Coins },
  { href: "/smart-contracts", label: "Contracts", icon: FileCode },
]

export function Sidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-20 z-50 h-10 w-10 rounded-lg border border-border bg-sidebar text-foreground shadow-lg md:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 top-16 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-64px)] border-r border-border bg-sidebar transition-all duration-300",
          // Desktop styles
          "max-md:translate-x-[-100%]",
          collapsed ? "w-16" : "w-56",
          // Mobile styles
          mobileOpen && "max-md:translate-x-0 max-md:w-64"
        )}
      >
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border border-border bg-sidebar text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <div className="flex h-full flex-col py-4">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#00d4ff]/20 to-transparent text-[#00d4ff]"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                  )}
                  
                  <item.icon 
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive 
                        ? "text-[#00d4ff] drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]" 
                        : "text-muted-foreground group-hover:text-foreground"
                    )} 
                  />
                  
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section - Network status */}
          <div className={cn(
            "border-t border-border px-3 pt-4",
            collapsed && "px-2"
          )}>
            <div className={cn(
              "flex items-center gap-2 rounded-lg bg-[#00ff88]/10 px-3 py-2",
              collapsed && "justify-center px-2"
            )}>
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
              {!collapsed && (
                <span className="text-xs font-medium text-[#00ff88]">
                  Network Active
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
