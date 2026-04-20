import { motion } from "framer-motion"
import { FaArrowRight, FaArrowUpRightFromSquare, FaCheck, FaSpinner } from "react-icons/fa6"
import type { CryptoToken } from "../App"
import { TokenWithChain } from "../icons/TokenWithChain"
import { ChainIcon } from "../icons/ChainIcons"

export interface BridgeTx {
  id:          string
  fromSymbol:  string
  fromLogo?:   string
  toSymbol:    string
  toLogo?:     string
  fromChainId: number
  toChainId:   number
  fromAmount:  number
  toAmount:    number
  hash:        string
  timestamp:   number // ms epoch
  status:      "pending" | "filled"
}

const CHAIN_EXPLORERS: Record<number, string> = {
  1:     "https://etherscan.io/tx",
  42161: "https://arbiscan.io/tx",
  137:   "https://polygonscan.com/tx",
  8453:  "https://basescan.org/tx",
  10:    "https://optimistic.etherscan.io/tx",
}

function relativeTime(ts: number) {
  const diffSec = Math.max(1, Math.floor((Date.now() - ts) / 1000))
  if (diffSec < 60)       return `${diffSec}s ago`
  if (diffSec < 3600)     return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400)    return `${Math.floor(diffSec / 3600)}h ago`
  return `${Math.floor(diffSec / 86400)}d ago`
}

interface BridgeHistoryProps {
  history: BridgeTx[]
  tokens:  CryptoToken[]   // for logo lookup on mock entries that don't carry one
}

function BridgeHistory({ history, tokens }: BridgeHistoryProps) {
  if (history.length === 0) {
    return (
      <section className="w-full max-w-[780px] mx-auto px-4 sm:px-6 mt-2 mb-16">
        <div
          className="rounded-2xl p-10 flex flex-col items-center justify-center text-center"
          style={{ background: "var(--glass-strong)", border: "1px solid var(--glass-border)", backdropFilter: "blur(24px)" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}
          >
            <FaArrowRight />
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-head)", fontWeight: 600 }}>
            No transactions yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
            Your bridges will appear here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-[780px] mx-auto px-4 sm:px-6 mt-2 mb-16">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex flex-col">
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>
            Recent Activity
          </span>
          <span className="text-[0.7rem]" style={{ color: "var(--text-muted)" }}>
            Showing last {Math.min(history.length, 5)} bridges
          </span>
        </div>
        <span
          className="flex items-center gap-1.5 text-[0.7rem] uppercase"
          style={{
            letterSpacing: "0.08em",
            background: "var(--cyan-dim)",
            border: "1px solid rgba(0,245,212,0.25)",
            color: "var(--cyan)",
            padding: "0.3rem 0.7rem",
            borderRadius: 100,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--cyan)", animation: "pulse-dot 2s ease-in-out infinite" }} />
          Live
        </span>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--glass-strong)", border: "1px solid var(--glass-border)", backdropFilter: "blur(24px)" }}
      >
        {history.slice(0, 5).map((tx, i) => {
          const fromTok = tokens.find(t => t.symbol.toLowerCase() === tx.fromSymbol.toLowerCase())
          const toTok   = tokens.find(t => t.symbol.toLowerCase() === tx.toSymbol.toLowerCase())
          const fromLogo = tx.fromLogo || fromTok?.logo
          const toLogo   = tx.toLogo   || toTok?.logo

          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-4 sm:px-5 py-4"
              style={{
                borderBottom: i < Math.min(history.length, 5) - 1 ? "1px solid var(--glass-border)" : "none",
              }}
            >
              {/* Status orb */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: tx.status === "filled" ? "rgba(0,214,143,0.12)" : "rgba(251,191,36,0.12)",
                  border: tx.status === "filled" ? "1px solid rgba(0,214,143,0.3)" : "1px solid rgba(251,191,36,0.3)",
                  color: tx.status === "filled" ? "var(--green)" : "#fbbf24",
                }}
              >
                {tx.status === "filled"
                  ? <FaCheck className="text-xs" />
                  : <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                      <FaSpinner className="text-xs" />
                    </motion.span>
                }
              </div>

              {/* Token pair + amount */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <TokenWithChain
                    logo={fromLogo}
                    symbol={tx.fromSymbol}
                    chainId={tx.fromChainId}
                    size={24}
                    badgeSize={10}
                  />
                  <span className="num text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                    {tx.fromAmount.toLocaleString("en-US", { maximumFractionDigits: 4 })} {tx.fromSymbol.toUpperCase()}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 shrink-0" style={{ color: "var(--text-dim)" }}>
                  <FaArrowRight className="text-[0.65rem]" />
                </div>

                <div className="flex items-center gap-2 min-w-0 mt-1 sm:mt-0">
                  <TokenWithChain
                    logo={toLogo}
                    symbol={tx.toSymbol}
                    chainId={tx.toChainId}
                    size={24}
                    badgeSize={10}
                  />
                  <span className="num text-sm truncate" style={{ color: "var(--text-muted)" }}>
                    {tx.toAmount.toLocaleString("en-US", { maximumFractionDigits: 4 })} {tx.toSymbol.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Route pill (desktop) */}
              <div
                className="hidden md:flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}
              >
                <ChainIcon chainId={tx.fromChainId} size={11} />
                <FaArrowRight className="text-[0.55rem]" style={{ color: "var(--text-dim)" }} />
                <ChainIcon chainId={tx.toChainId} size={11} />
              </div>

              {/* Right: timestamp + hash */}
              <div className="flex flex-col items-end shrink-0 gap-0.5">
                <span className="text-[0.68rem] num" style={{ color: "var(--text-muted)" }}>
                  {relativeTime(tx.timestamp)}
                </span>
                <a
                  href={`${CHAIN_EXPLORERS[tx.fromChainId] ?? "https://etherscan.io/tx"}/${tx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[0.68rem] num transition-colors hover:text-[var(--cyan)]"
                  style={{ color: "var(--text-dim)" }}
                >
                  {tx.hash.slice(0, 5)}…{tx.hash.slice(-4)}
                  <FaArrowUpRightFromSquare className="text-[0.55rem]" />
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default BridgeHistory
