import { Home, ArrowUpRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { sections, type SectionKey } from '../../data/sections'

interface SidebarProps {
  currentSection?: SectionKey
}

export function Sidebar({ currentSection }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">
          <Home size={18} />
        </div>
        <div>
          <p className="sidebar__eyebrow">Personal home</p>
          <h2 className="sidebar__title">Quiet systems</h2>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {sections.map((section) => {
          const Icon = section.icon
          const isCurrent = currentSection === section.key

          return (
            <NavLink
              key={section.key}
              to={section.path}
              className={({ isActive }) =>
                ['sidebar__link', isActive ? 'sidebar__link--active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <div className="sidebar__link-main">
                <div className="sidebar__icon" style={{ color: section.accent }}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="sidebar__link-title">{section.title}</p>
                  <p className="sidebar__link-subtitle">{section.subtitle}</p>
                </div>
              </div>
              <ArrowUpRight size={16} className={isCurrent ? 'sidebar__arrow--visible' : 'sidebar__arrow'} />
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar__note">
        <p className="sidebar__note-label">Theme</p>
        <p className="sidebar__note-value">
          Calm structure with richer contrast, soft gradients, and deliberate spacing.
        </p>
      </div>
    </aside>
  )
}
