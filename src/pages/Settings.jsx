import React, { useState } from 'react'
import { Sun, Moon, Bell, User, Palette, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { darkMode, setDarkMode, addToast } = useApp()
  const [name, setName]       = useState('Aryan Sharma')
  const [email, setEmail]     = useState('aryan@example.com')
  const [notifs, setNotifs]   = useState({ reminders: true, daily: true, tips: false })
  const [saved, setSaved]     = useState(false)

  const save = () => {
    addToast('Settings saved!', 'success')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Section = ({ icon: Icon, title, children }) => (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 32, height: 32, background: 'var(--accent-glow)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color="var(--accent-primary)" />
        </div>
        <div className="card-title">{title}</div>
      </div>
      {children}
    </div>
  )

  const Toggle = ({ label, desc, value, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      <div onClick={onChange} style={{
        width: 44, height: 24, borderRadius: 99, cursor: 'pointer', position: 'relative',
        background: value ? 'var(--accent-primary)' : 'var(--bg-elevated)',
        border: '1px solid var(--border)', transition: 'all 0.2s ease'
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: 'white',
          position: 'absolute', top: 2, left: value ? 22 : 2, transition: 'left 0.2s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
        }} />
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-desc">Customize your Aura experience</p>
        </div>
        <button className="btn btn-primary" onClick={save}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>

      {/* Profile */}
      <Section icon={User} title="Profile">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance">
        <Toggle
          label="Dark Mode"
          desc="Switch between dark and light interface"
          value={darkMode}
          onChange={() => setDarkMode(d => !d)}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {['Default', 'Compact', 'Comfortable'].map(d => (
            <div key={d} style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13,
              background: d === 'Default' ? 'var(--accent-glow)' : 'var(--bg-elevated)',
              border: `1px solid ${d === 'Default' ? 'var(--accent-primary)' : 'var(--border)'}`,
              color: d === 'Default' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            }}>
              {d}
            </div>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <Toggle label="Reminder Alerts"    desc="Get notified for scheduled reminders" value={notifs.reminders} onChange={() => setNotifs(n => ({ ...n, reminders: !n.reminders }))} />
        <Toggle label="Daily Digest"       desc="Receive a daily summary of your tasks"  value={notifs.daily}     onChange={() => setNotifs(n => ({ ...n, daily: !n.daily }))} />
        <Toggle label="AI Tips"            desc="Smart productivity tips from Aura"       value={notifs.tips}      onChange={() => setNotifs(n => ({ ...n, tips: !n.tips }))} />
      </Section>

      {/* Privacy */}
      <Section icon={Shield} title="Privacy & Data">
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
          All your data is stored locally in your browser using LocalStorage. Nothing is sent to external servers except AI Assistant queries (processed by Claude API).
        </div>
        <button className="btn btn-danger" onClick={() => {
          if (window.confirm('Clear all local data? This cannot be undone.')) {
            localStorage.clear()
            addToast('All data cleared. Refreshing...', 'info')
            setTimeout(() => window.location.reload(), 1500)
          }
        }}>
          🗑 Clear All Data
        </button>
      </Section>
    </div>
  )
}
