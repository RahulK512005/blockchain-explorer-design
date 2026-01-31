"use client"

import React from "react"
import { useState } from "react"
import { 
  ArrowRightLeft, 
  Send,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Info,
  Zap,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  generateMockAddress, 
  generateMockTxHash,
  shortenHash,
  type TransactionType
} from "@/lib/quai-sdk"

// Transaction types explanation
const transactionTypes = [
  {
    type: "quai" as TransactionType,
    name: "Quai Transaction",
    description: "Standard account-based transaction for the Quai ledger",
    color: "#00d4ff",
    features: ["Account model", "Smart contract support", "EVM compatible"]
  },
  {
    type: "qi" as TransactionType,
    name: "Qi Transaction",
    description: "UTXO-based transaction for the Qi ledger",
    color: "#00ff88",
    features: ["UTXO model", "Privacy features", "Merge-mining rewards"]
  },
  {
    type: "external" as TransactionType,
    name: "External Transaction",
    description: "Cross-shard transaction between different zones",
    color: "#ffd93d",
    features: ["Cross-shard", "Atomic execution", "Automatic routing"]
  },
]

// Mock recent transactions
const mockRecentTxs = Array.from({ length: 5 }, (_, i) => ({
  hash: generateMockTxHash(),
  from: generateMockAddress("quai"),
  to: generateMockAddress("quai"),
  value: (Math.random() * 10).toFixed(4),
  type: ["quai", "qi", "external"][Math.floor(Math.random() * 3)] as TransactionType,
  status: (["success", "pending", "success", "success", "failed"] as const)[i],
  time: `${i * 2 + 1}m ago`,
}))

