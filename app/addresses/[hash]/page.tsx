"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Check, Wallet, Coins, ArrowRightLeft, FileCode, ImageIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, TruncatedLink, StatusBadge } from "@/components/data-table"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "transactions", label: "Transactions" },
  { id: "internal-txns", label: "Internal Txns" },
  { id: "token-transfers", label: "Token Transfers" },
  { id: "nfts", label: "NFTs" },
  { id: "tokens", label: "Token Holdings" },
  { id: "contract", label: "Contract" },
]

// Mock address data
const mockAddress = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fC45",
  balance: "1,234,567.89",
  value: "$2,469,135.78",
  txnCount: 12847,
  isContract: false,
  label: "Whale",
  firstSeen: "2023-01-15",
  lastSeen: "2024-01-15 14:32:45 UTC",
}

// Mock transactions
const mockTransactions = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  block: 18234567 - i * 100,
  type: (["OUT", "IN", "OUT", "IN", "OUT"] as const)[i % 5],
  from: i % 2 === 0 ? mockAddress.address : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  to: i % 2 === 1 ? mockAddress.address : `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  value: `${(Math.random() * 100).toFixed(4)} QUAI`,
  fee: `${(Math.random() * 0.01).toFixed(6)} QUAI`,
  status: (["success", "success", "success", "pending", "failed"] as const)[Math.floor(Math.random() * 5)],
  timestamp: `${Math.floor(Math.random() * 60)} mins ago`,
}))

// Mock token holdings
const mockTokens = [
  { symbol: "USDT", name: "Tether USD", balance: "50,000.00", value: "$50,000.00", price: "$1.00" },
  { symbol: "WETH", name: "Wrapped Ether", balance: "25.5", value: "$63,750.00", price: "$2,500.00" },
  { symbol: "LINK", name: "Chainlink", balance: "1,000", value: "$15,000.00", price: "$15.00" },
  { symbol: "UNI", name: "Uniswap", balance: "500", value: "$3,500.00", price: "$7.00" },
]

// Mock NFTs
const mockNFTs = [
  { collection: "Quai Punks", tokenId: "#1234", image: "/placeholder.svg" },
  { collection: "Quai Apes", tokenId: "#5678", image: "/placeholder.svg" },
  { collection: "Quai Art", tokenId: "#9012", image: "/placeholder.svg" },
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
    key: "type",
    header: "Type",
    render: (tx: typeof mockTransactions[0]) => (
      <span
        className={cn(
          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
          tx.type === "IN" ? "bg-[#00ff88]/10 text-[#00ff88]" : "bg-primary/10 text-primary"
        )}
      >
        {tx.type}
      </span>
    ),
  },
  {
    key: "from",
    header: "From",
    render: (tx: typeof mockTransactions[0]) => (
      tx.from === mockAddress.address ? (
        <span className="font-mono text-sm text-muted-foreground">This Address</span>
      ) : (
        <TruncatedLink href={`/addresses/${tx.from}`} value={tx.from} maxLength={10} />
      )
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "to",
    header: "To",
    render: (tx: typeof mockTransactions[0]) => (
      tx.to === mockAddress.address ? (
        <span className="font-mono text-sm text-muted-foreground">This Address</span>
      ) : (
        <TruncatedLink href={`/addresses/${tx.to}`} value={tx.to} maxLength={10} />
      )
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

export default function AddressDetailPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params)
  const [activeTab, setActiveTab] = useState("transactions")
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
        href="/addresses"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Addresses
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold sm:text-2xl">Address</h1>
                {mockAddress.label && (
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {mockAddress.label}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs text-muted-foreground sm:text-sm">
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
        </div>
      </div>

      {/* Balance Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span className="text-sm">QUAI Balance</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{mockAddress.balance}</p>
          <p className="text-sm text-muted-foreground">{mockAddress.value}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="text-sm">Transactions</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{mockAddress.txnCount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span className="text-sm">Token Holdings</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{mockTokens.length}</p>
          <p className="text-sm text-[#00ff88]">$132,250.00</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">NFTs</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{mockNFTs.length}</p>
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
      {activeTab === "transactions" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Latest {mockTransactions.length} from a total of {mockAddress.txnCount.toLocaleString()} transactions
            </p>
          </div>
          <DataTable columns={transactionColumns} data={mockTransactions} />
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-10 of {mockAddress.txnCount.toLocaleString()} transactions
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

      {activeTab === "internal-txns" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No internal transactions found for this address.</p>
        </div>
      )}

      {activeTab === "token-transfers" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Token transfer history will appear here.</p>
        </div>
      )}

      {activeTab === "nfts" && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {mockNFTs.length} NFTs found
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mockNFTs.map((nft, i) => (
              <div key={i} className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50">
                <div className="aspect-square bg-muted">
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-medium">{nft.collection}</p>
                  <p className="text-sm text-muted-foreground">{nft.tokenId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "tokens" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Token</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Balance</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground hidden sm:table-cell">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody>
              {mockTokens.map((token, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{token.balance}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{token.price}</td>
                  <td className="px-6 py-4 font-medium text-[#00ff88]">{token.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "contract" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <FileCode className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">This address is not a contract.</p>
        </div>
      )}
    </div>
  )
}
