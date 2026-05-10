import { Modal, Form, Input, Select } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import type { Task } from '../types'

interface Props {
  open: boolean
  task?: Task | null
  onSubmit: (values: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required').min(3, 'Minimum 3 characters'),
  description: Yup.string(),
  status: Yup.mixed<Task['status']>()
    .oneOf(['todo', 'in-progress', 'done'])
    .required('Status is required'),
})

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export function TaskForm({ open, task, onSubmit, onCancel }: Props) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: (task?.status ?? 'todo') as Task['status'],
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values)
      resetForm()
    },
  })

  const handleCancel = () => {
    formik.resetForm()
    onCancel()
  }

  return (
    <Modal
      title={task ? 'Edit Task' : 'Create Task'}
      open={open}
      onOk={() => formik.handleSubmit()}
      onCancel={handleCancel}
      okText={task ? 'Update' : 'Create'}
      destroyOnHidden
    >
      <Form layout="vertical" className="mt-4">
        <Form.Item
          label="Title"
          validateStatus={formik.touched.title && formik.errors.title ? 'error' : ''}
          help={formik.touched.title && formik.errors.title}
        >
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter task title"
          />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter description (optional)"
            rows={3}
          />
        </Form.Item>

        <Form.Item label="Status">
          <Select
            value={formik.values.status}
            onChange={(value) => formik.setFieldValue('status', value)}
            options={STATUS_OPTIONS}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
