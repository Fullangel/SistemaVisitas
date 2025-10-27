import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import {
  KeyIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Permission {
  id: number
  name: string
  display_name: string
  description: string
  group: string
  created_at: string
  updated_at: string
  roles_count?: number
}

interface PermissionFormData {
  name: string
  display_name: string
  description: string
  group: string
}

interface PermissionManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onPermissionUpdated: () => void
}

const PermissionManagementModal: React.FC<PermissionManagementModalProps> = ({
  isOpen,
  onClose,
  onPermissionUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PermissionFormData>()

  useEffect(() => {
    if (isOpen) {
      fetchPermissions()
    }
  }, [isOpen])

  const fetchPermissions = async () => {
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

      // Simular datos de permisos (mientras se implementa el backend)
      const hardcodedPermissions: Permission[] = [
        { id: 1, name: 'users.create', display_name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 3 },
        { id: 2, name: 'users.read', display_name: 'Ver Usuarios', description: 'Permite ver información de usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 5 },
        { id: 3, name: 'users.update', display_name: 'Editar Usuarios', description: 'Permite actualizar información de usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 4, name: 'users.delete', display_name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 1 },
        { id: 5, name: 'roles.create', display_name: 'Crear Roles', description: 'Permite crear nuevos roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 6, name: 'roles.read', display_name: 'Ver Roles', description: 'Permite ver información de roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 4 },
        { id: 7, name: 'roles.update', display_name: 'Editar Roles', description: 'Permite actualizar roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 8, name: 'roles.delete', display_name: 'Eliminar Roles', description: 'Permite eliminar roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 1 },
        { id: 9, name: 'visits.create', display_name: 'Crear Visitas', description: 'Permite crear nuevas visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 3 },
        { id: 10, name: 'visits.read', display_name: 'Ver Visitas', description: 'Permite ver información de visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 6 },
        { id: 11, name: 'visits.update', display_name: 'Editar Visitas', description: 'Permite actualizar visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 12, name: 'visits.delete', display_name: 'Eliminar Visitas', description: 'Permite eliminar visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 1 },
        { id: 13, name: 'reports.read', display_name: 'Ver Reportes', description: 'Permite ver reportes', group: 'Reportes', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 4 },
        { id: 14, name: 'reports.export', display_name: 'Exportar Reportes', description: 'Permite exportar reportes', group: 'Reportes', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 }
      ]
      
      setPermissions(hardcodedPermissions)
    } catch (error) {
      console.error('Error fetching permissions:', error)
      toast.error('Error al cargar permisos')
      setPermissions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePermission = () => {
    setSelectedPermission(null)
    setIsCreating(true)
    setIsEditing(true)
    reset({
      name: '',
      display_name: '',
      description: '',
      group: ''
    })
  }

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsCreating(false)
    setIsEditing(true)
    reset({
      name: permission.name,
      display_name: permission.display_name,
      description: permission.description,
      group: permission.group
    })
  }

  const handleCloseForm = () => {
    setIsCreating(false)
    setIsEditing(false)
    setSelectedPermission(null)
    reset({
      name: '',
      display_name: '',
      description: '',
      group: ''
    })
  }

  const onSubmit = async (data: PermissionFormData) => {
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
        // Crear nuevo permiso
        await axios.post('/api/admin/permissions', data, config)
        toast.success('Permiso creado exitosamente')
      } else if (isEditing && selectedPermission) {
        // Actualizar permiso existente
        await axios.put(`/api/admin/permissions/${selectedPermission.id}`, data, config)
        toast.success('Permiso actualizado exitosamente')
      }

      await fetchPermissions()
      handleCloseForm()
      onPermissionUpdated()
    } catch (error: any) {
      console.error('Error saving permission:', error)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(field => {
          toast.error(`${field}: ${errors[field][0]}`)
        })
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al guardar el permiso')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePermission = async (permissionId: number) => {
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

      await axios.delete(`/api/admin/permissions/${permissionId}`, config)

      toast.success('Permiso eliminado exitosamente')
      await fetchPermissions()
      setShowDeleteConfirm(null)
      onPermissionUpdated()
    } catch (error: any) {
      console.error('Error deleting permission:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al eliminar el permiso')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    handleCloseForm()
    setShowDeleteConfirm(null)
  }

  const groupedPermissions = permissions.reduce((groups, permission) => {
    const group = permission.group || 'General'
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(permission)
    return groups
  }, {} as Record<string, Permission[]>)

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-6xl w-full bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden sm:max-w-2xl lg:max-w-4xl">
          {/* Estilos para scroll suave */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
            @media (max-width: 640px) {
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
            }
            /* Soporte para dispositivos táctiles */
            @media (hover: none) and (pointer: coarse) {
              .custom-scrollbar {
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
              }
            }
            /* Scroll suave para todos los navegadores */
            .custom-scrollbar {
              scroll-behavior: smooth;
              -webkit-overflow-scrolling: touch;
            }
          `}</style>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                <KeyIcon className="w-6 h-6 text-white" />
              </div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Gestión de Permisos
              </Dialog.Title>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {!isCreating && !isEditing ? (
            /* Permission List View */
            <div className="flex flex-col h-full">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Permisos del Sistema</h3>
                    <p className="text-sm text-gray-600">Administra los permisos y sus detalles</p>
                  </div>
                  <button
                    onClick={handleCreatePermission}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Crear Permiso
                  </button>
                </div>
              </div>

              <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar" 
                style={{ maxHeight: 'calc(90vh - 200px)' }}
                role="region"
                aria-label="Lista de permisos del sistema"
                tabIndex={0}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                      <div key={group} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
                          {group}
                        </h4>
                        <div className="grid gap-3">
                          {groupPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded">
                                  <KeyIcon className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{permission.display_name}</h5>
                                  <p className="text-sm text-gray-600">{permission.description}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-gray-500">
                                      <UserGroupIcon className="w-3 h-3 inline mr-1" />
                                      {permission.roles_count || 0} roles
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono">
                                      {permission.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditPermission(permission)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  disabled={isLoading}
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(permission.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  disabled={isLoading}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Permission Form View */
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isCreating ? 'Crear Nuevo Permiso' : 'Editar Permiso'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isCreating ? 'Define un nuevo permiso con sus detalles' : 'Modifica los detalles del permiso'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Guardar Permiso
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Permission Basic Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CogIcon className="w-5 h-5" />
                    Información del Permiso
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Sistema *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Nombre del sistema es requerido' })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: users.create"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre para Mostrar *
                      </label>
                      <input
                        type="text"
                        {...register('display_name', { required: 'Nombre para mostrar es requerido' })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                          errors.display_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Crear Usuarios"
                      />
                      {errors.display_name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.display_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grupo *
                    </label>
                    <input
                      type="text"
                      {...register('group', { required: 'Grupo es requerido' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                        errors.group ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Usuarios, Roles, Visitas"
                    />
                    {errors.group && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.group.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      {...register('description', { required: 'Descripción es requerida' })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe qué hace este permiso y para qué se utiliza..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Permission Guidelines */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h5 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    Recomendaciones para Permisos
                  </h5>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Usa nombres descriptivos en formato: recurso.acción (ej: users.create)</li>
                    <li>• Agrupa permisos relacionados para facilitar la gestión</li>
                    <li>• Proporciona descripciones claras sobre el propósito del permiso</li>
                    <li>• Considera el impacto de eliminar permisos que estén en uso</li>
                  </ul>
                </div>
              </div>
            </form>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">¿Eliminar Permiso?</h3>
                    <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDeletePermission(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                    ) : (
                      'Eliminar'
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

export default PermissionManagementModal