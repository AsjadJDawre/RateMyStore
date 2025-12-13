import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth  } from '../context/AuthContext.jsx'

function ProtectedRoute({ allowedRoles, children }) {
  const { user, role, loading } = useAuth ()
  const location = useLocation()
  const normalizedRole = (role || '').toUpperCase()
  const normalizedAllowed = allowedRoles?.map((r) => (r || '').toUpperCase())

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading session...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (normalizedAllowed && !normalizedAllowed.includes(normalizedRole)) {
    return (
      <div className="p-6 text-sm text-red-600">
        Access denied for role <span className="font-semibold">{normalizedRole || 'UNKNOWN'}</span>.
      </div>
    )
  }

  return children
}

export default ProtectedRoute





