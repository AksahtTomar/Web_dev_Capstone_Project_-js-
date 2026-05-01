import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, FileText, Calendar,
  Brain, Settings, ChevronLeft, ChevronRight, Timer, Bell
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { label: 'Dashboard',  path: '/',         icon: LayoutDashboard },
  { label: 'Tasks',      path: '/tasks',    icon: CheckSquare },
  { label: 'Notes',      path: '/notes',    icon: FileText },
  { label: 'Calendar',   path: '/calendar', icon: Calendar },
  { label: 'Focus',      path: '/focus',    icon: Timer },
  { label: 'AI Assist',  path: '/ai',       icon: Brain },
]

const secondaryItems = [
  { label: 'Reminders',  path: '/reminders', icon: Bell },
  { label: 'Settings',   path: '/settings',  icon: Settings },
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, stats } = useApp()
  const location = useLocation()

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        <span className="logo-text">Aura</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Main</div>
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon className="nav-icon" size={18} />
            <span className="nav-label">{label}</span>
            {label === 'Tasks' && stats.pendingTasks > 0 && (
              <span className="nav-badge">{stats.pendingTasks}</span>
            )}
          </NavLink>
        ))}

        <div className="nav-section-title">More</div>
        {secondaryItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon className="nav-icon" size={18} />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="sidebar-footer">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed
            ? <ChevronRight size={16} />
            : <><ChevronLeft size={16} /><span className="nav-label">Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}
