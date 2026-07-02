import { Activity, BriefcaseBusiness, Wallet, type LucideIcon } from 'lucide-react'

export type SectionKey = 'work' | 'body' | 'money'

export interface SectionMeta {
  key: SectionKey
  title: string
  subtitle: string
  path: string
  accent: string
  icon: LucideIcon
}

export const sections: SectionMeta[] = [
  {
    key: 'work',
    title: 'Work',
    subtitle: 'Focus, output, and momentum',
    path: '/work',
    accent: 'var(--work-accent)',
    icon: BriefcaseBusiness,
  },
  {
    key: 'body',
    title: 'Body',
    subtitle: 'Energy, rituals, and recovery',
    path: '/body',
    accent: 'var(--body-accent)',
    icon: Activity,
  },
  {
    key: 'money',
    title: 'Money',
    subtitle: 'Clarity, planning, and reserves',
    path: '/money',
    accent: 'var(--money-accent)',
    icon: Wallet,
  },
]

export const getSectionByKey = (key: SectionKey) =>
  sections.find((section) => section.key === key)

export const getSectionByPath = (pathname: string) =>
  sections.find(
    (section) => pathname === section.path || pathname.startsWith(`${section.path}/`),
  )
