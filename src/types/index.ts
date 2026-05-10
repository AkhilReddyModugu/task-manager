export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
