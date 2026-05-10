import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from '../../components/TaskCard'
import { renderWithProviders, mockTask } from '../testUtils'

describe('TaskCard', () => {
  const onEdit = jest.fn()
  const onDelete = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  it('renders task title and status', () => {
    renderWithProviders(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    renderWithProviders(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('Task description')).toBeInTheDocument()
  })

  it('does not render description when empty', () => {
    const taskNoDesc = { ...mockTask, description: '' }
    renderWithProviders(<TaskCard task={taskNoDesc} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.queryByText('Task description')).not.toBeInTheDocument()
  })

  it('calls onEdit with the task when Edit is clicked', async () => {
    renderWithProviders(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(mockTask)
  })

  it('calls onDelete with the task id when Delete is clicked', async () => {
    renderWithProviders(<TaskCard task={mockTask} onEdit={onEdit} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('renders in-progress status correctly', () => {
    const task = { ...mockTask, status: 'in-progress' as const }
    renderWithProviders(<TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders done status correctly', () => {
    const task = { ...mockTask, status: 'done' as const }
    renderWithProviders(<TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })
})
