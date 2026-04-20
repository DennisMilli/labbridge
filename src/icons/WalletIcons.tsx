/**
 * Wallet brand icons — approximate but recognizable SVG marks
 * with real brand colors. Replacements for the emoji placeholders.
 */
import type { ReactElement } from "react"

interface IconProps { size?: number; className?: string }

export function MetaMaskIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M29 4.5l-11.3 8.3 2.1-4.9L29 4.5z" fill="#E17726" stroke="#E17726" strokeWidth="0.3"/>
      <path d="M3 4.5l11.2 8.4-2-5L3 4.5z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      <path d="M24.6 22l-3 4.6 6.4 1.8 1.8-6.3-5.2-.1z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      <path d="M2.3 22l1.8 6.4 6.4-1.8-3-4.6-5.2 0z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      <path d="M10.2 14.4l-1.8 2.8 6.3.3-.2-6.8-4.3 3.7z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      <path d="M21.8 14.4L17.5 10.6l-.1 6.9 6.3-.3-1.9-2.8z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      <path d="M10.4 26.6L14.3 24.7l-3.3-2.6-.6 4.5z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      <path d="M17.7 24.7l3.9 1.9-.6-4.5-3.3 2.6z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      <path d="M21.6 26.6l-3.9-1.9.3 2.5 0 1.1 3.6-1.7z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.3"/>
      <path d="M10.4 26.6l3.6 1.7 0-1.1.3-2.5-3.9 1.9z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.3"/>
      <path d="M14 20.8l-3.1-.9 2.2-1 .9 1.9z" fill="#233447" stroke="#233447" strokeWidth="0.3"/>
      <path d="M18 20.8l.9-1.9 2.2 1-3.1.9z" fill="#233447" stroke="#233447" strokeWidth="0.3"/>
      <path d="M10.4 26.6l.6-4.6-3.6.1 3 4.5z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.3"/>
      <path d="M21 22l.6 4.6 3-4.5-3.6-.1z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.3"/>
      <path d="M23.7 17.2l-6.3.3.6 3.3.9-1.9 2.2 1 2.6-2.7z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.3"/>
      <path d="M10.9 19.9l2.2-1 .9 1.9.6-3.3-6.3-.3 2.6 2.7z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.3"/>
      <path d="M8.3 17.2l2.6 5.2-.1-2.5-2.5-2.7z" fill="#E27525" stroke="#E27525" strokeWidth="0.3"/>
      <path d="M21.2 19.9l-.1 2.5 2.6-5.2-2.5 2.7z" fill="#E27525" stroke="#E27525" strokeWidth="0.3"/>
      <path d="M14.6 17.5l-.6 3.3.7 3.6.2-4.8-.3-2.1z" fill="#E27525" stroke="#E27525" strokeWidth="0.3"/>
      <path d="M17.4 17.5l-.3 2.1.2 4.8.7-3.6-.6-3.3z" fill="#E27525" stroke="#E27525" strokeWidth="0.3"/>
    </svg>
  )
}

export function CoinbaseWalletIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#0052FF"/>
      <path
        d="M16 22.8a6.8 6.8 0 1 1 6.7-7.9H19.1a3.4 3.4 0 1 0 0 2.2h3.6A6.8 6.8 0 0 1 16 22.8Z"
        fill="white"
      />
    </svg>
  )
}

export function WalletConnectIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="#3B99FC"/>
      <path
        d="M9.7 12.3c3.5-3.5 9.1-3.5 12.6 0l.4.4a.4.4 0 0 1 0 .6L21.3 14.7a.2.2 0 0 1-.3 0l-.6-.6a4.4 4.4 0 0 0-6.2 0l-.6.6a.2.2 0 0 1-.3 0l-1.4-1.4a.4.4 0 0 1 0-.6l.3-.4ZM24.7 14.6 26 15.9a.4.4 0 0 1 0 .6l-5.9 5.8a.4.4 0 0 1-.6 0l-4.2-4.1a.1.1 0 0 0-.2 0L11 22.3a.4.4 0 0 1-.6 0l-5.9-5.8a.4.4 0 0 1 0-.6l1.3-1.3a.4.4 0 0 1 .6 0L10.6 19a.1.1 0 0 0 .2 0l4.2-4.2a.4.4 0 0 1 .6 0l4.2 4.2a.1.1 0 0 0 .2 0l4.2-4.2a.4.4 0 0 1 .6 0Z"
        fill="white"
      />
    </svg>
  )
}

