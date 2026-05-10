import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/authSlice'
import tasksReducer from '../store/taskSlice'
import type { RootState } from '../store/store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTestStore(preloadedState?: Partial<RootState>): any {
  return configureStore({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reducer: { auth: authReducer as any, tasks: tasksReducer as any },
    preloadedState,
  })
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  initialEntries?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: any
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    initialEntries = ['/'],
    store = createTestStore(preloadedState),
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Task description',
  status: 'todo' as const,
  createdAt: '2024-01-15T10:00:00.000Z',
}

export const mockAuthState: RootState['auth'] = {
  isAuthenticated: true,
  user: { id: '1', username: 'test' },
  token: 'fake-token',
  loading: false,
  error: null,
}

export const mockTasksState: RootState['tasks'] = {
  tasks: [mockTask],
  loading: false,
  error: null,
}
