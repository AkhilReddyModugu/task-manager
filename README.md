# Task Manager

A frontend-only task management application built with React, TypeScript, and a mocked API layer via Mock Service Worker (MSW).

## Live Demo

Deploy to Vercel or Netlify by connecting the repository. No backend required — all API responses are handled by MSW in the browser.

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy the MSW service worker to /public (already done, but run if missing)
npx msw init public/

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with:
- **Username:** `test`
- **Password:** `test123`

---

## How the Mocking Works

This app uses [Mock Service Worker (MSW)](https://mswjs.io/) to intercept HTTP requests at the network level — no real server needed.

### Service Worker setup

`src/mocks/browser.ts` sets up the MSW browser worker. In `src/main.tsx`, the worker is started and **awaited** before the React app renders, ensuring every API call is intercepted from the first render:

```ts
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}
enableMocking().then(() => ReactDOM.render(...))
```

### Mocked endpoints

All handlers live in `src/mocks/handlers.ts`:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/login` | Validates credentials (`test` / `test123`) and returns a fake JWT |
| `GET` | `/api/tasks` | Returns the task list from `localStorage` |
| `POST` | `/api/tasks` | Creates a task, persists to `localStorage` |
| `PUT` | `/api/tasks/:id` | Updates a task in `localStorage` |
| `DELETE` | `/api/tasks/:id` | Removes a task from `localStorage` |

### State persistence

Tasks are stored in `localStorage` under the key `tasks`. The auth token and user info are stored under `auth_token` and `auth_user`. Both survive page reloads.

---

## Project Structure

```
src/
├── App.tsx                  # Root: Provider, ConfigProvider, Router, dark mode state
├── main.tsx                 # Entry: starts MSW, then renders React
├── index.css                # Tailwind directives + antd reset
│
├── types/
│   └── index.ts             # Shared TypeScript interfaces
│
├── store/
│   ├── store.ts             # Redux store configuration
│   ├── authSlice.ts         # Auth state: login thunk, logout action
│   └── taskSlice.ts         # Tasks state: CRUD async thunks
│
├── mocks/
│   ├── browser.ts           # MSW worker setup
│   └── handlers.ts          # MSW request handlers
│
├── components/
│   ├── ProtectedRoute.tsx   # Redirects unauthenticated users to /login
│   ├── Header.tsx           # App header with logout + dark mode toggle
│   ├── EmptyState.tsx       # Shown when task list is empty
│   ├── TaskFilters.tsx      # Radio group to filter tasks by status
│   ├── TaskCard.tsx         # Displays a single task with edit/delete actions
│   └── TaskForm.tsx         # Formik + Yup modal form for create/edit
│
├── pages/
│   ├── LoginPage.tsx        # Login form with Formik validation
│   └── DashboardPage.tsx    # Task list, filters, create/edit/delete
│
└── __tests__/
    ├── testUtils.tsx         # Shared render helper with Redux + Router providers
    ├── App.test.tsx
    ├── store/
    │   ├── authSlice.test.ts
    │   └── taskSlice.test.ts
    ├── components/
    │   ├── Header.test.tsx
    │   ├── EmptyState.test.tsx
    │   ├── TaskFilters.test.tsx
    │   ├── TaskCard.test.tsx
    │   ├── TaskForm.test.tsx
    │   └── ProtectedRoute.test.tsx
    └── pages/
        ├── LoginPage.test.tsx
        └── DashboardPage.test.tsx
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint check |
| `npm test` | Run Jest tests |
| `npm run test:coverage` | Run tests with coverage report |

---

## Libraries Used

| Category | Library |
|----------|---------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| State | Redux Toolkit + React-Redux |
| Routing | React Router DOM v7 |
| Mock API | Mock Service Worker (MSW) v2 |
| HTTP | Axios |
| Forms | Formik + Yup |
| UI | Ant Design v6 + Tailwind CSS v3 |
| Testing | Jest 29 + React Testing Library + ts-jest |

---

## Features

- **Authentication** — Login with mocked JWT, logout, and route protection
- **Task CRUD** — Create, read, update, and delete tasks with title, description, and status
- **Filtering** — Filter tasks by status (All / To Do / In Progress / Done)
- **Dark Mode** — Toggle via header button; preference persisted to `localStorage`
- **Empty State** — Friendly prompt when no tasks exist
- **Error Handling** — Error alerts for failed API calls
- **Responsive** — Mobile-friendly grid layout

---

## Testing

Tests are written with Jest and React Testing Library targeting **100% code coverage**:

```
All files | 100% Stmts | 100% Branch | 100% Funcs | 100% Lines
```

Run coverage:

```bash
npm run test:coverage
```
