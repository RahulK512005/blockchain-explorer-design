"use client"

import React from "react"
import { useState } from "react"
import { 
  Code2, 
  Copy,
  Check,
  Play,
  Loader2,
  CheckCircle2,
  Terminal
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateMockAddress, generateMockBlockNumber, generateMockTxHash } from "@/lib/quai-sdk"

interface Example {
  id: string
  title: string
  description: string
  category: string
  code: string
  output?: string
}

const examples: Example[] = [
  {
    id: "validate-address",
    title: "Validate Address",
    description: "Check if an address is a valid Quai or Qi address",
    category: "Addresses",
    code: `import { isQuaiAddress, isQiAddress } from 'quais';

const address = '0x0012345678901234567890123456789012345678';

if (isQuaiAddress(address)) {
  console.log('Valid Quai address');
} else if (isQiAddress(address)) {
  console.log('Valid Qi address');
} else {
  console.log('Invalid address');
}`,
  },
  {
    id: "connect-provider",
    title: "Connect to Provider",
    description: "Create a JsonRpcProvider connection to the Quai network",
    category: "Providers",
    code: `import { JsonRpcProvider } from 'quais';

const provider = new JsonRpcProvider(
  'https://rpc.quai.network',
  undefined,
  { usePathing: true }
);

const blockNumber = await provider.getBlockNumber();
console.log('Current block:', blockNumber);`,
  },
  {
    id: "read-contract",
    title: "Read Contract State",
    description: "Call a read-only method on a smart contract",
    category: "Contracts",
    code: `import { Contract, JsonRpcProvider } from 'quais';

const provider = new JsonRpcProvider('https://rpc.quai.network');
const tokenAddress = '0x...';
const abi = ['function symbol() view returns (string)'];

const contract = new Contract(tokenAddress, abi, provider);
const symbol = await contract.symbol();

console.log('Token symbol:', symbol);`,
  },
  {
    id: "send-transaction",
    title: "Send Transaction",
    description: "Create and send a Quai transaction",
    category: "Transactions",
    code: `import { Wallet, parseQuai } from 'quais';

const wallet = new Wallet(privateKey, provider);

const tx = {
  to: '0x...',
  value: parseQuai('1.5'),
  gasLimit: 21000n,
};

const response = await wallet.sendTransaction(tx);
const receipt = await response.wait();

console.log('Transaction confirmed:', receipt.hash);`,
  },
  {
    id: "create-hd-wallet",
    title: "Create HD Wallet",
    description: "Generate a new Quai HD wallet with mnemonic",
    category: "Wallets",
    code: `import { QuaiHDWallet, Mnemonic } from 'quais';

// Generate new mnemonic
const mnemonic = Mnemonic.fromEntropy(randomBytes(16));
console.log('Mnemonic:', mnemonic.phrase);

// Create HD wallet
const wallet = QuaiHDWallet.fromMnemonic(mnemonic);

// Derive address for Cyprus-1
const address = await wallet.getNextAddress(0, 'Cyprus-1');
console.log('Address:', address);`,
  },
  {
    id: "derive-zone-address",
    title: "Derive Zone Address",
    description: "Derive addresses for specific zones from HD wallet",
    category: "Wallets",
    code: `import { QuaiHDWallet } from 'quais';

const wallet = QuaiHDWallet.fromMnemonic(mnemonic);

// Derive addresses for different zones
const zones = ['Cyprus-1', 'Paxos-1', 'Hydra-1'];

for (const zone of zones) {
  const address = await wallet.getNextAddress(0, zone);
  console.log(\`\${zone}: \${address}\`);
}`,
  },
  {
    id: "qi-transaction",
    title: "Qi UTXO Transaction",
    description: "Send a Qi transaction using UTXO model",
    category: "Transactions",
    code: `import { QiHDWallet, QiTransaction } from 'quais';

const wallet = QiHDWallet.fromMnemonic(mnemonic);

// Get available UTXOs
const utxos = await wallet.getUtxos();

// Create Qi transaction
const tx = new QiTransaction({
  inputs: utxos.slice(0, 2),
  outputs: [
    { address: recipientAddress, amount: 1000n }
  ]
});

// Sign and send
const signed = await wallet.signTransaction(tx);
const hash = await provider.sendTransaction(signed);`,
  },
  {
    id: "cross-shard",
    title: "Cross-Shard Transfer",
    description: "Send tokens between different shards",
    category: "Transactions",
    code: `import { Wallet, parseQuai } from 'quais';

// From Cyprus-1 to Paxos-1
const fromWallet = new Wallet(privateKey, cyprusProvider);

const tx = {
  to: '0x10...', // Paxos-1 address
  value: parseQuai('5.0'),
  // Cross-shard automatically detected from address prefix
};

const response = await fromWallet.sendTransaction(tx);
// Transaction will route through Prime chain
const receipt = await response.wait();`,
  },
]

