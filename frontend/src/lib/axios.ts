import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
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
    const originalRequest = error.config

    // Si no es 401, rechazar directamente
    if (status !== 401) return Promise.reject(error)

    // Si es la petición de login, logout o refresh-token que falló, no intentar refrescar
    if (
      originalRequest.url?.includes('/login') ||
      originalRequest.url?.includes('/logout') ||
      originalRequest.url?.includes('/refresh-token')
    ) {
      // Para login, simplemente rechazar el error para que se muestre el mensaje
      // Para logout/refresh, limpiar sesión y redirigir
      if (originalRequest.url?.includes('/logout') || originalRequest.url?.includes('/refresh-token')) {
        localStorage.removeItem('token')
        window.location.href = '/auth/login'
      }
      return Promise.reject(error)
    }

    // Si ya se está refrescando, agregar a cola
    if (isRefreshing) {
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

    // Intentar refrescar el token
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

      // Si no hay token nuevo, cerrar sesión
      pendingRequests.forEach((cb) => cb(null))
      pendingRequests = []
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
      return Promise.reject(error)
    } catch (refreshError) {
      // Falló el refresh; cerrar sesión
      pendingRequests.forEach((cb) => cb(null))
      pendingRequests = []
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api