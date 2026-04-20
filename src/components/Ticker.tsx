import type { TickerItem } from "../App"

interface TickerProps {
  tickers: TickerItem[]
}

function Ticker({ tickers }: TickerProps) {
  if (tickers.length === 0) return null
  const doubled = [...tickers, ...tickers]

  return (
    <div
      className="overflow-hidden"
      style={{
        background: "rgba(0,245,212,0.06)",
        borderBottom: "1px solid rgba(0,245,212,0.12)",
        padding: "0.5rem 0",
      }}
    >
      <div
        className="ticker-track flex whitespace-nowrap"
        style={{ width: "max-content", gap: "3rem" }}
      >
        {doubled.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2" style={{ fontSize: "0.78rem" }}>
            <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{t.symbol.toUpperCase()}</span>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{t.price}</span>
            <span style={{ color: t.change >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
              {t.change >= 0 ? "+" : ""}{t.change.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Ticker
