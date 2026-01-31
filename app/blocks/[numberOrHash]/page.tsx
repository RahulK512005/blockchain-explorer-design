"use client"

import React from "react"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Check, Blocks, Clock, Fuel, ChevronLeft, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, TruncatedLink, StatusBadge } from "@/components/data-table"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "transactions", label: "Transactions" },
  { id: "withdrawals", label: "Withdrawals" },
]

// Mock block data
const mockBlock = {
  number: 18234567,
  hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
  parentHash: "0x0a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789",
  timestamp: "2024-01-15 14:32:45 UTC (12 secs ago)",
  transactions: 142,
  validator: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fC45",
  gasUsed: 12500000,
  gasLimit: 30000000,
  baseFeePerGas: "25 Gwei",
  burntFees: "0.3125 QUAI",
  extraData: "Quai Vision",
  size: "45,892 bytes",
  stateRoot: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  receiptsRoot: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
}

// Mock transactions for this block
const mockBlockTransactions = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  to: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  value: `${(Math.random() * 10).toFixed(4)} QUAI`,
  fee: `${(Math.random() * 0.01).toFixed(6)} QUAI`,
  status: (["success", "success", "success", "pending", "failed"] as const)[Math.floor(Math.random() * 5)],
}))

const mockWithdrawals = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  index: 12345678 + i,
  validatorIndex: 100000 + i,
  address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  amount: `${(Math.random() * 0.1).toFixed(6)} QUAI`,
}))

const transactionColumns = [
  {
    key: "hash",
    header: "Tx Hash",
    render: (tx: typeof mockBlockTransactions[0]) => (
      <TruncatedLink href={`/transactions/${tx.hash}`} value={tx.hash} maxLength={18} />
    ),
  },
  {
    key: "from",
    header: "From",
    render: (tx: typeof mockBlockTransactions[0]) => (
      <TruncatedLink href={`/addresses/${tx.from}`} value={tx.from} maxLength={12} />
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "to",
    header: "To",
    render: (tx: typeof mockBlockTransactions[0]) => (
      <TruncatedLink href={`/addresses/${tx.to}`} value={tx.to} maxLength={12} />
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "value",
    header: "Value",
    render: (tx: typeof mockBlockTransactions[0]) => (
      <span className="font-medium">{tx.value}</span>
    ),
  },
  {
    key: "fee",
    header: "Fee",
    render: (tx: typeof mockBlockTransactions[0]) => (
      <span className="text-muted-foreground">{tx.fee}</span>
    ),
    className: "hidden sm:table-cell",
  },
  {
    key: "status",
    header: "Status",
    render: (tx: typeof mockBlockTransactions[0]) => <StatusBadge status={tx.status} />,
  },
]

const withdrawalColumns = [
  {
    key: "index",
    header: "Index",
    render: (w: typeof mockWithdrawals[0]) => (
      <span className="font-mono">{w.index}</span>
    ),
  },
  {
    key: "validatorIndex",
    header: "Validator Index",
    render: (w: typeof mockWithdrawals[0]) => (
      <span className="font-mono text-primary">{w.validatorIndex}</span>
    ),
  },
  {
    key: "address",
    header: "Recipient",
    render: (w: typeof mockWithdrawals[0]) => (
      <TruncatedLink href={`/addresses/${w.address}`} value={w.address} maxLength={14} />
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (w: typeof mockWithdrawals[0]) => (
      <span className="font-medium text-[#00ff88]">{w.amount}</span>
    ),
  },
]

export default function BlockDetailPage({ params }: { params: Promise<{ numberOrHash: string }> }) {
  const { numberOrHash } = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const blockNumber = Number.parseInt(numberOrHash) || mockBlock.number

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back Button */}
      <Link
        href="/blocks"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blocks
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Blocks className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">Block #{blockNumber.toLocaleString()}</h1>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs text-muted-foreground sm:text-sm">
                  {mockBlock.hash.slice(0, 20)}...{mockBlock.hash.slice(-8)}
                </code>
                <button
                  onClick={() => copyToClipboard(mockBlock.hash, "hash")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied === "hash" ? <Check className="h-4 w-4 text-[#00ff88]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Block Navigation */}
          <div className="flex gap-2">
            <Link href={`/blocks/${blockNumber - 1}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
            <Link href={`/blocks/${blockNumber + 1}`}>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
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
              {tab.id === "transactions" && (
                <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {mockBlock.transactions}
                </span>
              )}
              {tab.id === "withdrawals" && (
                <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {mockWithdrawals.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Block Information</h2>
            </div>
            <div className="divide-y divide-border">
              <InfoRow label="Block Height" value={blockNumber.toLocaleString()} />
              <InfoRow
                label="Timestamp"
                value={
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {mockBlock.timestamp}
                  </span>
                }
              />
              <InfoRow
                label="Transactions"
                value={
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="text-primary hover:underline"
                  >
                    {mockBlock.transactions} transactions
                  </button>
                }
              />
              <InfoRow
                label="Validator"
                value={
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <TruncatedLink href={`/addresses/${mockBlock.validator}`} value={mockBlock.validator} maxLength={24} />
                  </div>
                }
              />
            </div>
          </div>

          {/* Gas Info */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="flex items-center gap-2 font-semibold">
                <Fuel className="h-4 w-4" />
                Gas Details
              </h2>
            </div>
            <div className="divide-y divide-border">
              <InfoRow
                label="Gas Used"
                value={
                  <div className="flex items-center gap-3">
                    <span>{mockBlock.gasUsed.toLocaleString()}</span>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(mockBlock.gasUsed / mockBlock.gasLimit) * 100}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground">
                      ({((mockBlock.gasUsed / mockBlock.gasLimit) * 100).toFixed(2)}%)
                    </span>
                  </div>
                }
              />
              <InfoRow label="Gas Limit" value={mockBlock.gasLimit.toLocaleString()} />
              <InfoRow label="Base Fee Per Gas" value={mockBlock.baseFeePerGas} />
              <InfoRow
                label="Burnt Fees"
                value={<span className="text-destructive">{mockBlock.burntFees}</span>}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Additional Information</h2>
            </div>
            <div className="divide-y divide-border">
              <InfoRow label="Block Size" value={mockBlock.size} />
              <InfoRow
                label="Parent Hash"
                value={
                  <Link href={`/blocks/${mockBlock.parentHash}`} className="font-mono text-sm text-primary hover:underline">
                    {mockBlock.parentHash.slice(0, 20)}...{mockBlock.parentHash.slice(-8)}
                  </Link>
                }
              />
              <InfoRow
                label="State Root"
                value={
                  <code className="break-all text-xs">{mockBlock.stateRoot}</code>
                }
              />
              <InfoRow
                label="Receipts Root"
                value={
                  <code className="break-all text-xs">{mockBlock.receiptsRoot}</code>
                }
              />
              <InfoRow label="Extra Data" value={mockBlock.extraData} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "transactions" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              A total of {mockBlock.transactions} transactions found
            </p>
          </div>
          <DataTable columns={transactionColumns} data={mockBlockTransactions} />
          
          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-10 of {mockBlock.transactions} transactions
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

      {activeTab === "withdrawals" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              A total of {mockWithdrawals.length} withdrawals found
            </p>
          </div>
          <DataTable columns={withdrawalColumns} data={mockWithdrawals} />
        </div>
      )}
    </div>
  )
}

// Info Row component
function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 break-all text-sm">{value}</span>
    </div>
  )
}
