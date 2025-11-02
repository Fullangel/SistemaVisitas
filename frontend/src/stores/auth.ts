import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/axios'
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
  login: (login: string, password: string) => Promise<{ success: boolean; error?: string; user?: User; token?: string }>
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => Promise<{ success: boolean; error?: string }>
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
        return user?.role?.name === 'admin'
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
      
      login: async (login: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await api.post('/login', { login, password })
          
          const data = response.data
          
          // Guardar token y usuario - ajustar a la estructura real del backend
          const token = data.token || data.data?.access_token
          let user = data.user || data.data?.user
          
          if (!token) {
            throw new Error('No se recibió token de autenticación')
          }
          
          // Convertir el rol de string a objeto si es necesario
          if (user && typeof user.role === 'string') {
            user = {
              ...user,
              role: {
                id: 1, // ID por defecto
                name: user.role,
                description: '',
                permissions: [],
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          }
          
          localStorage.setItem('token', token)
          set({ 
            token: token, 
            user: user, 
            isLoading: false, 
            error: null 
          })
          
          return { success: true, user: user, token: token }
        } catch (err: any) {
          const error = err.response?.data?.message || err.message || 'Error al iniciar sesión'
          set({ isLoading: false, error })
          return { success: false, error }
        }
      },

      register: async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await api.post('/register', userData)
          
          const data = response.data
          
          // Guardar token y usuario
          localStorage.setItem('token', data.token)
          set({ 
            token: data.token, 
            user: data.user, 
            isLoading: false, 
            error: null 
          })
          
          return { success: true }
        } catch (err: any) {
          const error = err.response?.data?.message || err.message || 'Error al registrar usuario'
          set({ isLoading: false, error })
          return { success: false, error }
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        
        try {
          const { token } = get()
          if (token) {
            // Llamar a la API para cerrar sesión, pero no fallar si hay error
            await api.post('/logout').catch(err => {
              // Silenciosamente manejar el error, no es crítico
              console.warn('Logout API call failed (token might be invalid):', err)
            })
          }
        } catch (err) {
          console.warn('Error during logout process:', err)
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
          const response = await api.get('/user')
          
          const data = response.data
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