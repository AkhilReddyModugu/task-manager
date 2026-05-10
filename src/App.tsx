import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider, theme } from 'antd'
import { store } from './store/store'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const toggleDark = () => setDarkMode((d) => !d)

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage darkMode={darkMode} onToggleDark={toggleDark} />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage darkMode={darkMode} onToggleDark={toggleDark} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  )
}

export default App
