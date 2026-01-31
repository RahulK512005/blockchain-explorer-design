"use client"

import React from "react"
import { useState } from "react"
import { 
  FileCode, 
  Play,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  Edit3
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ERC20_ABI, type ContractMethod, generateMockAddress } from "@/lib/quai-sdk"

// Sample contract for demo
const SAMPLE_CONTRACT = "0x0012345678901234567890123456789012345678"

export default function ContractsPage() {
  const [contractAddress, setContractAddress] = useState(SAMPLE_CONTRACT)
  const [abiInput, setAbiInput] = useState(JSON.stringify(ERC20_ABI, null, 2))
  const [parsedAbi, setParsedAbi] = useState<ContractMethod[]>(ERC20_ABI)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle")
  const [results, setResults] = useState<Record<string, string>>({})
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const connectContract = () => {
    setConnectionStatus("connecting")
    // Simulate connection delay
    setTimeout(() => {
      try {
        const parsed = JSON.parse(abiInput)
        setParsedAbi(parsed)
        setConnectionStatus("connected")
      } catch {
        setConnectionStatus("error")
      }
    }, 1000)
  }

  const callMethod = async (method: ContractMethod) => {
    setLoadingMethod(method.name)
    // Simulate method call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock results based on method name
    const mockResults: Record<string, string> = {
      name: "Quai Token",
      symbol: "QUAI",
      decimals: "18",
      totalSupply: "1000000000000000000000000000",
      balanceOf: "5000000000000000000000",
    }
    
    setResults(prev => ({
      ...prev,
      [method.name]: mockResults[method.name] || "0x..."
    }))
    setLoadingMethod(null)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const readMethods = parsedAbi.filter(m => m.type === "function" && (m.stateMutability === "view" || m.stateMutability === "pure"))
  const writeMethods = parsedAbi.filter(m => m.type === "function" && (m.stateMutability === "nonpayable" || m.stateMutability === "payable"))

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#00ff88]/20">
            <FileCode className="h-7 w-7 text-[#00ff88]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contracts</h1>
            <p className="text-muted-foreground">Connect to contracts and interact with their methods</p>
          </div>
        </div>

        {/* Contract Connection */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Connect to Contract</CardTitle>
            <CardDescription>Enter a contract address and ABI to interact with it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contract-address">Contract Address</Label>
                <Input
                  id="contract-address"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <div className={`flex items-center gap-2 rounded-lg border p-3 ${
                  connectionStatus === "connected" 
                    ? "border-[#00ff88]/50 bg-[#00ff88]/10" 
                    : connectionStatus === "error"
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border bg-muted/30"
                }`}>
                  {connectionStatus === "connecting" && <Loader2 className="h-4 w-4 animate-spin text-[#00d4ff]" />}
                  {connectionStatus === "connected" && <CheckCircle2 className="h-4 w-4 text-[#00ff88]" />}
                  {connectionStatus === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                  {connectionStatus === "idle" && <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />}
                  <span className={`text-sm ${
                    connectionStatus === "connected" ? "text-[#00ff88]" :
                    connectionStatus === "error" ? "text-destructive" :
                    "text-muted-foreground"
                  }`}>
                    {connectionStatus === "idle" && "Not connected"}
                    {connectionStatus === "connecting" && "Connecting..."}
                    {connectionStatus === "connected" && "Connected"}
                    {connectionStatus === "error" && "Invalid ABI"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="abi">Contract ABI</Label>
              <Textarea
                id="abi"
                placeholder="Paste contract ABI here..."
                value={abiInput}
                onChange={(e) => setAbiInput(e.target.value)}
                className="min-h-32 font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Pre-filled with standard ERC-20 ABI for demonstration
              </p>
            </div>

            <Button 
              onClick={connectContract} 
              disabled={connectionStatus === "connecting"}
              className="bg-[#00ff88] text-background hover:bg-[#00ff88]/90"
            >
              {connectionStatus === "connecting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect to Contract"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Contract Methods */}
        {connectionStatus === "connected" && (
          <Tabs defaultValue="read" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="read" className="gap-2">
                <Eye className="h-4 w-4" />
                Read Methods ({readMethods.length})
              </TabsTrigger>
              <TabsTrigger value="write" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Write Methods ({writeMethods.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="read" className="mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Read-Only Methods</CardTitle>
                  <CardDescription>Call view/pure functions without spending gas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {readMethods.map((method) => (
                    <MethodCard 
                      key={method.name}
                      method={method}
                      onCall={() => callMethod(method)}
                      result={results[method.name]}
                      loading={loadingMethod === method.name}
                      type="read"
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="write" className="mt-4">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Write Methods</CardTitle>
                  <CardDescription>State-changing functions requiring wallet connection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-[#ffd93d]/50 bg-[#ffd93d]/10 p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[#ffd93d]" />
                      <span className="text-sm font-medium text-[#ffd93d]">Wallet Required</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Connect your wallet to execute state-changing transactions
                    </p>
                  </div>
                  {writeMethods.map((method) => (
                    <MethodCard 
                      key={method.name}
                      method={method}
                      onCall={() => {}}
                      result={undefined}
                      loading={false}
                      type="write"
                      disabled
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Code Example */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">SDK Code Example</CardTitle>
            <CardDescription>How to interact with contracts using the Quais SDK</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg bg-[#0a0a0f] p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("contract-code")}
                className="absolute right-2 top-2 h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {copiedText === "contract-code" ? (
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
                  <span className="text-[#00d4ff]">Contract</span>,{" "}
                  <span className="text-[#00d4ff]">JsonRpcProvider</span>{" "}
                  <span className="text-foreground">{"}"}</span>{" "}
                  <span className="text-[#c084fc]">from</span>{" "}
                  <span className="text-[#00ff88]">{`'quais'`}</span>;{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Connect to provider"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">provider</span> ={" "}
                  <span className="text-[#c084fc]">new</span>{" "}
                  <span className="text-[#00d4ff]">JsonRpcProvider</span>({"\n"}
                  {"  "}<span className="text-[#00ff88]">{`'https://rpc.quai.network'`}</span>{"\n"}
                  );{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Create contract instance"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">contract</span> ={" "}
                  <span className="text-[#c084fc]">new</span>{" "}
                  <span className="text-[#00d4ff]">Contract</span>({"\n"}
                  {"  "}contractAddress,{"\n"}
                  {"  "}abi,{"\n"}
                  {"  "}provider{"\n"}
                  );{"\n\n"}
                  
                  <span className="text-muted-foreground">{"// Call read method"}</span>{"\n"}
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-foreground">symbol</span> ={" "}
                  <span className="text-[#c084fc]">await</span>{" "}
                  contract.<span className="text-[#00d4ff]">symbol</span>();
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MethodCard({ 
  method, 
  onCall, 
  result, 
  loading,
  type,
  disabled = false
}: { 
  method: ContractMethod
  onCall: () => void
  result?: string
  loading: boolean
  type: "read" | "write"
  disabled?: boolean
}) {
  const [inputs, setInputs] = useState<Record<string, string>>({})

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium text-foreground">{method.name}</span>
          <Badge variant="outline" className={
            type === "read" ? "border-[#00d4ff]/50 text-[#00d4ff]" : "border-[#ffd93d]/50 text-[#ffd93d]"
          }>
            {method.stateMutability}
          </Badge>
        </div>
        <Button
          size="sm"
          onClick={onCall}
          disabled={loading || disabled}
          className={type === "read" 
            ? "bg-[#00d4ff] text-background hover:bg-[#00d4ff]/90" 
            : "bg-[#ffd93d] text-background hover:bg-[#ffd93d]/90"
          }
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Play className="mr-1 h-3 w-3" />
              {type === "read" ? "Query" : "Write"}
            </>
          )}
        </Button>
      </div>

      {method.inputs.length > 0 && (
        <div className="mb-3 space-y-2">
          {method.inputs.map((input) => (
            <div key={input.name} className="flex items-center gap-2">
              <Label className="min-w-20 text-xs text-muted-foreground">
                {input.name} ({input.type})
              </Label>
              <Input
                placeholder={`Enter ${input.type}`}
                value={inputs[input.name] || ""}
                onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: e.target.value }))}
                className="h-8 flex-1 font-mono text-xs"
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="rounded-md border border-[#00ff88]/50 bg-[#00ff88]/10 p-3">
          <p className="text-xs text-muted-foreground mb-1">Result:</p>
          <p className="font-mono text-sm text-[#00ff88] break-all">{result}</p>
        </div>
      )}
    </div>
  )
}
