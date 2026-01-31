"use client"

import React from "react"
import { useState } from "react"
import { 
  Wallet, 
  Key,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateMockAddress, SHARDS, shortenAddress } from "@/lib/quai-sdk"

// Wallet types
const walletTypes = [
  { id: "standard", name: "Standard Wallet", description: "Single address wallet from private key" },
  { id: "hd-quai", name: "Quai HD Wallet", description: "Hierarchical Deterministic wallet for Quai" },
  { id: "hd-qi", name: "Qi HD Wallet", description: "Hierarchical Deterministic wallet for Qi" },
]

interface DerivedAddress {
  zone: string
  address: string
  index: number
}

export default function WalletsPage() {
  const [walletType, setWalletType] = useState("standard")
  const [privateKey, setPrivateKey] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddress[]>([])
  const [selectedZone, setSelectedZone] = useState("Cyprus-1")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const generateWallet = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (walletType === "standard") {
      const mockKey = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")
      setPrivateKey(mockKey)
      setWalletAddress(generateMockAddress("quai"))
    } else {
      const words = [
        "abandon", "ability", "able", "about", "above", "absent",
        "absorb", "abstract", "absurd", "abuse", "access", "accident"
      ]
      setMnemonic(words.join(" "))
      setDerivedAddresses([])
    }
    
    setIsLoading(false)
  }

  const deriveAddress = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newAddress: DerivedAddress = {
      zone: selectedZone,
      address: generateMockAddress(walletType === "hd-qi" ? "qi" : "quai"),
      index: derivedAddresses.length,
    }
    
    setDerivedAddresses(prev => [...prev, newAddress])
    setIsLoading(false)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const clearWallet = () => {
    setPrivateKey("")
    setMnemonic("")
    setWalletAddress(null)
    setDerivedAddresses([])
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#c084fc]/20">
            <Wallet className="h-7 w-7 text-[#c084fc]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Wallets</h1>
            <p className="text-muted-foreground">Create and manage Quai HD wallets and standard wallets</p>
          </div>
        </div>

        {/* Security Warning */}
        <div className="rounded-lg border border-[#ffd93d]/50 bg-[#ffd93d]/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#ffd93d] mt-0.5" />
            <div>
              <p className="font-medium text-[#ffd93d]">Security Notice</p>
              <p className="text-sm text-muted-foreground">
                This is a demo environment. Never use real private keys or mnemonics here. 
                Generated keys are for demonstration purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Type Selection */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Wallet Type</CardTitle>
            <CardDescription>Select the type of wallet to create or import</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {walletTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setWalletType(type.id)
                    clearWallet()
                  }}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    walletType === type.id
                      ? "border-[#c084fc]/50 bg-[#c084fc]/10"
                      : "border-border bg-muted/30 hover:border-muted-foreground/30"
                  }`}
                >
                  <span className="font-medium text-foreground">{type.name}</span>
                  <p className="mt-1 text-xs text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallet Creation */}
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="import">Import Existing</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Create New Wallet</CardTitle>
                <CardDescription>Generate a new {walletTypes.find(w => w.id === walletType)?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  onClick={generateWallet}
                  disabled={isLoading}
                  className="bg-[#c084fc] text-background hover:bg-[#c084fc]/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate Wallet
                    </>
                  )}
                </Button>

                {/* Standard Wallet Result */}
                {walletType === "standard" && privateKey && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">Private Key</Label>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                          >
                            {showPrivateKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(privateKey)}
                          >
                            {copiedText === privateKey ? (
                              <Check className="h-3 w-3 text-[#00ff88]" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="font-mono text-sm text-foreground break-all">
                        {showPrivateKey ? privateKey : "•".repeat(66)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#00ff88]/50 bg-[#00ff88]/10 p-4">
                      <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-mono text-sm text-[#00ff88]">{walletAddress}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => walletAddress && copyToClipboard(walletAddress)}
                        >
                          {copiedText === walletAddress ? (
                            <Check className="h-3 w-3 text-[#00ff88]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* HD Wallet Result */}
                {(walletType === "hd-quai" || walletType === "hd-qi") && mnemonic && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">Mnemonic Phrase</Label>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowMnemonic(!showMnemonic)}
                          >
                            {showMnemonic ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(mnemonic)}
                          >
                            {copiedText === mnemonic ? (
                              <Check className="h-3 w-3 text-[#00ff88]" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {mnemonic.split(" ").map((word, i) => (
                          <div key={i} className="flex items-center gap-2 rounded bg-background/50 px-2 py-1">
                            <span className="text-xs text-muted-foreground">{i + 1}.</span>
                            <span className="text-sm text-foreground">
                              {showMnemonic ? word : "••••"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Derive Addresses */}
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <Label className="text-sm font-medium text-foreground mb-3 block">
                        Derive Address by Zone
                      </Label>
                      <div className="flex gap-3">
                        <Select value={selectedZone} onValueChange={setSelectedZone}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select zone" />
                          </SelectTrigger>
                          <SelectContent>
                            {SHARDS.map((shard) => (
                              <SelectItem key={shard.name} value={shard.name}>
                                {shard.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={deriveAddress}
                          disabled={isLoading}
                          className="bg-[#00d4ff] text-background hover:bg-[#00d4ff]/90"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Derive
                        </Button>
                      </div>
                    </div>

                    {/* Derived Addresses List */}
                    {derivedAddresses.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">
                          Derived Addresses ({derivedAddresses.length})
                        </Label>
                        {derivedAddresses.map((addr, i) => (
                          <div 
                            key={i}
                            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={walletType === "hd-qi" 
                                  ? "border-[#00ff88]/50 text-[#00ff88]" 
                                  : "border-[#00d4ff]/50 text-[#00d4ff]"
                                }
                              >
                                {addr.zone}
                              </Badge>
                              <span className="font-mono text-sm text-foreground">
                                {shortenAddress(addr.address, 8)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Index: {addr.index}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(addr.address)}
                              >
                                {copiedText === addr.address ? (
                                  <Check className="h-3 w-3 text-[#00ff88]" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Import Wallet</CardTitle>
                <CardDescription>Import from private key or mnemonic phrase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {walletType === "standard" ? (
                  <div className="space-y-2">
                    <Label htmlFor="import-key">Private Key</Label>
                    <Input
                      id="import-key"
                      type="password"
                      placeholder="Enter your private key (0x...)"
                      className="font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="import-mnemonic">Mnemonic Phrase</Label>
                    <Input
                      id="import-mnemonic"
                      type="password"
                      placeholder="Enter your 12 or 24 word mnemonic"
                    />
                  </div>
                )}
                <Button className="bg-[#c084fc] text-background hover:bg-[#c084fc]/90">
                  <Key className="mr-2 h-4 w-4" />
                  Import Wallet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Code Example */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">SDK Code Example</CardTitle>
            <CardDescription>How to create and use wallets with the Quais SDK</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg bg-[#0a0a0f] p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("wallet-code")}
                className="absolute right-2 top-2 h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {copiedText === "wallet-code" ? (
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
                  {"  "}<span className="text-[#00d4ff]">Wallet</span>,{"\n"}
                  {"  "}<span className="text-[#00d4ff]">QuaiHDWallet</span>,{"\n"}
                  {"  "}<span className="text-[#00d4ff]">QiHDWallet</span>{"\n"}
                  <span className="text-foreground">{"}"}</span>{" "}
                  <span className="text-[#c084fc]">from</span>{" "}
                  <span className="text-[#00ff88]">{`'quais'`}</span>;{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Standard wallet from private key"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">wallet</span> ={" "}
                  <span className="text-[#c084fc]">new</span>{" "}
                  <span className="text-[#00d4ff]">Wallet</span>(privateKey, provider);{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Quai HD Wallet from mnemonic"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">quaiHD</span> ={" "}
                  <span className="text-[#00d4ff]">QuaiHDWallet</span>.<span className="text-[#00d4ff]">fromMnemonic</span>(mnemonic);{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">address</span> ={" "}
                  <span className="text-[#c084fc]">await</span>{" "}
                  quaiHD.<span className="text-[#00d4ff]">getNextAddress</span>(<span className="text-ffd93d">0</span>, <span className="text-[#00ff88]">{`'Cyprus-1'`}</span>);{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Qi HD Wallet"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">qiHD</span> ={" "}
                  <span className="text-[#00d4ff]">QiHDWallet</span>.<span className="text-[#00d4ff]">fromMnemonic</span>(mnemonic);
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
