import React, { useState, useMemo } from 'react'
import { Plus, Trash2, Check, Filter, Search, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PRIORITIES = ['all', 'high', 'medium', 'low']
const CATEGORIES = ['all', 'Work', 'Personal', 'Health', 'Learning']

export default function Tasks() {
  const { tasks, toggleTask, addTask, deleteTask } = useApp()

  const [showModal, setShowModal] = useState(false)
  const [filterPriority, setFilterPriority]   = useState('all')
  const [filterCategory, setFilterCategory]   = useState('all')
  const [filterStatus, setFilterStatus]       = useState('all')
  const [searchQuery, setSearchQuery]         = useState('')

  const [form, setForm] = useState({ text: '', priority: 'medium', category: 'Work', due: '' })

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false
      if (filterCategory !== 'all' && t.category !== filterCategory) return false
      if (filterStatus === 'done'    && !t.done)  return false
      if (filterStatus === 'pending' &&  t.done)  return false
      if (searchQuery && !t.text.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [tasks, filterPriority, filterCategory, filterStatus, searchQuery])

  const handleSubmit = () => {
    if (!form.text.trim()) return
    addTask({ ...form, done: false })
    setForm({ text: '', priority: 'medium', category: 'Work', due: '' })
    setShowModal(false)
  }

  const priorityColor = { high: 'badge-red', medium: 'badge-amber', low: 'badge-green' }
  const priorityDot   = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' }

  const completed = tasks.filter(t => t.done).length
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-desc">{completed} of {tasks.length} tasks completed ({pct}%)</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> New Task
        </button>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Overall Completion</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="topbar-search" style={{ flex: 1, minWidth: 180, width: 'auto' }}>
          <Search size={14} color="var(--text-muted)" />
          <input placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {[
          { label: 'Status',   options: ['all', 'pending', 'done'],   val: filterStatus,   set: setFilterStatus },
          { label: 'Priority', options: PRIORITIES,                    val: filterPriority, set: setFilterPriority },
          { label: 'Category', options: CATEGORIES,                    val: filterCategory, set: setFilterCategory },
        ].map(({ label, options, val, set }) => (
          <select key={label} className="form-select" style={{ width: 'auto', padding: '8px 12px' }}
            value={val} onChange={e => set(e.target.value)}>
            {options.map(o => <option key={o} value={o}>{o === 'all' ? `${label}: All` : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        ))}

        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} tasks</span>
      </div>

      {/* Task List */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-text">No tasks match your filters.</div>
          </div>
        ) : (
          filtered.map((task, i) => (
            <div key={task.id} className="task-item" style={{ animationDelay: `${i * 0.04}s` }}>
              {/* Checkbox */}
              <div
                className={`task-checkbox ${task.done ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                {task.done && <Check size={11} color="white" />}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div className={`task-text ${task.done ? 'done' : ''}`}>{task.text}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                  <span className={`badge ${priorityColor[task.priority]}`}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: priorityDot[task.priority], display: 'inline-block' }} />
                    {task.priority}
                  </span>
                  <span className="badge badge-gray">{task.category}</span>
                  {task.due && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📅 {task.due}</span>}
                </div>
              </div>

              {/* Delete */}
              <button className="btn btn-ghost" style={{ padding: '6px 8px' }} onClick={() => deleteTask(task.id)}>
                <Trash2 size={14} color="var(--accent-danger)" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Task</div>
              <button className="icon-btn" onClick={() => setShowModal(false)}><span>✕</span></button>
            </div>

            <div className="form-group">
              <label className="form-label">Task Description *</label>
              <input className="form-input" placeholder="What needs to be done?" value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}><Plus size={14} /> Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
