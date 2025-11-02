export type RoleName = 'admin' | 'supervisor' | 'recepcion' | 'employee' | 'visitor'

export function normalizeRoleName(role?: string | RoleName): RoleName | null {
  if (!role) return null
  const r = String(role).toLowerCase()
  switch (r) {
    case 'admin': return 'admin'
    case 'supervisor': return 'supervisor'
    case 'recepcion':
    case 'reception': return 'recepcion'
    case 'employee':
    case 'empleado': return 'employee'
    case 'visitor':
    case 'visitante': return 'visitor'
    default: return null
  }
}

export function getDefaultRouteForRole(role?: string | RoleName): string {
  const r = normalizeRoleName(role)
  switch (r) {
    case 'admin': return '/admin/dashboard'
    case 'supervisor': return '/supervisor/dashboard'
    case 'recepcion': return '/reception/dashboard'
    case 'employee': return '/employee/dashboard'
    case 'visitor': return '/dashboard'
    default: return '/dashboard'
  }
}