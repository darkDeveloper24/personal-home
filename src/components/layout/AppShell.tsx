import { useEffect } from 'react'
import { CalendarDays, MoonStar } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'

import { getSectionByPath } from '../../data/sections'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const location = useLocation()
  const currentSection = getSectionByPath(location.pathname)
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  useEffect(() => {
    document.title = currentSection ? `${currentSection.title} · Personal Home` : 'Personal Home'
  }, [currentSection])

  return (
    <div className={`app-shell ${currentSection ? `theme-${currentSection.key}` : ''}`}>
      <div className="app-shell__glow app-shell__glow--primary" aria-hidden="true" />
      <div className="app-shell__glow app-shell__glow--secondary" aria-hidden="true" />

      <Sidebar currentSection={currentSection?.key} />

      <main className="app-shell__main">
        <header className="topbar">
          <div>
            <p className="topbar__eyebrow">Designed for clarity</p>
            <p className="topbar__headline">
              {currentSection?.subtitle ?? 'A personal dashboard for work, health, and money.'}
            </p>
          </div>

          <div className="topbar__meta">
            <span>
              <CalendarDays size={16} />
              {todayLabel}
            </span>
            <span>
              <MoonStar size={16} />
              Slow systems, long horizon
            </span>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}
