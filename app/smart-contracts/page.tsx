"use client"

import { useState } from "react"
import { Search, FileCode, CheckCircle, Clock } from "lucide-react"
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
const mockContracts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  address: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  name: ["Token Contract", "DEX Router", "NFT Marketplace", "Staking Pool", "Governance", "Bridge", "Vault", "Oracle", "Lending", "DAO"][i % 10],
  balance: (Math.random() * 10000).toFixed(4),
  txnCount: Math.floor(Math.random() * 100000) + 1000,
  compiler: "Solidity 0.8.19",
  verified: i % 3 !== 0,
  createdAt: `${Math.floor(Math.random() * 365)} days ago`,
}))

const columns = [
  {
    key: "address",
    header: "Contract Address",
    render: (contract: typeof mockContracts[0]) => (
      <div className="flex items-center gap-2">
        <TruncatedLink href={`/addresses/${contract.address}`} value={contract.address} maxLength={18} />
        {contract.verified && (
          <CheckCircle className="h-4 w-4 text-[#00ff88]" />
        )}
      </div>
    ),
  },
  {
    key: "name",
    header: "Contract Name",
    render: (contract: typeof mockContracts[0]) => (
      <span className="font-medium">{contract.name}</span>
    ),
  },
  {
    key: "balance",
    header: "Balance",
    render: (contract: typeof mockContracts[0]) => (
      <span>{contract.balance} QUAI</span>
    ),
    className: "hidden md:table-cell",
  },
  {
    key: "txnCount",
    header: "Txns",
    render: (contract: typeof mockContracts[0]) => (
      <span className="text-muted-foreground">{contract.txnCount.toLocaleString()}</span>
    ),
    className: "hidden sm:table-cell",
  },
  {
    key: "compiler",
    header: "Compiler",
    render: (contract: typeof mockContracts[0]) => (
      <span className="text-xs text-muted-foreground">{contract.compiler}</span>
    ),
    className: "hidden lg:table-cell",
  },
  {
    key: "verified",
    header: "Verified",
    render: (contract: typeof mockContracts[0]) => (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          contract.verified
            ? "bg-[#00ff88]/10 text-[#00ff88]"
            : "bg-muted text-muted-foreground"
        )}
      >
        {contract.verified ? (
          <>
            <CheckCircle className="h-3 w-3" />
            Yes
          </>
        ) : (
          <>
            <Clock className="h-3 w-3" />
            No
          </>
        )}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Age",
    render: (contract: typeof mockContracts[0]) => (
      <span className="text-muted-foreground">{contract.createdAt}</span>
    ),
    className: "hidden sm:table-cell",
  },
]

export default function SmartContractsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState("all")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileCode className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Smart Contracts</h1>
            <p className="text-sm text-muted-foreground">
              Verified and unverified smart contracts on the network
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Contracts</p>
          <p className="mt-1 text-2xl font-bold">8,234</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Verified</p>
          <p className="mt-1 text-2xl font-bold text-[#00ff88]">5,892</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Deployed (24h)</p>
          <p className="mt-1 text-2xl font-bold">+127</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by contract address or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contracts</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contracts Table */}
      <DataTable columns={columns} data={mockContracts} />

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-20 of 8,234 contracts
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
