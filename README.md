# Quai Vision Spark – Quai Network Explorer & Quais SDK Demo

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-000000?style=for-the-badge)](https://ui.shadcn.com/)
[![Quais SDK](https://img.shields.io/npm/v/quais/latest?style=for-the-badge&color=purple)](https://www.npmjs.com/package/quais)

Modern, responsive blockchain explorer and interactive demo application for **Quai Network** — showcasing core features of the **Quais SDK** (addresses, providers, contracts, transactions, wallets, and more).

Built upon the original v0-generated design → [Live Demo (original)](https://v0-blockchain-explorer-design-ecru.vercel.app/)

## ✨ Features

- **Dark-themed responsive UI** with sidebar navigation and top search bar
- **Network Overview Dashboard** — stats, latest blocks & transactions (mocked or real via RPC)
- **Addresses** — Validate Quai vs Qi addresses, visualize sharding (region/zone/ledger)
- **Contracts** — Connect to smart contracts, call read & write methods (requires wallet)
- **Providers** — Switch between JsonRpcProvider, WebSocketProvider, BrowserProvider (Pelagus)
- **Transactions** — Build, sign & send Quai / Qi transactions (demo mode supported)
- **Wallets** — Initialize basic Wallet, QuaiHDWallet, QiHDWallet — derive addresses by zone/account
- **Examples** — Copyable code snippets + live execution buttons for common Quais SDK patterns
- **Wallet Connection** — Supports Pelagus browser extension via `BrowserProvider`
- **Error handling & toasts** — Using sonner
- **Multi-shard support** — Uses `{ usePathing: true }` for Colosseum RPC

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Blockchain**: Quais SDK (`quais`)
- **Notifications**: sonner
- **Icons**: lucide-react
- **RPC**: `https://rpc.quai.network` (with pathing for multi-shard)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/quai-vision-spark.git
cd quai-vision-spark
2. Install dependencies
Bashnpm install
# or
pnpm install
# or
yarn install
3. Run the development server
Bashnpm run dev
# or
pnpm dev
# or
yarn dev
Open http://localhost:3000 in your browser.
4. Build for production
Bashnpm run build
npm run start
🔌 Environment Variables
Create .env.local:
env# (Optional) Only needed if you want to override default RPC
NEXT_PUBLIC_QUAI_RPC_URL=https://rpc.quai.network

# (Optional) For future features like analytics or API keys
NEXT_PUBLIC_APP_NAME="Quai Vision Spark"
Note: The app uses public RPC by default — no keys required.
🧭 Project Structure (key folders)
textapp/
├── layout.tsx                # Root layout + sidebar + topbar
├── page.tsx                  # Home / Dashboard
├── addresses/                # Address validation & sharding explorer
├── contracts/                # Contract interaction playground
├── providers/                # Provider selection & status
├── transactions/             # Tx builder & sender
├── wallets/                  # Wallet init + address derivation
└── examples/                 # SDK code demos + live runners

components/
├── ui/                       # shadcn/ui components
├── Sidebar.tsx
├── Topbar.tsx
├── NetworkSelector.tsx
├── WalletConnectButton.tsx
├── AddressValidator.tsx
├── ContractInteractor.tsx
└── ...

lib/
├── quais/                    # quais SDK helpers & utils
└── utils.ts                  # formatters, parsers, etc.

public/                       # static assets
🔐 Security Notes

Never store real private keys or mnemonics in the frontend code.
This app is for educational / demo purposes — wallet connections use injected providers only (Pelagus).
Qi transactions are experimental in Quais SDK — behavior may change.

📚 Quai Network & Quais SDK Resources

Official Docs: https://docs.qu.ai/sdk/introduction
Quais SDK: npm install quais
Block Explorer (reference): https://quaiscan.io
Main RPC (multi-shard): https://rpc.quai.network (with { usePathing: true })
Pelagus Wallet: Browser extension for Quai

🤝 Contributing
Contributions welcome!

Fork the repo
Create feature branch (git checkout -b feature/awesome-thing)
Commit changes (git commit -m 'Add awesome thing')
Push (git push origin feature/awesome-thing)
Open Pull Request

📄 License
MIT © 2026 [Rahul k]

Made with ❤️ for the Quai Network community
textFeel free to customize:

- Replace `YOUR_USERNAME` with your GitHub username
- Update year / name in license
- Add badges, screenshots, or deployment links (Vercel, Netlify, etc.) once deployed

Let me know if you'd like to add screenshots section, contribution guidelines template, or anythings
