import { Card, Tag, Button } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Task } from '../types'

const STATUS_COLOR: Record<Task['status'], string> = {
  todo: 'default',
  'in-progress': 'processing',
  done: 'success',
}

const STATUS_LABEL: Record<Task['status'], string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
}

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  return (
    <Card
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>,
        <Button
          key="delete"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>,
      ]}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white text-base m-0 leading-snug flex-1 min-w-0 break-words">
          {task.title}
        </h3>
        <Tag color={STATUS_COLOR[task.status]} className="shrink-0">
          {STATUS_LABEL[task.status]}
        </Tag>
      </div>
      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      <p className="text-xs text-gray-400 m-0">
        {new Date(task.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </Card>
  )
}
