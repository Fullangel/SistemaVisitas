import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Region {
  id: number
  name: string
  description: string
  country: string
  status: 'active' | 'inactive'
  sites_count?: number
  created_at: string
  updated_at: string
}

interface Site {
  id: number
  name: string
  address: string
  region_id: number
  region_name?: string
  status: 'active' | 'inactive'
  employees_count?: number
  created_at: string
  updated_at: string
}

interface RegionFormData {
  name: string
  description: string
  country: string
  status: 'active' | 'inactive'
}

interface SiteFormData {
  name: string
  address: string
  region_id: number
  status: 'active' | 'inactive'
}

interface RegionSiteManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onRegionSiteUpdated: () => void
}

const RegionSiteManagementModal: React.FC<RegionSiteManagementModalProps> = ({
  isOpen,
  onClose,
  onRegionSiteUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [regions, setRegions] = useState<Region[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [activeTab, setActiveTab] = useState<'regions' | 'sites'>('regions')
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
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
  } = useForm<RegionFormData | SiteFormData>()

  useEffect(() => {
    if (isOpen) {
      fetchRegionsAndSites()
    }
  }, [isOpen])

  const fetchRegionsAndSites = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // Simulación de datos hardcodeados mientras se implementa el backend
      const mockRegions: Region[] = [
        {
          id: 1,
          name: 'Región Norte',
          description: 'Región norte del país',
          country: 'Chile',
          status: 'active',
          sites_count: 5,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Región Centro',
          description: 'Región central del país',
          country: 'Chile',
          status: 'active',
          sites_count: 8,
          created_at: '2024-01-16T10:00:00Z',
          updated_at: '2024-01-16T10:00:00Z'
        },
        {
          id: 3,
          name: 'Región Sur',
          description: 'Región sur del país',
          country: 'Chile',
          status: 'inactive',
          sites_count: 3,
          created_at: '2024-01-17T10:00:00Z',
          updated_at: '2024-01-17T10:00:00Z'
        }
      ]

      const mockSites: Site[] = [
        {
          id: 1,
          name: 'Sede Santiago Centro',
          address: 'Av. Principal 123, Santiago',
          region_id: 2,
          region_name: 'Región Centro',
          status: 'active',
          employees_count: 150,
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        },
        {
          id: 2,
          name: 'Sede Antofagasta',
          address: 'Calle Norte 456, Antofagasta',
          region_id: 1,
          region_name: 'Región Norte',
          status: 'active',
          employees_count: 75,
          created_at: '2024-01-21T10:00:00Z',
          updated_at: '2024-01-21T10:00:00Z'
        },
        {
          id: 3,
          name: 'Sede Concepción',
          address: 'Av. Sur 789, Concepción',
          region_id: 3,
          region_name: 'Región Sur',
          status: 'inactive',
          employees_count: 50,
          created_at: '2024-01-22T10:00:00Z',
          updated_at: '2024-01-22T10:00:00Z'
        }
      ]

      setRegions(mockRegions)
      setSites(mockSites)
    } catch (error) {
      console.error('Error fetching regions and sites:', error)
      toast.error('Error al cargar regiones y sedes')
      setRegions([])
      setSites([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRegion = () => {
    setSelectedRegion(null)
    setSelectedSite(null)
    setIsCreating(true)
    setIsEditing(true)
    reset({
      name: '',
      description: '',
      country: '',
      status: 'active'
    } as RegionFormData)
  }

  const handleCreateSite = () => {
    setSelectedRegion(null)
    setSelectedSite(null)
    setIsCreating(true)
    setIsEditing(true)
    reset({
      name: '',
      address: '',
      region_id: 0,
      status: 'active'
    } as SiteFormData)
  }

  const handleEditRegion = (region: Region) => {
    setSelectedRegion(region)
    setSelectedSite(null)
    setIsCreating(false)
    setIsEditing(true)
    reset({
      name: region.name,
      description: region.description,
      country: region.country,
      status: region.status
    } as RegionFormData)
  }

  const handleEditSite = (site: Site) => {
    setSelectedRegion(null)
    setSelectedSite(site)
    setIsCreating(false)
    setIsEditing(true)
    reset({
      name: site.name,
      address: site.address,
      region_id: site.region_id,
      status: site.status
    } as SiteFormData)
  }

  const handleCloseForm = () => {
    setIsCreating(false)
    setIsEditing(false)
    setSelectedRegion(null)
    setSelectedSite(null)
    reset({
      name: '',
      description: '',
      country: '',
      status: 'active',
      address: '',
      region_id: 0
    })
  }

  const onSubmit = async (data: RegionFormData | SiteFormData) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // Simulación de guardado exitoso
      if (activeTab === 'regions') {
        if (isCreating) {
          toast.success('Región creada exitosamente')
        } else {
          toast.success('Región actualizada exitosamente')
        }
      } else {
        if (isCreating) {
          toast.success('Sede creada exitosamente')
        } else {
          toast.success('Sede actualizada exitosamente')
        }
      }

      await fetchRegionsAndSites()
      handleCloseForm()
      onRegionSiteUpdated()
    } catch (error: any) {
      console.error('Error saving region/site:', error)
      toast.error(error.response?.data?.message || 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // Simulación de eliminación exitosa
      if (activeTab === 'regions') {
        toast.success('Región eliminada exitosamente')
      } else {
        toast.success('Sede eliminada exitosamente')
      }

      await fetchRegionsAndSites()
      setShowDeleteConfirm(null)
      onRegionSiteUpdated()
    } catch (error: any) {
      console.error('Error deleting region/site:', error)
      toast.error(error.response?.data?.message || 'Error al eliminar')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || region.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.region_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Activo' : 'Inactivo'
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-6xl w-full bg-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Gestión de Regiones y Sedes
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  Administra las regiones y sedes del sistema
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('regions')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'regions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-4 w-4" />
                <span>Regiones ({regions.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sites')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'sites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-4 w-4" />
                <span>Sedes ({sites.length})</span>
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Buscar ${activeTab === 'regions' ? 'regiones' : 'sedes'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
              <button
                onClick={activeTab === 'regions' ? handleCreateRegion : handleCreateSite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Crear {activeTab === 'regions' ? 'Región' : 'Sede'}</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'regions' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRegions.map((region) => (
                  <div key={region.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-gray-900">{region.name}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(region.status)}`}>
                        {getStatusLabel(region.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{region.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {region.country}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {region.sites_count} sede{region.sites_count !== 1 ? 's' : ''}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRegion(region)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(region.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSites.map((site) => (
                  <div key={site.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
                          <h3 className="font-medium text-gray-900">{site.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(site.status)}`}>
                            {getStatusLabel(site.status)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {site.address}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Región: {site.region_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {site.employees_count} empleado{site.employees_count !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSite(site)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(site.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isCreating ? `Crear ${activeTab === 'regions' ? 'Región' : 'Sede'}` : `Editar ${activeTab === 'regions' ? 'Región' : 'Sede'}`}
                    </h3>
                    <button
                      onClick={handleCloseForm}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                  {activeTab === 'regions' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la Región
                        </label>
                        <input
                          {...register('name', { required: 'El nombre es requerido' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ej: Región Norte"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <textarea
                          {...register('description', { required: 'La descripción es requerida' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Describe la región..."
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          País
                        </label>
                        <input
                          {...register('country', { required: 'El país es requerido' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ej: Chile"
                        />
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la Sede
                        </label>
                        <input
                          {...register('name', { required: 'El nombre es requerido' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ej: Sede Santiago Centro"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección
                        </label>
                        <textarea
                          {...register('address', { required: 'La dirección es requerida' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                          placeholder="Dirección completa de la sede..."
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Región
                        </label>
                        <select
                          {...register('region_id', { required: 'La región es requerida' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecciona una región</option>
                          {regions.map(region => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                        {errors.region_id && (
                          <p className="mt-1 text-sm text-red-600">{errors.region_id.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <CheckIcon className="h-4 w-4" />
                      )}
                      <span>Guardar</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Eliminar {activeTab === 'regions' ? 'región' : 'sede'}?
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta {activeTab === 'regions' ? 'región' : 'sede'}?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    Eliminar
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

export default RegionSiteManagementModal