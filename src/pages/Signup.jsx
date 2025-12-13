import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

const passwordSchema = z
  .string()
  .min(8, 'Min 8 characters')
  .max(16, 'Max 16 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'At least one special character')

const signupSchema = z.object({
  name: z.string().min(20, 'Min 20 characters').max(60, 'Max 60 characters'),
  email: z.string().email('Invalid email'),
  address: z.string().min(1, 'Address required').max(400, 'Max 400 characters'),
  password: passwordSchema,
})

function Signup() {
  const navigate = useNavigate()
  const { signup, login } = useAuth()
  const { show } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', address: '', password: '' },
  })

  const onSubmit = async (values) => {
    try {
      const userData = await signup(values)
      show('Account created successfully!', 'success')
      // Redirect based on role (signup always creates USER, but handle all cases)
      const dest = userData?.role === 'ADMIN' 
        ? '/app/admin/dashboard'
        : userData?.role === 'OWNER'
          ? '/app/owner/dashboard'
          : '/app/stores'
      navigate(dest, { replace: true })
    } catch (err) {
      console.error(err)
      show(err?.response?.data?.error || 'Signup failed', 'error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Create an account</h1>
        <p className="mb-6 text-sm text-slate-600">Sign up as a normal user.</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Name
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
              Email
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
              Address
            </label>
            <textarea
              id="address"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Your address (max 400 chars)"
              {...register('address')}
            />
            {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Password
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
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup

