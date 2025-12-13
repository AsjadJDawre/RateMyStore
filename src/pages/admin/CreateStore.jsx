import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { useToast } from '../../components/Toast.jsx'

const createStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required').max(400, 'Max 400 characters'),
  ownerId: z.string().optional(),
})

function CreateStore() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [owners, setOwners] = useState([])
  const [loadingOwners, setLoadingOwners] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { name: '', email: '', address: '', ownerId: '' },
  })

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    setLoadingOwners(true)
    try {
      const { data } = await apiClient.get('/api/admin/users', {
        params: { role: 'OWNER' },
      })
      setOwners(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch owners:', err)
    } finally {
      setLoadingOwners(false)
    }
  }

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        address: values.address,
        ...(values.email && { email: values.email }),
        ...(values.ownerId && { ownerId: Number(values.ownerId) }),
      }
      await apiClient.post('/api/admin/stores', payload)
      show('Store created successfully!', 'success')
      navigate('/app/admin/stores', { replace: true })
    } catch (err) {
      console.error(err)
      show(err?.response?.data?.error || 'Failed to create store', 'error')
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create Store</h1>
        <p className="text-sm text-slate-600">Add a new store to the platform</p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Store name"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="store@example.com"
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
              placeholder="Store address (max 400 chars)"
              rows={3}
              {...register('address')}
            />
            {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="ownerId">
              Store Owner (Optional)
            </label>
            <select
              id="ownerId"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              {...register('ownerId')}
              disabled={loadingOwners}
            >
              <option value="">No owner assigned</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            {loadingOwners && (
              <p className="text-xs text-slate-500">Loading owners...</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create Store'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/admin/stores')}
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

export default CreateStore



