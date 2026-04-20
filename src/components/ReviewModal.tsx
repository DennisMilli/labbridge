import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaXmark, FaArrowDown, FaCheck, FaCircleCheck, FaArrowUpRightFromSquare } from "react-icons/fa6"
import type { CryptoToken, WalletInfo } from "../App"
import { TokenWithChain } from "../icons/TokenWithChain"
import { Identicon } from "../icons/Identicon"

const CHAINS: Record<number, { name: string; color: string; explorer: string }> = {
  1:     { name: "Ethereum", color: "#627EEA", explorer: "https://etherscan.io/tx"          },
  42161: { name: "Arbitrum", color: "#28A0F0", explorer: "https://arbiscan.io/tx"           },
  137:   { name: "Polygon",  color: "#8247E5", explorer: "https://polygonscan.com/tx"       },
  8453:  { name: "Base",     color: "#0052FF", explorer: "https://basescan.org/tx"          },
  10:    { name: "Optimism", color: "#FF0420", explorer: "https://optimistic.etherscan.io/tx"},
}

function fakeTxHash() {
  const chars = "0123456789abcdef"
  let h = "0x"
  for (let i = 0; i < 64; i++) h += chars[Math.floor(Math.random() * 16)]
  return h
}

interface ReviewModalProps {
  fromToken:   CryptoToken
  toToken:     CryptoToken
  fromChainId: number
  toChainId:   number
  fromAmount:  string
  toAmount:    string
  acrossFee:   string | null
  acrossTime:  string | null
  wallet:      WalletInfo
  onClose:     () => void
  onSuccess?:  (hash: string) => void
}

type View = "review" | "signing" | "success"

