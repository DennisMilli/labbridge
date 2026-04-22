/**
 * Chain metadata: chainId → { name, brand color, icon component }.
 *
 * Lives in its own file (no React components) so `ChainIcons.tsx` can stay
 * "components only" — Vite's react-refresh plugin requires that, otherwise
 * editing an icon triggers a full page reload instead of a Fast Refresh.
 */
import type { ReactElement } from "react"
import {
  EthereumIcon,
  ArbitrumIcon,
  PolygonIcon,
  BaseIcon,
  OptimismIcon,
  SolanaIcon,
} from "./ChainIcons"

interface IconProps { size?: number; className?: string }

// Solana is not EVM, so it has no real chainId. Across uses this sentinel
// internally as the convention for the SVM destination.
export const SOLANA_CHAIN_ID = 34268394551451

export const CHAIN_META: Record<number, { name: string; color: string; Icon: (p: IconProps) => ReactElement }> = {
  1:     { name: "Ethereum", color: "#627EEA", Icon: EthereumIcon },
  42161: { name: "Arbitrum", color: "#28A0F0", Icon: ArbitrumIcon },
  137:   { name: "Polygon",  color: "#8247E5", Icon: PolygonIcon  },
  8453:  { name: "Base",     color: "#0052FF", Icon: BaseIcon     },
  10:    { name: "Optimism", color: "#FF0420", Icon: OptimismIcon },
  [SOLANA_CHAIN_ID]: { name: "Solana", color: "#14F195", Icon: SolanaIcon },
}
