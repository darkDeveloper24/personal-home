import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card } from '../components/ui/Card'

export function NotFoundPage() {
  return (
    <section className="not-found-page">
      <Card className="not-found-card">
        <div className="not-found-card__icon">
          <Compass size={28} />
        </div>
        <p className="not-found-card__eyebrow">Page not found</p>
        <h1 className="not-found-card__title">That room does not exist yet.</h1>
        <p className="not-found-card__description">
          Head back to the workspace and continue with the pages already mapped.
        </p>
        <Link className="not-found-card__link" to="/work">
          Go to Work
        </Link>
      </Card>
    </section>
  )
}
