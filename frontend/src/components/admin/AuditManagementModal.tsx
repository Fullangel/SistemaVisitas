import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
  DismissRegular,
  SearchRegular,
  FilterRegular,
  DocumentTextRegular,
  PersonRegular,
  CalendarRegular,
  CheckmarkCircleRegular,
  WarningRegular,
  InfoRegular,
  ShieldCheckmarkRegular,
  KeyRegular,
  SettingsRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  EyeRegular,
  AddRegular,
  EditRegular
} from '@fluentui/react-icons'
import toast from 'react-hot-toast'

interface AuditLog {
  id: number
  user_id: number
  user_name: string
  user_role: string
  action: string
  resource_type: string
  resource_id: string
  description: string
  ip_address: string
  user_agent: string
  status: 'success' | 'error' | 'warning' | 'info'
  created_at: string
  changes?: {
    field: string
    old_value: string
    new_value: string
  }[]
}

interface AuditFilters {
  search: string
  user: string
  action: string
  resource_type: string
  status: string
  date_from: string
  date_to: string
}

interface AuditManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onAuditUpdated: () => void
}

const AuditManagementModal: React.FC<AuditManagementModalProps> = ({
  isOpen,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    user: '',
    action: '',
    resource_type: '',
    status: '',
    date_from: '',
    date_to: ''
  })

  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Acciones de auditoría comunes
  const auditActions = [
    'login', 'logout', 'create', 'update', 'delete', 'view', 'export', 'import',
    'approve', 'reject', 'cancel', 'complete', 'assign', 'remove', 'enable', 'disable'
  ]

  // Tipos de recursos
  const resourceTypes = [
    'user', 'role', 'permission', 'visit', 'visitor', 'employee', 'department',
    'headquarter', 'report', 'setting', 'backup', 'audit', 'notification'
  ]

  useEffect(() => {
    if (isOpen) {
      fetchAuditLogs()
    }
  }, [isOpen])

  useEffect(() => {
    applyFilters()
  }, [auditLogs, filters])

  const fetchAuditLogs = async () => {
    setIsLoading(true)
    try {
      // Simulación de datos de auditoría - en producción esto vendría del backend
      const hardcodedLogs: AuditLog[] = [
        {
          id: 1,
          user_id: 1,
          user_name: 'Juan Pérez',
          user_role: 'Administrador',
          action: 'create',
          resource_type: 'user',
          resource_id: 'USR-2024-001',
          description: 'Creó un nuevo usuario: María González',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
          status: 'success',
          created_at: '2024-01-15T10:30:00Z',
          changes: [
            { field: 'nombre', old_value: '', new_value: 'María González' },
            { field: 'email', old_value: '', new_value: 'maria@example.com' },
            { field: 'rol', old_value: '', new_value: 'Empleado' }
          ]
        },
        {
          id: 2,
          user_id: 2,
          user_name: 'Carlos Rodríguez',
          user_role: 'Supervisor',
          action: 'update',
          resource_type: 'visit',
          resource_id: 'VIS-2024-045',
          description: 'Actualizó el estado de la visita VIS-2024-045',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
          status: 'success',
          created_at: '2024-01-15T11:15:00Z',
          changes: [
            { field: 'estado', old_value: 'pendiente', new_value: 'aprobada' },
            { field: 'hora_aprobacion', old_value: '', new_value: '2024-01-15 11:15:00' }
          ]
        },
        {
          id: 3,
          user_id: 1,
          user_name: 'Juan Pérez',
          user_role: 'Administrador',
          action: 'delete',
          resource_type: 'role',
          resource_id: 'ROL-005',
          description: 'Eliminó el rol: Usuario Temporal',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
          status: 'warning',
          created_at: '2024-01-15T14:20:00Z',
          changes: [
            { field: 'nombre', old_value: 'Usuario Temporal', new_value: '' },
            { field: 'usuarios_afectados', old_value: '3', new_value: '0' }
          ]
        },
        {
          id: 4,
          user_id: 3,
          user_name: 'Ana Martínez',
          user_role: 'Empleado',
          action: 'login',
          resource_type: 'auth',
          resource_id: 'SESSION-789',
          description: 'Inició sesión en el sistema',
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (Linux; Android 11) Chrome/120.0',
          status: 'success',
          created_at: '2024-01-15T08:45:00Z'
        },
        {
          id: 5,
          user_id: 4,
          user_name: 'Luis Gómez',
          user_role: 'Recepcionista',
          action: 'export',
          resource_type: 'report',
          resource_id: 'REP-2024-01',
          description: 'Exportó reporte de visitas del mes',
          ip_address: '192.168.1.103',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
          status: 'success',
          created_at: '2024-01-15T16:00:00Z'
        },
        {
          id: 6,
          user_id: 1,
          user_name: 'Juan Pérez',
          user_role: 'Administrador',
          action: 'update',
          resource_type: 'setting',
          resource_id: 'CONFIG-001',
          description: 'Modificó la configuración del sistema',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
          status: 'info',
          created_at: '2024-01-15T12:30:00Z',
          changes: [
            { field: 'tiempo_sesion', old_value: '30', new_value: '60' },
            { field: 'intentos_login', old_value: '3', new_value: '5' }
          ]
        },
        {
          id: 7,
          user_id: 2,
          user_name: 'Carlos Rodríguez',
          user_role: 'Supervisor',
          action: 'approve',
          resource_type: 'visit',
          resource_id: 'VIS-2024-046',
          description: 'Aprobó la visita VIS-2024-046',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
          status: 'success',
          created_at: '2024-01-15T13:10:00Z'
        },
        {
          id: 8,
          user_id: 5,
          user_name: 'María López',
          user_role: 'Empleado',
          action: 'view',
          resource_type: 'visitor',
          resource_id: 'VIS-789',
          description: 'Consultó información del visitante VIS-789',
          ip_address: '192.168.1.104',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0',
          status: 'info',
          created_at: '2024-01-15T15:45:00Z'
        }
      ]
      
      setAuditLogs(hardcodedLogs)
      toast.success('Registros de auditoría cargados exitosamente')
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Error al cargar registros de auditoría')
      setAuditLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = auditLogs

    // Filtro de búsqueda general
    if (filters.search) {
      filtered = filtered.filter(log => 
        log.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.user_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.resource_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.ip_address.includes(filters.search)
      )
    }

    // Filtro por usuario
    if (filters.user) {
      filtered = filtered.filter(log => 
        log.user_name.toLowerCase().includes(filters.user.toLowerCase())
      )
    }

    // Filtro por acción
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action)
    }

    // Filtro por tipo de recurso
    if (filters.resource_type) {
      filtered = filtered.filter(log => log.resource_type === filters.resource_type)
    }

    // Filtro por estado
    if (filters.status) {
      filtered = filtered.filter(log => log.status === filters.status)
    }

    // Filtro por fecha
    if (filters.date_from) {
      filtered = filtered.filter(log => 
        new Date(log.created_at) >= new Date(filters.date_from)
      )
    }

    if (filters.date_to) {
      filtered = filtered.filter(log => 
        new Date(log.created_at) <= new Date(filters.date_to + 'T23:59:59')
      )
    }

    setFilteredLogs(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (key: keyof AuditFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      user: '',
      action: '',
      resource_type: '',
      status: '',
      date_from: '',
      date_to: ''
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckmarkCircleRegular className="w-4 h-4 text-green-500" />
      case 'error':
        return <WarningRegular className="w-4 h-4 text-red-500" />
      case 'warning':
        return <WarningRegular className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <InfoRegular className="w-4 h-4 text-blue-500" />
      default:
        return <InfoRegular className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (status) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return <KeyRegular className="w-4 h-4" />
      case 'create':
        return <AddRegular className="w-4 h-4" />
      case 'update':
        return <EditRegular className="w-4 h-4" />
      case 'delete':
        return <DeleteRegular className="w-4 h-4" />
      case 'view':
        return <EyeRegular className="w-4 h-4" />
      case 'export':
      case 'import':
        return <ArrowClockwiseRegular className="w-4 h-4" />
      case 'approve':
        return <CheckmarkCircleRegular className="w-4 h-4" />
      case 'reject':
        return <DismissRegular className="w-4 h-4" />
      default:
        return <SettingsRegular className="w-4 h-4" />
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-VE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedLog(null)
  }

  const handleRefresh = () => {
    fetchAuditLogs()
  }

  // Paginación
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  const handleClose = () => {
    onClose()
    // Limpiar estado al cerrar
    setTimeout(() => {
      setShowDetails(false)
      setSelectedLog(null)
      setFilters({
        search: '',
        user: '',
        action: '',
        resource_type: '',
        status: '',
        date_from: '',
        date_to: ''
      })
      setCurrentPage(1)
    }, 300)
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-7xl w-full bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
          
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
                <ShieldCheckmarkRegular className="w-6 h-6 text-white" />
              </div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Auditoría del Sistema
              </Dialog.Title>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <ArrowClockwiseRegular className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DismissRegular className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <SearchRegular className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en descripción, usuario, IP, ID de recurso..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Filter Toggle and Quick Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    showFilters 
                      ? 'bg-purple-100 border-purple-300 text-purple-800' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FilterRegular className="w-4 h-4" />
                  Filtros Avanzados
                </button>
                
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Limpiar Filtros
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Total:</span>
                  <span className="font-semibold">{filteredLogs.length}</span>
                  <span>registros</span>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                    <input
                      type="text"
                      placeholder="Nombre de usuario"
                      value={filters.user}
                      onChange={(e) => handleFilterChange('user', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acción</label>
                    <select
                      value={filters.action}
                      onChange={(e) => handleFilterChange('action', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Todas las acciones</option>
                      {auditActions.map(action => (
                        <option key={action} value={action}>{action}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Recurso</label>
                    <select
                      value={filters.resource_type}
                      onChange={(e) => handleFilterChange('resource_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Todos los recursos</option>
                      {resourceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Todos los estados</option>
                      <option value="success">Éxito</option>
                      <option value="error">Error</option>
                      <option value="warning">Advertencia</option>
                      <option value="info">Información</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                    <input
                      type="date"
                      value={filters.date_from}
                      onChange={(e) => handleFilterChange('date_from', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
                    <input
                      type="date"
                      value={filters.date_to}
                      onChange={(e) => handleFilterChange('date_to', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit Logs List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 300px)' }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                {currentLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextRegular className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron registros</h3>
                    <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentLogs.map((log) => (
                      <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0">
                              {getStatusIcon(log.status)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {getActionIcon(log.action)}
                                  <span className="ml-1 capitalize">{log.action}</span>
                                  <span className="text-gray-500"> • {log.resource_type}</span>
                                </h4>
                                <span className={getStatusBadge(log.status)}>
                                  {log.status === 'success' ? 'Éxito' : 
                                   log.status === 'error' ? 'Error' :
                                   log.status === 'warning' ? 'Advertencia' : 'Información'}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-2">
                                {log.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <PersonRegular className="w-3 h-3" />
                                  {log.user_name} ({log.user_role})
                                </span>
                                <span className="flex items-center gap-1">
                                  <CalendarRegular className="w-3 h-3" />
                                  {formatDateTime(log.created_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                  ID: {log.resource_id}
                                </span>
                                <span className="flex items-center gap-1 font-mono text-xs">
                                  {log.ip_address}
                                </span>
                              </div>
                              
                              {log.changes && log.changes.length > 0 && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                  <div className="font-medium text-gray-700 mb-1">Cambios realizados:</div>
                                  {log.changes.slice(0, 2).map((change, index) => (
                                    <div key={index} className="text-gray-600">
                                      • <span className="font-medium">{change.field}:</span> 
                                      <span className="text-red-600">{change.old_value || 'vacío'}</span> → 
                                      <span className="text-green-600">{change.new_value || 'vacío'}</span>
                                    </div>
                                  ))}
                                  {log.changes.length > 2 && (
                                    <div className="text-gray-500 mt-1">
                                      +{log.changes.length - 2} cambios más
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleViewDetails(log)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                          >
                            <EyeRegular className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando {startIndex + 1} - {Math.min(endIndex, filteredLogs.length)} de {filteredLogs.length} registros
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 text-sm rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-purple-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(selectedLog.status)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles del Registro
                </h3>
              </div>
              <button
                onClick={handleCloseDetails}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DismissRegular className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Acción</label>
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedLog.action)}
                    <span className="capitalize font-medium">{selectedLog.action}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <span className={getStatusBadge(selectedLog.status)}>
                    {selectedLog.status === 'success' ? 'Éxito' : 
                     selectedLog.status === 'error' ? 'Error' :
                     selectedLog.status === 'warning' ? 'Advertencia' : 'Información'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                  <p className="text-sm text-gray-900">{selectedLog.user_name}</p>
                  <p className="text-xs text-gray-500">{selectedLog.user_role}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
                  <p className="text-sm text-gray-900">{formatDateTime(selectedLog.created_at)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Recurso</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedLog.resource_type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID del Recurso</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.resource_id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección IP</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.ip_address}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agente de Usuario</label>
                  <p className="text-sm text-gray-600 break-all">{selectedLog.user_agent}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLog.description}</p>
              </div>
              
              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cambios Detallados</label>
                  <div className="space-y-2">
                    {selectedLog.changes.map((change, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{change.field}:</span>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-red-600 text-sm truncate">{change.old_value || 'vacío'}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-600 text-sm truncate">{change.new_value || 'vacío'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default AuditManagementModal