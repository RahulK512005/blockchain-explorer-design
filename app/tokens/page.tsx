"use client"

import { useState } from "react"
import { Search, Coins, TrendingUp, TrendingDown } from "lucide-react"
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
import { cn } from "@/lib/utils"

// Mock data
const mockTokens = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  rank: i + 1,
  symbol: ["QUAI", "WETH", "USDT", "USDC", "LINK", "UNI", "AAVE", "MKR", "SNX", "CRV"][i % 10],
  name: ["Quai", "Wrapped Ether", "Tether USD", "USD Coin", "Chainlink", "Uniswap", "Aave", "Maker", "Synthetix", "Curve"][i % 10],
  address: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  price: (Math.random() * 3000 + 1).toFixed(2),
  change24h: (Math.random() * 20 - 10).toFixed(2),
  volume24h: (Math.random() * 1000000000).toFixed(0),
  marketCap: (Math.random() * 10000000000).toFixed(0),
  holders: Math.floor(Math.random() * 100000) + 1000,
  type: i % 3 === 0 ? "ERC-721" : "ERC-20",
}))

const columns = [
  {
    key: "rank",
    header: "#",
    render: (token: typeof mockTokens[0]) => (
      <span className="font-medium text-muted-foreground">{token.rank}</span>
    ),
  },
  {
    key: "name",
    header: "Token",
    render: (token: typeof mockTokens[0]) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {token.symbol.slice(0, 2)}
        </div>
        <div>
          <a href={`/tokens/${token.address}`} className="font-medium hover:text-primary">
            {token.name}
          </a>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{token.symbol}</span>
            <span className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium",
              token.type === "ERC-721" ? "bg-[#c084fc]/10 text-[#c084fc]" : "bg-primary/10 text-primary"
            )}>
              {token.type}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "price",
    header: "Price",
    render: (token: typeof mockTokens[0]) => (
      <span className="font-medium">${Number(token.price).toLocaleString()}</span>
    ),
  },
  {
    key: "change24h",
    header: "24h %",
    render: (token: typeof mockTokens[0]) => {
      const isPositive = Number(token.change24h) >= 0
      return (
        <span className={`flex items-center gap-1 ${isPositive ? "text-[#00ff88]" : "text-destructive"}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? "+" : ""}{token.change24h}%
        </span>
      )
    },
  },
  {
    key: "volume24h",
    header: "Volume (24h)",
    render: (token: typeof mockTokens[0]) => (
      <span className="text-muted-foreground">
        ${Number(token.volume24h).toLocaleString()}
      </span>
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "marketCap",
    header: "Market Cap",
    render: (token: typeof mockTokens[0]) => (
      <span className="font-medium">
        ${Number(token.marketCap).toLocaleString()}
      </span>
    ),
    className: "hidden lg:table-cell",
  },
  {
    key: "holders",
    header: "Holders",
    render: (token: typeof mockTokens[0]) => (
      <span className="text-muted-foreground">{token.holders.toLocaleString()}</span>
    ),
    className: "hidden sm:table-cell",
  },
]

export default function TokensPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tokenType, setTokenType] = useState("all")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tokens</h1>
            <p className="text-sm text-muted-foreground">
              Top tokens by market capitalization
            </p>
          </div>
        </div>
      </div>

      {/* Token Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Tokens</p>
          <p className="mt-1 text-2xl font-bold">12,847</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">ERC-20 Tokens</p>
          <p className="mt-1 text-2xl font-bold">8,234</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">ERC-721 (NFTs)</p>
          <p className="mt-1 text-2xl font-bold">3,892</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Market Cap</p>
          <p className="mt-1 text-2xl font-bold text-[#00ff88]">$2.5B</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by token name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={tokenType} onValueChange={setTokenType}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Token Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value="erc20">ERC-20</SelectItem>
              <SelectItem value="erc721">ERC-721</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tokens Table */}
      <DataTable columns={columns} data={mockTokens} />

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-20 of 12,847 tokens
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
