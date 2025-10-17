// Tipos principales del sistema
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'supervisor'
  permissions: string[]
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Visita {
  id: number
  codigo: string
  visitante_nombre: string
  visitante_documento: string
  visitante_telefono: string
  visitante_email: string
  entidad_visitada: string
  motivo: string
  fecha_hora_ingreso: string
  fecha_hora_salida?: string
  estado: 'pendiente' | 'en_curso' | 'finalizada' | 'cancelada'
  observaciones?: string
  user_id: number
  user?: User
  created_at: string
  updated_at: string
}

export interface Entidad {
  id: number
  nombre: string
  codigo: string
  tipo: 'ministerio' | 'instituto' | 'direccion' | 'otro'
  direccion: string
  telefono: string
  email: string
  responsable: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Reporte {
  id: number
  tipo: 'mensual' | 'trimestral' | 'anual' | 'personalizado'
  titulo: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  datos: Record<string, any>
  generado_por: number
  usuario?: User
  archivo_url?: string
  created_at: string
  updated_at: string
}

export interface Configuracion {
  id: number
  clave: string
  valor: string
  tipo: 'string' | 'number' | 'boolean' | 'json'
  descripcion: string
  categoria: 'general' | 'seguridad' | 'notificaciones' | 'reportes'
  editable: boolean
  created_at: string
  updated_at: string
}

// Tipos para formularios
export interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export interface VisitaForm {
  visitante_nombre: string
  visitante_documento: string
  visitante_telefono: string
  visitante_email: string
  entidad_visitada: string
  motivo: string
  fecha_hora_ingreso: string
  observaciones?: string
}

export interface UsuarioForm {
  name: string
  email: string
  password?: string
  role: 'admin' | 'user' | 'supervisor'
  permissions: string[]
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Tipos para filtros y búsquedas
export interface FiltrosVisita {
  search?: string
  estado?: string
  entidad?: string
  fecha_inicio?: string
  fecha_fin?: string
  page?: number
  per_page?: number
}

export interface FiltrosReporte {
  tipo?: string
  fecha_inicio?: string
  fecha_fin?: string
  entidad?: string
  formato?: 'pdf' | 'excel' | 'csv'
}

// Tipos para notificaciones
export interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: 'info' | 'success' | 'warning' | 'error'
  leido: boolean
  user_id: number
  data?: Record<string, any>
  created_at: string
  updated_at: string
}

// Tipos para estadísticas
export interface Estadistica {
  total_visitas: number
  visitas_mes: number
  visitas_hoy: number
  promedio_duracion: number
  entidades_mas_visitadas: Array<{
    entidad: string
    visitas: number
  }>
  visitas_por_estado: Record<string, number>
  visitas_por_mes: Array<{
    mes: string
    visitas: number
  }>
}