import React, { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import { useToast } from '../components/Toast.jsx'
import { Users, Store, Star } from 'lucide-react'

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { show } = useToast()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get('/api/admin/dashboard')
      setStats(data || { users: 0, stores: 0, ratings: 0 })
    } catch (err) {
      console.error('Admin dashboard error:', err)
      setError(err?.response?.data?.error || 'Failed to load dashboard')
      show(err?.response?.data?.error || 'Failed to load dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Stores',
      value: stats.stores,
      icon: Store,
      color: 'bg-green-500',
    },
    {
      label: 'Total Ratings',
      value: stats.ratings,
      icon: Star,
      color: 'bg-yellow-500',
    },
  ]

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Overview of platform statistics</p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200"></div>
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{card.value.toLocaleString()}</p>
                  </div>
                  <div className={`rounded-full ${card.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default AdminDashboard
