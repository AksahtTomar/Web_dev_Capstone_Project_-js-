import React, { useState, useEffect } from 'react'
import { CheckSquare, FileText, TrendingUp, Zap, ArrowUp, ArrowDown, Droplets, Wind, Eye, Thermometer, Plus, X } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useApp } from '../context/AppContext'
import { format } from 'date-fns'

const productivityData = [
  { day: 'Mon', tasks: 4, focus: 65, notes: 2 },
  { day: 'Tue', tasks: 7, focus: 80, notes: 3 },
  { day: 'Wed', tasks: 3, focus: 45, notes: 1 },
  { day: 'Thu', tasks: 9, focus: 90, notes: 5 },
  { day: 'Fri', tasks: 6, focus: 70, notes: 4 },
  { day: 'Sat', tasks: 2, focus: 30, notes: 2 },
  { day: 'Sun', tasks: 5, focus: 55, notes: 3 },
]

const aiSuggestions = [
  "You have 3 high-priority tasks due today 🔥",
  "Peak focus time detected: 9–11 AM. Schedule deep work now.",
  "You're 80% done with this week's tasks — great momentum!",
  "Take a 5-min break — you've been working for 90 minutes.",
  "Thursday is your most productive day — plan big tasks then.",
]

const weatherInfo = {
  temp: 28,
  condition: 'Partly Cloudy',
  humidity: 62,
  wind: 14,
  visibility: 8,
  feelsLike: 31,
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.dataKey === 'tasks' ? '✓ Tasks' : p.dataKey === 'focus' ? '⏱ Focus' : '📝 Notes'}: <b>{p.value}{p.dataKey === 'focus' ? '%' : ''}</b>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { stats, tasks, notes, reminders } = useApp()
  const [suggestionIdx, setSuggestionIdx] = useState(0)
  const [reminderModal, setReminderModal] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSuggestionIdx(i => (i + 1) % aiSuggestions.length), 5000)
    return () => clearInterval(t)
  }, [])

  const priorityTasks = tasks.filter(t => !t.done && t.priority === 'high').slice(0, 3)
  const recentNotes   = notes.slice(0, 3)

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-desc">Your productivity snapshot for today</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-purple" style={{ padding: '6px 12px', fontSize: 12 }}>
            🔥 {stats.completionRate}% this week
          </span>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="ai-response-box" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="ai-pulse" />
        <span style={{ color: 'var(--text-accent)', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>AI Insight</span>
        <span style={{ fontSize: 13, transition: 'all 0.3s' }}>{aiSuggestions[suggestionIdx]}</span>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card purple">
          <div className="stat-icon purple"><CheckSquare size={18} /></div>
          <div className="stat-value">{stats.completedTasks}</div>
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-change up"><ArrowUp size={12} /> 12% vs last week</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon cyan"><TrendingUp size={18} /></div>
          <div className="stat-value">{stats.pendingTasks}</div>
          <div className="stat-label">Tasks Pending</div>
          <div className="stat-change down"><ArrowDown size={12} /> 3 due today</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber"><FileText size={18} /></div>
          <div className="stat-value">{stats.totalNotes}</div>
          <div className="stat-label">Notes Saved</div>
          <div className="stat-change up"><ArrowUp size={12} /> 2 added this week</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><Zap size={18} /></div>
          <div className="stat-value">4.2h</div>
          <div className="stat-label">Focus Time Today</div>
          <div className="stat-change up"><ArrowUp size={12} /> Above average</div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">

        {/* Productivity Chart */}
        <div className="card span-2">
          <div className="card-header">
            <div>
              <div className="card-title">Weekly Productivity</div>
              <div className="card-subtitle">Tasks, focus time & notes this week</div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              {[['#8b5cf6','Tasks'],['#06b6d4','Focus'],['#10b981','Notes']].map(([c,l]) => (
                <span key={l} style={{ display:'flex', alignItems:'center', gap:4, color:'var(--text-muted)' }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:c, display:'inline-block' }} />{l}
                </span>
              ))}
            </div>
          </div>
          <div className="chart-container" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  {[['purple','#8b5cf6'],['cyan','#06b6d4'],['green','#10b981']].map(([id,c]) => (
                    <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tasks" stroke="#8b5cf6" fill="url(#grad-purple)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="focus" stroke="#06b6d4" fill="url(#grad-cyan)"   strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="notes" stroke="#10b981" fill="url(#grad-green)"  strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="weather-widget">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Gurugram, India</div>
              <div className="weather-temp">{weatherInfo.temp}°</div>
              <div className="weather-condition">{weatherInfo.condition}</div>
            </div>
            <div style={{ fontSize: 48 }}>⛅</div>
          </div>
          <div className="weather-details">
            {[
              [Droplets, `${weatherInfo.humidity}%`, 'Humidity'],
              [Wind,     `${weatherInfo.wind} km/h`,  'Wind'],
              [Eye,      `${weatherInfo.visibility} km`,'Visibility'],
              [Thermometer,`${weatherInfo.feelsLike}°`,'Feels like'],
            ].map(([Icon, val, label]) => (
              <div key={label} className="weather-detail">
                <Icon size={14} color="var(--text-accent)" />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Priority Tasks</div>
              <div className="card-subtitle">High priority, pending</div>
            </div>
            <span className="badge badge-red">{priorityTasks.length} urgent</span>
          </div>
          {priorityTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <div className="empty-text">No urgent tasks! You're on top of it.</div>
            </div>
          ) : (
            priorityTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-checkbox" />
                <div style={{ flex: 1 }}>
                  <div className="task-text" style={{ fontSize: 13 }}>{task.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Due: {task.due}</div>
                </div>
                <span className="badge badge-red">High</span>
              </div>
            ))
          )}
        </div>

        {/* Completion Bar */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Goal Progress</div>
            <span className="badge badge-purple">{stats.completionRate}%</span>
          </div>
          {[
            ['Weekly Tasks',   stats.completionRate,   '#8b5cf6'],
            ['Focus Goal',     72,                      '#06b6d4'],
            ['Notes Target',   Math.min(stats.totalNotes * 10, 100), '#10b981'],
            ['Deep Work',      55,                      '#f59e0b'],
          ].map(([label, pct, color]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Reminders */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Today's Reminders</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{format(new Date(), 'MMM d')}</span>
          </div>
          {reminders.slice(0, 4).map(r => (
            <div key={r.id} className="reminder-item">
              <div className="reminder-dot" style={{ background: r.color }} />
              <span className="reminder-text">{r.text}</span>
              <span className="reminder-time">{r.time}</span>
            </div>
          ))}
        </div>

        {/* Quick AI Chips */}
        <div className="card span-3" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ✦ AI Quick Actions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              '📋 Summarize my tasks',
              '🧠 Suggest focus areas',
              '📅 Plan my day',
              '⏱ Start pomodoro',
              '💡 Give me a productivity tip',
              '📊 Weekly report',
            ].map(label => (
              <div key={label} className="ai-chip">
                <div className="ai-pulse" />
                {label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
