import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { Task, TasksState } from '../types'

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Task[]>('/api/tasks')
      return response.data
    } catch {
      return rejectWithValue('Failed to fetch tasks')
    }
  },
)

export const createTask = createAsyncThunk<
  Task,
  Omit<Task, 'id' | 'createdAt'>,
  { rejectValue: string }
>('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post<Task>('/api/tasks', taskData)
    return response.data
  } catch {
    return rejectWithValue('Failed to create task')
  }
})

export const updateTask = createAsyncThunk<
  Task,
  { id: string; data: Partial<Omit<Task, 'id' | 'createdAt'>> },
  { rejectValue: string }
>('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put<Task>(`/api/tasks/${id}`, data)
    return response.data
  } catch {
    return rejectWithValue('Failed to update task')
  }
})

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/tasks/${id}`)
      return id
    } catch {
      return rejectWithValue('Failed to delete task')
    }
  },
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) state.tasks[index] = action.payload
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export default tasksSlice.reducer
