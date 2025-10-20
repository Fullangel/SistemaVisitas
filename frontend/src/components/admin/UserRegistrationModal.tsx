import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import {
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  KeyIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import toast from 'react-hot-toast'

interface UserRegistrationForm {
  first_name: string
  last_name: string
  second_name?: string
  second_last_name?: string
  email: string
  username: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
  identification: string
  birth_date: string
  department_id: number
  headquarters_id: number
  role_id: number
  status: 'active' | 'inactive'
}

interface Department {
  id: number
  name: string
}

interface Headquarter {
  id: number
  name: string
  address: string
}

interface Role {
  id: number
  name: string
  display_name: string
}

interface UserRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: () => void
}

const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  isOpen,
  onClose,
  onUserCreated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [headquarters, setHeadquarters] = useState<Headquarter[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<UserRegistrationForm>({
    defaultValues: {
      status: 'active',
      role_id: 2 // Default to user role
    }
  })

  const password = watch('password')

  useEffect(() => {
    if (isOpen) {
      fetchFormData()
    }
  }, [isOpen])

  const fetchFormData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [departmentsRes, headquartersRes, rolesRes] = await Promise.all([
        axios.get('/api/admin/departments', { headers }),
        axios.get('/api/admin/headquarters', { headers }),
        axios.get('/api/roles', { headers })
      ])

      setDepartments(departmentsRes.data.data || departmentsRes.data)
      setHeadquarters(headquartersRes.data.data || headquartersRes.data)
      setRoles(rolesRes.data.data || rolesRes.data)
    } catch (error) {
      console.error('Error fetching form data:', error)
      toast.error('Error al cargar datos del formulario')
    }
  }

  const onSubmit = async (data: UserRegistrationForm) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      await axios.post(
        '/api/admin/users',
        {
          ...data,
          second_name: data.second_name || null,
          second_last_name: data.second_last_name || null,
          phone: data.phone || null,
          address: data.address || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      toast.success('Usuario creado exitosamente')
      reset()
      onUserCreated()
      onClose()
    } catch (error: any) {
      console.error('Error creating user:', error)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(field => {
          toast.error(`${field}: ${errors[field][0]}`)
        })
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error al crear usuario')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <UserPlusIcon className="w-6 h-6 text-primary-600" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Crear Nuevo Usuario
              </Dialog.Title>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information Section */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primer Nombre *
                    </label>
                    <input
                      type="text"
                      {...register('first_name', { required: 'Primer nombre es requerido' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.first_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese primer nombre"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Segundo Nombre
                    </label>
                    <input
                      type="text"
                      {...register('second_name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ingrese segundo nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primer Apellido *
                    </label>
                    <input
                      type="text"
                      {...register('last_name', { required: 'Primer apellido es requerido' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.last_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ingrese primer apellido"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Segundo Apellido
                    </label>
                    <input
                      type="text"
                      {...register('second_last_name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ingrese segundo apellido"
                    />
                  </div>
                </div>
              </div>

              {/* Identification Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula *
                </label>
                <input
                  type="text"
                  {...register('identification', { required: 'Cédula es requerida' })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.identification ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese número de cédula"
                />
                {errors.identification && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.identification.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  {...register('birth_date', { required: 'Fecha de nacimiento es requerida' })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.birth_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.birth_date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {errors.birth_date.message}
                  </p>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <EnvelopeIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Correo electrónico es requerido',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Correo electrónico inválido'
                        }
                      })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="usuario@empresa.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <PhoneIcon className="w-4 h-4 mr-1" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1 234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      Dirección
                    </label>
                    <input
                      type="text"
                      {...register('address')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ingrese dirección"
                    />
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <KeyIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Información de Cuenta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de Usuario *
                    </label>
                    <input
                      type="text"
                      {...register('username', { required: 'Nombre de usuario es requerido' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.username ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="nombre_usuario"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Contraseña es requerida',
                          minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres'
                          }
                        })}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <KeyIcon className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        {...register('password_confirmation', {
                          required: 'Confirme la contraseña',
                          validate: value => value === password || 'Las contraseñas no coinciden'
                        })}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <KeyIcon className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol *
                    </label>
                    <select
                      {...register('role_id', { required: 'Rol es requerido' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.role_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.display_name || role.name}
                        </option>
                      ))}
                    </select>
                    {errors.role_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.role_id.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organizational Information Section */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Información Organizacional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento *
                    </label>
                    <select
                      {...register('department_id', { required: 'Departamento es requerido' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.department_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione un departamento</option>
                      {departments.map(department => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                    {errors.department_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.department_id.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sede *
                    </label>
                    <select
                      {...register('headquarters_id', { required: 'Sede es requerida' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.headquarters_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione una sede</option>
                      {headquarters.map(headquarter => (
                        <option key={headquarter.id} value={headquarter.id}>
                          {headquarter.name}
                        </option>
                      ))}
                    </select>
                    {errors.headquarters_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.headquarters_id.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMarkIcon className="inline w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="inline w-4 h-4 mr-2" />
                    Crear Usuario
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default UserRegistrationModal