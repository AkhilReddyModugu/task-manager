import { Radio } from 'antd'

export type FilterStatus = 'all' | 'todo' | 'in-progress' | 'done'

interface Props {
  value: FilterStatus
  onChange: (value: FilterStatus) => void
}

export function TaskFilters({ value, onChange }: Props) {
  return (
    <Radio.Group
      data-testid="task-filters"
      value={value}
      onChange={(e) => onChange(e.target.value as FilterStatus)}
      buttonStyle="solid"
    >
      <Radio.Button value="all">All</Radio.Button>
      <Radio.Button value="todo">To Do</Radio.Button>
      <Radio.Button value="in-progress">In Progress</Radio.Button>
      <Radio.Button value="done">Done</Radio.Button>
    </Radio.Group>
  )
}
