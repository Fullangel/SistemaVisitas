import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import {
  UserIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Visitor {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  identification: string
  address: string
  city: string
  visit_purpose: string
  company: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  visits_count?: number
}

interface VisitorFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  identification: string
  address: string
  city: string
  visit_purpose: string
  company: string
  status: 'active' | 'inactive'
}

interface VisitorManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onVisitorUpdated: () => void
}

const VisitorManagementModal: React.FC<VisitorManagementModalProps> = ({
  isOpen,
  onClose,
  onVisitorUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([])
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<VisitorFormData>()

  const watchedStatus = watch('status', 'active')

  useEffect(() => {
    if (isOpen) {
      fetchVisitors()
    }
  }, [isOpen])

  useEffect(() => {
    filterVisitors()
  }, [visitors, searchTerm, statusFilter])

  const filterVisitors = () => {
    let filtered = visitors

    if (searchTerm) {
      filtered = filtered.filter(visitor =>
        visitor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.identification.includes(searchTerm) ||
        visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(visitor => visitor.status === statusFilter)
    }

    setFilteredVisitors(filtered)
  }

  const fetchVisitors = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // Usar axios para llamadas reales al backend
      const axios = (await import('axios')).default
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      // Simular datos mientras se implementa el backend
      const mockVisitors: Visitor[] = [
        {
          id: 1,
          first_name: 'Juan',
          last_name: 'Pérez García',
          email: 'juan.perez@empresa.com',
          phone: '+34 600 123 456',
          identification: '12345678A',
          address: 'Calle Mayor 123',
          city: 'Sede Central - Madrid',
          visit_purpose: 'Reunión comercial',
          company: 'Tech Solutions S.L.',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          visits_count: 5
        },
        {
          id: 2,
          first_name: 'María',
          last_name: 'González López',
          email: 'maria.gonzalez@consulting.es',
          phone: '+34 600 987 654',
          identification: '87654321B',
          address: 'Avenida Central 45',
          city: 'Sede Barcelona - Oficina Norte',
          visit_purpose: 'Consultoría técnica',
          company: 'Global Consulting',
          status: 'active',
          created_at: '2024-01-20T14:15:00Z',
          updated_at: '2024-01-20T14:15:00Z',
          visits_count: 3
        },
        {
          id: 3,
          first_name: 'Carlos',
          last_name: 'Rodríguez Martín',
          email: 'carlos.rodriguez@innovate.com',
          phone: '+34 611 222 333',
          identification: '11223344C',
          address: 'Plaza España 8',
          city: 'Sede Valencia - Centro',
          visit_purpose: 'Presentación de producto',
          company: 'Innovate Tech',
          status: 'inactive',
          created_at: '2024-01-25T09:45:00Z',
          updated_at: '2024-01-25T09:45:00Z',
          visits_count: 1
        }
      ]

      // Simular llamada a API
      setTimeout(() => {
        setVisitors(mockVisitors)
        setIsLoading(false)
      }, 1000)

      // Descomentar cuando el backend esté listo:
      // const visitorsResponse = await axios.get('/api/admin/visitors', config)
      // setVisitors(visitorsResponse.data.data || [])
      
    } catch (error) {
      console.error('Error fetching visitors:', error)
      toast.error('Error al cargar visitantes')
      setVisitors([])
      setIsLoading(false)
    }
  }

  const handleCreateVisitor = () => {
    setSelectedVisitor(null)
    setIsCreating(true)
    setIsEditing(true)
    reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      identification: '',
      address: '',
      city: '',
      visit_purpose: '',
      company: '',
      status: 'active'
    })
  }

  const handleEditVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor)
    setIsCreating(false)
    setIsEditing(true)
    reset({
      first_name: visitor.first_name,
      last_name: visitor.last_name,
      email: visitor.email,
      phone: visitor.phone,
      identification: visitor.identification,
      address: visitor.address,
      city: visitor.city,
      visit_purpose: visitor.visit_purpose,
      company: visitor.company,
      status: visitor.status
    })
  }

  const handleCloseForm = () => {
    setIsCreating(false)
    setIsEditing(false)
    setSelectedVisitor(null)
    reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      identification: '',
      address: '',
      city: '',
      visit_purpose: '',
      company: '',
      status: 'active'
    })
  }

  const onSubmit = async (data: VisitorFormData) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      const axios = (await import('axios')).default
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      if (isCreating) {
        // Descomentar cuando el backend esté listo:
        // await axios.post('/api/admin/visitors', data, config)
        toast.success('Visitante creado exitosamente')
      } else if (isEditing && selectedVisitor) {
        // Descomentar cuando el backend esté listo:
        // await axios.put(`/api/admin/visitors/${selectedVisitor.id}`, data, config)
        toast.success('Visitante actualizado exitosamente')
      }

      await fetchVisitors()
      handleCloseForm()
      onVisitorUpdated()
    } catch (error: any) {
      console.error('Error saving visitor:', error)
      if (error.response?.status === 422) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(field => {
          toast.error(`${field}: ${errors[field][0]}`)
        })
      } else {
        toast.error('Error al guardar visitante')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVisitor = async (visitorId: number) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      const axios = (await import('axios')).default
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      // Descomentar cuando el backend esté listo:
      // await axios.delete(`/api/admin/visitors/${visitorId}`, config)
      toast.success('Visitante eliminado exitosamente')
      
      setShowDeleteConfirm(null)
      await fetchVisitors()
      onVisitorUpdated()
    } catch (error) {
      console.error('Error deleting visitor:', error)
      toast.error('Error al eliminar visitante')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-6xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-blue-600" />
              Gestión de Visitantes
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {!isEditing ? (
            <div className="p-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email, identificación, empresa o sede..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </select>
                  <button
                    onClick={handleCreateVisitor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Nuevo Visitante
                  </button>
                </div>
              </div>

              {/* Visitors Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitas</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Cargando visitantes...</td>
                      </tr>
                    ) : filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No se encontraron visitantes</td>
                      </tr>
                    ) : (
                      filteredVisitors.map((visitor) => (
                        <tr key={visitor.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{visitor.first_name} {visitor.last_name}</div>
                            <div className="text-sm text-gray-500">{visitor.visit_purpose}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.identification}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{visitor.email}</div>
                            <div className="text-sm text-gray-500">{visitor.phone}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.company}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.city}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              visitor.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {visitor.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{visitor.visits_count || 0}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditVisitor(visitor)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(visitor.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Eliminar"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Visitor Form */
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <IdentificationIcon className="h-5 w-5 text-blue-600" />
                      Información Personal
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                      <input
                        type="text"
                        {...register('first_name', { required: 'El nombre es requerido' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                      <input
                        type="text"
                        {...register('last_name', { required: 'Los apellidos son requeridos' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Identificación *</label>
                      <input
                        type="text"
                        {...register('identification', { required: 'La identificación es requerida' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.identification && <p className="text-red-500 text-xs mt-1">{errors.identification.message}</p>}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                      Información de Contacto
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'El email es requerido',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Email inválido'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'El teléfono es requerido' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                      <input
                        type="text"
                        {...register('city')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-blue-600" />
                    Información Adicional
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <input
                        type="text"
                        {...register('address')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                      <input
                        type="text"
                        {...register('company')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Propósito de Visita</label>
                      <input
                        type="text"
                        {...register('visit_purpose')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        {...register('status')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                  <h3 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  ¿Estás seguro de que deseas eliminar este visitante? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDeleteVisitor(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="h-4 w-4" />
                        Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default VisitorManagementModal