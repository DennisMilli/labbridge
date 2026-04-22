/**
 * Chain icons — approximate but recognizable SVG marks in each chain's brand color.
 * Each icon is exported individually; chain metadata (name + color + icon
 * lookup by chainId) lives in `./chainMeta.ts`.
 */
interface IconProps { size?: number; className?: string }

export function EthereumIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#627EEA"/>
      <path d="M12 3V9.65L17.5 12.1L12 3Z" fill="white" fillOpacity="0.6"/>
      <path d="M12 3L6.5 12.1L12 9.65V3Z" fill="white"/>
      <path d="M12 16.48V20.97L17.5 13.12L12 16.48Z" fill="white" fillOpacity="0.6"/>
      <path d="M12 20.97V16.48L6.5 13.12L12 20.97Z" fill="white"/>
      <path d="M12 15.43L17.5 12.1L12 9.65V15.43Z" fill="white" fillOpacity="0.2"/>
      <path d="M6.5 12.1L12 15.43V9.65L6.5 12.1Z" fill="white" fillOpacity="0.6"/>
    </svg>
  )
}

export function ArbitrumIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#2D374B"/>
      <path d="M10.6 8.3L6.5 15.5L8.2 16.3L12.3 9.1L10.6 8.3Z" fill="#28A0F0"/>
      <path d="M13.1 6.6L6.5 18L8.2 18.9L14.8 7.4L13.1 6.6Z" fill="#28A0F0"/>
      <path d="M14 12.5L12.4 9.6L11 12L15.3 17.4L17 16.6L14 12.5Z" fill="#96BEDC"/>
    </svg>
  )
}

export function PolygonIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#8247E5"/>
      <path
        d="M15.9 10.1c-.3-.2-.7-.2-1 0l-2.2 1.3-1.5.8-2.1 1.3c-.3.2-.7.2-1 0L6.4 12.5c-.3-.2-.5-.5-.5-.9v-2c0-.4.2-.7.5-.9l1.7-1c.3-.2.7-.2 1 0l1.7 1c.3.2.5.5.5.9v1.3l1.5-.9v-1.3c0-.4-.2-.7-.5-.9l-3.2-1.9c-.3-.2-.7-.2-1 0L5.1 7.9c-.3.2-.5.5-.5.9V12.4c0 .4.2.7.5.9L8.2 15.2c.3.2.7.2 1 0l2.1-1.2 1.5-.9 2.2-1.3c.3-.2.7-.2 1 0l1.7 1c.3.2.5.5.5.9v2c0 .4-.2.7-.5.9l-1.7 1c-.3.2-.7.2-1 0l-1.7-1c-.3-.2-.5-.5-.5-.9V14.4l-1.5.9V16.6c0 .4.2.7.5.9l3.2 1.9c.3.2.7.2 1 0l3.2-1.9c.3-.2.5-.5.5-.9V12.8c0-.4-.2-.7-.5-.9l-3.3-1.8Z"
        fill="white"
      />
    </svg>
  )
}

export function BaseIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#0052FF"/>
      <path
        d="M12 22a10 10 0 1 0-9.96-11.07h13.23v2.15H2.04A10 10 0 0 0 12 22Z"
        fill="white"
      />
    </svg>
  )
}

export function OptimismIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FF0420"/>
      <path
        d="M8.4 15.4c-.95 0-1.72-.22-2.3-.67-.58-.46-.87-1.11-.87-1.95 0-.18.02-.4.06-.65.1-.57.25-1.26.44-2.06.54-2.2 1.95-3.3 4.2-3.3.62 0 1.17.1 1.66.31.49.2.87.5 1.15.92.28.4.42.89.42 1.46 0 .17-.02.38-.06.64-.12.7-.27 1.39-.44 2.06-.28 1.1-.76 1.92-1.44 2.47-.68.53-1.6.8-2.76.8Zm.17-1.74c.45 0 .83-.14 1.14-.4.32-.27.55-.69.68-1.24.2-.84.36-1.58.46-2.2.04-.2.06-.4.06-.6 0-.84-.45-1.25-1.34-1.25-.45 0-.83.13-1.15.4-.31.27-.54.69-.67 1.24-.17.57-.32 1.3-.47 2.2-.04.19-.06.39-.06.58 0 .84.45 1.27 1.35 1.27ZM13.42 15.28c-.08 0-.13-.02-.18-.07-.04-.05-.05-.11-.03-.19l1.6-7.52c.02-.09.06-.15.12-.2.06-.04.13-.06.21-.06h3.07c.86 0 1.54.18 2.05.55.52.35.78.87.78 1.54 0 .2-.02.4-.07.6-.2.93-.6 1.63-1.2 2.08-.6.44-1.42.66-2.48.66h-1.56l-.54 2.55a.31.31 0 0 1-.12.2.32.32 0 0 1-.2.06h-1.45Zm3.88-4.37c.34 0 .63-.09.88-.28.25-.19.42-.46.5-.81.02-.13.04-.25.04-.35 0-.23-.07-.4-.2-.52-.14-.12-.37-.18-.69-.18h-1.37l-.46 2.14h1.3Z"
        fill="white"
      />
    </svg>
  )
}

export function SolanaIcon({ size = 20, className }: IconProps) {
  const gid = `sol-${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9945FF"/>
          <stop offset="100%" stopColor="#14F195"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="#0b0b0f"/>
      <g fill={`url(#${gid})`}>
        <path d="M7.2 8.3h10.6c.2 0 .3.2.1.4l-1.6 1.6a.4.4 0 0 1-.3.1H5.4c-.2 0-.3-.2-.1-.4L6.9 8.4a.4.4 0 0 1 .3-.1Z"/>
        <path d="M7.2 13.6h10.6c.2 0 .3.2.1.4L16.3 15.6a.4.4 0 0 1-.3.1H5.4c-.2 0-.3-.2-.1-.4l1.6-1.6a.4.4 0 0 1 .3-.1Z"/>
        <path d="M16 10.9H5.4c-.2 0-.3.2-.1.4l1.6 1.6c.1.1.2.1.3.1h10.6c.2 0 .3-.2.1-.4l-1.6-1.6a.4.4 0 0 0-.3-.1Z"/>
      </g>
    </svg>
  )
}

export function AllChainsIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  )
}

// Convenience component that renders the right icon for a given chainId.
// CHAIN_META lives in `./chainMeta.ts` so this file stays "components only"
// for Vite Fast Refresh.
import { CHAIN_META } from "./chainMeta"

export function ChainIcon({ chainId, size = 20, className }: { chainId: number; size?: number; className?: string }) {
  const meta = CHAIN_META[chainId]
  if (!meta) return null
  const Icon = meta.Icon
  return <Icon size={size} className={className} />
}
