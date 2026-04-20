import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6"
import type { CryptoToken } from "../App"
import { ChainIcon, AllChainsIcon } from "../icons/ChainIcons"
import { TokenWithChain } from "../icons/TokenWithChain"

const CHAINS = [
  { id: 0,     name: "All Chains" },
  { id: 1,     name: "Ethereum"   },
  { id: 42161, name: "Arbitrum"   },
  { id: 137,   name: "Polygon"    },
  { id: 8453,  name: "Base"       },
  { id: 10,    name: "Optimism"   },
]

interface TokenModalProps {
  tokens: CryptoToken[]
  onSelect: (token: CryptoToken, chainId: number) => void
  onClose: () => void
  exclude?: string
}

function TokenModal({ tokens, onSelect, onClose, exclude }: TokenModalProps) {
  const [search, setSearch] = useState("")
  const [selectedChain, setSelectedChain] = useState(0)

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  const filtered = tokens.filter(t => {
    if (t.id === exclude) return false
    if (selectedChain !== 0 && !t.chainIds.includes(selectedChain)) return false
    if (search) {
      const q = search.toLowerCase()
      return t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <>
      {/* Backdrop — above header (header is z-100), blurs the whole app behind it */}
      <motion.div
        className="fixed inset-0 z-[150]"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[520px] sm:max-h-[580px] z-[200] flex flex-col overflow-hidden"
        style={{
          background: "var(--glass-strong)",
          border: "1px solid var(--glass-border)",
          borderRadius: 24,
          backdropFilter: "blur(40px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,245,212,0.08)",
        }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Cyan accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.5), transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)" }}>Select Token</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
          >
            <FaXmark className="text-sm" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-3">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-dim)" }} />
            <input
              autoFocus
              type="text"
              placeholder="Search token name or symbol..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(0,245,212,0.4)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--glass-border)"}
            />
          </div>
        </div>

        {/* Body: Chain filter + Token list */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chain filter — left panel */}
          <div className="w-36 flex-shrink-0 overflow-y-auto p-2 flex flex-col gap-1" style={{ borderRight: "1px solid var(--glass-border)" }}>
            {CHAINS.map(chain => {
              const active = selectedChain === chain.id
              return (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer"
                  style={{
                    background: active ? "var(--cyan-dim)" : "transparent",
                    border: active ? "1px solid rgba(0,245,212,0.3)" : "1px solid transparent",
                    color: active ? "var(--cyan)" : "var(--text-muted)",
                  }}
                >
                  {chain.id === 0 ? (
                    <AllChainsIcon size={14} className="shrink-0" />
                  ) : (
                    <ChainIcon chainId={chain.id} size={14} className="shrink-0" />
                  )}
                  <span className="truncate">{chain.name}</span>
                </button>
              )
            })}
          </div>

          {/* Token list — right panel */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-sm" style={{ color: "var(--text-muted)" }}>
                <p>No tokens found</p>
              </div>
            ) : (
              filtered.map((token, i) => (
                <motion.button
                  key={token.id}
                  onClick={() => {
                    // If user filtered to a chain the token supports, use that.
                    // Otherwise fall back to the token's first chain.
                    const chainId = selectedChain !== 0 && token.chainIds.includes(selectedChain)
                      ? selectedChain
                      : token.chainIds[0]
                    onSelect(token, chainId)
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors text-left w-full cursor-pointer"
                  style={{ background: "transparent" }}
                  whileHover={{ background: "rgba(255,255,255,0.05)" }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.012, 0.15) }}
                >
                  <TokenWithChain
                    logo={token.logo}
                    symbol={token.symbol}
                    chainId={
                      selectedChain !== 0 && token.chainIds.includes(selectedChain)
                        ? selectedChain
                        : token.chainIds[0]
                    }
                    size={36}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}>{token.symbol.toUpperCase()}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{token.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium num" style={{ color: "var(--text)" }}>${token.priceUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                    <p className="text-xs font-medium num" style={{ color: token.change24h >= 0 ? "var(--green)" : "var(--red)" }}>
                      {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%
                    </p>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default TokenModal
