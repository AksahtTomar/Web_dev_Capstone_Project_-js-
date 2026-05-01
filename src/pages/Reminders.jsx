import React, { useState } from 'react'
import { Plus, Trash2, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'

const dotColors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e']

export default function Reminders() {
  const { reminders, addReminder, deleteReminder } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ text: '', time: '', color: '#8b5cf6' })

  const handleSubmit = () => {
    if (!form.text.trim() || !form.time) return
    // Format time to AM/PM
    const [h, m] = form.time.split(':')
    const hour = parseInt(h)
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const display = `${hour % 12 || 12}:${m} ${suffix}`
    addReminder({ text: form.text, time: display, color: form.color })
    setForm({ text: '', time: '', color: '#8b5cf6' })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reminders</h1>
          <p className="page-desc">{reminders.length} reminders set for today</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Reminder
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {reminders.map(r => (
          <div key={r.id} className="card" style={{ borderLeft: `3px solid ${r.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={20} color={r.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{r.text}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>⏰ {r.time}</div>
              </div>
              <button className="btn btn-danger" style={{ padding: '6px 8px' }} onClick={() => deleteReminder(r.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {reminders.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1', minHeight: 300 }}>
            <div className="empty-icon">🔔</div>
            <div className="empty-text">No reminders yet. Add one to stay on track!</div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Reminder</div>
              <button className="icon-btn" onClick={() => setShowModal(false)}><span>✕</span></button>
            </div>
            <div className="form-group">
              <label className="form-label">Reminder Text *</label>
              <input className="form-input" placeholder="What do you want to be reminded about?" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Time *</label>
              <input type="time" className="form-input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {dotColors.map(c => (
                  <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? '3px solid white' : '3px solid transparent' }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}><Plus size={14} /> Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
