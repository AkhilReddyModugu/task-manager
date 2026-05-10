import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Spin, Alert } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/taskSlice'
import type { AppDispatch, RootState } from '../store/store'
import type { Task } from '../types'
import { Header } from '../components/Header'
import { TaskCard } from '../components/TaskCard'
import { TaskForm } from '../components/TaskForm'
import { TaskFilters } from '../components/TaskFilters'
import type { FilterStatus } from '../components/TaskFilters'
import { EmptyState } from '../components/EmptyState'

interface Props {
  darkMode: boolean
  onToggleDark: () => void
}

export function DashboardPage({ darkMode, onToggleDark }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks)

  const [filter, setFilter] = useState<FilterStatus>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const filtered =
    filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  const openCreate = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id))
  }

  const handleFormSubmit = async (values: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask.id, data: values }))
    } else {
      await dispatch(createTask(values))
    }
    setFormOpen(false)
    setEditingTask(null)
  }

  const handleFormCancel = () => {
    setFormOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header darkMode={darkMode} onToggleDark={onToggleDark} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white m-0">My Tasks</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Task
          </Button>
        </div>

        <div className="mb-6 overflow-x-auto">
          <TaskFilters value={filter} onChange={setFilter} />
        </div>

        {error && (
          <Alert type="error" title={error} className="mb-4" showIcon />
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <TaskForm
        open={formOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  )
}
