import React, { useState } from 'react'
import { Plus, Trash2, Edit3, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { format } from 'date-fns'

const COLORS = ['yellow', 'purple', 'cyan', 'green']

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useApp()
  const [showModal, setShowModal]   = useState(false)
  const [editNote, setEditNote]     = useState(null)
  const [search, setSearch]         = useState('')
  const [form, setForm]             = useState({ title: '', content: '', color: 'purple' })

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditNote(null)
    setForm({ title: '', content: '', color: 'purple' })
    setShowModal(true)
  }

  const openEdit = (note) => {
    setEditNote(note)
    setForm({ title: note.title, content: note.content, color: note.color })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return
    if (editNote) {
      updateNote(editNote.id, form)
    } else {
      addNote(form)
    }
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notes</h1>
          <p className="page-desc">{notes.length} notes saved</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={15} /> New Note
        </button>
      </div>

      {/* Search */}
      <div className="topbar-search" style={{ marginBottom: 24, width: '100%', maxWidth: 360 }}>
        <Search size={14} color="var(--text-muted)" />
        <input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ minHeight: 300 }}>
          <div className="empty-icon">📝</div>
          <div className="empty-text">No notes yet. Start writing your thoughts!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map(note => (
            <div key={note.id} className={`note-card ${note.color}`}>
              <div className="note-title">{note.title}</div>
              <div className="note-preview">{note.content}</div>
              <div className="note-footer">
                <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => openEdit(note)}>
                    <Edit3 size={13} />
                  </button>
                  <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => deleteNote(note.id)}>
                    <Trash2 size={13} color="var(--accent-danger)" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editNote ? 'Edit Note' : 'New Note'}</div>
              <button className="icon-btn" onClick={() => setShowModal(false)}><span>✕</span></button>
            </div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Note title..." value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea className="form-textarea" rows={5} placeholder="Write your thoughts..."
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                      background: c === 'yellow' ? '#f59e0b' : c === 'purple' ? '#8b5cf6' : c === 'cyan' ? '#06b6d4' : '#10b981',
                      border: form.color === c ? '3px solid var(--text-primary)' : '3px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editNote ? 'Save Changes' : <><Plus size={14} /> Save Note</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
