import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/apiClient'

const AuthContext = createContext(null)
const STORAGE_KEY = 'ratemystore.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const role = user?.role

  // Restore session on mount by calling /api/auth/me
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await apiClient.post('/api/auth/me')
        if (data && data.id) {
          setUser(data)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (err) {
        // Not authenticated or session expired
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = async (payload) => {
    // Backend sets cookie, then fetch user details from /api/auth/me
    await apiClient.post('/api/auth/login', payload)
    // Fetch full user details after login
    const { data } = await apiClient.get('/api/auth/me')
    if (data && data.id) {
      setUser(data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return data
    }
    throw new Error('Failed to get user details after login')
  }

  const signup = async (payload) => {
    await apiClient.post('/api/auth/signup', payload)

    // after signup fetch user details and redirect to stores page
    const { data } = await apiClient.get('/api/auth/me')

    if (data && data.id) {
      setUser(data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return data
    }
    throw new Error('Failed to get user details after signup')
  
  }

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout')
    } finally {
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
      navigate('/login', { replace: true })
    }
  }

  const changePassword = async (payload) => {
    await apiClient.post('/api/auth/change-password', payload)
    await logout()
  }

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      login,
      signup,
      logout,
      changePassword,
      setUser,
    }),
    [user, role, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

