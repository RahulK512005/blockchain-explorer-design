"use client"

import { useState } from "react"
import { Search, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable, TruncatedLink } from "@/components/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data - top addresses by balance
const mockAddresses = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  rank: i + 1,
  address: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  label: i < 5 ? ["Exchange", "Validator", "Contract", "Whale", "Foundation"][i] : null,
  balance: (1000000 - i * 45000 + Math.random() * 10000).toFixed(2),
  percentage: ((1000000 - i * 45000) / 10000000 * 100).toFixed(4),
  txnCount: Math.floor(Math.random() * 100000) + 1000,
  change24h: (Math.random() * 10 - 5).toFixed(2),
}))

const columns = [
  {
    key: "rank",
    header: "#",
    render: (addr: typeof mockAddresses[0]) => (
      <span className="font-medium text-muted-foreground">{addr.rank}</span>
    ),
  },
  {
    key: "address",
    header: "Address",
    render: (addr: typeof mockAddresses[0]) => (
      <div className="flex items-center gap-2">
        <TruncatedLink href={`/addresses/${addr.address}`} value={addr.address} maxLength={18} />
        {addr.label && (
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {addr.label}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "balance",
    header: "Balance",
    render: (addr: typeof mockAddresses[0]) => (
      <span className="font-medium">{Number(addr.balance).toLocaleString()} QUAI</span>
    ),
  },
  {
    key: "percentage",
    header: "% of Supply",
    render: (addr: typeof mockAddresses[0]) => (
      <span className="text-muted-foreground">{addr.percentage}%</span>
    ),
    className: "hidden sm:table-cell",
  },
  {
    key: "txnCount",
    header: "Txn Count",
    render: (addr: typeof mockAddresses[0]) => (
      <span>{addr.txnCount.toLocaleString()}</span>
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "change24h",
    header: "24h Change",
    render: (addr: typeof mockAddresses[0]) => {
      const isPositive = Number(addr.change24h) >= 0
      return (
        <span className={`flex items-center gap-1 ${isPositive ? "text-[#00ff88]" : "text-destructive"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {isPositive ? "+" : ""}{addr.change24h}%
        </span>
      )
    },
    className: "hidden lg:table-cell",
  },
]

export default function AddressesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("balance")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Top Addresses</h1>
            <p className="text-sm text-muted-foreground">
              Top accounts by QUAI balance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Addresses</p>
          <p className="mt-1 text-2xl font-bold">1,247,892</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Today</p>
          <p className="mt-1 text-2xl font-bold">45,231</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">New (24h)</p>
          <p className="mt-1 text-2xl font-bold text-[#00ff88]">+2,847</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balance">Balance</SelectItem>
              <SelectItem value="txnCount">Txn Count</SelectItem>
              <SelectItem value="change24h">24h Change</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Addresses Table */}
      <DataTable columns={columns} data={mockAddresses} />

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-20 of 1,247,892 addresses
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
