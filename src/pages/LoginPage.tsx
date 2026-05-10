import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, Card, Alert } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { login } from '../store/authSlice'
import type { AppDispatch, RootState } from '../store/store'

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

export function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(login(values))
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Task Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to continue</p>
        </div>

        {error && (
          <Alert type="error" title={error} className="mb-4" showIcon closable />
        )}

        <Form layout="vertical" onFinish={() => formik.handleSubmit()}>
          <Form.Item
            label="Username"
            validateStatus={formik.touched.username && formik.errors.username ? 'error' : ''}
            help={formik.touched.username && formik.errors.username}
          >
            <Input
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="test"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
            help={formik.touched.password && formik.errors.password}
          >
            <Input.Password
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="test123"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            className="mt-2"
          >
            Sign In
          </Button>
        </Form>

        <p className="text-center text-xs text-gray-400 mt-4 mb-0">
          Use <strong>test</strong> / <strong>test123</strong>
        </p>
      </Card>
    </div>
  )
}
