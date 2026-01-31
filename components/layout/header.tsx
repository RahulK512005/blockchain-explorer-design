import Link from "next/link"
import { Blocks, Wallet2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-gradient-red">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 backdrop-blur glow-cyan-sm">
            <Blocks className="h-5 w-5 text-[#00d4ff]" />
          </div>
          <span className="text-lg font-bold text-white">
            Quai Vision
          </span>
        </Link>

        {/* Right side - Wallet Button */}
        <div className="flex items-center gap-2">
          {/* Connect Wallet - Links to Wallets page */}
          <Link href="/wallets">
            <Button 
              className="gap-2 bg-[#00d4ff] text-background hover:bg-[#00d4ff]/90 glow-cyan-sm"
            >
              <Wallet2 className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
