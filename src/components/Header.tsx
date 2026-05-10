import { Button } from 'antd'
import { LogoutOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import type { AppDispatch } from '../store/store'

interface Props {
  darkMode: boolean
  onToggleDark: () => void
}

export function Header({ darkMode, onToggleDark }: Props) {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white m-0">Task Manager</h1>
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={darkMode ? <BulbFilled className="text-yellow-400" /> : <BulbOutlined />}
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="text-gray-600 dark:text-gray-300"
        />
        <Button
          icon={<LogoutOutlined />}
          onClick={() => dispatch(logout())}
          type="default"
        >
          Logout
        </Button>
      </div>
    </header>
  )
}
