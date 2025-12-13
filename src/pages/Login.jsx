import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { show } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values) => {
    try {
      const data = await login(values)
      // Normalize role to avoid casing issues impacting redirects
      const normalizedRole = (data?.role || '').toUpperCase()
      let dest = '/app/stores'
      if (normalizedRole === 'ADMIN') {
        dest = '/app/admin/dashboard'
      } else if (normalizedRole === 'OWNER') {
        dest = '/app/owner/dashboard'
      }

   
      const fromPath = location.state?.from?.pathname
      const isFromAllowed = (() => {
        if (!fromPath) return false
        // console.log('normalizedRole',normalizedRole)
        // console.log('fromPath',fromPath)
        if (normalizedRole === 'ADMIN') return fromPath.startsWith('/app/admin')
        if (normalizedRole === 'OWNER') return fromPath.startsWith('/app/owner')
        // USER: allow stores or any non-admin/owner app path
        return fromPath.startsWith('/app/stores')
      })()

      const target = isFromAllowed ? fromPath : dest
      show('Welcome back!', 'success')
      navigate(target, { replace: true })
    } catch (err) {
      console.error(err)
      show(err?.response?.data?.error || 'Login failed', 'error')
    }
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center px-4 relative"
      style={{
        backgroundImage: 'url(/LoginBackground-image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0  bg-white/10 backdrop-blur-[2px]" />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-xl border bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-xl">
        {/* Logo and Header */}
        <div className="mb-6 flex flex-col items-center">
          <img
            src="/RateMyStore-logo.png"
            alt="RateMyStore Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover shadow-md mb-4"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <h1 className="mb-1 text-2xl sm:text-3xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-600">Sign in to continue to RateMyStore.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none ring-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none ring-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          No account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

