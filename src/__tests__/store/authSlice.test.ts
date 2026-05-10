import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import authReducer, { login, logout, clearError } from '../../store/authSlice'
import type { AuthState } from '../../types'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const defaultState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
}

type StoreState = { auth: AuthState }

function makeStore(override?: Partial<AuthState>) {
  return configureStore({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reducer: { auth: authReducer as any },
    preloadedState: { auth: { ...defaultState, ...override } },
  })
}

function getAuth(store: ReturnType<typeof makeStore>): AuthState {
  return (store.getState() as StoreState).auth
}

beforeEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})

describe('authSlice — initial state', () => {
  it('starts unauthenticated when localStorage is empty', () => {
    const store = makeStore()
    const auth = getAuth(store)
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.token).toBeNull()
  })

  it('restores auth state from localStorage when token exists', () => {
    localStorage.setItem('auth_token', 'stored-token')
    localStorage.setItem('auth_user', JSON.stringify({ id: '1', username: 'test' }))
    jest.resetModules()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const freshModule = require('../../store/authSlice') as { default: typeof authReducer }
    const freshStore = configureStore({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reducer: { auth: freshModule.default as any },
    })
    const auth = (freshStore.getState() as StoreState).auth
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.token).toBe('stored-token')
    expect(auth.user).toEqual({ id: '1', username: 'test' })
  })
})

describe('authSlice — logout', () => {
  it('clears state and removes localStorage keys', () => {
    localStorage.setItem('auth_token', 'tok')
    localStorage.setItem('auth_user', '{}')
    const store = makeStore({
      isAuthenticated: true,
      token: 'tok',
      user: { id: '1', username: 'u' },
    })
    store.dispatch(logout())
    const auth = getAuth(store)
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.token).toBeNull()
    expect(auth.user).toBeNull()
    expect(auth.error).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(localStorage.getItem('auth_user')).toBeNull()
  })
})

describe('authSlice — clearError', () => {
  it('sets error to null', () => {
    const store = makeStore({ error: 'some error' })
    store.dispatch(clearError())
    expect(getAuth(store).error).toBeNull()
  })
})

describe('authSlice — login thunk', () => {
  it('sets loading:true and clears error on pending', () => {
    const store = makeStore({ error: 'prev error' })
    mockedAxios.post.mockReturnValue(new Promise(() => {}))
    store.dispatch(login({ username: 'test', password: 'test123' }))
    const auth = getAuth(store)
    expect(auth.loading).toBe(true)
    expect(auth.error).toBeNull()
  })

  it('authenticates and persists to localStorage on fulfilled', async () => {
    const store = makeStore()
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'fake-jwt', user: { id: '1', username: 'test' } },
    })
    await store.dispatch(login({ username: 'test', password: 'test123' }))
    const auth = getAuth(store)
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.token).toBe('fake-jwt')
    expect(auth.user).toEqual({ id: '1', username: 'test' })
    expect(auth.loading).toBe(false)
    expect(localStorage.getItem('auth_token')).toBe('fake-jwt')
    expect(JSON.parse(localStorage.getItem('auth_user')!)).toEqual({ id: '1', username: 'test' })
  })

  it('sets error and clears loading on rejected', async () => {
    const store = makeStore()
    mockedAxios.post.mockRejectedValueOnce(new Error('network error'))
    await store.dispatch(login({ username: 'bad', password: 'bad' }))
    const auth = getAuth(store)
    expect(auth.loading).toBe(false)
    expect(auth.error).toBe('Invalid username or password')
    expect(auth.isAuthenticated).toBe(false)
  })
})
