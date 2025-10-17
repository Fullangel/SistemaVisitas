import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters computados
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userPermissions = computed(() => user.value?.permissions || [])
  
  // Métodos
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const removeToken = () => {
    token.value = null
    localStorage.removeItem('token')
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true
    error.value = null

    try {
      // Aquí iría la llamada a la API
      // Por ahora simulamos una respuesta exitosa
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()
      
      setToken(data.token)
      setUser(data.user)
      
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al iniciar sesión'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      // Llamar a la API para cerrar sesión
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      // Limpiar estado independientemente del resultado de la API
      user.value = null
      removeToken()
      isLoading.value = false
    }
  }

  const fetchUser = async () => {
    if (!token.value) return

    isLoading.value = true
    
    try {
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Usuario no autenticado')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      console.error('Error al obtener usuario:', err)
      // Si hay error, limpiar el token
      removeToken()
    } finally {
      isLoading.value = false
    }
  }

  const hasPermission = (permission: string) => {
    return userPermissions.value.includes(permission)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    userPermissions,
    
    // Métodos
    setToken,
    removeToken,
    setUser,
    login,
    logout,
    fetchUser,
    hasPermission,
    clearError,
  }
})