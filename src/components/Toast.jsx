import React, { createContext, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const show = (message, type = 'info') => setToast({ message, type })

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded px-4 py-3 text-sm font-medium text-white shadow-lg transition ${
            toast.type === 'error'
              ? 'bg-red-600'
              : toast.type === 'success'
                ? 'bg-green-600'
                : 'bg-slate-900'
          }`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


