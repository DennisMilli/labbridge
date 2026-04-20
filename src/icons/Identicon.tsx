/**
 * Deterministic gradient identicon from a wallet address.
 * Same address → same avatar, every time. This is the MetaMask/Rainbow pattern.
 */

function hashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i)
    h |= 0 // force int32
  }
  return Math.abs(h)
}

// A curated web3 palette — on-brand, high saturation, no muddy tones
const COLORS = [
  "#00f5d4", "#8b5cf6", "#f472b6", "#60a5fa",
  "#fb923c", "#34d399", "#f43f5e", "#a855f7",
  "#06b6d4", "#facc15", "#22d3ee", "#e879f9",
]

export function Identicon({
  address,
  size = 28,
  className,
}: {
  address: string
  size?: number
  className?: string
}) {
  const h = hashString(address || "0x0")
  const a = COLORS[h % COLORS.length]
  const b = COLORS[(h >> 4) % COLORS.length]
  const c = COLORS[(h >> 8) % COLORS.length]
  const angle = h % 360

  return (
    <div
      className={className}
      style={{
        width:  size,
        height: size,
        borderRadius: "50%",
        background: `conic-gradient(from ${angle}deg at 50% 50%, ${a}, ${b}, ${c}, ${a})`,
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}
    />
  )
}
