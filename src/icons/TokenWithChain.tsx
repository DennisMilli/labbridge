import { ChainIcon } from "./ChainIcons"

/**
 * Token logo with a small chain badge overlaid in the bottom-right corner.
 * This is THE web3 visual pattern: you never just see "USDC" — you see
 * USDC+chain so you know exactly which network the token lives on.
 */
export function TokenWithChain({
  logo,
  symbol,
  chainId,
  size = 32,
  badgeSize,
}: {
  logo?: string
  symbol: string
  chainId: number | null
  size?: number
  badgeSize?: number
}) {
  const bsz = badgeSize ?? Math.max(10, Math.round(size * 0.42))

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {logo ? (
        <img
          src={logo}
          alt={symbol}
          className="rounded-full w-full h-full"
          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-[0.65rem] font-bold"
          style={{ background: "rgba(255,255,255,0.1)", color: "var(--text)" }}
        >
          {symbol.slice(0, 3).toUpperCase()}
        </div>
      )}
      {chainId && (
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width:  bsz + 2,
            height: bsz + 2,
            right:  -2,
            bottom: -2,
            background: "var(--bg)",
            border: "1.5px solid var(--bg)",
          }}
        >
          <ChainIcon chainId={chainId} size={bsz} />
        </div>
      )}
    </div>
  )
}
