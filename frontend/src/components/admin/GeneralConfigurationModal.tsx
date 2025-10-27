import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import {
  SettingsRegular,
  DismissRegular,
  SaveRegular,
  ShieldRegular,
  ClockRegular,
  AlertRegular,
  CheckmarkCircleRegular,
  WarningRegular,
  BuildingRegular,
  GlobeRegular,
  MailRegular,
  PhoneRegular,
  KeyRegular,
  CloudRegular
} from '@fluentui/react-icons'
import toast from 'react-hot-toast'

interface ConfigurationFormData {
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  system_timezone: string
  session_timeout: number
  max_login_attempts: number
  lockout_duration: number
  password_min_length: number
  require_special_chars: boolean
  require_numbers: boolean
  require_uppercase: boolean
  enable_two_factor: boolean
  enable_session_logging: boolean
  enable_audit_trail: boolean
  auto_backup_enabled: boolean
  backup_frequency: string
  backup_retention_days: number
  maintenance_mode: boolean
  allow_user_registration: boolean
  require_email_verification: boolean
  default_user_role: string
  enable_api: boolean
  api_rate_limit: number
  file_upload_max_size: number
  allowed_file_types: string
  enable_notifications: boolean
  notification_email: string
  security_level: 'low' | 'medium' | 'high'
}

interface GeneralConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfigurationUpdated: () => void
}

