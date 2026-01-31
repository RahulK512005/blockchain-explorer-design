"use client"

import React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Blocks, ArrowRightLeft, Wallet, Coins, FileCode, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock search results
const mockResults = {
  blocks: [
    { number: 18234567, hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", timestamp: "12 secs ago" },
    { number: 18234566, hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234", timestamp: "24 secs ago" },
  ],
  transactions: [
    { hash: "0xabc123def456789...890abc", value: "1.5 QUAI", timestamp: "5 mins ago" },
    { hash: "0xdef456789abc123...123def", value: "0.8 QUAI", timestamp: "15 mins ago" },
  ],
  addresses: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fC45", balance: "1,234.56 QUAI", type: "Wallet" },
    { address: "0x1234567890abcdef1234567890abcdef12345678", balance: "5,678.90 QUAI", type: "Contract" },
  ],
  tokens: [
    { symbol: "QUAI", name: "Quai Token", address: "0x..." },
    { symbol: "WETH", name: "Wrapped Ether", address: "0x..." },
  ],
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    setSearchQuery(query)
    setIsLoading(true)
    // Simulate search delay
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const filters = [
    { id: "all", label: "All Results", icon: Search },
    { id: "blocks", label: "Blocks", icon: Blocks },
    { id: "transactions", label: "Transactions", icon: ArrowRightLeft },
    { id: "addresses", label: "Addresses", icon: Wallet },
    { id: "tokens", label: "Tokens", icon: Coins },
  ]

  const totalResults =
    mockResults.blocks.length +
    mockResults.transactions.length +
    mockResults.addresses.length +
    mockResults.tokens.length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Address / Txn Hash / Block / Token"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 pr-24"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              size="sm"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="mb-6 overflow-x-auto scrollbar-thin">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : query ? (
        <div className="space-y-8">
          {/* Summary */}
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{totalResults}</span> results for{" "}
            <span className="font-semibold text-foreground">"{query}"</span>
          </p>

          {/* Blocks */}
          {(activeFilter === "all" || activeFilter === "blocks") && mockResults.blocks.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Blocks className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Blocks</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {mockResults.blocks.length}
                </span>
              </div>
              <div className="space-y-2">
                {mockResults.blocks.map((block, i) => (
                  <Link
                    key={i}
                    href={`/blocks/${block.number}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Blocks className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Block #{block.number.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {block.hash.slice(0, 20)}...{block.hash.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{block.timestamp}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Transactions */}
          {(activeFilter === "all" || activeFilter === "transactions") && mockResults.transactions.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Transactions</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {mockResults.transactions.length}
                </span>
              </div>
              <div className="space-y-2">
                {mockResults.transactions.map((tx, i) => (
                  <Link
                    key={i}
                    href={`/transactions/${tx.hash}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ArrowRightLeft className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium">{tx.hash}</p>
                        <p className="text-sm text-muted-foreground">Value: {tx.value}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{tx.timestamp}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Addresses */}
          {(activeFilter === "all" || activeFilter === "addresses") && mockResults.addresses.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Addresses</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {mockResults.addresses.length}
                </span>
              </div>
              <div className="space-y-2">
                {mockResults.addresses.map((addr, i) => (
                  <Link
                    key={i}
                    href={`/addresses/${addr.address}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {addr.type === "Contract" ? (
                          <FileCode className="h-5 w-5 text-primary" />
                        ) : (
                          <Wallet className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium">{addr.address}</p>
                        <p className="text-sm text-muted-foreground">Balance: {addr.balance}</p>
                      </div>
                    </div>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                      {addr.type}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tokens */}
          {(activeFilter === "all" || activeFilter === "tokens") && mockResults.tokens.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Tokens</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {mockResults.tokens.length}
                </span>
              </div>
              <div className="space-y-2">
                {mockResults.tokens.map((token, i) => (
                  <Link
                    key={i}
                    href={`/tokens/${token.address}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{token.name}</p>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            Enter a search query to find blocks, transactions, addresses, or tokens.
          </p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
