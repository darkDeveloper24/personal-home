import { dashboardContent } from '../../data/mockData'
import { getSectionByKey, type DashboardSectionKey } from '../../data/sections'
import { Card } from './Card'
import { MetricCard } from './MetricCard'
import { Pill } from './Pill'
import { SectionHero } from './SectionHero'

interface DashboardPageProps {
  sectionKey: DashboardSectionKey
}

export function DashboardPage({ sectionKey }: DashboardPageProps) {
  const section = getSectionByKey(sectionKey)
  const content = dashboardContent[sectionKey]

  if (!section) {
    return null
  }

  return (
    <section className="dashboard-page" style={{ ['--section-accent' as string]: section.accent }}>
      <SectionHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        quote={content.quote}
      />

      <div className="metrics-grid">
        {content.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="dashboard-grid">
        {content.panels.map((panel) => (
          <Card className="panel-card" key={panel.title}>
            <div className="panel-card__header">
              <div>
                <p className="panel-card__eyebrow">{panel.eyebrow}</p>
                <h2 className="panel-card__title">{panel.title}</h2>
              </div>
              {panel.badge ? <Pill>{panel.badge}</Pill> : null}
            </div>

            <div className="panel-card__items">
              {panel.items.map((item) => (
                <article className="panel-item" key={`${panel.title}-${item.title}`}>
                  <div className="panel-item__topline">
                    <div>
                      <h3 className="panel-item__title">{item.title}</h3>
                      <p className="panel-item__meta">{item.meta}</p>
                    </div>
                    {item.tag ? <Pill>{item.tag}</Pill> : null}
                  </div>
                  <p className="panel-item__description">{item.description}</p>
                </article>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
