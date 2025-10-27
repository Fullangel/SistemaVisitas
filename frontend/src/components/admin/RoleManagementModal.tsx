import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import {
  ShieldCheckmarkRegular,
  DismissRegular,
  AddRegular,
  EditRegular,
  DeleteRegular,
  CheckmarkRegular,
  WarningRegular,
  KeyRegular,
  PeopleCommunityRegular,
  SettingsRegular
} from '@fluentui/react-icons'
import toast from 'react-hot-toast'

interface Role {
  id: number
  name: string
  description: string
  permissions: string[] // Backend devuelve array de strings
  created_at: string
  updated_at: string
  users_count?: number
}

interface Permission {
  id: number
  name: string
  display_name: string
  description: string
  group: string
  checked?: boolean
}

interface RoleFormData {
  name: string
  description: string
  permissions: string[] // Backend usa array de strings
}

interface RoleManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onRoleUpdated: () => void
}

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
  isOpen,
  onClose,
  onRoleUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<string[]>([])
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RoleFormData>()

  const watchedPermissions = watch('permissions', [])

  useEffect(() => {
    if (isOpen) {
      fetchRolesAndPermissions()
    }
  }, [isOpen])

  const fetchRolesAndPermissions = async () => {
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

      // Fetch roles only - permissions will be handled differently
      const rolesResponse = await axios.get('/api/admin/roles', config)
      setRoles(rolesResponse.data.data || [])

      // Usar permisos hardcodeados ya que el backend no tiene endpoint de permisos
      const hardcodedPermissions: Permission[] = [
        { id: 1, name: 'users.create', display_name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios', group: 'Usuarios' },
        { id: 2, name: 'users.read', display_name: 'Ver Usuarios', description: 'Permite ver información de usuarios', group: 'Usuarios' },
        { id: 3, name: 'users.update', display_name: 'Editar Usuarios', description: 'Permite actualizar información de usuarios', group: 'Usuarios' },
        { id: 4, name: 'users.delete', display_name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios', group: 'Usuarios' },
        { id: 5, name: 'roles.create', display_name: 'Crear Roles', description: 'Permite crear nuevos roles', group: 'Roles' },
        { id: 6, name: 'roles.read', display_name: 'Ver Roles', description: 'Permite ver información de roles', group: 'Roles' },
        { id: 7, name: 'roles.update', display_name: 'Editar Roles', description: 'Permite actualizar roles', group: 'Roles' },
        { id: 8, name: 'roles.delete', display_name: 'Eliminar Roles', description: 'Permite eliminar roles', group: 'Roles' },
        { id: 9, name: 'visits.create', display_name: 'Crear Visitas', description: 'Permite crear nuevas visitas', group: 'Visitas' },
        { id: 10, name: 'visits.read', display_name: 'Ver Visitas', description: 'Permite ver información de visitas', group: 'Visitas' },
        { id: 11, name: 'visits.update', display_name: 'Editar Visitas', description: 'Permite actualizar visitas', group: 'Visitas' },
        { id: 12, name: 'visits.delete', display_name: 'Eliminar Visitas', description: 'Permite eliminar visitas', group: 'Visitas' },
        { id: 13, name: 'employees.create', display_name: 'Crear Empleados', description: 'Permite crear nuevos empleados', group: 'Empleados' },
        { id: 14, name: 'employees.read', display_name: 'Ver Empleados', description: 'Permite ver información de empleados', group: 'Empleados' },
        { id: 15, name: 'employees.update', display_name: 'Editar Empleados', description: 'Permite actualizar información de empleados', group: 'Empleados' },
        { id: 16, name: 'employees.delete', display_name: 'Eliminar Empleados', description: 'Permite eliminar empleados', group: 'Empleados' },
        { id: 17, name: 'departments.create', display_name: 'Crear Departamentos', description: 'Permite crear nuevos departamentos', group: 'Departamentos' },
        { id: 18, name: 'departments.read', display_name: 'Ver Departamentos', description: 'Permite ver información de departamentos', group: 'Departamentos' },
        { id: 19, name: 'departments.update', display_name: 'Editar Departamentos', description: 'Permite actualizar departamentos', group: 'Departamentos' },
        { id: 20, name: 'departments.delete', display_name: 'Eliminar Departamentos', description: 'Permite eliminar departamentos', group: 'Departamentos' },
        { id: 21, name: 'headquarters.create', display_name: 'Crear Sedes', description: 'Permite crear nuevas sedes', group: 'Sedes' },
        { id: 22, name: 'headquarters.read', display_name: 'Ver Sedes', description: 'Permite ver información de sedes', group: 'Sedes' },
        { id: 23, name: 'headquarters.update', display_name: 'Editar Sedes', description: 'Permite actualizar sedes', group: 'Sedes' },
        { id: 24, name: 'headquarters.delete', display_name: 'Eliminar Sedes', description: 'Permite eliminar sedes', group: 'Sedes' },
        { id: 25, name: 'reports.read', display_name: 'Ver Reportes', description: 'Permite ver reportes', group: 'Reportes' },
        { id: 26, name: 'reports.export', display_name: 'Exportar Reportes', description: 'Permite exportar reportes', group: 'Reportes' },
        { id: 27, name: 'settings.read', display_name: 'Ver Configuración', description: 'Permite ver configuración del sistema', group: 'Configuración' },
        { id: 28, name: 'settings.update', display_name: 'Editar Configuración', description: 'Permite actualizar configuración del sistema', group: 'Configuración' }
      ]
      setAvailablePermissions(hardcodedPermissions)
    } catch (error) {
      console.error('Error fetching roles and permissions:', error)
      toast.error('Error al cargar roles y permisos')
      setRoles([])
      setPermissions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRole = () => {
    setSelectedRole(null)
    setIsCreating(true)
    setIsEditing(true)
    reset({
      name: '',
      description: '',
      permissions: []
    })
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setIsCreating(false)
    setIsEditing(true)
    reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions // Ya es un array de strings
      })
  }

  const handleCloseForm = () => {
    setIsCreating(false)
    setIsEditing(false)
    setSelectedRole(null)
    reset({
      name: '',
      description: '',
      permissions: []
    })
  }

  const onSubmit = async (data: RoleFormData) => {
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
        await axios.post('/api/admin/roles', data, config)
        toast.success('Rol creado exitosamente')
      } else if (isEditing && selectedRole) {
        await axios.put(`/api/admin/roles/${selectedRole.id}`, data, config)
        toast.success('Rol actualizado exitosamente')
      }

      await fetchRolesAndPermissions()
      handleCloseForm()
      onRoleUpdated()
    } catch (error: any) {
      console.error('Error saving role:', error)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(field => {
          toast.error(`${field}: ${errors[field][0]}`)
        })
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al guardar el rol')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: number) => {
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

      await axios.delete(`/api/admin/roles/${roleId}`, config)

      toast.success('Rol eliminado exitosamente')
      await fetchRolesAndPermissions()
      setShowDeleteConfirm(null)
      onRoleUpdated()
    } catch (error: any) {
      console.error('Error deleting role:', error)
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al eliminar el rol')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePermission = (permissionName: string) => {
    const currentPermissions = watchedPermissions
    const newPermissions = currentPermissions.includes(permissionName)
      ? currentPermissions.filter(name => name !== permissionName)
      : [...currentPermissions, permissionName]
    
    setValue('permissions', newPermissions)
  }

  const groupedPermissions = availablePermissions.reduce((groups, permission) => {
    const group = permission.group || 'General'
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(permission)
    return groups
  }, {} as Record<string, Permission[]>)

  const handleClose = () => {
    onClose()
    handleCloseForm()
    setShowDeleteConfirm(null)
  }

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
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <ShieldCheckmarkRegular className="w-6 h-6 text-white" />
              </div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Gestión de Roles y Permisos
              </Dialog.Title>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <DismissRegular className="w-5 h-5" />
            </button>
          </div>

          {!isCreating && !isEditing ? (
            /* Role List View */
            <div className="flex flex-col h-full">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Roles del Sistema</h3>
                    <p className="text-sm text-gray-600">Administra los roles y sus permisos</p>
                  </div>
                  <button
                    onClick={handleCreateRole}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    <AddRegular className="w-4 h-4" />
                    Crear Rol
                  </button>
                </div>
              </div>

              <div 
                className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar" 
                style={{ maxHeight: 'calc(90vh - 200px)' }}
                role="region"
                aria-label="Lista de roles del sistema"
                tabIndex={0}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {roles.map((role) => (
                      <div key={role.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                              <PeopleCommunityRegular className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{role.name}</h4>
                              <p className="text-sm text-gray-600">{role.description}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-500">
                                  <KeyRegular className="w-3 h-3 inline mr-1" />
                                  {role.permissions.length} permisos
                                </span>
                                <span className="text-xs text-gray-500">
                                  <PeopleCommunityRegular className="w-3 h-3 inline mr-1" />
                                  {role.users_count || 0} usuarios
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {role.permissions.slice(0, 3).map((permissionName) => (
                                  <span key={permissionName} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {permissionName}
                                  </span>
                                ))}
                                {role.permissions.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{role.permissions.length - 3} más
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditRole(role)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              disabled={isLoading}
                            >
                              <EditRegular className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(role.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              disabled={isLoading}
                            >
                              <DeleteRegular className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Role Form View */
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isCreating ? 'Crear Nuevo Rol' : 'Editar Rol'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isCreating ? 'Define un nuevo rol con sus permisos' : 'Modifica los permisos y detalles del rol'}
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
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckmarkRegular className="w-4 h-4" />
                          Guardar Rol
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Role Basic Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <SettingsRegular className="w-5 h-5" />
                    Información del Rol
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Rol *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Nombre del rol es requerido' })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Administrador del Sistema"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <WarningRegular className="w-4 h-4 mr-1" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      {...register('description', { required: 'Descripción es requerida' })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe las funciones y responsabilidades de este rol..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <WarningRegular className="w-4 h-4 mr-1" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <KeyRegular className="w-5 h-5" />
                    Permisos del Sistema
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                      <div key={group} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 capitalize">{group.toLowerCase()}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {groupPermissions.map((permission) => (
                            <label key={permission.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={watchedPermissions.includes(permission.name)}
                                onChange={() => togglePermission(permission.name)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">{permission.display_name}</span>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                    <WarningRegular className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">¿Eliminar Rol?</h3>
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
                    onClick={() => handleDeleteRole(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Eliminando...' : 'Eliminar'}
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

export default RoleManagementModal