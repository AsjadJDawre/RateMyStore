import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'
import { useToast } from '../../components/Toast.jsx'
import { Star, ArrowLeft } from 'lucide-react'

function AdminUserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserDetails()
  }, [id])

  const fetchUserDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get(`/api/admin/users/${id}`)
      setUser(data)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Failed to load user details')
      show(err?.response?.data?.error || 'Failed to load user details', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (role) => {
    if (role === 'ADMIN') return 'bg-purple-100 text-purple-700'
    if (role === 'OWNER') return 'bg-blue-100 text-blue-700'
    return 'bg-slate-100 text-slate-700'
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading user details...
        </div>
      </section>
    )
  }

  if (error || !user) {
    return (
      <section className="space-y-4">
        <button
          onClick={() => navigate('/app/admin/users')}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error || 'User not found'}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <button
        onClick={() => navigate('/app/admin/users')}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Users
      </button>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={user.role === 'ADMIN' ? '/adminCharacter.png' : user.role === 'OWNER' ? '/SmallBusinessStoreOwner_standing.png' : '/YoungPersonStanding.png'} 
              alt={user.role}
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-2xl font-semibold text-slate-900">User Details</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
            {user.role}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase text-slate-500">Name</label>
            <p className="mt-1 text-lg font-medium text-slate-900">{user.name}</p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-500">Email</label>
            <p className="mt-1 text-lg text-slate-700">{user.email}</p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-500">Address</label>
            <p className="mt-1 text-slate-700">{user.address}</p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-500">Role</label>
            <p className="mt-1 text-slate-700">{user.role}</p>
          </div>

          {user.role === 'OWNER' && user.ownerRating !== null && user.ownerRating !== undefined && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <label className="text-xs font-medium uppercase text-indigo-700">Store Average Rating</label>
              <div className="mt-2 flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-indigo-900">
                  {Number(user.ownerRating).toFixed(1)}
                  <span className="ml-1 text-base font-normal text-indigo-600">/ 5</span>
                </span>
              </div>
              <p className="mt-1 text-xs text-indigo-600">
                Average rating across all stores owned by this user
              </p>
            </div>
          )}

          {user.role === 'OWNER' && (user.ownerRating === null || user.ownerRating === undefined) && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">This owner's stores have no ratings yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdminUserDetails




