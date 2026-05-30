import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles
}) => {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Si el usuario no tiene rol, redirigir a 403
  if (!user?.role) {
    return <Navigate to="/forbidden" replace />
  }

  // Verificar si el rol del usuario está en los roles permitidos
  const userRole = user.role?.name?.toLowerCase() || ''
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase())

  if (!normalizedAllowedRoles.includes(userRole)) {
    // Si no tiene el rol permitido, redirigir a 403
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}