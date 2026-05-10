import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import tasksReducer, {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../store/taskSlice'
import type { TasksState } from '../../types'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Desc',
  status: 'todo' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
}

const defaultState: TasksState = { tasks: [], loading: false, error: null }

function makeStore(tasks = defaultState.tasks) {
  return configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: { tasks: { ...defaultState, tasks } },
  })
}

beforeEach(() => jest.clearAllMocks())

describe('fetchTasks', () => {
  it('sets loading on pending', () => {
    const store = makeStore()
    mockedAxios.get.mockReturnValue(new Promise(() => {}))
    store.dispatch(fetchTasks())
    const { tasks } = store.getState()
    expect(tasks.loading).toBe(true)
    expect(tasks.error).toBeNull()
  })

  it('sets tasks on fulfilled', async () => {
    const store = makeStore()
    mockedAxios.get.mockResolvedValueOnce({ data: [mockTask] })
    await store.dispatch(fetchTasks())
    const { tasks } = store.getState()
    expect(tasks.tasks).toEqual([mockTask])
    expect(tasks.loading).toBe(false)
  })

  it('sets error on rejected', async () => {
    const store = makeStore()
    mockedAxios.get.mockRejectedValueOnce(new Error('fail'))
    await store.dispatch(fetchTasks())
    expect(store.getState().tasks.error).toBe('Failed to fetch tasks')
    expect(store.getState().tasks.loading).toBe(false)
  })
})

describe('createTask', () => {
  it('appends task on fulfilled', async () => {
    const store = makeStore()
    mockedAxios.post.mockResolvedValueOnce({ data: mockTask })
    await store.dispatch(createTask({ title: 'Test Task', description: 'Desc', status: 'todo' }))
    expect(store.getState().tasks.tasks).toEqual([mockTask])
  })

  it('sets error on rejected', async () => {
    const store = makeStore()
    mockedAxios.post.mockRejectedValueOnce(new Error('fail'))
    await store.dispatch(createTask({ title: 'T', description: '', status: 'todo' }))
    expect(store.getState().tasks.error).toBe('Failed to create task')
  })
})

describe('updateTask', () => {
  it('updates existing task on fulfilled', async () => {
    const store = makeStore([mockTask])
    const updated = { ...mockTask, title: 'Updated' }
    mockedAxios.put.mockResolvedValueOnce({ data: updated })
    await store.dispatch(updateTask({ id: '1', data: { title: 'Updated' } }))
    expect(store.getState().tasks.tasks[0].title).toBe('Updated')
  })

  it('does not crash when task id not found', async () => {
    const store = makeStore([mockTask])
    const ghost = { ...mockTask, id: '999' }
    mockedAxios.put.mockResolvedValueOnce({ data: ghost })
    await store.dispatch(updateTask({ id: '999', data: { title: 'X' } }))
    // original task untouched
    expect(store.getState().tasks.tasks[0]).toEqual(mockTask)
  })

  it('sets error on rejected', async () => {
    const store = makeStore([mockTask])
    mockedAxios.put.mockRejectedValueOnce(new Error('fail'))
    await store.dispatch(updateTask({ id: '1', data: { title: 'X' } }))
    expect(store.getState().tasks.error).toBe('Failed to update task')
  })
})

describe('deleteTask', () => {
  it('removes task on fulfilled', async () => {
    const store = makeStore([mockTask])
    mockedAxios.delete.mockResolvedValueOnce({})
    await store.dispatch(deleteTask('1'))
    expect(store.getState().tasks.tasks).toEqual([])
  })

  it('sets error on rejected', async () => {
    const store = makeStore([mockTask])
    mockedAxios.delete.mockRejectedValueOnce(new Error('fail'))
    await store.dispatch(deleteTask('1'))
    expect(store.getState().tasks.error).toBe('Failed to delete task')
  })
})
