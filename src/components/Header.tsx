import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { FaGithub } from "react-icons/fa6"
import Ticker from "./Ticker"
import type { TickerItem, WalletInfo } from "../App"
import { Identicon } from "../icons/Identicon"

/**
 * GasChip — live ETH mainnet gas price (gwei). Refreshes every 30s.
 * Tiny green dot pulses to signal "live". Desktop-only so it doesn't
 * clutter the mobile header.
 */
function GasChip() {
  const [gwei, setGwei] = useState<number | null>(null)

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/gas`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && typeof data.gwei === "number") setGwei(data.gwei)
      } catch { /* silent */ }
    }
    load()
    const t = setInterval(load, 30_000)
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  if (gwei === null) return null
  // Color tier based on typical mainnet bands
  const color = gwei < 15 ? "var(--green)" : gwei < 40 ? "#fbbf24" : "var(--red)"

  return (
    <div
      className="liquid-glass-chip hidden md:flex items-center gap-2 rounded-full"
      style={{ padding: "0.4rem 0.75rem" }}
      title="Ethereum mainnet gas price"
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color, animation: "pulse-dot 1.8s ease-in-out infinite" }}
      />
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-muted)" }}>
        <path d="M3 20h11V4H3v16ZM14 9l4-2v11a2 2 0 0 0 2 2M18 13l2-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="num text-[0.72rem] font-semibold" style={{ color: "var(--text)" }}>
        {gwei}
      </span>
      <span className="text-[0.65rem]" style={{ color: "var(--text-dim)" }}>gwei</span>
    </div>
  )
}

interface HeaderProps {
  tickers: TickerItem[]
  wallet: WalletInfo | null
  onOpenWallet: () => void
}

const NAV_LINKS = [
  { label: "Bridge",  href: "#bridge",  active: true  },
  { label: "Tokens",  href: "#tokens",  active: false },
  { label: "Routes",  href: "#routes",  active: false },
  { label: "Docs",    href: "https://docs.across.to", external: true },
]

function Header({ tickers, wallet, onOpenWallet }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const shortAddr = wallet ? wallet.address : ""

  return (
    <header className="relative z-50">
      <nav
        className="flex items-center justify-between gap-4"
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--glass-border)",
          background: "rgba(5,11,20,0.7)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Apply larger horizontal padding on desktop via inline media-style class */}
        <style>{`
          @media (min-width: 768px) {
            header > nav { padding: 1.1rem 2.5rem !important; }
          }
          @media (min-width: 1280px) {
            header > nav { padding: 1.1rem 4rem !important; }
          }
        `}</style>

        {/* ── Left: Logo ── */}
        <Link
          to="/"
          className="no-underline flex items-center gap-2 shrink-0"
          style={{ color: "var(--text)" }}
        >
          {/* Little logo mark */}
          <span
            className="flex items-center justify-center"
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, var(--cyan), #0ea5e9)",
              boxShadow: "0 4px 14px rgba(0,245,212,0.35)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12h7l-2-3M21 12h-7l2 3"
                stroke="#050b14"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 12h4"
                stroke="#050b14"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "1.15rem",
              letterSpacing: "-0.02em",
            }}
          >
            Lab<span style={{ color: "var(--cyan)" }}>Bridge</span>
          </span>
        </Link>

        {/* ── Center (desktop only): Nav pills ── */}
        <div
          className="hidden lg:flex items-center gap-1 rounded-full px-1.5 py-1.5 absolute left-1/2 -translate-x-1/2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="no-underline rounded-full px-4 py-1.5 text-sm transition-all"
              style={{
                color: link.active ? "var(--cyan)" : "var(--text-muted)",
                background: link.active ? "var(--cyan-dim)" : "transparent",
                fontWeight: link.active ? 600 : 500,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Right: Gas chip + GitHub + Wallet (desktop) + Hamburger (mobile) ── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live gas price (desktop only) */}
          <GasChip />

          {/* GitHub icon-only (desktop) — liquid glass */}
          <a
            href="https://github.com/DennisMilli/labbridge"
            target="_blank"
            rel="noreferrer"
            className="liquid-glass-button hidden md:flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, color: "var(--text-muted)" }}
            title="GitHub"
          >
            <FaGithub className="text-sm" />
          </a>

          {/* Wallet button — liquid glass, responsive */}
          {wallet ? (
            <button
              onClick={onOpenWallet}
              className="liquid-glass-button flex items-center gap-2 cursor-pointer"
              style={{
                background: "rgba(0,245,212,0.10)",
                borderColor: "rgba(0,245,212,0.30)",
                padding: "0.3rem 0.75rem 0.3rem 0.3rem",
                borderRadius: 100,
              }}
            >
              <Identicon address={shortAddr} size={28} />
              <span className="flex flex-col items-start leading-tight">
                <span
                  className="num"
                  style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--text)" }}
                >
                  {wallet.balances.eth?.toFixed(3) ?? "0.000"} ETH
                </span>
                <span className="num hidden sm:block" style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
                  {shortAddr}
                </span>
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenWallet}
              className="liquid-glass-cta hidden sm:flex items-center gap-2 cursor-pointer"
              style={{
                padding: "0.55rem 1.15rem",
                borderRadius: 100,
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              <span className="relative z-10 w-1.5 h-1.5 rounded-full" style={{ background: "#050b14", opacity: 0.5 }} />
              <span className="relative z-10">Connect Wallet</span>
            </button>
          )}

          {/* Hamburger — mobile only. Morphing lines, ported from LabCoatCoder. */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col cursor-pointer items-end py-2 z-50 transition-transform"
            aria-label="Toggle menu"
          >
            <div
              className={`h-0.5 my-0.5 transition-all duration-400 ${
                menuOpen ? "w-6 translate-y-1.5 -rotate-45" : "w-5"
              }`}
              style={{ background: "var(--text)" }}
            />
            <div
              className={`h-0.5 my-0.5 transition-all duration-400 ${
                menuOpen ? "w-6 opacity-0" : "w-2.5"
              }`}
              style={{ background: "var(--cyan)" }}
            />
            <div
              className={`h-0.5 my-0.5 transition-all duration-400 ${
                menuOpen ? "w-6 -translate-y-1.5 rotate-45" : "w-3.5"
              }`}
              style={{ background: "var(--text)" }}
            />
          </button>
        </div>
      </nav>

      <Ticker tickers={tickers} />

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden mx-4 mt-3 mb-4 rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: "var(--glass-strong)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(30px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1 p-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="no-underline flex items-center justify-between rounded-xl px-4 py-3 transition-colors"
                  style={{
                    color: link.active ? "var(--cyan)" : "var(--text)",
                    background: link.active ? "var(--cyan-dim)" : "transparent",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  <span>{link.label}</span>
                  <svg width="12" height="12" viewBox="0 0 10 16" fill="none" style={{ color: "var(--text-dim)" }}>
                    <path d="M2 2L8 8L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </a>
              ))}

              <a
                href="https://github.com/DennisMilli/labbridge"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="no-underline flex items-center gap-2 rounded-xl px-4 py-3 transition-colors"
                style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
              >
                <FaGithub /> View on GitHub
              </a>
            </div>

            <div className="p-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
              <button
                onClick={() => { setMenuOpen(false); onOpenWallet() }}
                className={`w-full flex items-center justify-center gap-2 cursor-pointer ${wallet ? "liquid-glass-button" : "liquid-glass-cta"}`}
                style={{
                  padding: "0.8rem 1.2rem",
                  borderRadius: 14,
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  ...(wallet
                    ? { background: "rgba(0,245,212,0.10)", borderColor: "rgba(0,245,212,0.30)", color: "var(--text)" }
                    : {}),
                }}
              >
                {wallet ? (
                  <>
                    <Identicon address={shortAddr} size={20} />
                    <span className="num">{shortAddr}</span>
                    <span style={{ color: "var(--text-muted)" }}>·</span>
                    <span className="num">{wallet.balances.eth?.toFixed(3) ?? "0.000"} ETH</span>
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
