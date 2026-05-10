import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { AuthState, LoginCredentials, LoginResponse } from '../types'

const storedToken = localStorage.getItem('auth_token')
const storedUser = localStorage.getItem('auth_user')

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  loading: false,
  error: null,
}

export const login = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>('/api/login', credentials)
      return response.data
    } catch {
      return rejectWithValue('Invalid username or password')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('auth_token', action.payload.token)
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
