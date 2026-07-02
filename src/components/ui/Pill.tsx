import type { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  variant?: 'accent' | 'neutral'
}

export function Pill({ children, variant = 'neutral' }: PillProps) {
  return <span className={`pill pill--${variant}`}>{children}</span>
}