const categories = [...new Set(examples.map(e => e.category))]

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [runningExample, setRunningExample] = useState<string | null>(null)
  const [outputs, setOutputs] = useState<Record<string, string>>({})
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const filteredExamples = selectedCategory 
    ? examples.filter(e => e.category === selectedCategory)
    : examples

  const runExample = async (example: Example) => {
    setRunningExample(example.id)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate mock outputs based on example
    const mockOutputs: Record<string, string> = {
      "validate-address": "Valid Quai address",
      "connect-provider": `Current block: ${generateMockBlockNumber()}`,
      "read-contract": "Token symbol: QUAI",
      "send-transaction": `Transaction confirmed: ${generateMockTxHash()}`,
      "create-hd-wallet": `Mnemonic: abandon ability able...\nAddress: ${generateMockAddress("quai")}`,
      "derive-zone-address": `Cyprus-1: ${generateMockAddress("quai")}\nPaxos-1: ${generateMockAddress("quai")}\nHydra-1: ${generateMockAddress("quai")}`,
      "qi-transaction": `Transaction hash: ${generateMockTxHash()}`,
      "cross-shard": `Cross-shard transfer confirmed: ${generateMockTxHash()}`,
    }
    
    setOutputs(prev => ({
      ...prev,
      [example.id]: mockOutputs[example.id] || "Execution complete"
    }))
    setRunningExample(null)
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
            <Code2 className="h-7 w-7 text-[#00d4ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Examples</h1>
            <p className="text-muted-foreground">Copy-paste code snippets and run live demos</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-[#00d4ff] text-background" : ""}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-[#00d4ff] text-background" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="space-y-6">
          {filteredExamples.map((example) => (
            <Card key={example.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-foreground">{example.title}</CardTitle>
                      <Badge variant="outline" className="border-[#00d4ff]/50 text-[#00d4ff]">
                        {example.category}
                      </Badge>
                    </div>
                    <CardDescription>{example.description}</CardDescription>
                  </div>
                  <Button
                    onClick={() => runExample(example)}
                    disabled={runningExample === example.id}
                    className="gap-2 bg-[#00ff88] text-background hover:bg-[#00ff88]/90"
                  >
                    {runningExample === example.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Run Demo
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Code Block */}
                <div className="relative rounded-lg bg-[#0a0a0f] p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example.code)}
                    className="absolute right-2 top-2 h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copiedText === example.code ? (
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
                    <code className="text-muted-foreground whitespace-pre-wrap">
                      {example.code.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line.includes('import') || line.includes('const') || line.includes('for') || line.includes('if') ? (
                            <span>
                              {line.split(/(\s+)/).map((part, j) => {
                                if (['import', 'from', 'const', 'await', 'new', 'for', 'of', 'if', 'else'].includes(part)) {
                                  return <span key={j} className="text-[#c084fc]">{part}</span>
                                }
                                if (part.startsWith("'") || part.startsWith('"') || part.startsWith('`')) {
                                  return <span key={j} className="text-[#00ff88]">{part}</span>
                                }
                                return part
                              })}
                            </span>
                          ) : line.includes('//') ? (
                            <span className="text-muted-foreground/70">{line}</span>
                          ) : (
                            line
                          )}
                          {'\n'}
                        </React.Fragment>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Output */}
                {outputs[example.id] && (
                  <div className="rounded-lg border border-[#00ff88]/50 bg-[#00ff88]/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="h-4 w-4 text-[#00ff88]" />
                      <span className="text-sm font-medium text-[#00ff88]">Output</span>
                    </div>
                    <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
                      {outputs[example.id]}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Reference */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Reference</CardTitle>
            <CardDescription>Common imports and utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="font-medium text-foreground mb-2">Core Imports</h4>
                <pre className="text-xs text-muted-foreground">
{`import {
  JsonRpcProvider,
  WebSocketProvider,
  BrowserProvider,
  Contract,
  Wallet,
  QuaiHDWallet,
  QiHDWallet,
} from 'quais';`}
                </pre>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="font-medium text-foreground mb-2">Utility Functions</h4>
                <pre className="text-xs text-muted-foreground">
{`import {
  parseQuai,
  formatQuai,
  isQuaiAddress,
  isQiAddress,
  getShardForAddress,
} from 'quais';`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
