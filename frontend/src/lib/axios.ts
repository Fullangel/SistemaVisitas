import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Interceptor de petición para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuesta para manejar errores
let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    if (status !== 401) return Promise.reject(error)

    const originalRequest = error.config

    if (isRefreshing) {
      // Cola de peticiones mientras se refresca
      return new Promise((resolve) => {
        pendingRequests.push((token) => {
          if (token) {
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${token}`,
            }
          }
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true
    try {
      const refreshResponse = await api.post('/refresh-token')
      const newToken = refreshResponse.data?.access_token

      if (newToken) {
        localStorage.setItem('token', newToken)
        // Reintentar las pendientes
        pendingRequests.forEach((cb) => cb(newToken))
        pendingRequests = []

        // Reintentar la original
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newToken}`,
        }
        return api(originalRequest)
      }

      // Si no hay token nuevo, proceder a logout
      pendingRequests.forEach((cb) => cb(null))
      pendingRequests = []
      useAuthStore.getState().logout().catch(() => {})
      window.location.href = '/auth/login'
      return Promise.reject(error)
    } catch (refreshError) {
      // Falló el refresh; cerrar sesión
      pendingRequests.forEach((cb) => cb(null))
      pendingRequests = []
      useAuthStore.getState().logout().catch(() => {})
      window.location.href = '/auth/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api