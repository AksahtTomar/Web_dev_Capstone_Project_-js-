import React, { useState } from 'react'
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { format } from 'date-fns'

export default function Topbar() {
  const { darkMode, setDarkMode, sidebarCollapsed } = useApp()
  const [search, setSearch] = useState('')

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className={`topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        <div className="topbar-greeting">{greeting}, Aryan 👋</div>
        <div className="topbar-date">{format(now, 'EEEE, MMMM d, yyyy')}</div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Notifications */}
        <button className="icon-btn" title="Notifications">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>

        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Avatar */}
        <div className="avatar" title="Profile">A</div>
      </div>
    </header>
  )
}
