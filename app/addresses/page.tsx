"use client"

import React from "react"
import { useState } from "react"
import { 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  Copy,
  Check,
  Sparkles,
  Info
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  isQuaiAddress, 
  isQiAddress, 
  getAddressType, 
  getShardInfo,
  generateMockAddress,
  SHARDS,
  type ShardInfo
} from "@/lib/quai-sdk"

// Example addresses for demonstration
const exampleAddresses = [
  { address: "0x0012345678901234567890123456789012345678", type: "quai", description: "Cyprus-1 Quai" },
  { address: "0x1012345678901234567890123456789012345678", type: "quai", description: "Paxos-1 Quai" },
  { address: "0x2012345678901234567890123456789012345678", type: "qi", description: "Cyprus-1 Qi" },
  { address: "0x3012345678901234567890123456789012345678", type: "qi", description: "Paxos-1 Qi" },
]

export default function AddressesPage() {
  const [inputAddress, setInputAddress] = useState("")
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    type: "quai" | "qi" | "unknown"
    shardInfo: ShardInfo | null
  } | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const validateAddress = () => {
    if (!inputAddress) return

    const type = getAddressType(inputAddress)
    const shardInfo = getShardInfo(inputAddress)
    
    setValidationResult({
      isValid: type !== "unknown",
      type,
      shardInfo,
    })
  }

  const generateAddress = (ledger: "quai" | "qi") => {
    const address = generateMockAddress(ledger)
    setInputAddress(address)
    setValidationResult(null)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#00d4ff]/20 glow-cyan">
            <KeyRound className="h-7 w-7 text-[#00d4ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Addresses</h1>
            <p className="text-muted-foreground">Validate and explore Quai/Qi address structures</p>
          </div>
        </div>

        {/* Address Validation Tool */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Address Validator</CardTitle>
            <CardDescription>Check if an address is valid Quai or Qi and view its shard information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  placeholder="Enter address (0x...)"
                  value={inputAddress}
                  onChange={(e) => {
                    setInputAddress(e.target.value)
                    setValidationResult(null)
                  }}
                  className="flex-1 font-mono"
                />
                <Button onClick={validateAddress} className="bg-[#00d4ff] text-background hover:bg-[#00d4ff]/90">
                  Validate
                </Button>
              </div>
            </div>

            {/* Quick Generate */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Generate sample:</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateAddress("quai")}
                className="gap-2 border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/10"
              >
                <Sparkles className="h-3 w-3" />
                Quai Address
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => generateAddress("qi")}
                className="gap-2 border-[#00ff88]/50 text-[#00ff88] hover:bg-[#00ff88]/10"
              >
                <Sparkles className="h-3 w-3" />
                Qi Address
              </Button>
            </div>

            {/* Validation Result */}
            {validationResult && (
              <div className={`rounded-lg border p-4 ${
                validationResult.isValid 
                  ? "border-[#00ff88]/50 bg-[#00ff88]/10" 
                  : "border-destructive/50 bg-destructive/10"
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  {validationResult.isValid ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-[#00ff88]" />
                      <span className="font-medium text-[#00ff88]">Valid {validationResult.type.toUpperCase()} Address</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-destructive" />
                      <span className="font-medium text-destructive">Invalid Address</span>
                    </>
                  )}
                </div>

                {validationResult.shardInfo && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-md border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Ledger</p>
                      <p className="mt-1 font-semibold text-foreground capitalize">{validationResult.shardInfo.ledger}</p>
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Shard</p>
                      <p className="mt-1 font-semibold text-foreground">{validationResult.shardInfo.shard}</p>
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Region / Zone</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {validationResult.shardInfo.region} / {validationResult.shardInfo.zone}
                      </p>
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Binary Prefix</p>
                      <p className="mt-1 font-mono font-semibold text-[#00d4ff]">
                        {validationResult.shardInfo.binaryPrefix}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address Structure Explanation */}
        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="prefixes">Prefixes</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="mt-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Address Structure</CardTitle>
                <CardDescription>How Quai Network addresses are organized</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-[#00d4ff]" />
                    <span className="font-medium text-foreground">Sharded Address Format</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Quai Network uses a hierarchical sharding system with 3 regions, each containing 3 zones, 
                    for a total of 9 shards. The first byte of an address encodes its ledger type (Quai/Qi), 
                    region, and zone information.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-[#00d4ff]/50 bg-[#00d4ff]/10 p-4">
                    <h4 className="font-semibold text-[#00d4ff] mb-2">Quai Addresses</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Binary prefix: <code className="text-[#00d4ff]">00xxxxxx</code>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hex range: <code className="text-[#00d4ff]">0x00 - 0x1F</code>
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#00ff88]/50 bg-[#00ff88]/10 p-4">
                    <h4 className="font-semibold text-[#00ff88] mb-2">Qi Addresses</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Binary prefix: <code className="text-[#00ff88]">01xxxxxx</code>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hex range: <code className="text-[#00ff88]">0x20 - 0x3F</code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prefixes" className="mt-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Shard Prefixes</CardTitle>
                <CardDescription>Binary prefixes for each shard in the network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Shard</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Region</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Zone</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quai Prefix</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Qi Prefix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SHARDS.map((shard) => (
                        <tr key={shard.name} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium text-foreground">{shard.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{shard.region}</td>
                          <td className="px-4 py-3 text-muted-foreground">{shard.zone}</td>
                          <td className="px-4 py-3 font-mono text-[#00d4ff]">0x{shard.prefix}</td>
                          <td className="px-4 py-3 font-mono text-[#00ff88]">
                            0x{(parseInt(shard.prefix, 16) + 0x20).toString(16).padStart(2, "0")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="mt-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Example Addresses</CardTitle>
                <CardDescription>Sample addresses for testing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exampleAddresses.map((example) => (
                    <div 
                      key={example.address}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          example.type === "quai" ? "bg-[#00d4ff]" : "bg-[#00ff88]"
                        }`} />
                        <div>
                          <p className="font-mono text-sm text-foreground">{example.address}</p>
                          <p className="text-xs text-muted-foreground">{example.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          example.type === "quai" 
                            ? "bg-[#00d4ff]/20 text-[#00d4ff]" 
                            : "bg-[#00ff88]/20 text-[#00ff88]"
                        }`}>
                          {example.type.toUpperCase()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(example.address)}
                          className="h-8 w-8"
                        >
                          {copiedText === example.address ? (
                            <Check className="h-4 w-4 text-[#00ff88]" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Code Example */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">SDK Code Example</CardTitle>
            <CardDescription>How to validate addresses using the Quais SDK</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg bg-[#0a0a0f] p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("sdk-code")}
                className="absolute right-2 top-2 h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {copiedText === "sdk-code" ? (
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
                  <span className="text-foreground">{"{"}</span>{" "}
                  <span className="text-[#00d4ff]">isQuaiAddress</span>,{" "}
                  <span className="text-[#00d4ff]">isQiAddress</span>{" "}
                  <span className="text-foreground">{"}"}</span>{" "}
                  <span className="text-[#c084fc]">from</span>{" "}
                  <span className="text-[#00ff88]">{`'quais'`}</span>;{"\n\n"}
                  <span className="text-muted-foreground">{"// Validate address type"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">address</span> ={" "}
                  <span className="text-[#00ff88]">{`'0x00123...789'`}</span>;{"\n\n"}
                  <span className="text-[#c084fc]">if</span> (
                  <span className="text-[#00d4ff]">isQuaiAddress</span>(address)) {"{"}
                  {"\n"}  console.<span className="text-[#00d4ff]">log</span>(<span className="text-[#00ff88]">{`'Valid Quai address'`}</span>);{"\n"}
                  {"}"} <span className="text-[#c084fc]">else if</span> (
                  <span className="text-[#00d4ff]">isQiAddress</span>(address)) {"{"}
                  {"\n"}  console.<span className="text-[#00d4ff]">log</span>(<span className="text-[#00ff88]">{`'Valid Qi address'`}</span>);{"\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
