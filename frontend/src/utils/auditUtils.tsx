import { AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Plus, Activity } from 'lucide-react'
import type { AuditLog } from '@/components/audit/AuditTable'

// Mock data para Registro de Actividades
export const mockActivityLogs: AuditLog[] = [
    { id: 1, timestamp: '2025-11-25 17:45:23', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'create', module: 'Empleados', description: 'Creó nuevo empleado: María González', ip_address: '192.168.1.100', status: 'success' },
    { id: 2, timestamp: '2025-11-25 17:30:15', user_id: 2, user_name: 'Supervisor Regional', user_role: 'supervisor', action: 'update', module: 'Visitas', description: 'Aprobó visita #1234', ip_address: '192.168.1.101', status: 'success' },
    { id: 3, timestamp: '2025-11-25 17:15:42', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'delete', module: 'Departamentos', description: 'Eliminó departamento: Marketing', ip_address: '192.168.1.100', status: 'warning' },
    { id: 4, timestamp: '2025-11-25 16:50:11', user_id: 3, user_name: 'Recepcionista', user_role: 'receptionist', action: 'create', module: 'Visitas', description: 'Registró nueva visita para Juan Pérez', ip_address: '192.168.1.102', status: 'success' },
    { id: 5, timestamp: '2025-11-25 16:20:33', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'update', module: 'Configuración', description: 'Modificó configuración de seguridad', ip_address: '192.168.1.100', status: 'success' },
]

// Mock data para Historial de Visitas
export const mockVisitLogs: AuditLog[] = [
    { id: 6, timestamp: '2025-11-25 17:40:00', user_id: 2, user_name: 'Supervisor Regional', user_role: 'supervisor', action: 'approve', module: 'Visitas', description: 'Aprobó visita #1234 - Carlos Rodríguez', ip_address: '192.168.1.101', status: 'success' },
    { id: 7, timestamp: '2025-11-25 17:25:00', user_id: 3, user_name: 'Recepcionista', user_role: 'receptionist', action: 'checkin', module: 'Visitas', description: 'Check-in de visita #1233 - Ana Martínez', ip_address: '192.168.1.102', status: 'success' },
    { id: 8, timestamp: '2025-11-25 17:10:00', user_id: 2, user_name: 'Supervisor Regional', user_role: 'supervisor', action: 'reject', module: 'Visitas', description: 'Rechazó visita #1232 - Motivo: Documentación incompleta', ip_address: '192.168.1.101', status: 'warning' },
    { id: 9, timestamp: '2025-11-25 16:55:00', user_id: 3, user_name: 'Recepcionista', user_role: 'receptionist', action: 'checkout', module: 'Visitas', description: 'Check-out de visita #1231 - Luis Pérez', ip_address: '192.168.1.102', status: 'success' },
]

// Mock data para Cambios en Configuración
export const mockConfigLogs: AuditLog[] = [
    { id: 10, timestamp: '2025-11-25 15:30:00', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'create', module: 'Regiones', description: 'Creó nueva región: Región Occidental', ip_address: '192.168.1.100', status: 'success' },
    { id: 11, timestamp: '2025-11-25 14:45:00', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'update', module: 'Sedes', description: 'Actualizó sede: Oficina Chacao', ip_address: '192.168.1.100', status: 'success' },
    { id: 12, timestamp: '2025-11-25 14:20:00', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'delete', module: 'Cargos', description: 'Eliminó cargo: Asistente Temporal', ip_address: '192.168.1.100', status: 'warning' },
]

// Mock data para Accesos al Sistema
export const mockAccessLogs: AuditLog[] = [
    { id: 13, timestamp: '2025-11-25 08:00:15', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'login', module: 'Autenticación', description: 'Inicio de sesión exitoso', ip_address: '192.168.1.100', status: 'success' },
    { id: 14, timestamp: '2025-11-25 08:05:22', user_id: 2, user_name: 'Supervisor Regional', user_role: 'supervisor', action: 'login', module: 'Autenticación', description: 'Inicio de sesión exitoso', ip_address: '192.168.1.101', status: 'success' },
    { id: 15, timestamp: '2025-11-25 08:10:45', user_id: 0, user_name: 'Desconocido', user_role: 'unknown', action: 'login_failed', module: 'Autenticación', description: 'Intento fallido de inicio de sesión - Usuario: admin@test.com', ip_address: '203.45.67.89', status: 'error' },
    { id: 16, timestamp: '2025-11-25 08:11:12', user_id: 0, user_name: 'Desconocido', user_role: 'unknown', action: 'login_failed', module: 'Autenticación', description: 'Intento fallido de inicio de sesión - Usuario: admin@test.com', ip_address: '203.45.67.89', status: 'error' },
]

// Mock data para Reportes de Seguridad
export const mockSecurityLogs: AuditLog[] = [
    { id: 17, timestamp: '2025-11-25 08:11:12', user_id: 0, user_name: 'Sistema', user_role: 'system', action: 'alert', module: 'Seguridad', description: 'Múltiples intentos fallidos de login desde IP: 203.45.67.89', ip_address: '203.45.67.89', status: 'error' },
    { id: 18, timestamp: '2025-11-25 03:15:00', user_id: 0, user_name: 'Sistema', user_role: 'system', action: 'alert', module: 'Seguridad', description: 'Acceso inusual fuera de horario laboral', ip_address: '192.168.1.150', status: 'warning' },
    { id: 19, timestamp: '2025-11-24 22:30:00', user_id: 1, user_name: 'Admin Principal', user_role: 'admin', action: 'permission_change', module: 'Seguridad', description: 'Modificó permisos de usuario: Recepcionista', ip_address: '192.168.1.100', status: 'warning' },
]

// Funciones auxiliares compartidas
export const getActionIcon = (action: string) => {
    switch (action) {
        case 'create': return <Plus className="h-4 w-4" />
        case 'update': case 'approve': return <Edit className="h-4 w-4" />
        case 'delete': case 'reject': return <Trash2 className="h-4 w-4" />
        case 'login': return <CheckCircle className="h-4 w-4" />
        case 'login_failed': return <XCircle className="h-4 w-4" />
        case 'alert': return <AlertTriangle className="h-4 w-4" />
        default: return <Activity className="h-4 w-4" />
    }
}

export const getActionColor = (action: string) => {
    switch (action) {
        case 'create': return 'text-green-600 bg-green-50'
        case 'update': case 'approve': return 'text-blue-600 bg-blue-50'
        case 'delete': case 'reject': return 'text-red-600 bg-red-50'
        case 'login': return 'text-green-600 bg-green-50'
        case 'login_failed': return 'text-red-600 bg-red-50'
        case 'alert': return 'text-orange-600 bg-orange-50'
        default: return 'text-gray-600 bg-gray-50'
    }
}