export function TrustWalletIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#0500FF"/>
      <path
        d="M16 5.5c2.1 1.6 5 2.6 7.8 2.6-.5 11-3.6 13.3-7.8 18.4-4.2-5.1-7.3-7.4-7.8-18.4 2.8 0 5.7-1 7.8-2.6Zm0 3.1v15.5c3-2.4 5.4-5.1 5.8-13.7-1.9-.4-3.9-1-5.8-1.8Z"
        fill="white"
      />
    </svg>
  )
}

export function PhantomIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="url(#phantom-grad)"/>
      <defs>
        <linearGradient id="phantom-grad" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#534BB1"/>
          <stop offset="1" stopColor="#551BF9"/>
        </linearGradient>
      </defs>
      <path
        d="M26 16.2h-2.3c0-4.4-3.5-8-7.8-8s-7.8 3.6-7.8 8c0 4 3 7.3 6.9 7.9.4 0 .8-.2.9-.6l.2-.8c.1-.4.4-.6.8-.6h2.2c.4 0 .7.2.8.6l.2.8c.1.4.5.6.9.6 3.3-.5 5.7-3.3 5.7-6.8l-.1-1.1ZM13.2 16c-.7 0-1.2-.7-1.2-1.5s.5-1.5 1.2-1.5 1.2.7 1.2 1.5-.6 1.5-1.2 1.5Zm4.6 0c-.6 0-1.2-.7-1.2-1.5s.5-1.5 1.2-1.5 1.2.7 1.2 1.5-.5 1.5-1.2 1.5Z"
        fill="white"
      />
    </svg>
  )
}

export function BraveWalletIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="#FB542B"/>
      <path
        d="M23.5 11.6 22 9.8l-1 .3-1.5-1.5-3.5.1-3.5-.1-1.5 1.5-1-.3-1.5 1.8.6 1.7-.4 1.3 1.4 5.1c.8 2.9 1.3 3.7 2.1 4.3l2.5 1.7c.3.2.7.3 1.1.3s.8-.1 1.1-.3l2.5-1.7c.8-.6 1.3-1.4 2.1-4.3l1.4-5.1-.4-1.3.5-1.7ZM19.4 19l-1.9 1.2c-.4.2-.8.3-1.2.3h-.6c-.4 0-.8-.1-1.2-.3L12.6 19l-.4-.6.6-.3c.4-.2.6-.5.6-.9v-.3c0-.4-.2-.7-.5-.9l-1.3-.8c-.3-.2-.4-.6-.3-.9l.5-1.1c.1-.2.3-.4.5-.5l2.2-.8c.1 0 .3 0 .4-.1l1.1-.9.1-.1.1.1 1.1.9h.4l2.2.8c.2 0 .4.3.5.5l.5 1.1c.2.3 0 .7-.3.9l-1.3.8c-.3.2-.5.5-.5.9v.3c0 .4.2.7.6.9l.6.3-.4.6Z"
        fill="white"
      />
    </svg>
  )
}

export const WALLET_ICONS = {
  MetaMask:          MetaMaskIcon,
  "Coinbase Wallet": CoinbaseWalletIcon,
  WalletConnect:     WalletConnectIcon,
  "Trust Wallet":    TrustWalletIcon,
  Phantom:           PhantomIcon,
  "Brave Wallet":    BraveWalletIcon,
} as const

export type WalletName = keyof typeof WALLET_ICONS

export function WalletIcon({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const Icon = (WALLET_ICONS as Record<string, (p: IconProps) => ReactElement>)[name]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
