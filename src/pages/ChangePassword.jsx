import React from 'react'
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

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

function ChangePassword() {
  const { changePassword } = useAuth()
  const { show } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (values) => {
    try {
      await changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword })
      show('Password updated. Please sign in again.', 'success')
    } catch (err) {
      console.error(err)
      show(err?.response?.data?.error || 'Unable to update password', 'error')
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Change password</h1>
      <form className="max-w-md space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="oldPassword">
            Current password
          </label>
          <input
            id="oldPassword"
            type="password"
            className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
            {...register('oldPassword')}
          />
          {errors.oldPassword && <p className="text-xs text-red-600">{errors.oldPassword.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="newPassword">
            New password
          </label>
          <input
            id="newPassword"
            type="password"
            className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
            placeholder="8-16 chars, uppercase + special"
            {...register('newPassword')}
          />
          {errors.newPassword && <p className="text-xs text-red-600">{errors.newPassword.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
            placeholder="Re-enter new password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {isSubmitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </section>
  )
}

export default ChangePassword

