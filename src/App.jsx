import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Topbar  from './components/Topbar'
import Toast   from './components/Toast'

import Dashboard from './pages/Dashboard'
import Tasks     from './pages/Tasks'
import Notes     from './pages/Notes'
import Calendar  from './pages/Calendar'
import Focus     from './pages/Focus'
import AIAssist  from './pages/AIAssist'
import Reminders from './pages/Reminders'
import Settings  from './pages/Settings'

function Layout() {
  return (
    <AppProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <main className="page-content">
            <Routes>
              <Route path="/"          element={<Dashboard />} />
              <Route path="/tasks"     element={<Tasks />} />
              <Route path="/notes"     element={<Notes />} />
              <Route path="/calendar"  element={<Calendar />} />
              <Route path="/focus"     element={<Focus />} />
              <Route path="/ai"        element={<AIAssist />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/settings"  element={<Settings />} />
            </Routes>
          </main>
        </div>
        <Toast />
      </div>
    </AppProvider>
  )
}

export default function App() {
  return <Layout />
}
