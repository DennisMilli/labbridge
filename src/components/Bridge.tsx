import { useState, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowDown, FaWallet, FaArrowRight } from "react-icons/fa6"
import TokenModal from "./TokenModal"
import ReviewModal from "./ReviewModal"
import BridgeHistory, { type BridgeTx } from "./BridgeHistory"
import type { CryptoToken, WalletInfo } from "../App"
import { TokenWithChain } from "../icons/TokenWithChain"
import { ChainIcon, CHAIN_META } from "../icons/ChainIcons"

interface BridgeProps {
  tokens: CryptoToken[]
  loading: boolean
  wallet: WalletInfo | null
  onOpenWallet: () => void
}

const CHAINS: Record<number, { name: string; color: string }> = {
  1:     { name: "Ethereum", color: "#627EEA" },
  42161: { name: "Arbitrum", color: "#28A0F0" },
  137:   { name: "Polygon",  color: "#8247E5" },
  8453:  { name: "Base",     color: "#0052FF" },
  10:    { name: "Optimism", color: "#FF0420" },
}

function TokenButton({ token, chainId, onClick }: { token: CryptoToken | null; chainId: number | null; onClick: () => void }) {
  const chain = chainId ? CHAINS[chainId] : null

  return (
    <button
      onClick={onClick}
      title={token && chain ? `${token.symbol.toUpperCase()} · ${chain.name}` : undefined}
      className="flex items-center gap-2 rounded-xl transition-all shrink-0 self-start hover:brightness-110 max-w-[50%] sm:max-w-[38%]"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid var(--glass-border)",
        padding: "0.4rem 0.65rem",
      }}
    >
      {token ? (
        <>
          <TokenWithChain logo={token.logo} symbol={token.symbol} chainId={chainId} size={28} badgeSize={12} />
          <span aria-hidden className="shrink-0" style={{ width: 1, height: 26, background: "var(--glass-border)" }} />
          <div className="flex flex-col items-start leading-tight min-w-0">
            <span
              className="font-bold text-[0.82rem] truncate w-full"
              style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
            >
              {token.symbol.toUpperCase()}
            </span>
            <span
              className="text-[0.62rem] truncate w-full"
              style={{ color: chain ? chain.color : "var(--text-muted)", letterSpacing: "0.02em" }}
            >
              {chain ? chain.name : "—"}
            </span>
          </div>
        </>
      ) : (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Select</span>
      )}
      <svg className="w-2.5 h-2.5 ml-0.5 shrink-0" viewBox="0 0 10 6" fill="none" style={{ color: "var(--text-dim)" }}>
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

