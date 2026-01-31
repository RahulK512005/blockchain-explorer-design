"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Check, Coins, TrendingUp, TrendingDown, ExternalLink, Users, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, TruncatedLink } from "@/components/data-table"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "transfers", label: "Transfers" },
  { id: "holders", label: "Holders" },
  { id: "contract", label: "Contract" },
  { id: "info", label: "Info" },
]

// Mock token data
const mockToken = {
  symbol: "QUAI",
  name: "Quai Token",
  address: "0x1234567890abcdef1234567890abcdef12345678",
  type: "ERC-20",
  decimals: 18,
  totalSupply: "1,000,000,000",
  price: "$2.45",
  change24h: "+5.67",
  marketCap: "$2,450,000,000",
  volume24h: "$125,000,000",
  holders: 125847,
  transfers: 5892341,
  contractCreator: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fC45",
  contractCreatedAt: "Block #1000000",
}

// Mock transfers
const mockTransfers = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  amount: `${(Math.random() * 10000).toFixed(2)}`,
  timestamp: `${Math.floor(Math.random() * 60)} mins ago`,
}))

// Mock holders
const mockHolders = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  rank: i + 1,
  address: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  quantity: (100000000 - i * 5000000 + Math.random() * 1000000).toFixed(2),
  percentage: ((100000000 - i * 5000000) / 1000000000 * 100).toFixed(4),
  value: `$${((100000000 - i * 5000000) * 2.45).toLocaleString()}`,
}))

const transferColumns = [
  {
    key: "hash",
    header: "Tx Hash",
    render: (t: typeof mockTransfers[0]) => (
      <TruncatedLink href={`/transactions/${t.hash}`} value={t.hash} maxLength={16} />
    ),
  },
  {
    key: "from",
    header: "From",
    render: (t: typeof mockTransfers[0]) => (
      <TruncatedLink href={`/addresses/${t.from}`} value={t.from} maxLength={12} />
    ),
  },
  {
    key: "to",
    header: "To",
    render: (t: typeof mockTransfers[0]) => (
      <TruncatedLink href={`/addresses/${t.to}`} value={t.to} maxLength={12} />
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (t: typeof mockTransfers[0]) => (
      <span className="font-medium">{t.amount} {mockToken.symbol}</span>
    ),
  },
  {
    key: "timestamp",
    header: "Age",
    render: (t: typeof mockTransfers[0]) => (
      <span className="text-muted-foreground">{t.timestamp}</span>
    ),
    className: "hidden sm:table-cell",
  },
]

const holderColumns = [
  {
    key: "rank",
    header: "#",
    render: (h: typeof mockHolders[0]) => (
      <span className="font-medium text-muted-foreground">{h.rank}</span>
    ),
  },
  {
    key: "address",
    header: "Address",
    render: (h: typeof mockHolders[0]) => (
      <TruncatedLink href={`/addresses/${h.address}`} value={h.address} maxLength={18} />
    ),
  },
  {
    key: "quantity",
    header: "Quantity",
    render: (h: typeof mockHolders[0]) => (
      <span className="font-medium">{Number(h.quantity).toLocaleString()}</span>
    ),
  },
  {
    key: "percentage",
    header: "Percentage",
    render: (h: typeof mockHolders[0]) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(Number(h.percentage), 100)}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">{h.percentage}%</span>
      </div>
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "value",
    header: "Value",
    render: (h: typeof mockHolders[0]) => (
      <span className="font-medium text-[#00ff88]">{h.value}</span>
    ),
    className: "hidden sm:table-cell",
  },
]

export default function TokenDetailPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params)
  const [activeTab, setActiveTab] = useState("transfers")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPositive = mockToken.change24h.startsWith("+")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back Button */}
      <Link
        href="/tokens"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tokens
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
              {mockToken.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{mockToken.name}</h1>
                <span className="rounded bg-muted px-2 py-0.5 text-sm font-medium">
                  {mockToken.symbol}
                </span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {mockToken.type}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <code className="text-sm text-muted-foreground">
                  {hash}
                </code>
                <button
                  onClick={() => copyToClipboard(hash)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? <Check className="h-4 w-4 text-[#00ff88]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">{mockToken.price}</p>
            </div>
            <div className={cn(
              "flex items-center gap-1 rounded-lg px-3 py-1",
              isPositive ? "bg-[#00ff88]/10 text-[#00ff88]" : "bg-destructive/10 text-destructive"
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">{mockToken.change24h}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span className="text-sm">Market Cap</span>
          </div>
          <p className="mt-2 text-xl font-bold">{mockToken.marketCap}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="text-sm">Volume (24h)</span>
          </div>
          <p className="mt-2 text-xl font-bold">{mockToken.volume24h}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Holders</span>
          </div>
          <p className="mt-2 text-xl font-bold">{mockToken.holders.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="text-sm">Total Transfers</span>
          </div>
          <p className="mt-2 text-xl font-bold">{mockToken.transfers.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-thin">
        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.id === "holders" && (
                <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {mockToken.holders.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "transfers" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Latest {mockTransfers.length} token transfers
            </p>
          </div>
          <DataTable columns={transferColumns} data={mockTransfers} />
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-10 of {mockToken.transfers.toLocaleString()} transfers
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
      )}

      {activeTab === "holders" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Top {mockHolders.length} holders
            </p>
          </div>
          <DataTable columns={holderColumns} data={mockHolders} />
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-10 of {mockToken.holders.toLocaleString()} holders
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
      )}

      {activeTab === "contract" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">Contract Information</h2>
          </div>
          <div className="divide-y divide-border">
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Contract Address</span>
              <TruncatedLink href={`/addresses/${mockToken.address}`} value={mockToken.address} maxLength={32} />
            </div>
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Creator</span>
              <TruncatedLink href={`/addresses/${mockToken.contractCreator}`} value={mockToken.contractCreator} maxLength={32} />
            </div>
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Created At</span>
              <span className="text-sm">{mockToken.contractCreatedAt}</span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Decimals</span>
              <span className="text-sm">{mockToken.decimals}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "info" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">Token Information</h2>
          </div>
          <div className="divide-y divide-border">
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Token Name</span>
              <span className="text-sm font-medium">{mockToken.name}</span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Symbol</span>
              <span className="text-sm font-medium">{mockToken.symbol}</span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Token Type</span>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {mockToken.type}
              </span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Total Supply</span>
              <span className="text-sm font-medium">{mockToken.totalSupply} {mockToken.symbol}</span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">Decimals</span>
              <span className="text-sm">{mockToken.decimals}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
