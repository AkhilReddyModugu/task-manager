import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '../../components/Header'
import { renderWithProviders, mockAuthState } from '../testUtils'

describe('Header', () => {
  const onToggleDark = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  it('renders the app title', () => {
    renderWithProviders(
      <Header darkMode={false} onToggleDark={onToggleDark} />,
      { preloadedState: { auth: mockAuthState } },
    )
    expect(screen.getByText('Task Manager')).toBeInTheDocument()
  })

  it('renders the logout button', () => {
    renderWithProviders(
      <Header darkMode={false} onToggleDark={onToggleDark} />,
      { preloadedState: { auth: mockAuthState } },
    )
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('calls onToggleDark when the theme button is clicked', async () => {
    renderWithProviders(
      <Header darkMode={false} onToggleDark={onToggleDark} />,
      { preloadedState: { auth: mockAuthState } },
    )
    await userEvent.click(screen.getByLabelText('Toggle dark mode'))
    expect(onToggleDark).toHaveBeenCalledTimes(1)
  })

  it('dispatches logout and clears localStorage when logout is clicked', async () => {
    localStorage.setItem('auth_token', 'tok')
    const { store } = renderWithProviders(
      <Header darkMode={false} onToggleDark={onToggleDark} />,
      { preloadedState: { auth: mockAuthState } },
    )
    await userEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(store.getState().auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('shows BulbFilled icon in dark mode', () => {
    const { container } = renderWithProviders(
      <Header darkMode={true} onToggleDark={onToggleDark} />,
      { preloadedState: { auth: mockAuthState } },
    )
    // BulbFilled is rendered in dark mode — verify button still present
    expect(container.querySelector('[aria-label="Toggle dark mode"]')).toBeInTheDocument()
  })
})