function Bridge({ tokens, loading, wallet, onOpenWallet }: BridgeProps) {
  const [fromToken, setFromToken] = useState<CryptoToken | null>(null)
  const [toToken,   setToToken]   = useState<CryptoToken | null>(null)
  const [fromChainId, setFromChainId] = useState<number | null>(null)
  const [toChainId,   setToChainId]   = useState<number | null>(null)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount,   setToAmount]   = useState("")
  const [modalFor, setModalFor] = useState<"from" | "to" | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)

  // ── Bridge tx history — seeded with a few mocks so the card isn't empty
  const [history, setHistory] = useState<BridgeTx[]>(() => {
    const now = Date.now()
    const rand = () => "0x" + Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")
    return [
      {
        id: "seed-1", fromSymbol: "usdc", toSymbol: "usdc",
        fromChainId: 1, toChainId: 42161,
        fromAmount: 250, toAmount: 249.95,
        hash: rand(), timestamp: now - 2 * 60_000, status: "filled",
      },
      {
        id: "seed-2", fromSymbol: "eth", toSymbol: "eth",
        fromChainId: 42161, toChainId: 10,
        fromAmount: 0.5, toAmount: 0.4998,
        hash: rand(), timestamp: now - 47 * 60_000, status: "filled",
      },
      {
        id: "seed-3", fromSymbol: "dai", toSymbol: "dai",
        fromChainId: 1, toChainId: 8453,
        fromAmount: 1200, toAmount: 1199.8,
        hash: rand(), timestamp: now - 4 * 60 * 60_000, status: "filled",
      },
    ]
  })

  function addTxToHistory(hash: string) {
    if (!fromToken || !toToken || !fromChainId || !toChainId) return
    const newTx: BridgeTx = {
      id:          `${Date.now()}`,
      fromSymbol:  fromToken.symbol,
      fromLogo:    fromToken.logo,
      toSymbol:    toToken.symbol,
      toLogo:      toToken.logo,
      fromChainId,
      toChainId,
      fromAmount:  parseFloat(fromAmount || "0"),
      toAmount:    parseFloat(toAmount   || "0"),
      hash,
      timestamp:   Date.now(),
      status:      "pending",
    }
    setHistory(prev => [newTx, ...prev])
    // Mock: flip to "filled" after ~3s to match Across's fast fill times
    setTimeout(() => {
      setHistory(prev => prev.map(t => t.id === newTx.id ? { ...t, status: "filled" } : t))
    }, 3000)
  }
  const [acrossFee,    setAcrossFee]    = useState<string | null>(null)
  const [acrossTime,   setAcrossTime]   = useState<string | null>(null)
  const [acrossSource, setAcrossSource] = useState<string | null>(null)

  // Set defaults once tokens load — pick a real Across route (USDC Eth → USDC Arb)
  // so the live quote + est-time populate out of the box.
  useEffect(() => {
    if (tokens.length > 0 && !fromToken && !toToken) {
      const eth  = tokens.find(t => t.symbol.toLowerCase() === "eth")  || tokens[0]
      const usdc = tokens.find(t => t.symbol.toLowerCase() === "usdc") || tokens[1]
      setFromToken(eth)
      setToToken(usdc)
      setFromChainId(eth.chainIds.includes(1) ? 1 : eth.chainIds[0])
      setToChainId(usdc.chainIds.includes(42161) ? 42161 : usdc.chainIds[0])
    }
  }, [tokens, fromToken, toToken])

  function convert(amount: string, from: CryptoToken | null, to: CryptoToken | null) {
    if (!from || !to || !amount || isNaN(parseFloat(amount))) return ""
    return ((parseFloat(amount) * from.priceUsd) / to.priceUsd).toFixed(4)
  }

  function handleFromAmountChange(val: string) {
    setFromAmount(val)
    setToAmount(convert(val, fromToken, toToken))
  }

  function handleToAmountChange(val: string) {
    setToAmount(val)
    setFromAmount(convert(val, toToken, fromToken))
  }

  function handleSwap() {
    const pf = fromToken, pt = toToken
    const pfc = fromChainId, ptc = toChainId
    setFromToken(pt); setToToken(pf)
    setFromChainId(ptc); setToChainId(pfc)
    if (fromAmount) setToAmount(convert(fromAmount, pt, pf))
  }

  function handleSelectToken(token: CryptoToken, chainId: number) {
    if (modalFor === "from") {
      setFromToken(token)
      setFromChainId(chainId)
      if (fromAmount) setToAmount(convert(fromAmount, token, toToken))
    } else {
      setToToken(token)
      setToChainId(chainId)
      if (fromAmount) setToAmount(convert(fromAmount, fromToken, token))
    }
    setModalFor(null)
  }

  // Across fee fetch
  useEffect(() => {
    if (!fromToken || !toToken || !fromChainId || !toChainId || !fromAmount || parseFloat(fromAmount) <= 0) {
      setAcrossFee(null); setAcrossTime(null); setAcrossSource(null); return
    }
    const t = setTimeout(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"
        const qs = new URLSearchParams({
          fromSymbol:   fromToken.symbol,
          fromChainId:  String(fromChainId),
          toSymbol:     toToken.symbol,
          toChainId:    String(toChainId),
          amount:       fromAmount,
          fromPriceUsd: String(fromToken.priceUsd),
        })
        const res = await fetch(`${API_URL}/api/across-fee?${qs}`)
        if (!res.ok) return
        const data = await res.json()
        setAcrossFee(data.fee || null)
        setAcrossTime(data.estimatedTime && data.estimatedTime !== "—" ? data.estimatedTime : null)
        setAcrossSource(data.source || null)
      } catch { /* silent */ }
    }, 600)
    return () => clearTimeout(t)
  }, [fromToken, toToken, fromChainId, toChainId, fromAmount])

  const rate = fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0
    ? `1 ${fromToken.symbol.toUpperCase()} = ${(fromToken.priceUsd / toToken.priceUsd).toFixed(4)} ${toToken.symbol.toUpperCase()}`
    : null

  return (
    <>
    <main
      className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 w-full max-w-6xl mx-auto"
      style={{ padding: "5rem 4rem", minHeight: "calc(100vh - 140px)" }}
    >
      {/* ── Hero copy ── */}
      <motion.div
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2"
          style={{
            background: "var(--cyan-dim)",
            border: "1px solid rgba(0,245,212,0.2)",
            color: "var(--cyan)",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0.35rem 0.9rem",
            borderRadius: 100,
            marginBottom: "1.5rem",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--cyan)", animation: "pulse-dot 2s ease-in-out infinite", flexShrink: 0 }} />
          Powered by Across Protocol v4
        </div>

        <h1
          className="font-extrabold leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--font-head)", fontSize: "clamp(2rem,3.5vw,3.2rem)", letterSpacing: "-0.03em", marginBottom: "1.5rem" }}
        >
          Bridge Crypto<br />
          at <span style={{ color: "var(--cyan)" }}>Lightning</span> Speed.
        </h1>

        <p className="max-w-sm mx-auto lg:mx-0" style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
          Instant cross-chain transfers with live rates from CoinGecko. Move ETH, USDC, and 50+ tokens across Ethereum, Arbitrum, Base, and more.
        </p>

        {/* Supported chains strip */}
        <div className="flex flex-col gap-2 items-center lg:items-start" style={{ marginBottom: "2rem" }}>
          <span className="text-[0.68rem] uppercase" style={{ color: "var(--text-dim)", letterSpacing: "0.14em" }}>
            Supported Networks
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
            {Object.entries(CHAIN_META).map(([id, meta]) => (
              <div
                key={id}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--glass-border)",
                }}
                title={meta.name}
              >
                <ChainIcon chainId={Number(id)} size={14} />
                <span className="text-[0.7rem]" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                  {meta.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Converter card ── */}
      <motion.div
        className="w-full max-w-[420px] mx-auto lg:mx-0 flex-shrink-0 relative overflow-hidden flex flex-col gap-5 p-6"
        style={{
          background: "var(--glass-strong)",
          border: "1px solid var(--glass-border)",
          borderRadius: 24,
          backdropFilter: "blur(32px)",
          animation: "float 6s ease-in-out infinite",
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        {/* Cyan top line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.5), transparent)" }} />
        {/* Internal glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 0%, rgba(0,245,212,0.06), transparent 60%)" }} />

        {/* Card header */}
        <div className="flex items-center justify-between relative">
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem" }}>Bridge</span>
          <span
            className="flex items-center rounded-full"
            style={{
              gap: "0.4rem",
              background: "rgba(0,214,143,0.12)",
              border: "1px solid rgba(0,214,143,0.25)",
              color: "var(--green)",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "0.25rem 0.65rem",
              borderRadius: 100,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", animation: "pulse-dot 1.5s ease-in-out infinite", flexShrink: 0 }} />
            Live
          </span>
        </div>

        {/* FROM */}
        <div className="relative">
          <label className="block mb-2 text-[0.72rem] uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.07em" }}>You Send</label>
          <div className="input-box">
            <div className="flex-1 flex flex-col min-w-0">
              <input
                type="number" placeholder="0.00" value={fromAmount}
                onChange={e => handleFromAmountChange(e.target.value)}
                className="bg-transparent outline-none w-full num"
                style={{ fontSize: "1.55rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}
              />
              <div className="flex items-center justify-between gap-2 mt-1 text-xs" style={{ color: "var(--text-dim)" }}>
                <span className="num">
                  {fromToken && fromAmount
                    ? `≈ $${(parseFloat(fromAmount) * fromToken.priceUsd).toLocaleString("en-US", { maximumFractionDigits: 2 })}`
                    : ""}
                </span>
                {wallet && fromToken && (
                  <span>
                    Balance:{" "}
                    <span className="num" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                      {(wallet.balances[fromToken.symbol.toLowerCase()] ?? 0).toLocaleString("en-US", { maximumFractionDigits: 4 })}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <TokenButton token={fromToken} chainId={fromChainId} onClick={() => setModalFor("from")} />
          </div>
        </div>

        {/* Swap — negative margin pulls it closer to sibling inputs */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleSwap}
            className="rounded-full flex items-center justify-center transition-all hover:rotate-180 active:scale-90"
            style={{ width: 40, height: 40, background: "var(--cyan-dim)", border: "1px solid rgba(0,245,212,0.25)", color: "var(--cyan)", fontSize: "1rem" }}
          >
            <FaArrowDown />
          </button>
        </div>

        {/* TO */}
        <div className="relative">
          <label className="block mb-2 text-[0.72rem] uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.07em" }}>They Receive</label>
          <div className="input-box">
            <div className="flex-1 flex flex-col min-w-0">
              <input
                type="number" placeholder="0.00" value={toAmount}
                onChange={e => handleToAmountChange(e.target.value)}
                className="bg-transparent outline-none w-full num"
                style={{ fontSize: "1.55rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}
              />
              {toToken && toAmount && (
                <span className="text-xs mt-1 num" style={{ color: "var(--text-dim)" }}>
                  ≈ ${(parseFloat(toAmount) * toToken.priceUsd).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
            <TokenButton token={toToken} chainId={toChainId} onClick={() => setModalFor("to")} />
          </div>
        </div>

        {/* Rate bar */}
        <AnimatePresence>
          {rate && (
            <motion.div
              className="flex flex-col gap-2 rounded-xl px-4 py-3 text-xs"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Rate</span>
                <span className="num" style={{ color: "var(--cyan)", fontWeight: 500 }}>{rate}</span>
              </div>
              {acrossSource === "across" ? (
                <>
                  {acrossFee && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Bridge Fee</span>
                      <span className="num" style={{ color: "var(--green)", fontWeight: 500 }}>{acrossFee}</span>
                    </div>
                  )}
                  {acrossTime && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Est. Time</span>
                      <span className="num" style={{ color: "#60a5fa", fontWeight: 500 }}>{acrossTime}</span>
                    </div>
                  )}
                </>
              ) : acrossFee ? (
                <div
                  className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 -mx-1 mt-0.5"
                  style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.15)" }}
                >
                  <svg className="w-3 h-3 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none" style={{ color: "#fbbf24" }}>
                    <path d="M10 2l9 16H1L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M10 8v4M10 15v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[0.72rem]" style={{ color: "var(--text-muted)" }}>
                    {acrossFee}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>Protocol</span>
                <span style={{ color: "var(--cyan)", fontWeight: 500 }}>Across v4</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {(() => {
          const fromSym = fromToken?.symbol.toLowerCase() ?? ""
          const balance = wallet?.balances[fromSym] ?? 0
          const amt     = parseFloat(fromAmount || "0")
          const insufficient = !!wallet && amt > 0 && amt > balance

          let label: string
          let icon: ReactNode = <FaArrowRight className="text-xs" />
          let disabled = false
          let tone: "primary" | "muted" | "danger" = "primary"

          if (loading) {
            label = "Loading rates..."
            icon = null
            disabled = true
            tone = "muted"
          } else if (!wallet) {
            label = "Connect Wallet"
            icon = <FaWallet className="text-sm" />
          } else if (!fromToken || !toToken) {
            label = "Select tokens"
            disabled = true
            tone = "muted"
          } else if (!amt) {
            label = "Enter an amount"
            disabled = true
            tone = "muted"
          } else if (insufficient) {
            label = `Insufficient ${fromToken.symbol.toUpperCase()}`
            disabled = true
            tone = "danger"
            icon = null
          } else {
            label = `Bridge ${fromToken.symbol.toUpperCase()}`
          }

          const bg =
            tone === "danger"
              ? "rgba(255,77,109,0.12)"
              : tone === "muted"
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, var(--cyan), #00b8a0)"
          const color =
            tone === "danger" ? "var(--red)" : tone === "muted" ? "var(--text-muted)" : "#050b14"
          const border =
            tone === "danger"
              ? "1px solid rgba(255,77,109,0.3)"
              : tone === "muted"
              ? "1px solid var(--glass-border)"
              : "none"
          const shadow =
            tone === "primary" ? "0 8px 30px rgba(0,245,212,0.25)" : "none"

          const canBridge = !disabled && !!wallet && !!fromToken && !!toToken && amt > 0 && !insufficient

          return (
            <button
              onClick={() => {
                if (!wallet) { onOpenWallet(); return }
                if (canBridge) setReviewOpen(true)
              }}
              disabled={disabled}
              className="group relative w-full flex items-center justify-center rounded-xl font-bold transition-all py-3 px-6 text-[0.92rem] tracking-[0.02em] overflow-hidden"
              style={{
                background: bg,
                color,
                border,
                boxShadow: shadow,
                fontFamily: "var(--font-head)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled && tone === "muted" ? 0.85 : 1,
              }}
            >
              {/* Label sits center; chevron slides out to the right on hover */}
              <span className="flex items-center gap-2 transition-transform duration-300 group-hover:-translate-x-3">
                {icon}
                {label}
              </span>
              {!disabled && tone === "primary" && (
                <span
                  className="absolute right-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                >
                  <FaArrowRight className="text-sm" />
                </span>
              )}
            </button>
          )
        })()}

      </motion.div>

      {/* Token Modal */}
      <AnimatePresence>
        {modalFor && (
          <TokenModal tokens={tokens} onSelect={handleSelectToken} onClose={() => setModalFor(null)}
            exclude={modalFor === "from" ? toToken?.id : fromToken?.id} />
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewOpen && wallet && fromToken && toToken && fromChainId && toChainId && (
          <ReviewModal
            fromToken={fromToken}
            toToken={toToken}
            fromChainId={fromChainId}
            toChainId={toChainId}
            fromAmount={fromAmount}
            toAmount={toAmount}
            acrossFee={acrossSource === "across" ? acrossFee : null}
            acrossTime={acrossTime}
            wallet={wallet}
            onClose={() => setReviewOpen(false)}
            onSuccess={addTxToHistory}
          />
        )}
      </AnimatePresence>

    </main>

    {/* History card — lives below the bridge */}
    <BridgeHistory history={history} tokens={tokens} />
    </>
  )
}

export default Bridge
