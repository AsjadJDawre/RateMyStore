import axios from 'axios'


  // console.log(import.meta.env.VITE_API_BASE_URL)

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  // baseURL: 'http://localhost:4000',
  withCredentials: true,
})

// Request interceptor to add Authorization header as fallback if cookie fails
apiClient.interceptors.request.use(
  (config) => {
    // If there's a fallback token and no Authorization header, add it
    const fallbackToken = sessionStorage.getItem('auth_token_fallback')
    if (fallbackToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${fallbackToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear auth when unauthorized; actual redirect handled in components
      console.warn('Unauthorized, please log in again.')
      // Clear fallback token on 401
      sessionStorage.removeItem('auth_token_fallback')
    }
    if (error?.response?.status === 403) {
      console.warn('Forbidden: insufficient permissions.')
    }
    return Promise.reject(error)
  },
)

