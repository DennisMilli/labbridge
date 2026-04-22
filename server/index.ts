import express from "express"
import cors from "cors"
import axios from "axios"
import "dotenv/config"

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ─── Across Protocol: chains & supported tokens ────────────────────────────
// Across supports 5 EVM chains (v3/v4) plus Solana via the SOLANA sentinel
// below. Native BTC and other non-EVM chains are NOT bridgeable. Per-token
// chain support lives in ACROSS_TOKEN_CHAINS further down.
//
// ─── Token address registry: symbol → chainId → { address, decimals } ───
// Only tokens Across actually bridges. Addresses used for /suggested-fees.
const TOKEN_ADDRESSES: Record<string, Record<number, { address: string; decimals: number }>> = {
  eth: {
    1:     { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 }, // WETH
    42161: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", decimals: 18 },
    10:    { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
    8453:  { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
  },
  weth: {
    1:     { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
    42161: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", decimals: 18 },
    10:    { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
    8453:  { address: "0x4200000000000000000000000000000000000006", decimals: 18 },
    137:   { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
  },
  usdc: {
    1:     { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
    42161: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6 },
    137:   { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6 },
    8453:  { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
    10:    { address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", decimals: 6 },
  },
  usdt: {
    1:     { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    42161: { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6 },
    137:   { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
    10:    { address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", decimals: 6 },
  },
  dai: {
    1:     { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
    42161: { address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18 },
    137:   { address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", decimals: 18 },
    10:    { address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18 },
  },
  wbtc: {
    1:     { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
    42161: { address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", decimals: 8 },
    137:   { address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", decimals: 8 },
    8453:  { address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c", decimals: 8 },
  },
  bal: {
    1:     { address: "0xba100000625a3754423978a60c9317c58a424e3D", decimals: 18 },
    42161: { address: "0x040d1eDC9569d4Bab2D15287Dc5A4F10F56a56B8", decimals: 18 },
    137:   { address: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3", decimals: 18 },
    8453:  { address: "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1", decimals: 18 },
  },
}

// Solana sentinel — not a real EVM chainId, used by Across for SVM routing.
const SOLANA = 34268394551451

// ─── Across-bridgeable tokens: CoinGecko id → chains Across actually supports ──
// This map is the SOURCE OF TRUTH. Only tokens listed here appear in the picker.
// Native BTC ("bitcoin") is excluded — not bridgeable. WBTC covers the EVM side.
// Native SOL ("solana") lives on its own chain. Across V4 bridges USDC ↔ Solana.
const ACROSS_TOKEN_CHAINS: Record<string, number[]> = {
  ethereum:          [1, 42161, 137, 8453, 10],                // WETH wraps on all 5
  "usd-coin":        [1, 42161, 137, 8453, 10, SOLANA],        // USDC — includes Solana
  tether:            [1, 42161, 137, 10],                       // no Base USDT
  dai:               [1, 42161, 137, 10],
  "wrapped-bitcoin": [1, 42161, 137, 8453],
  balancer:          [1, 42161, 137, 8453],
  solana:            [SOLANA],                                  // SOL lives only on Solana
}

// ─── /api/tokens — CoinGecko top coins ────────────────────────────────────
app.get("/api/tokens", async (_req, res) => {
  try {
    const cgKey = process.env.COINGECKO_KEY || ""
    const validKey = cgKey && cgKey !== "your_coingecko_key_here"
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=24h${validKey ? `&x_cg_demo_api_key=${cgKey}` : ""}`

    const { data } = await axios.get(url)

    // ── Tickers for the marquee: we still show the top 20 movers from CoinGecko
    //    (including BTC, SOL, etc.) so the live strip feels like a real market.
    const tickers = data.slice(0, 20).map((coin: {
      symbol: string
      name: string
      current_price: number
      price_change_percentage_24h: number
    }) => ({
      symbol: coin.symbol,
      name:   coin.name,
      price:  coin.current_price >= 1
        ? `$${coin.current_price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
        : `$${(coin.current_price ?? 0).toFixed(6)}`,
      change: parseFloat((coin.price_change_percentage_24h ?? 0).toFixed(2)),
    }))

    // ── Tokens for the bridge picker: return ALL top market-cap coins so the
    //    picker feels like a real exchange. Tokens Across can bridge get a
    //    `bridgeable: true` flag + their chain list; everything else gets
    //    `bridgeable: false` with an empty chain list (shown for discovery).
    const tokens = data.map((coin: {
      id: string
      symbol: string
      name: string
      image: string
      current_price: number
      price_change_percentage_24h: number
    }) => {
      const chains = ACROSS_TOKEN_CHAINS[coin.id]
      return {
        id:         coin.id,
        symbol:     coin.symbol,
        name:       coin.name,
        logo:       coin.image,
        priceUsd:   coin.current_price || 0,
        change24h:  coin.price_change_percentage_24h || 0,
        chainIds:   chains ?? [],
        bridgeable: !!chains,
      }
    })

    const bridgeableCount = tokens.filter((t: { bridgeable: boolean }) => t.bridgeable).length
    console.log(`[api/tokens] ${tokens.length} tokens (${bridgeableCount} bridgeable via Across)`)
    res.json({ tokens, tickers })
  } catch (err) {
    console.error("CoinGecko error:", err)
    res.status(500).json({ error: "Failed to fetch token data" })
  }
})

// ─── /api/across-fee — Across Protocol suggested fees ─────────────────────
// Accepts: fromSymbol, fromChainId, toSymbol, toChainId, amount, fromPriceUsd
app.get("/api/across-fee", async (req, res) => {
  try {
    const {
      fromSymbol,
      fromChainId,
      toSymbol,
      toChainId,
      amount,
      fromPriceUsd,
    } = req.query as Record<string, string | undefined>

    // Validate amount
    const amt = parseFloat(amount || "")
    if (!amt || amt <= 0) {
      return res.json({ fee: "—", estimatedTime: "—", source: "invalid" })
    }

    // Look up addresses + decimals
    const inKey  = (fromSymbol || "").toLowerCase()
    const outKey = (toSymbol   || "").toLowerCase()
    const inChain  = Number(fromChainId)
    const outChain = Number(toChainId)

    const inMeta  = TOKEN_ADDRESSES[inKey]?.[inChain]
    const outMeta = TOKEN_ADDRESSES[outKey]?.[outChain]

    // If either side isn't in our registry → route not supported by Across
    if (!inMeta || !outMeta) {
      return res.json({
        fee: "Route not supported",
        estimatedTime: "—",
        source: "unsupported",
      })
    }

    // Can't bridge to the same chain
    if (inChain === outChain) {
      return res.json({
        fee: "Same chain — no bridge needed",
        estimatedTime: "—",
        source: "same-chain",
      })
    }

    // Across only bridges same-asset. Normalize eth/weth as equivalent.
    const isEthLike = (s: string) => s === "eth" || s === "weth"
    const sameAsset = inKey === outKey || (isEthLike(inKey) && isEthLike(outKey))
    if (!sameAsset) {
      return res.json({
        fee: "Bridge-swap not supported",
        estimatedTime: "—",
        source: "cross-asset",
        note: "Across bridges same-asset only (e.g. USDC→USDC). For cross-asset try a DEX aggregator.",
      })
    }

    // Convert amount to token's smallest unit (handles 6-decimal USDC, 8-decimal WBTC, etc.)
    const amountWei = BigInt(Math.floor(amt * 10 ** inMeta.decimals)).toString()

    const acrossUrl = `https://app.across.to/api/suggested-fees`
      + `?inputToken=${inMeta.address}`
      + `&outputToken=${outMeta.address}`
      + `&originChainId=${inChain}`
      + `&destinationChainId=${outChain}`
      + `&amount=${amountWei}`

    const { data } = await axios.get(acrossUrl, { timeout: 5000 })

    // Across response shape has evolved; handle both.
    // New:  { totalRelayFee: { total, pct }, estimatedFillTimeSec, ... }
    // Old:  { relayerCapitalFeeTotal, ... }
    const feeRaw: string | undefined =
      data?.totalRelayFee?.total ??
      data?.relayFeeTotal ??
      data?.relayerCapitalFeeTotal

    let fee = "~$0.10 – $0.50"
    if (feeRaw) {
      const feeTokens = Number(feeRaw) / 10 ** inMeta.decimals
      const price = parseFloat(fromPriceUsd || "0")
      if (price > 0) {
        const feeUsd = feeTokens * price
        fee = feeUsd < 0.01
          ? "< $0.01"
          : `~$${feeUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
      } else {
        // Fallback: show in token units
        fee = `~${feeTokens.toFixed(6)} ${inKey.toUpperCase()}`
      }
    }

    const estimatedTime = data?.estimatedFillTimeSec
      ? data.estimatedFillTimeSec < 60
        ? `~${data.estimatedFillTimeSec} sec`
        : `~${Math.ceil(data.estimatedFillTimeSec / 60)} min`
      : "~2–4 min"

    res.json({
      fee,
      estimatedTime,
      source: "across",
      route: `${inKey.toUpperCase()} (${inChain}) → ${outKey.toUpperCase()} (${outChain})`,
    })
  } catch (err: unknown) {
    const e = err as { response?: { data?: { code?: string; message?: string } }; message?: string }
    const acrossCode = e?.response?.data?.code
    console.error("Across fee error:", e?.response?.data || e?.message || err)

    if (acrossCode === "ROUTE_NOT_ENABLED") {
      return res.json({
        fee: "Route not enabled",
        estimatedTime: "—",
        source: "route-disabled",
      })
    }
    if (acrossCode === "AMOUNT_TOO_LOW") {
      return res.json({
        fee: "Amount too low",
        estimatedTime: "—",
        source: "too-low",
      })
    }
    res.json({
      fee: "Unavailable",
      estimatedTime: "—",
      source: "fallback",
    })
  }
})

// ─── /api/gas — Ethereum mainnet gas price via public RPC ────────────────────
// Free, keyless, cached 15s to avoid hammering Cloudflare.
let gasCache: { gwei: number | null; ts: number } = { gwei: null, ts: 0 }
app.get("/api/gas", async (_req, res) => {
  try {
    if (Date.now() - gasCache.ts < 15_000 && gasCache.gwei !== null) {
      return res.json({ gwei: gasCache.gwei, cached: true })
    }
    const { data } = await axios.post(
      "https://cloudflare-eth.com",
      { jsonrpc: "2.0", id: 1, method: "eth_gasPrice", params: [] },
      { timeout: 4000 },
    )
    const wei = parseInt(data.result, 16)
    const gwei = Math.round((wei / 1e9) * 10) / 10
    gasCache = { gwei, ts: Date.now() }
    res.json({ gwei, cached: false })
  } catch {
    res.json({ gwei: null })
  }
})

// ─── Health check ──────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`LabBridge server running on http://localhost:${port}`)
})
