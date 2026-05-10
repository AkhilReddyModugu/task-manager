import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { LoginPage } from '../../pages/LoginPage'
import { renderWithProviders, mockAuthState } from '../testUtils'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})

describe('LoginPage', () => {
  it('renders the login form', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByPlaceholderText('test')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('test123')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderWithProviders(<LoginPage />)
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('dispatches login on valid submit', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'tok', user: { id: '1', username: 'test' } },
    })
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] })
    await userEvent.type(screen.getByPlaceholderText('test'), 'test')
    await userEvent.type(screen.getByPlaceholderText('test123'), 'test123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/login', {
        username: 'test',
        password: 'test123',
      })
    })
  })

  it('shows error from Redux state', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: 'Invalid username or password',
        },
      },
    })
    expect(screen.getByText('Invalid username or password')).toBeInTheDocument()
  })

  it('shows loading spinner on button while submitting', async () => {
    mockedAxios.post.mockReturnValue(new Promise(() => {}))
    renderWithProviders(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText('test'), 'test')
    await userEvent.type(screen.getByPlaceholderText('test123'), 'test123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      // antd loading button adds ant-btn-loading class but may not set disabled attr
      expect(screen.getByRole('button', { name: /sign in/i })).toHaveClass('ant-btn-loading')
    })
  })

  it('navigates to / when already authenticated', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<div>Dashboard</div>} />
      </Routes>,
      { preloadedState: { auth: { ...mockAuthState } }, initialEntries: ['/login'] },
    )
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })
})
