import { Sparkles } from 'lucide-react'

import { Pill } from './Pill'

interface SectionHeroProps {
  eyebrow: string
  title: string
  description: string
  quote: string
}

export function SectionHero({ eyebrow, title, description, quote }: SectionHeroProps) {
  return (
    <section className="section-hero">
      <div>
        <Pill variant="accent">{eyebrow}</Pill>
        <h1 className="section-hero__title">{title}</h1>
        <p className="section-hero__description">{description}</p>
      </div>

      <div className="section-hero__quote">
        <Sparkles size={18} />
        <p>{quote}</p>
      </div>
    </section>
  )
}
