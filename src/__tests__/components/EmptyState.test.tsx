import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyState } from '../../components/EmptyState'
import { renderWithProviders } from '../testUtils'

describe('EmptyState', () => {
  it('renders the empty message', () => {
    renderWithProviders(<EmptyState onAdd={jest.fn()} />)
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
    expect(screen.getByText(/Create your first task/i)).toBeInTheDocument()
  })

  it('calls onAdd when the button is clicked', async () => {
    const onAdd = jest.fn()
    renderWithProviders(<EmptyState onAdd={onAdd} />)
    await userEvent.click(screen.getByRole('button', { name: /add task/i }))
    expect(onAdd).toHaveBeenCalledTimes(1)
  })
})
