import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '../../components/Toast.jsx'
import { Plus } from 'lucide-react'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const nameTimeoutRef = useRef(null)
  const emailTimeoutRef = useRef(null)
  const addressTimeoutRef = useRef(null)

  const [nameInput, setNameInput] = useState(searchParams.get('name') || '')
  const [emailInput, setEmailInput] = useState(searchParams.get('email') || '')
  const [addressInput, setAddressInput] = useState(searchParams.get('address') || '')
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc')

  useEffect(() => {
    fetchUsers()
  }, [searchParams])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = Object.fromEntries(searchParams.entries())
      const { data } = await apiClient.get('/api/admin/users', { params })
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Failed to load users')
      show(err?.response?.data?.error || 'Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (field, value, setter) => {
    setter(value)
    const timeoutRef = field === 'name' ? nameTimeoutRef : field === 'email' ? emailTimeoutRef : addressTimeoutRef
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

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

  const handleRoleFilter = (value) => {
    setRoleFilter(value)
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set('role', value)
    } else {
      next.delete('role')
    }
    setSearchParams(next)
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
    setRoleFilter(searchParams.get('role') || '')
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (nameTimeoutRef.current) clearTimeout(nameTimeoutRef.current)
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current)
      if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current)
    }
  }, [])

  const sortedUsers = [...users].sort((a, b) => {
    const field = sortBy
    const order = sortOrder === 'asc' ? 1 : -1
    if (field === 'name') {
      return order * a.name.localeCompare(b.name)
    }
    if (field === 'email') {
      return order * a.email.localeCompare(b.email)
    }
    return 0
  })

  const getRoleBadgeColor = (role) => {
    if (role === 'ADMIN') return 'bg-purple-100 text-purple-700'
    if (role === 'OWNER') return 'bg-blue-100 text-blue-700'
    return 'bg-slate-100 text-slate-700'
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/TotalUser-icon.png" 
            alt="Users" 
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">All Users</h1>
            <p className="text-sm text-slate-600">Manage and view all users</p>
          </div>
        </div>
        <Link
          to="/app/admin/users/create"
          className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <Plus size={16} />
          Create User
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Search by Name</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              placeholder="Name..."
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
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Filter by Role</label>
            <select
              className="w-full rounded border px-3 py-2 text-sm shadow-sm outline-none ring-indigo-200 focus:ring"
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Store Owner</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading users...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !users.length && !error && (
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          No users found. Try adjusting your filters.
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-indigo-600"
                  >
                    Name
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
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="cursor-pointer border-b hover:bg-slate-50"
                  onClick={() => navigate(`/app/admin/users/${user.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{user.address}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
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

export default AdminUsers




