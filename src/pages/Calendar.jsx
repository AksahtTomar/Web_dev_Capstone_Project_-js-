import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'
import { useApp } from '../context/AppContext'

const eventColors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e']

const sampleEvents = [
  { id: 1, title: 'Team Standup',       date: new Date(), color: '#8b5cf6', time: '09:00 AM' },
  { id: 2, title: 'Design Review',       date: new Date(new Date().setDate(new Date().getDate() + 2)), color: '#06b6d4', time: '02:00 PM' },
  { id: 3, title: 'Product Demo',        date: new Date(new Date().setDate(new Date().getDate() + 5)), color: '#f59e0b', time: '04:00 PM' },
  { id: 4, title: 'Sprint Planning',     date: new Date(new Date().setDate(new Date().getDate() - 2)), color: '#10b981', time: '10:00 AM' },
  { id: 5, title: 'Investor Call',       date: new Date(new Date().setDate(new Date().getDate() + 8)), color: '#f43f5e', time: '11:00 AM' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState(new Date())
  const [events, setEvents]   = useState(sampleEvents)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', time: '', color: '#8b5cf6' })

  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const gridStart  = startOfWeek(monthStart)
  const gridEnd    = endOfWeek(monthEnd)
  const days       = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const selectedEvents = events.filter(e => isSameDay(new Date(e.date), selected))

  const addEvent = () => {
    if (!form.title.trim()) return
    setEvents(prev => [...prev, { id: Date.now(), ...form, date: selected }])
    setForm({ title: '', time: '', color: '#8b5cf6' })
    setShowModal(false)
  }

  const hasEvent = (day) => events.some(e => isSameDay(new Date(e.date), day))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-desc">Manage your schedule and events</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Event</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Calendar */}
        <div className="card">
          {/* Month Nav */}
          <div className="card-header">
            <button className="icon-btn" onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
              <ChevronLeft size={16} />
            </button>
            <div className="card-title">{format(current, 'MMMM yyyy')}</div>
            <button className="icon-btn" onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="calendar-grid" style={{ marginBottom: 4 }}>
            {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
          </div>

          {/* Day Cells */}
          <div className="calendar-grid">
            {days.map(day => (
              <div
                key={day.toISOString()}
                className={[
                  'cal-day',
                  isToday(day) ? 'today' : '',
                  !isSameMonth(day, current) ? 'other-month' : '',
                  isSameDay(day, selected) && !isToday(day) ? 'selected' : '',
                  hasEvent(day) ? 'has-event' : '',
                ].filter(Boolean).join(' ')}
                style={isSameDay(day, selected) && !isToday(day) ? { background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontWeight: 600 } : {}}
                onClick={() => setSelected(day)}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>

        {/* Event Sidebar */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{format(selected, 'EEEE')}</div>
              <div className="card-subtitle">{format(selected, 'MMMM d, yyyy')}</div>
            </div>
            <span className="badge badge-purple">{selectedEvents.length} events</span>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-text">No events for this day. Add one!</div>
            </div>
          ) : (
            selectedEvents.map(ev => (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)', marginBottom: 8,
                borderLeft: `3px solid ${ev.color}`
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{ev.title}</div>
                  {ev.time && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>⏰ {ev.time}</div>}
                </div>
                <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => setEvents(prev => prev.filter(e => e.id !== ev.id))}>
                  <span style={{ fontSize: 10 }}>✕</span>
                </button>
              </div>
            ))
          )}

          <div className="divider" />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Upcoming
          </div>
          {events
            .filter(e => new Date(e.date) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 4)
            .map(ev => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: ev.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(new Date(ev.date), 'MMM d')}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Event</div>
              <button className="icon-btn" onClick={() => setShowModal(false)}><span>✕</span></button>
            </div>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input className="form-input" placeholder="Event name..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="form-input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {eventColors.map(c => (
                  <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? '3px solid white' : '3px solid transparent' }} />
                ))}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              Adding to: <strong style={{ color: 'var(--text-primary)' }}>{format(selected, 'MMMM d, yyyy')}</strong>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addEvent}>Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
