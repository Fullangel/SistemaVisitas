import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

interface GuestGuardProps {
  children: React.ReactNode
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated, token, user } = useAuthStore()
  const location = useLocation()

  // Verificar más detalladamente el estado de autenticación
  const isReallyAuthenticated = isAuthenticated && token && user

  if (isReallyAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}