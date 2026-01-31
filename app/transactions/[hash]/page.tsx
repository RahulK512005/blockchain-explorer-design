"use client"

import React from "react"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Check, ExternalLink, ArrowRightLeft, Clock, Fuel, Blocks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge, TruncatedLink } from "@/components/data-table"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "token-transfers", label: "Token Transfers" },
  { id: "internal-txns", label: "Internal Txns" },
  { id: "logs", label: "Logs" },
  { id: "raw-trace", label: "Raw Trace" },
  { id: "state", label: "State Changes" },
]

// Mock transaction data
const mockTransaction = {
  hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
  status: "success" as const,
  block: 18234567,
  timestamp: "2024-01-15 14:32:45 UTC",
  from: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fC45",
  to: "0x1234567890abcdef1234567890abcdef12345678",
  value: "1.5 QUAI",
  transactionFee: "0.002145 QUAI",
  gasPrice: "25 Gwei",
  gasLimit: "21000",
  gasUsed: "21000",
  nonce: 42,
  inputData: "0x",
  transactionIndex: 15,
}

const mockTokenTransfers = [
  { token: "USDT", from: "0x742d...fC45", to: "0x1234...5678", amount: "1,000.00" },
  { token: "WETH", from: "0x742d...fC45", to: "0x1234...5678", amount: "0.5" },
]

const mockInternalTxns = [
  { type: "CALL", from: "0x742d...fC45", to: "0x1234...5678", value: "0.1 QUAI" },
  { type: "DELEGATECALL", from: "0x1234...5678", to: "0xabcd...ef01", value: "0 QUAI" },
]

const mockLogs = [
  { index: 0, address: "0x1234...5678", topics: ["0xddf252ad...", "0x00000000..."], data: "0x000000000000000000000000000000000000000000000000000000003b9aca00" },
  { index: 1, address: "0xabcd...ef01", topics: ["0x8c5be1e5...", "0x00000000..."], data: "0x0000000000000000000000000000000000000000000000000000000000000001" },
]

export default function TransactionDetailPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back Button */}
      <Link
        href="/transactions"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Transactions
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">Transaction Details</h1>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs text-muted-foreground sm:text-sm">
                  {hash.slice(0, 20)}...{hash.slice(-8)}
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
          <StatusBadge status={mockTransaction.status} className="self-start sm:self-auto" />
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
              <h2 className="font-semibold">Transaction Information</h2>
            </div>
            <div className="divide-y divide-border">
              <InfoRow label="Transaction Hash" value={mockTransaction.hash} copyable />
              <InfoRow
                label="Status"
                value={<StatusBadge status={mockTransaction.status} />}
              />
              <InfoRow
                label="Block"
                value={
                  <Link href={`/blocks/${mockTransaction.block}`} className="flex items-center gap-1 text-primary hover:underline">
                    <Blocks className="h-4 w-4" />
                    {mockTransaction.block.toLocaleString()}
                  </Link>
                }
              />
              <InfoRow
                label="Timestamp"
                value={
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {mockTransaction.timestamp}
                  </span>
                }
              />
            </div>
          </div>

          {/* Transfer Info */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Transfer Details</h2>
            </div>
            <div className="divide-y divide-border">
              <InfoRow
                label="From"
                value={<TruncatedLink href={`/addresses/${mockTransaction.from}`} value={mockTransaction.from} maxLength={24} />}
                copyable
                copyValue={mockTransaction.from}
              />
              <InfoRow
                label="To"
                value={<TruncatedLink href={`/addresses/${mockTransaction.to}`} value={mockTransaction.to} maxLength={24} />}
                copyable
                copyValue={mockTransaction.to}
              />
              <InfoRow label="Value" value={<span className="font-semibold text-foreground">{mockTransaction.value}</span>} />
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
              <InfoRow label="Transaction Fee" value={mockTransaction.transactionFee} />
              <InfoRow label="Gas Price" value={mockTransaction.gasPrice} />
              <InfoRow label="Gas Limit" value={mockTransaction.gasLimit} />
              <InfoRow
                label="Gas Used"
                value={
                  <span className="flex items-center gap-2">
                    {mockTransaction.gasUsed}
                    <span className="text-muted-foreground">
                      ({((parseInt(mockTransaction.gasUsed) / parseInt(mockTransaction.gasLimit)) * 100).toFixed(2)}%)
                    </span>
                  </span>
                }
              />
            </div>
          </div>

          {/* Other Info */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-semibold">Other Information</h2>
            </div>
            <div className="divide-y divide-border">
              <InfoRow label="Nonce" value={mockTransaction.nonce} />
              <InfoRow label="Transaction Index" value={mockTransaction.transactionIndex} />
              <InfoRow
                label="Input Data"
                value={
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {mockTransaction.inputData}
                  </code>
                }
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "token-transfers" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">Token Transfers ({mockTokenTransfers.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Token</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">From</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockTokenTransfers.map((transfer, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-6 py-4 font-medium">{transfer.token}</td>
                    <td className="px-6 py-4 font-mono text-sm text-primary">{transfer.from}</td>
                    <td className="px-6 py-4 font-mono text-sm text-primary">{transfer.to}</td>
                    <td className="px-6 py-4">{transfer.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "internal-txns" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">Internal Transactions ({mockInternalTxns.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">From</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {mockInternalTxns.map((txn, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-6 py-4">
                      <span className="rounded bg-muted px-2 py-1 text-xs font-medium">{txn.type}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-primary">{txn.from}</td>
                    <td className="px-6 py-4 font-mono text-sm text-primary">{txn.to}</td>
                    <td className="px-6 py-4">{txn.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">Event Logs ({mockLogs.length})</h2>
          </div>
          <div className="space-y-4 p-6">
            {mockLogs.map((log, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Log #{log.index}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">{log.address}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Topics:</p>
                    {log.topics.map((topic, j) => (
                      <code key={j} className="mb-1 block break-all rounded bg-background px-2 py-1 text-xs">
                        [{j}] {topic}
                      </code>
                    ))}
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Data:</p>
                    <code className="block break-all rounded bg-background px-2 py-1 text-xs">
                      {log.data}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "raw-trace" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">Raw Trace</h2>
          </div>
          <div className="p-6">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs scrollbar-thin">
{`{
  "type": "CALL",
  "from": "${mockTransaction.from}",
  "to": "${mockTransaction.to}",
  "value": "0x14d1120d7b160000",
  "gas": "0x5208",
  "gasUsed": "0x5208",
  "input": "0x",
  "output": "0x"
}`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === "state" && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold">State Changes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-2 font-mono text-sm text-primary">{mockTransaction.from}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Balance Before</p>
                    <p className="font-medium">10.5 QUAI</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Balance After</p>
                    <p className="font-medium">8.997855 QUAI</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-2 font-mono text-sm text-primary">{mockTransaction.to}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Balance Before</p>
                    <p className="font-medium">5.0 QUAI</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Balance After</p>
                    <p className="font-medium">6.5 QUAI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Info Row component
function InfoRow({
  label,
  value,
  copyable,
  copyValue,
}: {
  label: string
  value: React.ReactNode
  copyable?: boolean
  copyValue?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const textToCopy = copyValue || (typeof value === "string" ? value : "")
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="min-w-0 break-all text-sm">{value}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-[#00ff88]" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
