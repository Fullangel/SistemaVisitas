import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}) => {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Si el usuario no tiene rol, redirigir al dashboard general
  if (!user?.role) {
    return <Navigate to={redirectTo} replace />
  }

  // Verificar si el rol del usuario está en los roles permitidos
  const userRole = user.role?.name?.toLowerCase() || ''
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase())
  
  if (!normalizedAllowedRoles.includes(userRole)) {
    // Si no tiene el rol permitido, redirigir al dashboard general
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}