export default function TransactionsPage() {
  const [txType, setTxType] = useState<TransactionType>("quai")
  const [fromAddress, setFromAddress] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [value, setValue] = useState("")
  const [data, setData] = useState("")
  const [isSigning, setIsSigning] = useState(false)
  const [signedTx, setSignedTx] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleSign = async () => {
    setIsSigning(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSignedTx(generateMockTxHash())
    setIsSigning(false)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const fillSample = () => {
    setFromAddress(generateMockAddress(txType === "qi" ? "qi" : "quai"))
    setToAddress(generateMockAddress(txType === "qi" ? "qi" : "quai"))
    setValue("1.5")
    setData("")
    setSignedTx(null)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff6b6b]/20">
            <ArrowRightLeft className="h-7 w-7 text-[#ff6b6b]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground">Build, sign, and send transactions on the Quai Network</p>
          </div>
        </div>

        {/* Transaction Types */}
        <div className="grid gap-4 md:grid-cols-3">
          {transactionTypes.map((tx) => (
            <Card 
              key={tx.type}
              className={`border-border bg-card transition-all cursor-pointer ${
                txType === tx.type ? "ring-2" : "hover:border-muted-foreground/30"
              }`}
              style={txType === tx.type ? { borderColor: tx.color, boxShadow: `0 0 20px ${tx.color}20` } : {}}
              onClick={() => setTxType(tx.type)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tx.color }}
                  />
                  <span className="font-semibold text-foreground">{tx.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{tx.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tx.features.map((feature) => (
                    <Badge 
                      key={feature} 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: `${tx.color}50`, color: tx.color }}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transaction Builder */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Transaction Builder</CardTitle>
                <CardDescription>Create and sign a {txType} transaction</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fillSample}
                className="gap-2 bg-transparent"
              >
                <Zap className="h-3 w-3" />
                Fill Sample
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from">From Address</Label>
                <Input
                  id="from"
                  placeholder="0x..."
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To Address</Label>
                <Input
                  id="to"
                  placeholder="0x..."
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="value">Value ({txType === "qi" ? "QI" : "QUAI"})</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="0.0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gas">Gas Limit (optional)</Label>
                <Input
                  id="gas"
                  placeholder="21000"
                  defaultValue="21000"
                />
              </div>
            </div>

            {txType === "quai" && (
              <div className="space-y-2">
                <Label htmlFor="data">Data (optional)</Label>
                <Textarea
                  id="data"
                  placeholder="0x..."
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            )}

            <div className="rounded-lg border border-[#ffd93d]/50 bg-[#ffd93d]/10 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#ffd93d]" />
                <span className="text-sm font-medium text-[#ffd93d]">Wallet Required</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect your wallet to sign and send this transaction
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSign}
                disabled={isSigning || !fromAddress || !toAddress || !value}
                className="bg-[#00d4ff] text-background hover:bg-[#00d4ff]/90"
              >
                {isSigning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  "Sign Transaction"
                )}
              </Button>
              <Button 
                variant="outline"
                disabled={!signedTx}
                className="gap-2 bg-transparent"
              >
                <Send className="h-4 w-4" />
                Send Transaction
              </Button>
            </div>

            {signedTx && (
              <div className="rounded-lg border border-[#00ff88]/50 bg-[#00ff88]/10 p-4">
                <p className="text-xs text-muted-foreground mb-1">Signed Transaction Hash:</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-[#00ff88]">{signedTx}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(signedTx)}
                    className="h-8 w-8"
                  >
                    {copiedText === signedTx ? (
                      <Check className="h-4 w-4 text-[#00ff88]" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
            <CardDescription>Latest transactions on the network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentTxs.map((tx) => (
                <div 
                  key={tx.hash}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ 
                        backgroundColor: tx.type === "quai" ? "#00d4ff20" : 
                          tx.type === "qi" ? "#00ff8820" : "#ffd93d20" 
                      }}
                    >
                      <ArrowRightLeft 
                        className="h-5 w-5"
                        style={{ 
                          color: tx.type === "quai" ? "#00d4ff" : 
                            tx.type === "qi" ? "#00ff88" : "#ffd93d" 
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-[#00d4ff]">{shortenHash(tx.hash)}</p>
                      <p className="text-xs text-muted-foreground">
                        {shortenHash(tx.from, 4)} <ArrowRight className="inline h-3 w-3" /> {shortenHash(tx.to, 4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline"
                      className="capitalize"
                      style={{ 
                        borderColor: tx.type === "quai" ? "#00d4ff50" : 
                          tx.type === "qi" ? "#00ff8850" : "#ffd93d50",
                        color: tx.type === "quai" ? "#00d4ff" : 
                          tx.type === "qi" ? "#00ff88" : "#ffd93d"
                      }}
                    >
                      {tx.type}
                    </Badge>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{tx.value} QUAI</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${
                      tx.status === "success" ? "bg-[#00ff88]" :
                      tx.status === "pending" ? "bg-[#ffd93d] animate-pulse" :
                      "bg-destructive"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">SDK Code Example</CardTitle>
            <CardDescription>How to create and send transactions using the Quais SDK</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg bg-[#0a0a0f] p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("tx-code")}
                className="absolute right-2 top-2 h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {copiedText === "tx-code" ? (
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
                  <span className="text-[#00d4ff]">Wallet</span>,{" "}
                  <span className="text-[#00d4ff]">parseQuai</span>{" "}
                  <span className="text-foreground">{"}"}</span>{" "}
                  <span className="text-[#c084fc]">from</span>{" "}
                  <span className="text-[#00ff88]">{`'quais'`}</span>;{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Create transaction"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">tx</span> = {"{"}
                  {"\n"}  to: <span className="text-[#00ff88]">{`'0x...'`}</span>,
                  {"\n"}  value: <span className="text-[#00d4ff]">parseQuai</span>(<span className="text-[#00ff88]">{`'1.5'`}</span>),
                  {"\n"}  gasLimit: <span className="text-[#ffd93d]">21000n</span>,
                  {"\n"}{"}"};{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Sign and send"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">wallet</span> ={" "}
                  <span className="text-[#c084fc]">new</span>{" "}
                  <span className="text-[#00d4ff]">Wallet</span>(privateKey, provider);{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">response</span> ={" "}
                  <span className="text-[#c084fc]">await</span>{" "}
                  wallet.<span className="text-[#00d4ff]">sendTransaction</span>(tx);{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Wait for confirmation"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">receipt</span> ={" "}
                  <span className="text-[#c084fc]">await</span>{" "}
                  response.<span className="text-[#00d4ff]">wait</span>();
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
