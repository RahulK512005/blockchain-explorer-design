"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Blocks, 
  ArrowRightLeft, 
  Users, 
  Zap,
  KeyRound,
  FileCode,
  Network,
  Wallet,
  Code2,
  ArrowRight,
  Activity,
  Globe,
  Layers,
  Search
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SHARDS, generateMockBlockNumber, generateMockTxHash, shortenHash } from "@/lib/quai-sdk"

// Network Stats
const networkStats = [
  { 
    label: "Total Blocks", 
    value: "5,847,293", 
    change: "+12,847", 
    icon: Blocks,
    color: "#00d4ff"
  },
  { 
    label: "Transactions", 
    value: "24.7M", 
    change: "+156K", 
    icon: ArrowRightLeft,
    color: "#00ff88"
  },
  { 
    label: "Active Addresses", 
    value: "892,451", 
    change: "+2,847", 
    icon: Users,
    color: "#ffd93d"
  },
  { 
    label: "TPS", 
    value: "1,247", 
    change: "+89", 
    icon: Zap,
    color: "#ff6b6b"
  },
]

// SDK Sections
const sdkSections = [
  {
    href: "/addresses",
    icon: KeyRound,
    title: "Addresses",
    description: "Validate Quai/Qi addresses, explore sharded address structure, and understand binary prefixes.",
    color: "#00d4ff",
  },
  {
    href: "/contracts",
    icon: FileCode,
    title: "Contracts",
    description: "Connect to smart contracts, call read-only methods, and execute state-changing transactions.",
    color: "#00ff88",
  },
  {
    href: "/providers",
    icon: Network,
    title: "Providers",
    description: "Connect via JsonRpc, WebSocket, or Browser providers. Query blockchain state and network info.",
    color: "#ffd93d",
  },
  {
    href: "/transactions",
    icon: ArrowRightLeft,
    title: "Transactions",
    description: "Build, sign, and send Quai and Qi transactions. Explore transaction types and formats.",
    color: "#ff6b6b",
  },
  {
    href: "/wallets",
    icon: Wallet,
    title: "Wallets",
    description: "Manage HD wallets, derive addresses by zone, and handle mnemonic phrases securely.",
    color: "#c084fc",
  },
  {
    href: "/examples",
    icon: Code2,
    title: "Examples",
    description: "Copy-paste code snippets and run live demos showcasing SDK functionality.",
    color: "#00d4ff",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recentBlocks, setRecentBlocks] = useState<{ number: number; hash: string; txCount: number; time: string }[]>([])
  const [recentTxs, setRecentTxs] = useState<{ hash: string; from: string; to: string; value: string; time: string }[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  useEffect(() => {
    // Generate mock recent blocks
    const blocks = Array(5).fill(0).map((_, i) => ({
      number: generateMockBlockNumber() - i,
      hash: generateMockTxHash(),
      txCount: Math.floor(Math.random() * 200) + 50,
      time: `${i * 3 + 1}s ago`,
    }))
    setRecentBlocks(blocks)

    // Generate mock recent transactions
    const txs = Array(5).fill(0).map((_, i) => ({
      hash: generateMockTxHash(),
      from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      value: (Math.random() * 10).toFixed(4),
      time: `${i * 2 + 1}s ago`,
    }))
    setRecentTxs(txs)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-red py-12 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur glow-cyan">
                <Layers className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Quai Vision SDK Explorer
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-white/80 sm:text-lg">
              Interactive demo for the Quais SDK. Explore addresses, contracts, providers, 
              transactions, and wallets with hands-on tools.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search by Address / Txn Hash / Block / Token"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 rounded-xl border-white/20 bg-white/10 pl-12 pr-28 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#ff3d3d] hover:bg-white/90"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Network Stats */}
        <div className="-mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {networkStats.map((stat) => (
            <Card key={stat.label} className="border-border bg-card hover:border-[#00d4ff]/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-xs text-[#00ff88]">{stat.change} (24h)</p>
                  </div>
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SDK Sections */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">SDK Documentation</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sdkSections.map((section) => (
              <Link key={section.href} href={section.href}>
                <Card className="group h-full border-border bg-card transition-all hover:border-[#00d4ff]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]">
                  <CardContent className="flex h-full flex-col p-6">
                    <div 
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${section.color}20` }}
                    >
                      <section.icon className="h-6 w-6" style={{ color: section.color }} />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{section.title}</h3>
                    <p className="flex-1 text-sm text-muted-foreground">{section.description}</p>
                    <div className="mt-4 flex items-center text-sm text-[#00d4ff]">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Network Shards */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#00d4ff]" />
              <CardTitle className="text-foreground">Network Shards</CardTitle>
            </div>
            <CardDescription>Quai Network operates across 9 shards in 3 regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((region) => (
                <div key={region} className="rounded-lg border border-border bg-muted/30 p-4">
                  <h4 className="mb-3 font-semibold text-foreground">
                    {region === 0 ? "Cyprus" : region === 1 ? "Paxos" : "Hydra"} Region
                  </h4>
                  <div className="space-y-2">
                    {SHARDS.filter(s => s.region === region).map((shard) => (
                      <div key={shard.name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{shard.name}</span>
                        <span className="font-mono text-[#00d4ff]">0x{shard.prefix}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Blocks */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Blocks className="h-5 w-5 text-[#00d4ff]" />
                <CardTitle className="text-foreground">Latest Blocks</CardTitle>
              </div>
              <Link href="/blocks">
                <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff]/80">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBlocks.map((block) => (
                  <div key={block.hash} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00d4ff]/10">
                        <Blocks className="h-5 w-5 text-[#00d4ff]" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-foreground">#{block.number.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{block.txCount} txns</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-muted-foreground">{shortenHash(block.hash)}</p>
                      <p className="text-xs text-muted-foreground">{block.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00ff88]" />
                <CardTitle className="text-foreground">Latest Transactions</CardTitle>
              </div>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff]/80">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTxs.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ff88]/10">
                        <ArrowRightLeft className="h-5 w-5 text-[#00ff88]" />
                      </div>
                      <div>
                        <p className="font-mono text-xs text-[#00d4ff]">{tx.from}</p>
                        <p className="font-mono text-xs text-muted-foreground">→ {tx.to}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{tx.value} QUAI</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
