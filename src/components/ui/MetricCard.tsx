import { Card } from './Card'

interface MetricCardProps {
  label: string
  value: string
  detail: string
  trend: string
}

export function MetricCard({ label, value, detail, trend }: MetricCardProps) {
  return (
    <Card className="metric-card">
      <p className="metric-card__label">{label}</p>
      <p className="metric-card__value">{value}</p>
      <p className="metric-card__detail">{detail}</p>
      <p className="metric-card__trend">{trend}</p>
    </Card>
  )
}
