import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

const STORAGE_KEYS = {
  TASKS: 'aura_tasks',
  NOTES: 'aura_notes',
  THEME: 'aura_theme',
  USER: 'aura_user',
  REMINDERS: 'aura_reminders',
}

const defaultTasks = [
  { id: 1, text: 'Finalize Q4 product roadmap', priority: 'high',   done: false, category: 'Work',     due: '2025-04-15' },
  { id: 2, text: 'Review design mockups from team', priority: 'medium', done: false, category: 'Work',  due: '2025-04-16' },
  { id: 3, text: 'Prepare sprint retrospective notes', priority: 'low', done: true, category: 'Work',   due: '2025-04-14' },
  { id: 4, text: 'Read "Atomic Habits" chapter 5-7', priority: 'low', done: false, category: 'Personal', due: '2025-04-18' },
  { id: 5, text: 'Schedule dentist appointment', priority: 'medium', done: false, category: 'Health',   due: '2025-04-20' },
  { id: 6, text: 'Respond to client email about proposal', priority: 'high', done: false, category: 'Work', due: '2025-04-15' },
]

const defaultNotes = [
  { id: 1, title: 'Product Vision 2025', content: 'Focus on user retention. Build features that keep users coming back daily. Consider gamification, streak tracking, personalization.', color: 'purple', updatedAt: '2025-04-12T10:00:00Z' },
  { id: 2, title: 'Meeting Notes — Standup', content: 'Sprint ends Friday. Blocker: API integration delay from backend. Priya handling auth module. Demo scheduled Monday 10 AM.', color: 'cyan', updatedAt: '2025-04-14T09:30:00Z' },
  { id: 3, title: 'Ideas Brainstorm', content: 'AI-powered task scheduling. Auto-categorize tasks by context. Voice input for quick notes. Weekly digest email.', color: 'yellow', updatedAt: '2025-04-13T15:00:00Z' },
  { id: 4, title: 'Book Notes — Atomic Habits', content: 'Identity-based habits. You don\'t rise to the level of goals, you fall to the level of systems. 1% better every day.', color: 'green', updatedAt: '2025-04-11T20:00:00Z' },
]

const defaultReminders = [
  { id: 1, text: 'Team standup call', time: '09:00 AM', color: '#8b5cf6' },
  { id: 2, text: 'Submit weekly report', time: '05:00 PM', color: '#f59e0b' },
  { id: 3, text: 'Gym session', time: '07:00 PM', color: '#10b981' },
  { id: 4, text: 'Read before bed', time: '10:00 PM', color: '#06b6d4' },
]

export function AppProvider({ children }) {
  const [darkMode, setDarkMode]     = useState(() => localStorage.getItem(STORAGE_KEYS.THEME) !== 'light')
  const [tasks, setTasks]           = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || 'null') || defaultTasks)
  const [notes, setNotes]           = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || 'null') || defaultNotes)
  const [reminders, setReminders]   = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || 'null') || defaultReminders)
  const [toasts, setToasts]         = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Persist
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders)) }, [reminders])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, darkMode ? 'dark' : 'light')
    document.body.classList.toggle('light', !darkMode)
  }, [darkMode])

  // Toast
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  // Task operations
  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const addTask = useCallback((task) => {
    const newTask = { ...task, id: Date.now() }
    setTasks(prev => [newTask, ...prev])
    addToast('Task added!', 'success')
  }, [addToast])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    addToast('Task removed', 'info')
  }, [addToast])

  // Note operations
  const addNote = useCallback((note) => {
    const newNote = { ...note, id: Date.now(), updatedAt: new Date().toISOString() }
    setNotes(prev => [newNote, ...prev])
    addToast('Note saved!', 'success')
  }, [addToast])

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
  }, [])

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    addToast('Note deleted', 'info')
  }, [addToast])

  // Reminder operations
  const addReminder = useCallback((reminder) => {
    setReminders(prev => [...prev, { ...reminder, id: Date.now() }])
    addToast('Reminder set!', 'success')
  }, [addToast])

  const deleteReminder = useCallback((id) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }, [])

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.done).length,
    pendingTasks: tasks.filter(t => !t.done).length,
    totalNotes: notes.length,
    completionRate: tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0,
  }

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      tasks, toggleTask, addTask, deleteTask,
      notes, addNote, updateNote, deleteNote,
      reminders, addReminder, deleteReminder,
      toasts, addToast,
      sidebarCollapsed, setSidebarCollapsed,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
