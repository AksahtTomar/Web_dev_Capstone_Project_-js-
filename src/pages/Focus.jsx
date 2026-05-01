import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, X, Coffee, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

const MODES = [
  { label: 'Focus',       duration: 25 * 60, color: '#8b5cf6' },
  { label: 'Short Break', duration: 5  * 60, color: '#10b981' },
  { label: 'Long Break',  duration: 15 * 60, color: '#06b6d4' },
]

export default function Focus() {
  const { addToast } = useApp()
  const [modeIdx, setModeIdx]       = useState(0)
  const [timeLeft, setTimeLeft]     = useState(MODES[0].duration)
  const [running, setRunning]       = useState(false)
  const [sessions, setSessions]     = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const intervalRef = useRef(null)

  const mode = MODES[modeIdx]
  const pct  = ((mode.duration - timeLeft) / mode.duration) * 100
  const circumference = 2 * Math.PI * 110

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (modeIdx === 0) {
              setSessions(s => s + 1)
              addToast('🎉 Focus session complete! Take a break.', 'success')
            } else {
              addToast('Break over! Ready to focus?', 'info')
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, modeIdx, addToast])

  const switchMode = (idx) => {
    setModeIdx(idx)
    setTimeLeft(MODES[idx].duration)
    setRunning(false)
  }

  const reset = () => {
    setTimeLeft(mode.duration)
    setRunning(false)
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const TimerUI = ({ compact } = {}) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 24 : 32 }}>
      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', padding: 4, borderRadius: 'var(--radius-md)' }}>
        {MODES.map((m, i) => (
          <button key={m.label} onClick={() => switchMode(i)} className="btn"
            style={{ background: modeIdx === i ? m.color : 'transparent', color: modeIdx === i ? 'white' : 'var(--text-muted)', padding: '6px 16px', fontSize: 13 }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* SVG Ring Timer */}
      <div className="pomodoro-ring" style={{ width: compact ? 240 : 280, height: compact ? 240 : 280 }}>
        <svg width={compact ? 240 : 280} height={compact ? 240 : 280} viewBox="0 0 240 240">
          <circle cx="120" cy="120" r="110" fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="120" cy="120" r="110" fill="none" stroke={mode.color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * pct / 100)}
            style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 8px ${mode.color})` }}
          />
        </svg>
        <div className="center-text">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: compact ? 52 : 60, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -3, lineHeight: 1 }}>
            {fmt(timeLeft)}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{mode.label}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={reset} style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
          <RotateCcw size={18} />
        </button>
        <button onClick={() => setRunning(r => !r)}
          style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: mode.color, boxShadow: `0 8px 24px ${mode.color}55`, transition: 'all 0.2s ease', transform: running ? 'scale(0.95)' : 'scale(1)' }}>
          {running ? <Pause size={24} color="white" /> : <Play size={24} color="white" fill="white" />}
        </button>
        <button className="btn btn-ghost" onClick={() => setFullscreen(true)} style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
          <Zap size={18} />
        </button>
      </div>

      {/* Session count */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sessions today:</span>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: i < sessions ? mode.color : 'var(--bg-elevated)',
            border: `1px solid ${i < sessions ? mode.color : 'var(--border)'}`,
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Focus Mode</h1>
          <p className="page-desc">Pomodoro timer — stay in the zone</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-purple">🔥 {sessions} sessions</span>
          <span className="badge badge-cyan">⏱ {sessions * 25} min focused</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Timer Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 480, padding: 40 }}>
          <TimerUI />
        </div>

        {/* Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>How it works</div>
            {[
              ['🎯', 'Work for 25 minutes without interruptions'],
              ['☕', 'Take a 5-minute short break'],
              ['🔄', 'Repeat 4 times, then take a 15-min long break'],
              ['🏆', 'Track your sessions and build a streak'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 13 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>✦ AI Suggestions</div>
            {[
              'Silence notifications during focus sessions',
              'Prepare water and snacks before starting',
              'Set a clear intention for each session',
              'Thursday 10 AM is your peak focus window',
            ].map(tip => (
              <div key={tip} className="ai-chip" style={{ marginBottom: 6, width: '100%', borderRadius: 'var(--radius-sm)' }}>
                <div className="ai-pulse" />
                <span style={{ fontSize: 12 }}>{tip}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Today's Stats</div>
            {[
              ['Sessions Completed', sessions, '#8b5cf6'],
              ['Minutes Focused',    sessions * 25, '#06b6d4'],
              ['Daily Goal',         80, '#f59e0b'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{val}{label.includes('Minutes') ? ' min' : ''}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((val / (label === 'Sessions Completed' ? 8 : label === 'Minutes Focused' ? 200 : 80)) * 100, 100)}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Focus Overlay */}
      {fullscreen && (
        <div className="focus-overlay">
          <div style={{ position: 'absolute', top: 24, right: 24 }}>
            <button className="btn btn-ghost" onClick={() => setFullscreen(false)}>
              <X size={18} /> Exit Focus
            </button>
          </div>
          <TimerUI compact />
        </div>
      )}
    </div>
  )
}
