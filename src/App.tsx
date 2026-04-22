import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Bridge from "./components/Bridge"
import Footer from "./components/Footer"
import Background from "./components/Background"
import WalletSidebar from "./components/WalletSidebar"

export interface CryptoToken {
  id: string
  symbol: string
  name: string
  logo: string
  priceUsd: number
  change24h: number
  chainIds: number[]     // empty array when not bridgeable via Across
  bridgeable: boolean    // true = Across can bridge this same-asset cross-chain
}

export interface TickerItem {
  symbol: string
  name: string
  price: string
  change: number
}

export interface WalletInfo {
  address:    string
  walletName: string
  balances:   Record<string, number>  // symbol(lowercase) → amount
}

function App() {
  const [tokens, setTokens] = useState<CryptoToken[]>([])
  const [tickers, setTickers] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [walletOpen, setWalletOpen] = useState(false)
  const [wallet,     setWallet]     = useState<WalletInfo | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"
        const res = await fetch(`${API_URL}/api/tokens`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setTokens(data.tokens || [])
        setTickers(data.tickers || [])
      } catch (err) {
        console.error("API error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <BrowserRouter>
      <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }} className="relative min-h-screen overflow-x-hidden">
        <Background />
        <Header
          tickers={tickers}
          wallet={wallet}
          onOpenWallet={() => setWalletOpen(true)}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Bridge
                tokens={tokens}
                loading={loading}
                wallet={wallet}
                onOpenWallet={() => setWalletOpen(true)}
              />
            }
          />
        </Routes>
        <Footer />
        <AnimatePresence>
          {walletOpen && (
            <WalletSidebar
              wallet={wallet}
              onConnect={(info) => setWallet(info)}
              onDisconnect={() => setWallet(null)}
              onClose={() => setWalletOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
