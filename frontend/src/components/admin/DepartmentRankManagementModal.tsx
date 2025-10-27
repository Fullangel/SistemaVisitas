import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import {
  DismissRegular,
  AddRegular,
  EditRegular,
  DeleteRegular,
  CheckmarkRegular,
  WarningRegular,
  BuildingRegular,
  SettingsRegular,
  HatGraduationRegular
  // BriefcaseIcon
} from '@fluentui/react-icons'
import toast from 'react-hot-toast'

interface Department {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  users_count?: number
}

interface Rank {
  id: number
  name: string
  description: string
  department_id?: number
  department_name?: string
  created_at: string
  updated_at: string
  users_count?: number
}

interface DepartmentFormData {
  name: string
  description: string
}

interface RankFormData {
  name: string
  description: string
  department_id: number
}

interface DepartmentRankManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onDepartmentRankUpdated: () => void
}

const DepartmentRankManagementModal: React.FC<DepartmentRankManagementModalProps> = ({
  isOpen,
  onClose,
  onDepartmentRankUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [ranks, setRanks] = useState<Rank[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null)
  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false)
  const [isCreatingRank, setIsCreatingRank] = useState(false)
  const [isEditingDepartment, setIsEditingDepartment] = useState(false)
  const [isEditingRank, setIsEditingRank] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'departments' | 'ranks'>('departments')
  const [searchTerm, setSearchTerm] = useState('')

  const {
    register: registerDepartment,
    handleSubmit: handleSubmitDepartment,
    reset: resetDepartment,
    formState: { errors: departmentErrors }
  } = useForm<DepartmentFormData>()

  const {
    register: registerRank,
    handleSubmit: handleSubmitRank,
    reset: resetRank,
    formState: { errors: rankErrors }
  } = useForm<RankFormData>()

  useEffect(() => {
    if (isOpen) {
      fetchDepartmentsAndRanks()
    }
  }, [isOpen])

  const fetchDepartmentsAndRanks = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // const axios = (await import('axios')).default
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` }
      // }

      // Simular datos hardcodeados mientras se implementa el backend
      const mockDepartments: Department[] = [
        {
          id: 1,
          name: 'Recursos Humanos',
          description: 'Departamento encargado de la gestión del personal',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          users_count: 5
        },
        {
          id: 2,
          name: 'Tecnología de la Información',
          description: 'Departamento de sistemas y tecnología',
          created_at: '2024-01-16T10:00:00Z',
          updated_at: '2024-01-16T10:00:00Z',
          users_count: 8
        },
        {
          id: 3,
          name: 'Finanzas',
          description: 'Departamento de contabilidad y finanzas',
          created_at: '2024-01-17T10:00:00Z',
          updated_at: '2024-01-17T10:00:00Z',
          users_count: 4
        },
        {
          id: 4,
          name: 'Operaciones',
          description: 'Departamento de operaciones y logística',
          created_at: '2024-01-18T10:00:00Z',
          updated_at: '2024-01-18T10:00:00Z',
          users_count: 12
        }
      ]

      const mockRanks: Rank[] = [
        {
          id: 1,
          name: 'Gerente',
          description: 'Nivel gerencial con responsabilidades de dirección',
          department_id: 1,
          department_name: 'Recursos Humanos',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          users_count: 2
        },
        {
          id: 2,
          name: 'Analista Senior',
          description: 'Analista con experiencia avanzada',
          department_id: 2,
          department_name: 'Tecnología de la Información',
          created_at: '2024-01-16T10:00:00Z',
          updated_at: '2024-01-16T10:00:00Z',
          users_count: 3
        },
        {
          id: 3,
          name: 'Coordinador',
          description: 'Coordinador de equipo o área',
          department_id: 3,
          department_name: 'Finanzas',
          created_at: '2024-01-17T10:00:00Z',
          updated_at: '2024-01-17T10:00:00Z',
          users_count: 2
        },
        {
          id: 4,
          name: 'Asistente',
          description: 'Asistente administrativo',
          department_id: 1,
          department_name: 'Recursos Humanos',
          created_at: '2024-01-18T10:00:00Z',
          updated_at: '2024-01-18T10:00:00Z',
          users_count: 5
        },
        {
          id: 5,
          name: 'Técnico',
          description: 'Técnico especializado',
          department_id: 2,
          department_name: 'Tecnología de la Información',
          created_at: '2024-01-19T10:00:00Z',
          updated_at: '2024-01-19T10:00:00Z',
          users_count: 4
        }
      ]

      setDepartments(mockDepartments)
      setRanks(mockRanks)
    } catch (error) {
      console.error('Error fetching departments and ranks:', error)
      toast.error('Error al cargar departamentos y rangos')
      setDepartments([])
      setRanks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDepartment = () => {
    setSelectedDepartment(null)
    setSelectedRank(null)
    setIsCreatingDepartment(true)
    setIsCreatingRank(false)
    setIsEditingDepartment(true)
    setIsEditingRank(false)
    resetDepartment({
      name: '',
      description: ''
    })
  }

  const handleCreateRank = () => {
    setSelectedDepartment(null)
    setSelectedRank(null)
    setIsCreatingDepartment(false)
    setIsCreatingRank(true)
    setIsEditingDepartment(false)
    setIsEditingRank(true)
    resetRank({
      name: '',
      description: '',
      department_id: 0
    })
  }

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department)
    setSelectedRank(null)
    setIsCreatingDepartment(false)
    setIsCreatingRank(false)
    setIsEditingDepartment(true)
    setIsEditingRank(false)
    resetDepartment({
      name: department.name,
      description: department.description
    })
  }

  const handleEditRank = (rank: Rank) => {
    setSelectedDepartment(null)
    setSelectedRank(rank)
    setIsCreatingDepartment(false)
    setIsCreatingRank(false)
    setIsEditingDepartment(false)
    setIsEditingRank(true)
    resetRank({
      name: rank.name,
      description: rank.description,
      department_id: rank.department_id || 0
    })
  }

  const handleCloseForm = () => {
    setIsCreatingDepartment(false)
    setIsCreatingRank(false)
    setIsEditingDepartment(false)
    setIsEditingRank(false)
    setSelectedDepartment(null)
    setSelectedRank(null)
    resetDepartment({
      name: '',
      description: ''
    })
    resetRank({
      name: '',
      description: '',
      department_id: 0
    })
  }

  const onSubmitDepartment = async (data: DepartmentFormData) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // const axios = (await import('axios')).default
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` }
      // }

      if (isCreatingDepartment) {
        // Simular creación
        const newDepartment: Department = {
          id: Math.max(...departments.map(d => d.id), 0) + 1,
          name: data.name,
          description: data.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          users_count: 0
        }
        setDepartments([...departments, newDepartment])
        toast.success('Departamento creado exitosamente')
      } else if (isEditingDepartment && selectedDepartment) {
        // Simular actualización
        const updatedDepartments = departments.map(dept =>
          dept.id === selectedDepartment.id
            ? { ...dept, name: data.name, description: data.description, updated_at: new Date().toISOString() }
            : dept
        )
        setDepartments(updatedDepartments)
        toast.success('Departamento actualizado exitosamente')
      }

      handleCloseForm()
      onDepartmentRankUpdated()
    } catch (error: any) {
      console.error('Error saving department:', error)
      toast.error(error.response?.data?.message || 'Error al guardar departamento')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitRank = async (data: RankFormData) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // const axios = (await import('axios')).default
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` }
      // }

      const department = departments.find(d => d.id === data.department_id)

      if (isCreatingRank) {
        // Simular creación
        const newRank: Rank = {
          id: Math.max(...ranks.map(r => r.id), 0) + 1,
          name: data.name,
          description: data.description,
          department_id: data.department_id,
          department_name: department?.name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          users_count: 0
        }
        setRanks([...ranks, newRank])
        toast.success('Rango creado exitosamente')
      } else if (isEditingRank && selectedRank) {
        // Simular actualización
        const updatedRanks = ranks.map(rank =>
          rank.id === selectedRank.id
            ? {
                ...rank,
                name: data.name,
                description: data.description,
                department_id: data.department_id,
                department_name: department?.name || '',
                updated_at: new Date().toISOString()
              }
            : rank
        )
        setRanks(updatedRanks)
        toast.success('Rango actualizado exitosamente')
      }

      handleCloseForm()
      onDepartmentRankUpdated()
    } catch (error: any) {
      console.error('Error saving rank:', error)
      toast.error(error.response?.data?.message || 'Error al guardar rango')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number, type: 'department' | 'rank') => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('No estás autenticado')
        setIsLoading(false)
        return
      }

      // const axios = (await import('axios')).default
      // const config = {
      //   headers: { Authorization: `Bearer ${token}` }
      // }

      if (type === 'department') {
        // Simular eliminación
        setDepartments(departments.filter(dept => dept.id !== id))
        toast.success('Departamento eliminado exitosamente')
      } else {
        // Simular eliminación
        setRanks(ranks.filter(rank => rank.id !== id))
        toast.success('Rango eliminado exitosamente')
      }

      setShowDeleteConfirm(null)
      onDepartmentRankUpdated()
    } catch (error: any) {
      console.error('Error deleting:', error)
      toast.error(error.response?.data?.message || `Error al eliminar ${type}`)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRanks = ranks.filter(rank =>
    rank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rank.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rank.department_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-6xl w-full bg-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BuildingRegular className="h-6 w-6 text-indigo-600" />
              Gestión de Departamentos y Rangos
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <DismissRegular className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('departments')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'departments'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BuildingRegular className="h-4 w-4 inline mr-2" />
                Departamentos
              </button>
              <button
                onClick={() => setActiveTab('ranks')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'ranks'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HatGraduationRegular className="h-4 w-4 inline mr-2" />
                Rangos
              </button>
            </div>

            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder={`Buscar ${activeTab === 'departments' ? 'departamentos' : 'rangos'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SettingsRegular className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex space-x-2">
                {activeTab === 'departments' && (
                  <button
                    onClick={handleCreateDepartment}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <AddRegular className="h-4 w-4" />
                    Nuevo Departamento
                  </button>
                )}
                {activeTab === 'ranks' && (
                  <button
                    onClick={handleCreateRank}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <AddRegular className="h-4 w-4" />
                    Nuevo Rango
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {!isEditingDepartment && !isEditingRank && (
              <div className="space-y-4">
                {activeTab === 'departments' && (
                  <div className="grid gap-4">
                    {filteredDepartments.map((department) => (
                      <div key={department.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BuildingRegular className="h-8 w-8 text-indigo-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                              <p className="text-gray-600">{department.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {department.users_count} usuarios • Creado el {new Date(department.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditDepartment(department)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <EditRegular className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(department.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <DeleteRegular className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredDepartments.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BuildingRegular className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No se encontraron departamentos</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'ranks' && (
                  <div className="grid gap-4">
                    {filteredRanks.map((rank) => (
                      <div key={rank.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <HatGraduationRegular className="h-8 w-8 text-indigo-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{rank.name}</h3>
                              <p className="text-gray-600">{rank.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {rank.department_name && (
                                  <span className="inline-flex items-center gap-1">
                                    <BuildingRegular className="h-3 w-3" />
                                    {rank.department_name}
                                  </span>
                                )}
                                <span className="ml-2">{rank.users_count} usuarios</span>
                                <span className="ml-2">• Creado el {new Date(rank.created_at).toLocaleDateString()}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditRank(rank)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <EditRegular className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(rank.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <DeleteRegular className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredRanks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <HatGraduationRegular className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No se encontraron rangos</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Department Form */}
            {(isCreatingDepartment || isEditingDepartment) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BuildingRegular className="h-5 w-5 text-indigo-600" />
                  {isCreatingDepartment ? 'Crear Nuevo Departamento' : 'Editar Departamento'}
                </h3>
                <form onSubmit={handleSubmitDepartment(onSubmitDepartment)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Departamento
                    </label>
                    <input
                      {...registerDepartment('name', { required: 'El nombre es requerido' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingrese el nombre del departamento"
                    />
                    {departmentErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{departmentErrors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      {...registerDepartment('description', { required: 'La descripción es requerida' })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingrese la descripción del departamento"
                    />
                    {departmentErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{departmentErrors.description.message}</p>
                    )}
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      <CheckmarkRegular className="h-4 w-4" />
                      {isCreatingDepartment ? 'Crear Departamento' : 'Actualizar Departamento'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      disabled={isLoading}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Rank Form */}
            {(isCreatingRank || isEditingRank) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <HatGraduationRegular className="h-5 w-5 text-indigo-600" />
                  {isCreatingRank ? 'Crear Nuevo Rango' : 'Editar Rango'}
                </h3>
                <form onSubmit={handleSubmitRank(onSubmitRank)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Rango
                    </label>
                    <input
                      {...registerRank('name', { required: 'El nombre es requerido' })}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingrese el nombre del rango"
                    />
                    {rankErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{rankErrors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      {...registerRank('description', { required: 'La descripción es requerida' })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingrese la descripción del rango"
                    />
                    {rankErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{rankErrors.description.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento (Opcional)
                    </label>
                    <select
                      {...registerRank('department_id')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={0}>Sin departamento asignado</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      <CheckmarkRegular className="h-4 w-4" />
                      {isCreatingRank ? 'Crear Rango' : 'Actualizar Rango'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      disabled={isLoading}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <WarningRegular className="h-8 w-8 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Confirmar Eliminación</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  ¿Está seguro de que desea eliminar este {activeTab === 'departments' ? 'departamento' : 'rango'}?
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDelete(showDeleteConfirm, activeTab === 'departments' ? 'department' : 'rank')}
                    disabled={isLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={isLoading}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                  >
                    Cancelar
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

export default DepartmentRankManagementModal