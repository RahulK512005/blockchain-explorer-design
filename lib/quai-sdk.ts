"use client"

// Quai SDK utility functions and types
// Note: In production, import from 'quais' package

export const RPC_URL = "https://rpc.quai.network"

// Address validation utilities
export function isQuaiAddress(address: string): boolean {
  // Quai addresses start with 0x00-0x1F (binary prefix 00)
  if (!address || !address.startsWith("0x") || address.length !== 42) {
    return false
  }
  const prefix = parseInt(address.slice(2, 4), 16)
  return prefix >= 0x00 && prefix <= 0x1f
}

export function isQiAddress(address: string): boolean {
  // Qi addresses start with 0x20-0x3F (binary prefix 01)
  if (!address || !address.startsWith("0x") || address.length !== 42) {
    return false
  }
  const prefix = parseInt(address.slice(2, 4), 16)
  return prefix >= 0x20 && prefix <= 0x3f
}

export function getAddressType(address: string): "quai" | "qi" | "unknown" {
  if (isQuaiAddress(address)) return "quai"
  if (isQiAddress(address)) return "qi"
  return "unknown"
}

// Shard/Zone utilities
export interface ShardInfo {
  region: number
  zone: number
  ledger: "quai" | "qi"
  shard: string
  binaryPrefix: string
}

export const SHARDS = [
  { name: "Cyprus-1", region: 0, zone: 0, prefix: "00" },
  { name: "Cyprus-2", region: 0, zone: 1, prefix: "01" },
  { name: "Cyprus-3", region: 0, zone: 2, prefix: "02" },
  { name: "Paxos-1", region: 1, zone: 0, prefix: "10" },
  { name: "Paxos-2", region: 1, zone: 1, prefix: "11" },
  { name: "Paxos-3", region: 1, zone: 2, prefix: "12" },
  { name: "Hydra-1", region: 2, zone: 0, prefix: "20" },
  { name: "Hydra-2", region: 2, zone: 1, prefix: "21" },
  { name: "Hydra-3", region: 2, zone: 2, prefix: "22" },
]

export function getShardInfo(address: string): ShardInfo | null {
  if (!address || !address.startsWith("0x") || address.length !== 42) {
    return null
  }
  
  const firstByte = parseInt(address.slice(2, 4), 16)
  const ledger = firstByte < 0x20 ? "quai" : "qi"
  const adjustedByte = ledger === "qi" ? firstByte - 0x20 : firstByte
  
  // Extract region (bits 4-5) and zone (bits 2-3)
  const region = (adjustedByte >> 4) & 0x03
  const zone = (adjustedByte >> 2) & 0x03
  
  const shard = SHARDS.find(s => s.region === region && s.zone === zone)
  
  return {
    region,
    zone,
    ledger,
    shard: shard?.name || "Unknown",
    binaryPrefix: firstByte.toString(2).padStart(8, "0"),
  }
}

// Transaction types
export type TransactionType = "quai" | "qi" | "external"

export interface QuaiTransaction {
  type: TransactionType
  from: string
  to: string
  value: string
  data?: string
  gasLimit?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

// Provider types
export type ProviderType = "jsonrpc" | "websocket" | "browser"

export interface ProviderStatus {
  connected: boolean
  type: ProviderType
  chainId?: string
  blockNumber?: number
  shards?: string[]
}

// Contract ABI types
export interface ContractMethod {
  name: string
  type: "function" | "event"
  stateMutability?: "pure" | "view" | "nonpayable" | "payable"
  inputs: { name: string; type: string }[]
  outputs?: { name: string; type: string }[]
}

// Sample ERC20 ABI
export const ERC20_ABI = [
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint8" }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "transfer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
  { name: "transferFrom", type: "function", stateMutability: "nonpayable", inputs: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
] as ContractMethod[]

// Wallet types
export interface WalletInfo {
  type: "standard" | "hd-quai" | "hd-qi"
  address: string
  derivedAddresses?: { zone: string; address: string }[]
}

// Mock data generators for demo
export function generateMockBlockNumber(): number {
  return Math.floor(Math.random() * 1000000) + 5000000
}

export function generateMockAddress(ledger: "quai" | "qi" = "quai"): string {
  const prefix = ledger === "quai" ? Math.floor(Math.random() * 0x1f) : 0x20 + Math.floor(Math.random() * 0x1f)
  const rest = Array(38).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")
  return `0x${prefix.toString(16).padStart(2, "0")}${rest}`
}

export function generateMockTxHash(): string {
  return "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")
}

// Format utilities
export function formatQuai(wei: string | bigint): string {
  const value = typeof wei === "string" ? BigInt(wei) : wei
  const quai = Number(value) / 1e18
  return quai.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

export function parseQuai(quai: string): bigint {
  const value = parseFloat(quai)
  return BigInt(Math.floor(value * 1e18))
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function shortenHash(hash: string, chars = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`
}
