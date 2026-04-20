import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaXmark, FaCircleCheck } from "react-icons/fa6"
import type { WalletInfo } from "../App"
import { WalletIcon } from "../icons/WalletIcons"

const WALLETS = [
  { name: "MetaMask",        desc: "Browser extension & mobile"   },
  { name: "Coinbase Wallet", desc: "Self-custody by Coinbase"      },
  { name: "WalletConnect",   desc: "Connect any mobile wallet"     },
  { name: "Trust Wallet",    desc: "Multi-chain mobile wallet"     },
  { name: "Phantom",         desc: "Solana & Ethereum wallet"      },
  { name: "Brave Wallet",    desc: "Built into Brave browser"      },
]

function randomAddress() {
  const chars = "0123456789abcdef"
  let addr = "0x"
  for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * 16)]
  return addr.slice(0, 6) + "..." + addr.slice(-4)
}

function randomBalances(): Record<string, number> {
  return {
    eth:  +(Math.random() * 4   + 0.1).toFixed(4),
    usdc: +(Math.random() * 5000 + 50).toFixed(2),
    usdt: +(Math.random() * 3000 + 25).toFixed(2),
    dai:  +(Math.random() * 1500 + 10).toFixed(2),
    wbtc: +(Math.random() * 0.2 + 0.01).toFixed(5),
  }
}

type View = "list" | "connecting" | "connected"

interface WalletSidebarProps {
  wallet:        WalletInfo | null
  onConnect:    (info: WalletInfo) => void
  onDisconnect:  () => void
  onClose:       () => void
}

function WalletSidebar({ wallet, onConnect, onDisconnect, onClose }: WalletSidebarProps) {
  const [view, setView] = useState<View>(wallet ? "connected" : "list")
  const [pendingWallet, setPendingWallet] = useState<string | null>(null)

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  function handleConnect(walletName: string) {
    setPendingWallet(walletName)
    setView("connecting")
    setTimeout(() => {
      const info: WalletInfo = {
        address:    randomAddress(),
        walletName,
        balances:   randomBalances(),
      }
      onConnect(info)
      setView("connected")
    }, 1400)
  }

  function handleDisconnect() {
    onDisconnect()
    setView("list")
    setPendingWallet(null)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[150]"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[380px] z-[200] flex flex-col overflow-hidden"
        style={{
          background: "var(--glass-strong)",
          borderLeft: "1px solid var(--glass-border)",
          backdropFilter: "blur(40px)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,245,212,0.08)",
        }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Cyan accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.5), transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)" }}>
            {view === "connected" ? "Wallet Connected" : "Connect Wallet"}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
          >
            <FaXmark className="text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {view === "list" && (
            <div className="flex flex-col gap-3">
              <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>Choose your wallet to continue</p>
              {WALLETS.map((w, i) => (
                <motion.button
                  key={w.name}
                  onClick={() => handleConnect(w.name)}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-all text-left w-full cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}
                  whileHover={{ background: "rgba(255,255,255,0.09)" }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <WalletIcon name={w.name} size={36} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}>{w.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{w.desc}</p>
                  </div>
                  <svg className="w-4 h-4" viewBox="0 0 10 16" fill="none" style={{ color: "var(--text-dim)" }}>
                    <path d="M2 2L8 8L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </motion.button>
              ))}
            </div>
          )}

          {view === "connecting" && (
            <motion.div
              className="flex flex-col items-center justify-center h-64 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--cyan-dim)", border: "1px solid rgba(0,245,212,0.3)" }}
              >
                {pendingWallet && <WalletIcon name={pendingWallet} size={40} />}
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg mb-1" style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}>Connecting...</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Opening {pendingWallet}</p>
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
            </motion.div>
          )}

          {view === "connected" && wallet && (
            <motion.div
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="flex items-center gap-3 rounded-2xl p-4"
                style={{ background: "rgba(0,214,143,0.1)", border: "1px solid rgba(0,214,143,0.25)" }}
              >
                <FaCircleCheck className="text-xl flex-shrink-0" style={{ color: "var(--green)" }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--green)" }}>Connected</p>
                  <p className="text-xs num" style={{ color: "var(--text-muted)" }}>{wallet.address}</p>
                </div>
              </div>

              <div
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}
              >
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>Portfolio</p>
                {Object.entries(wallet.balances).map(([sym, amt]) => (
                  <div key={sym} className="flex justify-between items-center">
                    <span className="text-sm uppercase" style={{ color: "var(--text-muted)" }}>{sym}</span>
                    <span className="font-bold num" style={{ color: "var(--text)" }}>{amt.toLocaleString("en-US", { maximumFractionDigits: 4 })}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Wallet</span>
                  <span className="text-sm" style={{ color: "var(--text)" }}>{wallet.walletName}</span>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full py-3 rounded-2xl text-sm font-medium transition-colors cursor-pointer"
                style={{ background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.25)", color: "var(--red)" }}
              >
                Disconnect
              </button>
            </motion.div>
          )}
        </div>

        <div className="p-5" style={{ borderTop: "1px solid var(--glass-border)" }}>
          <p className="text-xs text-center" style={{ color: "var(--text-dim)" }}>
            By connecting, you agree to our Terms of Service. This is a demo — no real transactions occur.
          </p>
        </div>
      </motion.div>
    </>
  )
}

export default WalletSidebar
