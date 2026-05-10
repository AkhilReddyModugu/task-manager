import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { DashboardPage } from '../../pages/DashboardPage'
import { renderWithProviders, mockTask, mockAuthState } from '../testUtils'
import type { Task } from '../../types'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const defaultProps = { darkMode: false, onToggleDark: jest.fn() }

function renderDashboard(tasks: Task[] = []) {
  mockedAxios.get.mockResolvedValue({ data: tasks })
  return renderWithProviders(<DashboardPage {...defaultProps} />, {
    preloadedState: { auth: mockAuthState, tasks: { tasks, loading: false, error: null } },
  })
}

function getFilters() {
  return screen.getByTestId('task-filters')
}

beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})

describe('DashboardPage', () => {
  it('renders header and add task button', async () => {
    renderDashboard([])
    await waitFor(() => expect(screen.getByText('Task Manager')).toBeInTheDocument())
    // Multiple "Add Task" buttons may exist (header + EmptyState), so use getAllByRole
    expect(screen.getAllByRole('button', { name: /add task/i }).length).toBeGreaterThan(0)
  })

  it('shows spinner while loading', () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}))
    renderWithProviders(<DashboardPage {...defaultProps} />, {
      preloadedState: { auth: mockAuthState, tasks: { tasks: [], loading: true, error: null } },
    })
    expect(document.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('shows empty state when no tasks', async () => {
    renderDashboard([])
    await waitFor(() => expect(screen.getByText('No tasks yet')).toBeInTheDocument())
  })

  it('renders task cards when tasks exist', async () => {
    renderDashboard([mockTask])
    await waitFor(() => expect(screen.getByText('Test Task')).toBeInTheDocument())
  })

  it('shows error alert when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('network error'))
    renderWithProviders(<DashboardPage {...defaultProps} />, {
      preloadedState: { auth: mockAuthState, tasks: { tasks: [], loading: false, error: null } },
    })
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument()
    })
  })

  it('filters tasks by status (todo → hides in-progress)', async () => {
    const tasks: Task[] = [
      { ...mockTask, id: '1', title: 'Todo Task', status: 'todo' },
      { ...mockTask, id: '2', title: 'InProg Task', status: 'in-progress' },
    ]
    renderDashboard(tasks)
    await waitFor(() => screen.getByText('Todo Task'))
    // Click "In Progress" filter inside the Radio.Group (avoid tag text collision)
    await userEvent.click(within(getFilters()).getByText('In Progress'))
    expect(screen.queryByText('Todo Task')).not.toBeInTheDocument()
    expect(screen.getByText('InProg Task')).toBeInTheDocument()
  })

  it('shows all tasks when All filter selected after filtering', async () => {
    const tasks: Task[] = [
      { ...mockTask, id: '1', title: 'Todo Task', status: 'todo' },
      { ...mockTask, id: '2', title: 'InProg Task', status: 'in-progress' },
    ]
    renderDashboard(tasks)
    await waitFor(() => screen.getByText('Todo Task'))
    await userEvent.click(within(getFilters()).getByText('In Progress'))
    await userEvent.click(within(getFilters()).getByText('All'))
    expect(screen.getByText('Todo Task')).toBeInTheDocument()
    expect(screen.getByText('InProg Task')).toBeInTheDocument()
  })

  it('opens create form when Add Task header button is clicked', async () => {
    renderDashboard([])
    await waitFor(() => screen.getByText('No tasks yet'))
    await userEvent.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await waitFor(() => expect(screen.getByText('Create Task')).toBeInTheDocument())
  })

  it('opens create form from EmptyState add button', async () => {
    renderDashboard([])
    await waitFor(() => screen.getByText('No tasks yet'))
    const btns = screen.getAllByRole('button', { name: /add task/i })
    await userEvent.click(btns[btns.length - 1])
    await waitFor(() => expect(screen.getByText('Create Task')).toBeInTheDocument())
  })

  it('opens edit form when Edit is clicked', async () => {
    renderDashboard([mockTask])
    await waitFor(() => screen.getByText('Test Task'))
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    await waitFor(() => expect(screen.getByText('Edit Task')).toBeInTheDocument())
  })

  it('dispatches deleteTask when Delete is clicked', async () => {
    mockedAxios.delete.mockResolvedValueOnce({})
    const { store } = renderDashboard([mockTask])
    await waitFor(() => screen.getByText('Test Task'))
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    await waitFor(() => {
      expect((store.getState() as { tasks: { tasks: Task[] } }).tasks.tasks).toHaveLength(0)
    })
  })

  it('creates a new task via the form', async () => {
    const newTask: Task = { id: '2', title: 'Brand New Task', description: '', status: 'todo', createdAt: new Date().toISOString() }
    mockedAxios.post.mockResolvedValueOnce({ data: newTask })
    renderDashboard([])
    await waitFor(() => screen.getByText('No tasks yet'))
    await userEvent.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await waitFor(() => screen.getByText('Create Task'))
    await userEvent.type(screen.getByPlaceholderText('Enter task title'), 'Brand New Task')
    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled())
  })

  it('updates a task via the edit form', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: { ...mockTask, title: 'Updated Task' } })
    renderDashboard([mockTask])
    await waitFor(() => screen.getByText('Test Task'))
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    await waitFor(() => screen.getByText('Edit Task'))
    const titleInput = screen.getByDisplayValue('Test Task')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Task')
    await userEvent.click(screen.getByRole('button', { name: 'Update' }))
    await waitFor(() => expect(mockedAxios.put).toHaveBeenCalled())
  })

  it('closes form on cancel', async () => {
    renderDashboard([])
    await waitFor(() => screen.getByText('No tasks yet'))
    await userEvent.click(screen.getAllByRole('button', { name: /add task/i })[0])
    await waitFor(() => screen.getByText('Create Task'))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => {
      expect(screen.queryByText('Create Task')).not.toBeInTheDocument()
    })
  })

  it('calls onToggleDark from the header toggle', async () => {
    const onToggleDark = jest.fn()
    mockedAxios.get.mockResolvedValue({ data: [] })
    renderWithProviders(<DashboardPage darkMode={false} onToggleDark={onToggleDark} />, {
      preloadedState: { auth: mockAuthState, tasks: { tasks: [], loading: false, error: null } },
    })
    await userEvent.click(screen.getByLabelText('Toggle dark mode'))
    expect(onToggleDark).toHaveBeenCalledTimes(1)
  })
})
