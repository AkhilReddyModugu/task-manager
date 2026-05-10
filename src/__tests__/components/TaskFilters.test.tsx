import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskFilters } from '../../components/TaskFilters'
import { renderWithProviders } from '../testUtils'

describe('TaskFilters', () => {
  it('renders all filter buttons', () => {
    renderWithProviders(<TaskFilters value="all" onChange={jest.fn()} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('calls onChange with the selected value', async () => {
    const onChange = jest.fn()
    renderWithProviders(<TaskFilters value="all" onChange={onChange} />)
    await userEvent.click(screen.getByText('To Do'))
    expect(onChange).toHaveBeenCalledWith('todo')
  })
})
