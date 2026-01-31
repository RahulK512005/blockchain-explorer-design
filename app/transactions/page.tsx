"use client"

import { useState } from "react"
import { Search, Filter, ArrowRightLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable, TruncatedLink, StatusBadge } from "@/components/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data
const mockTransactions = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  block: 18234567 - i,
  from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  value: `${(Math.random() * 100).toFixed(4)} QUAI`,
  fee: `${(Math.random() * 0.01).toFixed(6)} QUAI`,
  status: (["success", "success", "success", "pending", "failed"] as const)[Math.floor(Math.random() * 5)],
  timestamp: `${Math.floor(Math.random() * 60)} mins ago`,
}))

const columns = [
  {
    key: "hash",
    header: "Transaction Hash",
    render: (tx: typeof mockTransactions[0]) => (
      <TruncatedLink href={`/transactions/${tx.hash}`} value={tx.hash} maxLength={20} />
    ),
  },
  {
    key: "block",
    header: "Block",
    render: (tx: typeof mockTransactions[0]) => (
      <a href={`/blocks/${tx.block}`} className="text-primary hover:underline">
        {tx.block.toLocaleString()}
      </a>
    ),
    className: "hidden sm:table-cell",
  },
  {
    key: "from",
    header: "From",
    render: (tx: typeof mockTransactions[0]) => (
      <TruncatedLink href={`/addresses/${tx.from}`} value={tx.from} maxLength={12} />
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "to",
    header: "To",
    render: (tx: typeof mockTransactions[0]) => (
      <TruncatedLink href={`/addresses/${tx.to}`} value={tx.to} maxLength={12} />
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "value",
    header: "Value",
    render: (tx: typeof mockTransactions[0]) => (
      <span className="font-medium">{tx.value}</span>
    ),
  },
  {
    key: "fee",
    header: "Fee",
    render: (tx: typeof mockTransactions[0]) => (
      <span className="text-muted-foreground">{tx.fee}</span>
    ),
    className: "hidden lg:table-cell",
  },
  {
    key: "status",
    header: "Status",
    render: (tx: typeof mockTransactions[0]) => <StatusBadge status={tx.status} />,
  },
  {
    key: "timestamp",
    header: "Age",
    render: (tx: typeof mockTransactions[0]) => (
      <span className="text-muted-foreground">{tx.timestamp}</span>
    ),
    className: "hidden sm:table-cell",
  },
]

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              A total of 2,547,892,341 transactions found
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by transaction hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <DataTable columns={columns} data={mockTransactions} />

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-20 of 2,547,892,341 transactions
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
