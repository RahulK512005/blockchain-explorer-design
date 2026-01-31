"use client"

import React from "react"

import { useState } from "react"
import { Search, Blocks, ArrowRightLeft, Wallet, Activity, Clock, Fuel } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { DataTable, TruncatedLink, StatusBadge, LiveIndicator } from "@/components/data-table"
import Link from "next/link"

// Mock data for demonstration
const mockBlocks = [
  { id: 1, number: 18234567, hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", transactions: 142, timestamp: "12 secs ago", validator: "0xValidator1..." },
  { id: 2, number: 18234566, hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234", transactions: 98, timestamp: "24 secs ago", validator: "0xValidator2..." },
  { id: 3, number: 18234565, hash: "0x3c4d5e6f7890abcdef1234567890abcdef123456", transactions: 156, timestamp: "36 secs ago", validator: "0xValidator3..." },
  { id: 4, number: 18234564, hash: "0x4d5e6f7890abcdef1234567890abcdef12345678", transactions: 87, timestamp: "48 secs ago", validator: "0xValidator4..." },
  { id: 5, number: 18234563, hash: "0x5e6f7890abcdef1234567890abcdef1234567890", transactions: 201, timestamp: "60 secs ago", validator: "0xValidator5..." },
]

const mockTransactions = [
  { id: 1, hash: "0xabc123def456789...890abc", from: "0x1234...5678", to: "0xabcd...ef01", value: "1.5 QUAI", status: "success" as const, timestamp: "5 secs ago" },
  { id: 2, hash: "0xdef456789abc123...123def", from: "0x5678...9012", to: "0xef01...2345", value: "0.8 QUAI", status: "success" as const, timestamp: "15 secs ago" },
  { id: 3, hash: "0x789abc123def456...456789", from: "0x9012...3456", to: "0x2345...6789", value: "25.0 QUAI", status: "pending" as const, timestamp: "25 secs ago" },
  { id: 4, hash: "0xabc789def123456...789abc", from: "0x3456...7890", to: "0x6789...0123", value: "0.05 QUAI", status: "success" as const, timestamp: "35 secs ago" },
  { id: 5, hash: "0xdef123abc789456...123def", from: "0x7890...1234", to: "0x0123...4567", value: "10.0 QUAI", status: "failed" as const, timestamp: "45 secs ago" },
]

const blockColumns = [
  {
    key: "number",
    header: "Block",
    render: (block: typeof mockBlocks[0]) => (
      <Link href={`/blocks/${block.number}`} className="font-mono text-primary hover:underline">
        #{block.number.toLocaleString()}
      </Link>
    ),
  },
  {
    key: "timestamp",
    header: "Age",
    render: (block: typeof mockBlocks[0]) => (
      <span className="text-muted-foreground">{block.timestamp}</span>
    ),
  },
  {
    key: "transactions",
    header: "Txns",
    render: (block: typeof mockBlocks[0]) => (
      <span className="font-medium">{block.transactions}</span>
    ),
  },
  {
    key: "validator",
    header: "Validator",
    render: (block: typeof mockBlocks[0]) => (
      <TruncatedLink href={`/addresses/${block.validator}`} value={block.validator} maxLength={12} />
    ),
    className: "hidden sm:table-cell",
  },
]

const transactionColumns = [
  {
    key: "hash",
    header: "Tx Hash",
    render: (tx: typeof mockTransactions[0]) => (
      <TruncatedLink href={`/transactions/${tx.hash}`} value={tx.hash} maxLength={16} />
    ),
  },
  {
    key: "from",
    header: "From",
    render: (tx: typeof mockTransactions[0]) => (
      <TruncatedLink href={`/addresses/${tx.from}`} value={tx.from} maxLength={10} />
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "to",
    header: "To",
    render: (tx: typeof mockTransactions[0]) => (
      <TruncatedLink href={`/addresses/${tx.to}`} value={tx.to} maxLength={10} />
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "value",
    header: "Value",
    render: (tx: typeof mockTransactions[0]) => (
      <span className="font-medium text-foreground">{tx.value}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (tx: typeof mockTransactions[0]) => <StatusBadge status={tx.status} />,
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-red py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h1 className="text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Quai Network Explorer
            </h1>
            <p className="mt-3 text-pretty text-white/80 sm:text-lg">
              Explore blocks, transactions, addresses, and smart contracts on the Quai network
            </p>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl">
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
      </section>

      {/* Stats Section */}
      <section className="mx-auto -mt-8 max-w-7xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Transactions"
            value="2.5B"
            icon={ArrowRightLeft}
            change="+12.5% (24h)"
            changeType="positive"
          />
          <StatCard
            title="Total Blocks"
            value="18,234,567"
            icon={Blocks}
            change="+1,247 (24h)"
            changeType="positive"
          />
          <StatCard
            title="Active Addresses"
            value="1.2M"
            icon={Wallet}
            change="+5.2% (7d)"
            changeType="positive"
          />
          <StatCard
            title="Network TPS"
            value="1,247"
            icon={Activity}
            change="Healthy"
            changeType="neutral"
          />
        </div>
      </section>

      {/* Secondary Stats */}
      <section className="mx-auto mt-6 max-w-7xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Block Time</p>
              <p className="text-lg font-semibold">12.4s</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Fuel className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gas Price</p>
              <p className="text-lg font-semibold">25 Gwei</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ff88]/10">
              <Activity className="h-5 w-5 text-[#00ff88]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Network Status</p>
              <p className="text-lg font-semibold text-[#00ff88]">Operational</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blocks & Transactions */}
      <section className="mx-auto mt-8 max-w-7xl px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Latest Blocks */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Latest Blocks</h2>
                <LiveIndicator />
              </div>
              <Link
                href="/blocks"
                className="text-sm text-primary transition-colors hover:text-primary/80"
              >
                View All
              </Link>
            </div>
            <DataTable columns={blockColumns} data={mockBlocks} />
          </div>

          {/* Latest Transactions */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Latest Transactions</h2>
                <LiveIndicator />
              </div>
              <Link
                href="/transactions"
                className="text-sm text-primary transition-colors hover:text-primary/80"
              >
                View All
              </Link>
            </div>
            <DataTable columns={transactionColumns} data={mockTransactions} />
          </div>
        </div>
      </section>
    </div>
  )
}
