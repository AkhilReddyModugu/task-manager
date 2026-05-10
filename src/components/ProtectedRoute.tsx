import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

interface Props {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
