"use client"

import React from "react"
import { useState } from "react"
import { 
  Network, 
  Wifi,
  WifiOff,
  Globe,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  Play,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SHARDS, generateMockBlockNumber, type ProviderType, RPC_URL } from "@/lib/quai-sdk"

type ConnectionState = "disconnected" | "connecting" | "connected" | "error"

interface ProviderInfo {
  type: ProviderType
  status: ConnectionState
  chainId?: string
  blockNumber?: number
  shards?: typeof SHARDS
}

const providerTypes = [
  { 
    id: "jsonrpc" as ProviderType, 
    name: "JsonRpcProvider", 
    description: "HTTP-based provider for RPC calls",
    color: "#00d4ff"
  },
  { 
    id: "websocket" as ProviderType, 
    name: "WebSocketProvider", 
    description: "Real-time updates via WebSocket",
    color: "#00ff88"
  },
  { 
    id: "browser" as ProviderType, 
    name: "BrowserProvider", 
    description: "Connect via browser wallet (Pelagus)",
    color: "#ffd93d"
  },
]

export default function ProvidersPage() {
  const [selectedType, setSelectedType] = useState<ProviderType>("jsonrpc")
  const [providerInfo, setProviderInfo] = useState<ProviderInfo>({
    type: "jsonrpc",
    status: "disconnected"
  })
  const [queryResults, setQueryResults] = useState<Record<string, string>>({})
  const [loadingQuery, setLoadingQuery] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const connectProvider = async () => {
    setProviderInfo(prev => ({ ...prev, status: "connecting" }))
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setProviderInfo({
      type: selectedType,
      status: "connected",
      chainId: "0x2328",
      blockNumber: generateMockBlockNumber(),
      shards: SHARDS,
    })
  }

  const disconnectProvider = () => {
    setProviderInfo({
      type: selectedType,
      status: "disconnected"
    })
    setQueryResults({})
  }

  const runQuery = async (queryName: string) => {
    setLoadingQuery(queryName)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const mockResults: Record<string, string> = {
      "getBlockNumber": generateMockBlockNumber().toString(),
      "getNetwork": JSON.stringify({ name: "quai", chainId: 9000 }, null, 2),
      "getGasPrice": "25000000000",
      "getBalance": "5000000000000000000",
      "getFeeData": JSON.stringify({ maxFeePerGas: "30000000000", maxPriorityFeePerGas: "1000000000" }, null, 2),
    }
    
    setQueryResults(prev => ({
      ...prev,
      [queryName]: mockResults[queryName] || "Result"
    }))
    setLoadingQuery(null)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const selectedProviderType = providerTypes.find(p => p.id === selectedType)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ffd93d]/20">
            <Network className="h-7 w-7 text-[#ffd93d]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Providers</h1>
            <p className="text-muted-foreground">Connect to the Quai Network via different provider types</p>
          </div>
        </div>

        {/* Provider Selection */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Select Provider Type</CardTitle>
            <CardDescription>Choose how you want to connect to the network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {providerTypes.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedType(provider.id)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    selectedType === provider.id
                      ? `border-[${provider.color}]/50 bg-[${provider.color}]/10`
                      : "border-border bg-muted/30 hover:border-muted-foreground/30"
                  }`}
                  style={selectedType === provider.id ? {
                    borderColor: `${provider.color}50`,
                    backgroundColor: `${provider.color}10`
                  } : {}}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: provider.color }}
                    />
                    <span className="font-medium text-foreground">{provider.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{provider.description}</p>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">RPC Endpoint</Label>
                <p className="font-mono text-sm text-foreground">{RPC_URL}</p>
              </div>
              <div className="flex items-center gap-2">
                {providerInfo.status === "connected" ? (
                  <>
                    <div className="flex items-center gap-2 rounded-full bg-[#00ff88]/20 px-3 py-1">
                      <Wifi className="h-4 w-4 text-[#00ff88]" />
                      <span className="text-sm font-medium text-[#00ff88]">Connected</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={disconnectProvider}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={connectProvider}
                    disabled={providerInfo.status === "connecting"}
                    style={{ backgroundColor: selectedProviderType?.color }}
                    className="text-background hover:opacity-90"
                  >
                    {providerInfo.status === "connecting" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wifi className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Info */}
        {providerInfo.status === "connected" && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-[#00ff88]" />
                Connection Info
              </CardTitle>
              <CardDescription>Current provider connection details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Provider Type</p>
                  <p className="mt-1 font-medium text-foreground capitalize">{providerInfo.type}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Chain ID</p>
                  <p className="mt-1 font-mono font-medium text-[#00d4ff]">{providerInfo.chainId}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Block Number</p>
                  <p className="mt-1 font-mono font-medium text-foreground">
                    {providerInfo.blockNumber?.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Shards</p>
                  <p className="mt-1 font-medium text-foreground">{providerInfo.shards?.length} zones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Queries */}
        {providerInfo.status === "connected" && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Sample Queries</CardTitle>
              <CardDescription>Test common provider methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "getBlockNumber", description: "Get the current block number" },
                { name: "getNetwork", description: "Get network information" },
                { name: "getGasPrice", description: "Get current gas price" },
                { name: "getBalance", description: "Get balance for an address" },
                { name: "getFeeData", description: "Get current fee data" },
              ].map((query) => (
                <div 
                  key={query.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div>
                    <p className="font-mono font-medium text-foreground">{query.name}()</p>
                    <p className="text-xs text-muted-foreground">{query.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {queryResults[query.name] && (
                      <div className="max-w-xs truncate rounded-md bg-[#00ff88]/10 px-3 py-1">
                        <span className="font-mono text-xs text-[#00ff88]">
                          {queryResults[query.name].length > 30 
                            ? queryResults[query.name].slice(0, 30) + "..." 
                            : queryResults[query.name]}
                        </span>
                      </div>
                    )}
                    <Button
                      size="sm"
                      onClick={() => runQuery(query.name)}
                      disabled={loadingQuery === query.name}
                      className="bg-[#00d4ff] text-background hover:bg-[#00d4ff]/90"
                    >
                      {loadingQuery === query.name ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Run
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Network Shards */}
        {providerInfo.status === "connected" && providerInfo.shards && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Globe className="h-5 w-5 text-[#00d4ff]" />
                Network Shards
              </CardTitle>
              <CardDescription>Available shards on the connected network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((region) => (
                  <div key={region} className="rounded-lg border border-border bg-muted/30 p-4">
                    <h4 className="mb-3 font-semibold text-foreground">
                      {region === 0 ? "Cyprus" : region === 1 ? "Paxos" : "Hydra"} Region
                    </h4>
                    <div className="space-y-2">
                      {providerInfo.shards?.filter(s => s.region === region).map((shard) => (
                        <div key={shard.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-[#00ff88]" />
                            <span className="text-muted-foreground">{shard.name}</span>
                          </div>
                          <Badge variant="outline" className="font-mono text-xs">
                            Zone {shard.zone}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Code Example */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">SDK Code Example</CardTitle>
            <CardDescription>How to create and use providers with the Quais SDK</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg bg-[#0a0a0f] p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("provider-code")}
                className="absolute right-2 top-2 h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {copiedText === "provider-code" ? (
                  <>
                    <Check className="h-3 w-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </Button>
              <pre className="overflow-x-auto text-sm">
                <code className="text-muted-foreground">
                  <span className="text-[#c084fc]">import</span>{" "}
                  <span className="text-foreground">{"{"}</span>{"\n"}
                  {"  "}<span className="text-[#00d4ff]">JsonRpcProvider</span>,{"\n"}
                  {"  "}<span className="text-[#00d4ff]">WebSocketProvider</span>,{"\n"}
                  {"  "}<span className="text-[#00d4ff]">BrowserProvider</span>{"\n"}
                  <span className="text-foreground">{"}"}</span>{" "}
                  <span className="text-[#c084fc]">from</span>{" "}
                  <span className="text-[#00ff88]">{`'quais'`}</span>;{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// JsonRpcProvider (HTTP)"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">jsonRpc</span> ={" "}
                  <span className="text-[#c084fc]">new</span>{" "}
                  <span className="text-[#00d4ff]">JsonRpcProvider</span>({"\n"}
                  {"  "}<span className="text-[#00ff88]">{`'https://rpc.quai.network'`}</span>,{"\n"}
                  {"  "}undefined,{"\n"}
                  {"  "}{"{"} usePathing: <span className="text-[#c084fc]">true</span> {"}"}{"\n"}
                  );{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// WebSocketProvider"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">ws</span> ={" "}
                  <span className="text-[#c084fc]">new</span>{" "}
                  <span className="text-[#00d4ff]">WebSocketProvider</span>({"\n"}
                  {"  "}<span className="text-[#00ff88]">{`'wss://rpc.quai.network'`}</span>{"\n"}
                  );{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// BrowserProvider (Pelagus)"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">browser</span> ={" "}
                  <span className="text-[#c084fc]">new</span>{" "}
                  <span className="text-[#00d4ff]">BrowserProvider</span>({"\n"}
                  {"  "}window.pelagus{"\n"}
                  );{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Query the network"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">blockNumber</span> ={" "}
                  <span className="text-[#c084fc]">await</span>{" "}
                  jsonRpc.<span className="text-[#00d4ff]">getBlockNumber</span>();
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
