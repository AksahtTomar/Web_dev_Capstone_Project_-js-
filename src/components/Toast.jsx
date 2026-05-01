import React from 'react'
import { CheckCircle, Info, XCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const icons = {
  success: <CheckCircle size={16} color="var(--accent-success)" />,
  error:   <XCircle    size={16} color="var(--accent-danger)"  />,
  info:    <Info       size={16} color="var(--accent-primary)" />,
}

export default function ToastContainer() {
  const { toasts } = useApp()
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {icons[t.type]}
          {t.message}
        </div>
      ))}
    </div>
  )
}
