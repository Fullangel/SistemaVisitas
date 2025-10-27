import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  KeyIcon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: {
    id: number
    name: string
    description: string
    is_active: boolean
  }
  status: 'active' | 'inactive' | 'suspended'
  last_login: string
  created_at: string
  updated_at: string
  visitas_count: number
  phone?: string
  department?: string
  avatar?: string
}

interface UserFilters {
  search: string
  role: string
  status: string
  department: string
  dateRange: string
}

interface UserViewModalProps {
  isOpen: boolean
  onClose: () => void
  onUserUpdated: () => void
}

const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  onClose,
  onUserUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showStatusConfirm, setShowStatusConfirm] = useState<{userId: number, newStatus: string} | null>(null)
  
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    status: '',
    department: '',
    dateRange: ''
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'status' | 'last_login'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen])

  useEffect(() => {
    applyFilters()
  }, [users, filters, sortBy, sortOrder])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // Simulación de datos de usuarios - en producción esto vendría del backend
      const hardcodedUsers: User[] = [
        {
          id: 1,
          username: 'juan.perez',
          email: 'juan.perez@empresa.com',
          first_name: 'Juan',
          last_name: 'Pérez García',
          role: {
            id: 1,
            name: 'Administrador',
            description: 'Acceso total al sistema',
            is_active: true
          },
          status: 'active',
          last_login: '2024-01-15T10:30:00Z',
          created_at: '2024-01-01T08:00:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          visitas_count: 45,
          phone: '+56912345678',
          department: 'TI',
          avatar: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=JP'
        },
        {
          id: 2,
          username: 'maria.gonzalez',
          email: 'maria.gonzalez@empresa.com',
          first_name: 'María',
          last_name: 'González López',
          role: {
            id: 2,
            name: 'Supervisor',
            description: 'Supervisión de visitas y empleados',
            is_active: true
          },
          status: 'active',
          last_login: '2024-01-14T15:45:00Z',
          created_at: '2024-01-05T09:15:00Z',
          updated_at: '2024-01-14T15:45:00Z',
          visitas_count: 32,
          phone: '+56987654321',
          department: 'Operaciones',
          avatar: 'https://via.placeholder.com/150/10B981/FFFFFF?text=MG'
        },
        {
          id: 3,
          username: 'carlos.rodriguez',
          email: 'carlos.rodriguez@empresa.com',
          first_name: 'Carlos',
          last_name: 'Rodríguez Martínez',
          role: {
            id: 3,
            name: 'Recepcionista',
            description: 'Gestión de visitas en recepción',
            is_active: true
          },
          status: 'inactive',
          last_login: '2024-01-10T08:20:00Z',
          created_at: '2024-01-10T08:20:00Z',
          updated_at: '2024-01-10T08:20:00Z',
          visitas_count: 18,
          phone: '+56911223344',
          department: 'Recepción',
          avatar: 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=CR'
        },
        {
          id: 4,
          username: 'ana.lopez',
          email: 'ana.lopez@empresa.com',
          first_name: 'Ana',
          last_name: 'López Fernández',
          role: {
            id: 4,
            name: 'Empleado',
            description: 'Acceso básico al sistema',
            is_active: true
          },
          status: 'active',
          last_login: '2024-01-15T09:15:00Z',
          created_at: '2024-01-08T14:30:00Z',
          updated_at: '2024-01-15T09:15:00Z',
          visitas_count: 12,
          phone: '+56955667788',
          department: 'RRHH',
          avatar: 'https://via.placeholder.com/150/EF4444/FFFFFF?text=AL'
        },
        {
          id: 5,
          username: 'luis.martinez',
          email: 'luis.martinez@empresa.com',
          first_name: 'Luis',
          last_name: 'Martínez Sánchez',
          role: {
            id: 2,
            name: 'Supervisor',
            description: 'Supervisión de visitas y empleados',
            is_active: true
          },
          status: 'suspended',
          last_login: '2024-01-12T11:00:00Z',
          created_at: '2024-01-03T10:45:00Z',
          updated_at: '2024-01-12T11:00:00Z',
          visitas_count: 28,
          phone: '+56999887766',
          department: 'Operaciones',
          avatar: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=LM'
        },
        {
          id: 6,
          username: 'patricia.garcia',
          email: 'patricia.garcia@empresa.com',
          first_name: 'Patricia',
          last_name: 'García Ruiz',
          role: {
            id: 4,
            name: 'Empleado',
            description: 'Acceso básico al sistema',
            is_active: true
          },
          status: 'active',
          last_login: '2024-01-13T16:20:00Z',
          created_at: '2024-01-12T12:30:00Z',
          updated_at: '2024-01-13T16:20:00Z',
          visitas_count: 8,
          phone: '+56944332211',
          department: 'Finanzas',
          avatar: 'https://via.placeholder.com/150/F97316/FFFFFF?text=PG'
        }
      ]
      
      setUsers(hardcodedUsers)
      toast.success('Usuarios cargados exitosamente')
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...users]
    
    // Aplicar filtros
    if (filters.search) {
      filtered = filtered.filter(user => 
        user.first_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    if (filters.role) {
      filtered = filtered.filter(user => user.role.name === filters.role)
    }
    
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status)
    }
    
    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department)
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`
          bValue = `${b.first_name} ${b.last_name}`
          break
        case 'email':
          aValue = a.email
          bValue = b.email
          break
        case 'role':
          aValue = a.role.name
          bValue = b.role.name
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'last_login':
          aValue = a.last_login
          bValue = b.last_login
          break
        default:
          aValue = a.id
          bValue = b.id
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })
    
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: '',
      department: '',
      dateRange: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Activo
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <InformationCircleIcon className="w-3 h-3 mr-1" />
            Inactivo
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Suspendido
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Desconocido
          </span>
        )
    }
  }

  const getRoleBadge = (roleName: string) => {
    const roleColors = {
      'Administrador': 'bg-purple-100 text-purple-800',
      'Supervisor': 'bg-blue-100 text-blue-800',
      'Recepcionista': 'bg-amber-100 text-amber-800',
      'Empleado': 'bg-green-100 text-green-800'
    }
    
    const colorClass = roleColors[roleName as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        <KeyIcon className="w-3 h-3 mr-1" />
        {roleName}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = async (userId: number) => {
    setShowDeleteConfirm(userId)
  }

  const confirmDeleteUser = async () => {
    if (!showDeleteConfirm) return
    
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.filter(user => user.id !== showDeleteConfirm))
      toast.success('Usuario eliminado exitosamente')
      setShowDeleteConfirm(null)
      onUserUpdated()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error al eliminar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    setShowStatusConfirm({ userId, newStatus })
  }

  const confirmStatusChange = async () => {
    if (!showStatusConfirm) return
    
    setIsLoading(true)
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.map(user => 
        user.id === showStatusConfirm.userId 
          ? { ...user, status: showStatusConfirm.newStatus as 'active' | 'inactive' | 'suspended' }
          : user
      ))
      
      toast.success('Estado de usuario actualizado exitosamente')
      setShowStatusConfirm(null)
      onUserUpdated()
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Error al actualizar estado del usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleClose = () => {
    setFilters({
      search: '',
      role: '',
      status: '',
      department: '',
      dateRange: ''
    })
    setCurrentPage(1)
    onClose()
  }

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-7xl w-full bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Vista de Usuarios
              </Dialog.Title>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o usuario..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtros
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select
                      value={filters.role}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos los roles</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Recepcionista">Recepcionista</option>
                      <option value="Empleado">Empleado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos los estados</option>
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="suspended">Suspendido</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                    <select
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos los departamentos</option>
                      <option value="TI">TI</option>
                      <option value="Operaciones">Operaciones</option>
                      <option value="Recepción">Recepción</option>
                      <option value="RRHH">RRHH</option>
                      <option value="Finanzas">Finanzas</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último Acceso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatar || `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}
                              alt={`${user.first_name} ${user.last_name}`}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.department || 'Sin departamento'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.last_login)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.visitas_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver detalles"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-green-600 hover:text-green-900"
                              title="Editar usuario"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              className={`${
                                user.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                              }`}
                              title={user.status === 'active' ? 'Desactivar usuario' : 'Activar usuario'}
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar usuario"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Detalles del Usuario</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-16 w-16 rounded-full"
                    src={selectedUser.avatar || `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${selectedUser.first_name.charAt(0)}${selectedUser.last_name.charAt(0)}`}
                    alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</h4>
                    <p className="text-gray-600">@{selectedUser.username}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="text-gray-900">{selectedUser.phone || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    {getRoleBadge(selectedUser.role.name)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Departamento</label>
                    <p className="text-gray-900">{selectedUser.department || 'Sin departamento'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Visitas Registradas</label>
                    <p className="text-gray-900">{selectedUser.visitas_count}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                    <p className="text-gray-900">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Último Acceso</label>
                    <p className="text-gray-900">{formatDate(selectedUser.last_login)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowUserDetails(false)
                    handleEditUser(selectedUser)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Editar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation */}
      {showStatusConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Cambio</h3>
                <button
                  onClick={() => setShowStatusConfirm(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">
                ¿Está seguro de que desea {showStatusConfirm.newStatus === 'active' ? 'activar' : 'desactivar'} este usuario?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">
                ¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default UserViewModal