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
        const { data } = await apiClient.get('/api/auth/me')
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
    const loginResponse = await apiClient.post('/api/auth/login', payload)
    console.log('Login response:', loginResponse)
    
    // Store token as fallback if cookies are blocked by browser
    const token = loginResponse.data?.token
    if (token) {
      // Store token in memory (not localStorage for security) as fallback
      // We'll use this if cookie-based auth fails
      sessionStorage.setItem('auth_token_fallback', token)
    }
    
    // Small delay to ensure cookie is set (browser may need a moment)
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Fetch full user details after login
    try {
      // Try with cookie first
      let response
      try {
        response = await apiClient.get('/api/auth/me')
      } catch (cookieErr) {
        // If cookie-based auth fails, try with Authorization header
        if (token && cookieErr?.response?.status === 401) {
          console.warn('Cookie auth failed, trying Authorization header fallback')
          response = await apiClient.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        } else {
          throw cookieErr
        }
      }
      
      const { data } = response
      if (data && data.id) {
        setUser(data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return data
      }
      throw new Error('Failed to get user details after login')
    } catch (err) {
      console.error('Error fetching user after login:', err)
      // Clean up fallback token on error
      sessionStorage.removeItem('auth_token_fallback')
      throw err
    }
  }

  const signup = async (payload) => {
    const signupResponse = await apiClient.post('/api/auth/signup', payload)
    
    // Store token as fallback if cookies are blocked by browser
    const token = signupResponse.data?.token
    if (token) {
      sessionStorage.setItem('auth_token_fallback', token)
    }
    
    // Small delay to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 100))

    // after signup fetch user details and redirect to stores page
    try {
      // Try with cookie first
      let response
      try {
        response = await apiClient.get('/api/auth/me')
      } catch (cookieErr) {
        // If cookie-based auth fails, try with Authorization header
        if (token && cookieErr?.response?.status === 401) {
          console.warn('Cookie auth failed, trying Authorization header fallback')
          response = await apiClient.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        } else {
          throw cookieErr
        }
      }
      
      const { data } = response
      if (data && data.id) {
        setUser(data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return data
      }
      throw new Error('Failed to get user details after signup')
    } catch (err) {
      console.error('Error fetching user after signup:', err)
      sessionStorage.removeItem('auth_token_fallback')
      throw err
    }
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