function ReviewModal({
  fromToken, toToken, fromChainId, toChainId,
  fromAmount, toAmount, acrossFee, acrossTime,
  wallet, onClose, onSuccess,
}: ReviewModalProps) {
  const [view, setView] = useState<View>("review")
  const [txHash, setTxHash] = useState<string>("")

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  // Close on Esc (only when not mid-sign)
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && view !== "signing") onClose() }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [view, onClose])

  const fromChain = CHAINS[fromChainId]
  const toChain   = CHAINS[toChainId]

  const fromAmt = parseFloat(fromAmount || "0")
  const toAmt   = parseFloat(toAmount   || "0")
  const fromUsd = fromAmt * fromToken.priceUsd
  const toUsd   = toAmt * toToken.priceUsd

  // Slippage — mock 0.5% on the receive side for the min-received row
  const SLIPPAGE = 0.005
  const minReceived = toAmt * (1 - SLIPPAGE)

  function handleConfirm() {
    setView("signing")
    // Simulate: wallet prompt → broadcast → fill
    setTimeout(() => {
      const hash = fakeTxHash()
      setTxHash(hash)
      setView("success")
      onSuccess?.(hash)
    }, 2200)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[150]"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={view !== "signing" ? onClose : undefined}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-x-4 top-[5%] bottom-[5%] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[460px] sm:max-h-[92vh] z-[200] flex flex-col overflow-hidden"
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
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {/* Cyan top accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.5), transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <div className="flex flex-col leading-tight">
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)" }}>
              {view === "success" ? "Bridge Initiated" : view === "signing" ? "Confirming..." : "Review Bridge"}
            </span>
            <span className="text-[0.72rem]" style={{ color: "var(--text-muted)" }}>
              {view === "success" ? "Your transfer is on the way" : view === "signing" ? "Waiting for wallet signature" : "Confirm the details before signing"}
            </span>
          </div>
          {view !== "signing" && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer hover:brightness-125"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
            >
              <FaXmark className="text-sm" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {view === "signing" ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-6 py-10">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center relative"
                style={{ background: "var(--cyan-dim)", border: "1px solid rgba(0,245,212,0.3)" }}
              >
                <Identicon address={wallet.address} size={44} />
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{ border: "2px solid var(--cyan)", opacity: 0 }}
                  animate={{ opacity: [0, 0.7, 0], scale: [1, 1.15, 1.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              </div>
              <div className="text-center">
                <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.05rem", color: "var(--text)" }}>
                  Confirming in {wallet.walletName}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Check your wallet to approve the transaction
                </p>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--cyan)" }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          ) : view === "success" ? (
            <>
              {/* Success hero */}
              <div
                className="flex flex-col items-center text-center py-4 rounded-2xl"
                style={{ background: "rgba(0,214,143,0.08)", border: "1px solid rgba(0,214,143,0.25)" }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "var(--green)", color: "#050b14" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                >
                  <FaCheck className="text-xl" />
                </motion.div>
                <p className="mt-3" style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.05rem", color: "var(--green)" }}>
                  Bridge submitted
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Expected fill time: <span className="num" style={{ color: "var(--text)" }}>{acrossTime ?? "~2–4 min"}</span>
                </p>
              </div>

              {/* Tx receipt */}
              <div
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Sent</span>
                  <span className="num text-sm" style={{ color: "var(--text)" }}>
                    {fromAmt.toLocaleString("en-US", { maximumFractionDigits: 4 })} {fromToken.symbol.toUpperCase()}
                    <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>on {fromChain?.name}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Receiving</span>
                  <span className="num text-sm" style={{ color: "var(--text)" }}>
                    ≈ {toAmt.toLocaleString("en-US", { maximumFractionDigits: 4 })} {toToken.symbol.toUpperCase()}
                    <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>on {toChain?.name}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Tx hash</span>
                  <a
                    href={`${fromChain?.explorer}/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="num text-xs flex items-center gap-1.5 hover:brightness-125 transition"
                    style={{ color: "var(--cyan)" }}
                  >
                    {txHash.slice(0, 6)}…{txHash.slice(-4)}
                    <FaArrowUpRightFromSquare className="text-[0.65rem]" />
                  </a>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold cursor-pointer transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, var(--cyan), #00b8a0)",
                  color: "#050b14",
                  fontFamily: "var(--font-head)",
                  fontSize: "0.92rem",
                  boxShadow: "0 6px 20px rgba(0,245,212,0.25)",
                }}
              >
                Done
              </button>
            </>
          ) : (
            <>
              {/* FROM card */}
              <div
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}
              >
                <TokenWithChain logo={fromToken.logo} symbol={fromToken.symbol} chainId={fromChainId} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>You send</p>
                  <p className="num font-bold" style={{ color: "var(--text)", fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
                    {fromAmt.toLocaleString("en-US", { maximumFractionDigits: 6 })} {fromToken.symbol.toUpperCase()}
                  </p>
                  <p className="text-xs num" style={{ color: "var(--text-dim)" }}>
                    ≈ ${fromUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    <span className="ml-2" style={{ color: fromChain?.color ?? "var(--text-muted)" }}>
                      on {fromChain?.name ?? "—"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Arrow divider */}
              <div className="flex justify-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "var(--cyan-dim)", border: "1px solid rgba(0,245,212,0.3)", color: "var(--cyan)" }}
                >
                  <FaArrowDown className="text-sm" />
                </div>
              </div>

              {/* TO card */}
              <div
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}
              >
                <TokenWithChain logo={toToken.logo} symbol={toToken.symbol} chainId={toChainId} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.7rem] uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>You receive</p>
                  <p className="num font-bold" style={{ color: "var(--text)", fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
                    ≈ {toAmt.toLocaleString("en-US", { maximumFractionDigits: 6 })} {toToken.symbol.toUpperCase()}
                  </p>
                  <p className="text-xs num" style={{ color: "var(--text-dim)" }}>
                    ≈ ${toUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    <span className="ml-2" style={{ color: toChain?.color ?? "var(--text-muted)" }}>
                      on {toChain?.name ?? "—"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div
                className="rounded-2xl p-4 flex flex-col gap-2.5 text-xs"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
              >
                <Row label="Rate">
                  <span className="num" style={{ color: "var(--text)" }}>
                    1 {fromToken.symbol.toUpperCase()} = {(fromToken.priceUsd / toToken.priceUsd).toLocaleString("en-US", { maximumFractionDigits: 4 })} {toToken.symbol.toUpperCase()}
                  </span>
                </Row>
                <Row label="Bridge fee">
                  <span className="num" style={{ color: "var(--green)" }}>
                    {acrossFee ?? "~$0.10 – $0.50"}
                  </span>
                </Row>
                <Row label="Est. fill time">
                  <span className="num" style={{ color: "#60a5fa" }}>{acrossTime ?? "~2–4 min"}</span>
                </Row>
                <Row label={`Min received (${(SLIPPAGE * 100).toFixed(1)}% slippage)`}>
                  <span className="num" style={{ color: "var(--text)" }}>
                    {minReceived.toLocaleString("en-US", { maximumFractionDigits: 6 })} {toToken.symbol.toUpperCase()}
                  </span>
                </Row>
                <div className="border-t my-1" style={{ borderColor: "var(--glass-border)" }} />
                <Row label="Route">
                  <span style={{ color: "var(--cyan)" }}>Across Protocol v4</span>
                </Row>
                <Row label="Recipient">
                  <span className="flex items-center gap-1.5">
                    <Identicon address={wallet.address} size={14} />
                    <span className="num" style={{ color: "var(--text)" }}>{wallet.address}</span>
                  </span>
                </Row>
              </div>

              {/* Disclaimer pill */}
              <div
                className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <FaCircleCheck className="text-xs shrink-0 mt-0.5" style={{ color: "var(--violet)" }} />
                <p className="text-[0.72rem] leading-snug" style={{ color: "var(--text-muted)" }}>
                  This is a demo UI — no real transaction will be signed or broadcast. "Confirm" simulates a bridge for preview purposes.
                </p>
              </div>

              {/* CTA */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold cursor-pointer transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-head)",
                    fontSize: "0.9rem",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[1.8] py-3 rounded-xl font-bold cursor-pointer transition-all hover:brightness-110"
                  style={{
                    background: "linear-gradient(135deg, var(--cyan), #00b8a0)",
                    color: "#050b14",
                    border: "none",
                    fontFamily: "var(--font-head)",
                    fontSize: "0.92rem",
                    boxShadow: "0 8px 26px rgba(0,245,212,0.3)",
                    letterSpacing: "0.01em",
                  }}
                >
                  Confirm Bridge
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      {children}
    </div>
  )
}

export default ReviewModal
