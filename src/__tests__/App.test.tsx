import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import App from '../App'
import { store } from '../store/store'
import { login, logout } from '../store/authSlice'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  // Reset the store's auth state before each test
  store.dispatch(logout())
  mockedAxios.get.mockResolvedValue({ data: [] })
})

describe('App', () => {
  it('shows login page when not authenticated', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })
  })

  it('shows dashboard when authenticated via store', async () => {
    store.dispatch(
      login.fulfilled(
        { token: 'tok', user: { id: '1', username: 'test' } },
        'req',
        { username: 'test', password: 'test123' },
      ),
    )
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    })
  })

  it('applies dark class from localStorage when darkMode=true', async () => {
    localStorage.setItem('darkMode', 'true')
    render(<App />) // useState reads localStorage at render time
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  it('toggles dark mode and saves preference to localStorage', async () => {
    store.dispatch(
      login.fulfilled(
        { token: 'tok', user: { id: '1', username: 'test' } },
        'req',
        { username: 'test', password: 'test123' },
      ),
    )
    render(<App />)
    await waitFor(() => screen.getByLabelText('Toggle dark mode'))
    await userEvent.click(screen.getByLabelText('Toggle dark mode'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('darkMode')).toBe('true')
  })
})