const GeneralConfigurationModal: React.FC<GeneralConfigurationModalProps> = ({
  isOpen,
  onClose,
  onConfigurationUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'system' | 'backup'>('general')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm<ConfigurationFormData>({
    defaultValues: {
      site_name: 'Sistema de Visitas Nacional',
      site_description: 'Sistema integral de gestión de visitas para entidades ministeriales',
      contact_email: 'admin@sistema.gov.ve',
      contact_phone: '+58 212-555-0123',
      system_timezone: 'America/Caracas',
      session_timeout: 30,
      max_login_attempts: 5,
      lockout_duration: 30,
      password_min_length: 8,
      require_special_chars: true,
      require_numbers: true,
      require_uppercase: true,
      enable_two_factor: false,
      enable_session_logging: true,
      enable_audit_trail: true,
      auto_backup_enabled: true,
      backup_frequency: 'daily',
      backup_retention_days: 30,
      maintenance_mode: false,
      allow_user_registration: false,
      require_email_verification: true,
      default_user_role: 'empleado',
      enable_api: true,
      api_rate_limit: 1000,
      file_upload_max_size: 10,
      allowed_file_types: 'pdf,jpg,png,doc,docx',
      enable_notifications: true,
      notification_email: 'notifications@sistema.gov.ve',
      security_level: 'medium'
    }
  })

  useEffect(() => {
    if (isOpen) {
      fetchCurrentConfiguration()
    }
  }, [isOpen])

  const fetchCurrentConfiguration = async () => {
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

      // Intentar obtener configuración actual del backend
      try {
        const response = await axios.get('/api/admin/configuration', config)
        if (response.data && response.data.data) {
          reset(response.data.data)
        }
      } catch (error) {
        // Si no existe endpoint, usar valores por defecto
        console.log('Usando configuración por defecto')
      }
    } catch (error) {
      console.error('Error fetching configuration:', error)
      toast.error('Error al cargar configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ConfigurationFormData) => {
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

      // Enviar configuración al backend
      await axios.post('/api/admin/configuration', data, config)
      toast.success('Configuración guardada exitosamente')
      onConfigurationUpdated()
      onClose()
    } catch (error: any) {
      console.error('Error saving configuration:', error)
      toast.error(error.response?.data?.message || 'Error al guardar configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsRegular },
    { id: 'security', name: 'Seguridad', icon: ShieldRegular },
    { id: 'system', name: 'Sistema', icon: GlobeRegular },
    { id: 'backup', name: 'Respaldo', icon: CloudRegular }
  ]

  const timezones = [
    'America/Caracas',
    'America/Bogota',
    'America/Lima',
    'America/Mexico_City',
    'America/New_York',
    'UTC'
  ]

  const backupFrequencies = [
    { value: 'hourly', label: 'Cada hora' },
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' }
  ]

  const securityLevels = [
    { value: 'low', label: 'Bajo', icon: CheckmarkCircleRegular, color: 'text-green-600' },
    { value: 'medium', label: 'Medio', icon: WarningRegular, color: 'text-yellow-600' },
    { value: 'high', label: 'Alto', icon: AlertRegular, color: 'text-red-600' }
  ]

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <SettingsRegular className="h-6 w-6 text-blue-600" />
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Configuración General del Sistema
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <DismissRegular className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <BuildingRegular className="h-4 w-4 inline mr-1" />
                        Nombre del Sitio
                      </label>
                      <input
                        {...register('site_name', { required: 'El nombre del sitio es requerido' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Sistema de Visitas Nacional"
                      />
                      {errors.site_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.site_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MailRegular className="h-4 w-4 inline mr-1" />
                        Email de Contacto
                      </label>
                      <input
                        type="email"
                        {...register('contact_email', { 
                          required: 'El email es requerido',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email inválido'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="admin@ejemplo.com"
                      />
                      {errors.contact_email && (
                        <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción del Sitio
                    </label>
                      <textarea
                      {...register('site_description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Descripción breve del sistema"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <PhoneRegular className="h-4 w-4 inline mr-1" />
                        Teléfono de Contacto
                      </label>
                      <input
                        {...register('contact_phone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="+58 212-555-0123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <ClockRegular className="h-4 w-4 inline mr-1" />
                        Zona Horaria
                      </label>
                      <select
                        {...register('system_timezone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <WarningRegular className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Configuración de Seguridad
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Estas configuraciones afectan la seguridad del sistema. Use con precaución.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tiempo de Sesión (minutos)
                      </label>
                      <input
                        type="number"
                        {...register('session_timeout', { min: 5, max: 480 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Intentos Máximos de Login
                      </label>
                      <input
                        type="number"
                        {...register('max_login_attempts', { min: 1, max: 10 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duración de Bloqueo (minutos)
                      </label>
                      <input
                        type="number"
                        {...register('lockout_duration', { min: 5, max: 1440 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Longitud Mínima de Contraseña
                      </label>
                      <input
                        type="number"
                        {...register('password_min_length', { min: 4, max: 32 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Requerir Caracteres Especiales</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Las contraseñas deben incluir caracteres especiales</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('require_special_chars')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Requerir Números</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Las contraseñas deben incluir números</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('require_numbers')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Requerir Mayúsculas</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Las contraseñas deben incluir mayúsculas</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('require_uppercase')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Autenticación de Dos Factores</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Requerir 2FA para todos los usuarios</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('enable_two_factor')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Registro de Usuarios
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('allow_user_registration')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          Permitir registro de nuevos usuarios
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verificación de Email
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('require_email_verification')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          Requerir verificación de email
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rol por Defecto
                      </label>
                      <select
                        {...register('default_user_role')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="empleado">Empleado</option>
                        <option value="recepcion">Recepción</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Límite de API (requests/minuto)
                      </label>
                      <input
                        type="number"
                        {...register('api_rate_limit', { min: 100, max: 10000 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tamaño Máximo de Archivos (MB)
                      </label>
                      <input
                        type="number"
                        {...register('file_upload_max_size', { min: 1, max: 100 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipos de Archivo Permitidos
                      </label>
                      <input
                        {...register('allowed_file_types')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="pdf,jpg,png,doc,docx"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Modo de Mantenimiento</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Activar modo de mantenimiento del sistema</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('maintenance_mode')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Auto-respaldo</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Habilitar respaldo automático del sistema</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('auto_backup_enabled')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {watchedValues.auto_backup_enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Frecuencia de Respaldo
                        </label>
                        <select
                          {...register('backup_frequency')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          {backupFrequencies.map((freq) => (
                            <option key={freq.value} value={freq.value}>{freq.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Días de Retención
                        </label>
                        <input
                          type="number"
                          {...register('backup_retention_days', { min: 1, max: 365 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isDirty && <span className="text-blue-600">• Hay cambios sin guardar</span>}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <SaveRegular className="h-4 w-4" />
                      <span>Guardar Configuración</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default GeneralConfigurationModal