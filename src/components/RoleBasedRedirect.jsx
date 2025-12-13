import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function RoleBasedRedirect() {
  const { role, loading } = useAuth()
  const normalizedRole = (role || '').toUpperCase()

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading...</div>
  }

  if (normalizedRole === 'ADMIN') {
    return <Navigate to="/app/admin/dashboard" replace />
  }

  if (normalizedRole === 'OWNER') {
    return <Navigate to="/app/owner/dashboard" replace />
  }

  // Default to stores for USER
  return <Navigate to="/app/stores" replace />
}

export default RoleBasedRedirect



