import React, { useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import { useToast } from '../components/Toast.jsx'
import { Star } from 'lucide-react'

function OwnerDashboard() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('name') // 'name' or 'email'
  const [sortOrder, setSortOrder] = useState('asc')
  const { show } = useToast()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get('/api/owner/dashboard')
      setStores(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Owner dashboard error:', err)
      setError(err?.response?.data?.error || 'Failed to load dashboard')
      show(err?.response?.data?.error || 'Failed to load dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortRaters = (raters) => {
    if (!raters || raters.length === 0) return raters
    return [...raters].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      if (sortBy === 'email') {
        return sortOrder === 'asc'
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email)
      }
      return 0
    })
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Owner Dashboard</h1>
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading dashboard...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Owner Dashboard</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      </section>
    )
  }

  if (!stores.length) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Owner Dashboard</h1>
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-600">You don't own any stores yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Owner Dashboard</h1>
        <p className="text-sm text-slate-600">View ratings and feedback for your stores</p>
      </div>

      {stores.map((store) => (
        <div key={store.id} className="rounded-lg border bg-white shadow-sm">
          {/* Store Header with Average Rating */}
          <div className="border-b bg-slate-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{store.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{store.address}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {store.averageRating ? store.averageRating.toFixed(1) : '—'}
                      <span className="ml-1 text-base font-normal text-slate-500">/ 5</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {store.ratingCount || 0} {store.ratingCount === 1 ? 'rating' : 'ratings'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raters Table */}
          <div className="px-6 py-4">
            {!store.raters || store.raters.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No ratings yet. Users haven't rated this store.
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    Users Who Rated ({store.raters.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="px-4 py-2 text-left font-semibold text-slate-700">
                          <button
                            onClick={() => handleSort('name')}
                            className="flex items-center gap-1 hover:text-indigo-600"
                          >
                            User Name
                            {sortBy === 'name' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-700">
                          <button
                            onClick={() => handleSort('email')}
                            className="flex items-center gap-1 hover:text-indigo-600"
                          >
                            Email
                            {sortBy === 'email' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-slate-700">
                          Rating
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-700">
                          Comment
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortRaters(store.raters).map((rater) => (
                          <tr key={rater.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900">{rater.name}</td>
                            <td className="px-4 py-3 text-slate-600">{rater.email}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="font-semibold text-indigo-600">{rater.rating}</span>
                                <span className="text-slate-400">/</span>
                                <span className="text-slate-400">5</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {rater.comment || (
                                <span className="text-slate-400 italic">No comment</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {rater.createdAt
                                ? new Date(rater.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : '—'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

export default OwnerDashboard
