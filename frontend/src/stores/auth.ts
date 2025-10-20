import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  // Estado
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  
  // Getters (como funciones)
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  userPermissions: () => string[]
  
  // Acciones
  setToken: (token: string) => void
  removeToken: () => void
  setUser: (user: User) => void
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  hasPermission: (permission: string) => boolean
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      // Getters
      isAuthenticated: () => {
        const { token, user } = get()
        return !!token && !!user
      },
      
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
      
      userPermissions: () => {
        const { user } = get()
        return user?.permissions || []
      },
      
      // Acciones
      setToken: (token: string) => {
        set({ token })
        localStorage.setItem('token', token)
      },
      
      removeToken: () => {
        set({ token: null })
        localStorage.removeItem('token')
      },
      
      setUser: (user: User) => {
        set({ user })
      },
      
      login: async (credentials: { login: string; password: string }) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/login', {
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
          
          // Guardar token y usuario
          localStorage.setItem('token', data.token)
          set({ 
            token: data.token, 
            user: data.user, 
            isLoading: false, 
            error: null 
          })
          
          return { success: true }
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Error al iniciar sesión'
          set({ isLoading: false, error })
          return { success: false, error }
        }
      },

      register: async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })
          
          if (!response.ok) {
            throw new Error('Error al registrar usuario')
          }
          
          const data = await response.json()
          
          // Guardar token y usuario
          localStorage.setItem('token', data.token)
          set({ 
            token: data.token, 
            user: data.user, 
            isLoading: false, 
            error: null 
          })
          
          return { success: true }
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Error al registrar usuario'
          set({ isLoading: false, error })
          return { success: false, error }
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        
        try {
          const { token } = get()
          if (token) {
            // Llamar a la API para cerrar sesión
            await fetch('/api/logout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            })
          }
        } catch (err) {
          console.error('Error al cerrar sesión:', err)
        } finally {
          // Limpiar estado independientemente del resultado de la API
          localStorage.removeItem('token')
          set({ 
            user: null, 
            token: null, 
            isLoading: false 
          })
        }
      },
      
      fetchUser: async () => {
        const { token } = get()
        if (!token) return
        
        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          
          if (!response.ok) {
            throw new Error('Usuario no autenticado')
          }
          
          const data = await response.json()
          set({ user: data.user, isLoading: false })
        } catch (err) {
          console.error('Error al obtener usuario:', err)
          // Si hay error, limpiar el token
          localStorage.removeItem('token')
          set({ token: null, isLoading: false })
        }
      },
      
      hasPermission: (permission: string) => {
        const { user } = get()
        return user?.permissions?.includes(permission) || false
      },
      
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
)