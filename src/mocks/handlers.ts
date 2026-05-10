import { http, HttpResponse } from 'msw'
import type { Task, LoginCredentials, LoginResponse } from '../types'

const handlers = [
  // POST /api/login
  http.post('/api/login', async ({ request }) => {
    const { username, password } = await request.json() as LoginCredentials

    if (username === 'test' && password === 'test123') {
      const token = `fake-jwt-token-${Date.now()}`
      const user = { id: '1', username: 'test' }
      const response: LoginResponse = { token, user }
      return HttpResponse.json(response)
    } else {
      return new HttpResponse(null, { status: 401, statusText: 'Invalid credentials' })
    }
  }),

  // GET /api/tasks
  http.get('/api/tasks', () => {
    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]')
    return HttpResponse.json(tasks)
  }),

  // POST /api/tasks
  http.post('/api/tasks', async ({ request }) => {
    const newTask = await request.json() as Omit<Task, 'id' | 'createdAt'>
    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]')

    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    return HttpResponse.json(task)
  }),

  // PUT /api/tasks/:id
  http.put('/api/tasks/:id', async ({ request, params }) => {
    const { id } = params
    const updateData = await request.json() as Partial<Task>

    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]')
    const taskIndex = tasks.findIndex((t) => t.id === id)

    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404, statusText: 'Task not found' })
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updateData }
    localStorage.setItem('tasks', JSON.stringify(tasks))

    return HttpResponse.json(tasks[taskIndex])
  }),

  // DELETE /api/tasks/:id
  http.delete('/api/tasks/:id', ({ params }) => {
    const { id } = params

    const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]')
    const filteredTasks = tasks.filter((t) => t.id !== id)

    if (filteredTasks.length === tasks.length) {
      return new HttpResponse(null, { status: 404, statusText: 'Task not found' })
    }

    localStorage.setItem('tasks', JSON.stringify(filteredTasks))

    return new HttpResponse(null, { status: 204 })
  }),
]

export { handlers }