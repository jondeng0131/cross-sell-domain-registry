import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/CrossSellPatternRegistry'

// Polyfill window.storage for Vercel deployment (no Claude environment)
if (!window.storage) {
  const memStore = {}
  window.storage = {
    get: async (key) => {
      try {
        const val = localStorage.getItem(key)
        return val ? { key, value: val } : null
      } catch {
        return memStore[key] ? { key, value: memStore[key] } : null
      }
    },
    set: async (key, value) => {
      try {
        localStorage.setItem(key, value)
      } catch {
        memStore[key] = value
      }
      return { key, value }
    },
    delete: async (key) => {
      try { localStorage.removeItem(key) } catch { delete memStore[key] }
      return { key, deleted: true }
    },
    list: async (prefix) => {
      try {
        const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix))
        return { keys }
      } catch {
        return { keys: Object.keys(memStore).filter(k => !prefix || k.startsWith(prefix)) }
      }
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

