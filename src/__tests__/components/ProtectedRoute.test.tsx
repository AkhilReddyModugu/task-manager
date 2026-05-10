import React from 'react'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { renderWithProviders } from '../testUtils'

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      { preloadedState: { auth: { isAuthenticated: true, user: { id: '1', username: 'test' }, token: 'tok', loading: false, error: null } } },
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when not authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { preloadedState: { auth: { isAuthenticated: false, user: null, token: null, loading: false, error: null } } },
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
