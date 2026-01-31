"use client"

import { useState } from "react"
import { Search, Blocks } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable, TruncatedLink, LiveIndicator } from "@/components/data-table"
import Link from "next/link"

// Mock data
const mockBlocks = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  number: 18234567 - i,
  hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  timestamp: `${12 + i * 12} secs ago`,
  transactions: Math.floor(Math.random() * 200) + 50,
  gasUsed: Math.floor(Math.random() * 15000000) + 5000000,
  gasLimit: 30000000,
  validator: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  reward: `${(Math.random() * 0.1 + 0.05).toFixed(6)} QUAI`,
}))

const columns = [
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
      <Link
        href={`/blocks/${block.number}?tab=transactions`}
        className="text-primary hover:underline"
      >
        {block.transactions}
      </Link>
    ),
  },
  {
    key: "validator",
    header: "Validator",
    render: (block: typeof mockBlocks[0]) => (
      <TruncatedLink href={`/addresses/${block.validator}`} value={block.validator} maxLength={14} />
    ),
    className: "hidden sm:table-cell",
  },
  {
    key: "gasUsed",
    header: "Gas Used",
    render: (block: typeof mockBlocks[0]) => {
      const percentage = ((block.gasUsed / block.gasLimit) * 100).toFixed(1)
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">{(block.gasUsed / 1000000).toFixed(2)}M</span>
          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
            <div
              className="h-full bg-primary"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="hidden text-xs text-muted-foreground sm:inline">({percentage}%)</span>
        </div>
      )
    },
    className: "hidden md:table-cell",
  },
  {
    key: "reward",
    header: "Reward",
    render: (block: typeof mockBlocks[0]) => (
      <span className="font-medium text-[#00ff88]">{block.reward}</span>
    ),
    className: "hidden lg:table-cell",
  },
]

export default function BlocksPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Blocks className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Blocks</h1>
              <LiveIndicator />
            </div>
            <p className="text-sm text-muted-foreground">
              Block #18,234,567 to #18,234,548 (Total of 18,234,567 blocks)
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by block number or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Blocks Table */}
      <DataTable columns={columns} data={mockBlocks} />

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing blocks #18,234,567 to #18,234,548
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
