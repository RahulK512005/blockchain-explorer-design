"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import { Search, Blocks, Wallet2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const networks = [
  { id: "quai", name: "Quai Ledger", color: "#00d4ff" },
  { id: "qi", name: "Qi Ledger", color: "#00ff88" },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const connectWallet = (walletType: string) => {
    // Simulated wallet connection
    const mockAddress = "0x" + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
    setWalletAddress(mockAddress)
    setWalletConnected(true)
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress("")
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

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

        {/* Center - Search Bar */}
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <form onSubmit={handleSearch} className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                type="text"
                placeholder="Search by Address / Txn Hash / Block / Token"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-white/20 bg-white/10 pl-10 pr-4 text-white placeholder:text-white/50 focus:border-[#00d4ff]/50 focus:ring-[#00d4ff]/20"
              />
            </div>
          </form>
        </div>

        {/* Right side - Network Selector & Wallet Button */}
        <div className="flex items-center gap-2">
          {/* Network Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="hidden gap-2 border border-white/20 bg-white/5 text-white hover:bg-white/10 sm:flex"
              >
                <div 
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selectedNetwork.color }}
                />
                {selectedNetwork.name}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border bg-card">
              {networks.map((network) => (
                <DropdownMenuItem
                  key={network.id}
                  onClick={() => setSelectedNetwork(network)}
                  className="cursor-pointer gap-2"
                >
                  <div 
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: network.color }}
                  />
                  {network.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 md:hidden"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Wallet Connection */}
          {walletConnected ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff]/20 hover:text-[#00d4ff]"
                >
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[#00ff88]" />
                  <span className="hidden sm:inline">{formatAddress(walletAddress)}</span>
                  <Wallet2 className="h-4 w-4 sm:hidden" />
                </Button>
              </DialogTrigger>
              <DialogContent className="border-border bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Wallet Connected</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Your wallet is connected to Quai Vision
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="mt-1 break-all font-mono text-sm text-[#00d4ff]">
                      {walletAddress}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="gap-2 bg-[#00d4ff] text-background hover:bg-[#00d4ff]/90 glow-cyan-sm"
                >
                  <Wallet2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="border-border bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Connect Wallet</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Choose a wallet to connect to Quai Vision
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                  <WalletOption 
                    name="Quai Wallet"
                    description="Official Quai Network wallet"
                    icon="Q"
                    color="#00d4ff"
                    onClick={() => connectWallet("quai")}
                  />
                  <WalletOption 
                    name="Qi HD Wallet"
                    description="Hierarchical Deterministic wallet for Qi"
                    icon="Qi"
                    color="#00ff88"
                    onClick={() => connectWallet("qi")}
                  />
                  <WalletOption 
                    name="MetaMask"
                    description="Popular browser extension wallet"
                    icon="M"
                    color="#f6851b"
                    onClick={() => connectWallet("metamask")}
                  />
                  <WalletOption 
                    name="WalletConnect"
                    description="Connect via QR code"
                    icon="W"
                    color="#3b99fc"
                    onClick={() => connectWallet("walletconnect")}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      <div
        className={cn(
          "border-t border-white/10 bg-gradient-red px-4 py-3 md:hidden",
          mobileSearchOpen ? "block" : "hidden"
        )}
      >
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50"
            />
          </div>
        </form>
      </div>
    </header>
  )
}

function WalletOption({ 
  name, 
  description, 
  icon, 
  color, 
  onClick 
}: { 
  name: string
  description: string
  icon: string
  color: string
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4 text-left transition-all hover:border-[#00d4ff]/50 hover:bg-muted/50"
    >
      <div 
        className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
