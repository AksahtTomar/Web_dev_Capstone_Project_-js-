import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SYSTEM_CONTEXT = (stats, tasks, notes) => `
You are Aura, an intelligent AI productivity assistant built into a dashboard app.
The user's current stats: ${stats.completedTasks} tasks completed, ${stats.pendingTasks} tasks pending, ${stats.totalNotes} notes saved, ${stats.completionRate}% completion rate.
Their pending tasks: ${tasks.filter(t=>!t.done).map(t=>t.text).join(', ')}.
Their notes: ${notes.map(n=>n.title).join(', ')}.
Be concise, helpful, and motivating. Use emojis sparingly.
`

const quickPrompts = [
  '📋 Summarize my pending tasks',
  '🧠 Suggest my top 3 priorities today',
  '💡 Give me a productivity tip',
  '📊 How am I doing this week?',
  '⏱ Help me plan a focus session',
  '🎯 What should I work on next?',
]

export default function AIAssist() {
  const { stats, tasks, notes } = useApp()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Aura, your AI productivity assistant 🌟 I can help you prioritize tasks, plan your day, or just answer productivity questions. What's on your mind?" }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return

    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_CONTEXT(stats, tasks, notes),
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMsg }
          ]
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that."
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops! Something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const clear = () => setMessages([{ role: 'assistant', content: "Chat cleared! How can I help you?" }])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Assistant</h1>
          <p className="page-desc">Powered by Claude — your intelligent productivity companion</p>
        </div>
        <button className="btn btn-ghost" onClick={clear}><RotateCcw size={14} /> Clear Chat</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, height: 'calc(100vh - 220px)', minHeight: 500 }}>
        {/* Chat Area */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, marginBottom: 20,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}>
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'assistant' ? 'linear-gradient(135deg,#8b5cf6,#06b6d4)' : 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'assistant' ? <Bot size={16} color="white" /> : <User size={16} color="var(--text-secondary)" />}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  padding: '10px 14px',
                  fontSize: 14,
                  lineHeight: 1.6,
                  border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={16} color="white" />
                </div>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: `pulse 1.4s ease-in-out ${i*0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input
              className="form-input"
              placeholder="Ask Aura anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: '9px 16px' }}>
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Sidebar Prompts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Quick Questions</div>
            {quickPrompts.map(p => (
              <button key={p} className="btn btn-ghost" onClick={() => send(p)}
                style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6, textAlign: 'left', fontSize: 12, padding: '8px 12px' }}>
                {p}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={14} color="var(--accent-primary)" /> Context
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Aura knows about your <strong style={{ color: 'var(--text-primary)' }}>{stats.pendingTasks}</strong> pending tasks,
              <strong style={{ color: 'var(--text-primary)' }}> {stats.totalNotes}</strong> notes, and
              <strong style={{ color: 'var(--text-primary)' }}> {stats.completionRate}%</strong> completion rate.
            </div>
          </div>

          <div className="ai-response-box" style={{ fontSize: 12 }}>
            Tip: Ask Aura to help you break down big tasks, set priorities, or create a daily schedule.
          </div>
        </div>
      </div>
    </div>
  )
}
