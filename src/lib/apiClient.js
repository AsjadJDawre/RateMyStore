import axios from 'axios'


  // console.log(import.meta.env.VITE_API_BASE_URL)

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  // baseURL: 'http://localhost:4000',
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear auth when unauthorized; actual redirect handled in components
      console.warn('Unauthorized, please log in again.')
    }
    if (error?.response?.status === 403) {
      console.warn('Forbidden: insufficient permissions.')
    }
    return Promise.reject(error)
  },
)

