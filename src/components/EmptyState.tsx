import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface Props {
  onAdd: () => void
}

export function EmptyState({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-7xl mb-4 select-none">📋</div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No tasks yet</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first task to get started</p>
      <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onAdd}>
        Add Task
      </Button>
    </div>
  )
}
