import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '../../components/Toast.jsx'
import { Plus, Star } from 'lucide-react'

function AdminStores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc')
  const { show } = useToast()
  const nameTimeoutRef = useRef(null)
  const emailTimeoutRef = useRef(null)
  const addressTimeoutRef = useRef(null)

  const [nameInput, setNameInput] = useState(searchParams.get('name') || '')
  const [emailInput, setEmailInput] = useState(searchParams.get('email') || '')
  const [addressInput, setAddressInput] = useState(searchParams.get('address') || '')

  useEffect(() => {
    fetchStores()
  }, [searchParams])

  const fetchStores = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = Object.fromEntries(searchParams.entries())
      const { data } = await apiClient.get('/api/admin/stores', { params })
      setStores(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Failed to load stores')
      show(err?.response?.data?.error || 'Failed to load stores', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (field, value, setter) => {
    setter(value)
    if (field === 'name' && nameTimeoutRef.current) clearTimeout(nameTimeoutRef.current)
    if (field === 'email' && emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current)
    if (field === 'address' && addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current)

    const timeoutRef = field === 'name' ? nameTimeoutRef : field === 'email' ? emailTimeoutRef : addressTimeoutRef
    timeoutRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      const trimmed = value.trim()
      if (trimmed) {
        next.set(field, trimmed)
      } else {
        next.delete(field)
      }
      setSearchParams(next)
    }, 500)
  }

  const handleSort = (field) => {
    const next = new URLSearchParams(searchParams)
    if (sortBy === field) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
      setSortOrder(newOrder)
      next.set('sortOrder', newOrder)
    } else {
      setSortBy(field)
      setSortOrder('asc')
      next.set('sortBy', field)
      next.set('sortOrder', 'asc')
    }
    setSearchParams(next)
  }

  useEffect(() => {
    setNameInput(searchParams.get('name') || '')
    setEmailInput(searchParams.get('email') || '')
    setAddressInput(searchParams.get('address') || '')
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (nameTimeoutRef.current) clearTimeout(nameTimeoutRef.current)
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current)
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current)
    }
  }, [])

  const sortedStores = [...stores].sort((a, b) => {
    const field = sortBy
    const order = sortOrder === 'asc' ? 1 : -1
    if (field === 'name') {
      return order * a.name.localeCompare(b.name)
    }
    if (field === 'email') {
      const aEmail = a.email || ''
      const bEmail = b.email || ''
      return order * aEmail.localeCompare(bEmail)
    }
    return 0
  })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/SearchStore-icon.png" 
            alt="Stores" 
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">All Stores</h1>
            <p className="text-sm text-slate-600">Manage and view all stores</p>
          </div>
        </div>
        <Link
          to="/app/admin/stores/create"
          className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <Plus size={16} />
          Create Store
        </Link>
      </div>

      {/* Search and Sort */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Search by Name</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Store name..."
              value={nameInput}
              onChange={(e) => handleSearch('name', e.target.value, setNameInput)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Search by Email</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Email..."
              value={emailInput}
              onChange={(e) => handleSearch('email', e.target.value, setEmailInput)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Search by Address</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Address..."
              value={addressInput}
              onChange={(e) => handleSearch('address', e.target.value, setAddressInput)}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading stores...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !stores.length && !error && (
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          No stores found. Try adjusting your search filters.
        </div>
      )}

      {!loading && stores.length > 0 && (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-indigo-600"
                  >
                    Store Name
                    {sortBy === 'name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 hover:text-indigo-600"
                  >
                    Email
                    {sortBy === 'email' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Address</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Overall Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.map((store) => (
                <tr key={store.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{store.name}</td>
                  <td className="px-4 py-3 text-slate-600">{store.email || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{store.address}</td>
                  <td className="px-4 py-3 text-center">
                    {store.rating ? (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{store.rating.toFixed(1)}</span>
                        <span className="text-slate-400">({store.ratingCount || 0})</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">No ratings</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminStores




