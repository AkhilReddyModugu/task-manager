import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply dark mode before render to avoid flash of unstyled content
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark')
}

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
