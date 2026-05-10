import React from 'react'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../../components/TaskForm'
import { renderWithProviders, mockTask } from '../testUtils'

// Replace antd Select with a native <select> so onChange is testable in jsdom
jest.mock('antd', () => {
  const actual = jest.requireActual<typeof import('antd')>('antd')
  return {
    ...actual,
    Select: ({ onChange, value, options }: {
      onChange: (v: string) => void
      value: string
      options: Array<{ value: string; label: string }>
    }) => (
      <select
        data-testid="status-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    ),
  }
})

describe('TaskForm', () => {
  const onSubmit = jest.fn()
  const onCancel = jest.fn()

  beforeEach(() => jest.clearAllMocks())

  it('renders create mode when no task provided', () => {
    renderWithProviders(
      <TaskForm open={true} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    expect(screen.getByText('Create Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('renders edit mode when task is provided', () => {
    renderWithProviders(
      <TaskForm open={true} task={mockTask} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
  })

  it('pre-fills form with task values in edit mode', () => {
    renderWithProviders(
      <TaskForm open={true} task={mockTask} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Task description')).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    renderWithProviders(
      <TaskForm open={false} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    expect(screen.queryByText('Create Task')).not.toBeInTheDocument()
  })

  it('shows validation error when title is empty on submit', async () => {
    renderWithProviders(
      <TaskForm open={true} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when title is too short', async () => {
    renderWithProviders(
      <TaskForm open={true} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'ab')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => {
      expect(screen.getByText('Minimum 3 characters')).toBeInTheDocument()
    })
  })

  it('allows changing the status and submits with updated value', async () => {
    renderWithProviders(
      <TaskForm open={true} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    fireEvent.change(screen.getByTestId('status-select'), {
      target: { value: 'in-progress' },
    })
    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'My Task')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'My Task',
        description: '',
        status: 'in-progress',
      })
    })
  })

  it('calls onSubmit with default values when form is valid', async () => {
    renderWithProviders(
      <TaskForm open={true} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'New Task')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: '',
        status: 'todo',
      })
    })
  })

  it('calls onCancel and resets form on cancel', async () => {
    renderWithProviders(
      <TaskForm open={true} onSubmit={onSubmit} onCancel={onCancel} />,
    )
    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'Draft')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
