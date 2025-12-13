import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { useToast } from '../../components/Toast.jsx'

const passwordSchema = z
  .string()
  .min(8, 'Min 8 characters')
  .max(16, 'Max 16 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'At least one special character')

const createUserSchema = z.object({
  name: z.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters'),
  email: z.string().email('Invalid email'),
  address: z.string().min(1, 'Address required').max(400, 'Max 400 characters'),
  password: passwordSchema,
  role: z.enum(['USER', 'ADMIN', 'OWNER'], { required_error: 'Please select a role' }),
})

function CreateUser() {
  const navigate = useNavigate()
  const { show } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', address: '', password: '', role: 'USER' },
  })

  const onSubmit = async (values) => {
    try {
      await apiClient.post('/api/admin/users', values)
      show('User created successfully!', 'success')
      navigate('/app/admin/users', { replace: true })
    } catch (err) {
      console.error(err)
      show(err?.response?.data?.error || 'Failed to create user', 'error')
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <img 
          src="/TotalUser-icon.png" 
          alt="Create User" 
          className="h-10 w-10 object-contain"
        />
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create User</h1>
          <p className="text-sm text-slate-600">Add a new user to the platform</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Full name (20-60 chars)"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="address">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="User address (max 400 chars)"
              rows={3}
              {...register('address')}
            />
            {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="8-16 chars, include uppercase & special"
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="role">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              {...register('role')}
            >
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Store Owner</option>
            </select>
            {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/admin/users')}
              className="rounded border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateUser




