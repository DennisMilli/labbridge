import { FaGithub, FaXTwitter, FaDiscord, FaBook } from "react-icons/fa6"

const SOCIALS = [
  { name: "GitHub",  href: "https://github.com",         Icon: FaGithub   },
  { name: "Twitter", href: "https://x.com",              Icon: FaXTwitter },
  { name: "Discord", href: "https://discord.com",        Icon: FaDiscord  },
  { name: "Docs",    href: "https://docs.across.to",     Icon: FaBook     },
]

function Footer() {
  return (
    <footer
      className="relative w-full"
      style={{
        borderTop: "1px solid var(--glass-border)",
        background: "rgba(5,11,20,0.4)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top cyan accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.35), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand + blurb */}
          <div className="flex flex-col gap-3 max-w-sm">
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 800,
                fontSize: "1.25rem",
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              Lab<span style={{ color: "var(--cyan)" }}>Bridge</span>
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Bridge ETH, USDC, and 50+ tokens across Ethereum, Arbitrum, Base, Optimism,
              and Polygon with live rates and Across Protocol intents.
            </p>

            {/* Across chip */}
            <a
              href="https://across.to"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 transition-colors hover:brightness-125"
              style={{
                background: "var(--cyan-dim)",
                border: "1px solid rgba(0,245,212,0.22)",
                color: "var(--cyan)",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--cyan)", animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              Powered by Across Protocol · Secured by UMA
            </a>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            <div className="flex flex-col gap-2">
              <span
                className="text-[0.7rem] uppercase mb-1"
                style={{ color: "var(--text-dim)", letterSpacing: "0.14em" }}
              >
                Product
              </span>
              <a className="text-sm hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--text-muted)" }} href="#bridge">Bridge</a>
              <a className="text-sm hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--text-muted)" }} href="#tokens">Tokens</a>
              <a className="text-sm hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--text-muted)" }} href="#routes">Routes</a>
            </div>

            <div className="flex flex-col gap-2">
              <span
                className="text-[0.7rem] uppercase mb-1"
                style={{ color: "var(--text-dim)", letterSpacing: "0.14em" }}
              >
                Developers
              </span>
              <a className="text-sm hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--text-muted)" }} target="_blank" rel="noreferrer" href="https://docs.across.to">Across Docs</a>
              <a className="text-sm hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--text-muted)" }} target="_blank" rel="noreferrer" href="https://www.coingecko.com/api">CoinGecko API</a>
              <a className="text-sm hover:text-[var(--cyan)] transition-colors" style={{ color: "var(--text-muted)" }} target="_blank" rel="noreferrer" href="https://github.com">GitHub</a>
            </div>

            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
              <span
                className="text-[0.7rem] uppercase mb-1"
                style={{ color: "var(--text-dim)", letterSpacing: "0.14em" }}
              >
                Community
              </span>
              <div className="flex gap-2 flex-wrap">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={name}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:brightness-125 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid var(--glass-border)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-dim)" }}>
            © {new Date().getFullYear()} LabBridge · Built by Dennis Milli x Hex Nomad
          </span>
          <span
            className="text-xs flex items-center gap-2"
            style={{ color: "var(--text-dim)" }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--violet)" }}
            />
            Demo UI — no real transactions are executed
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
