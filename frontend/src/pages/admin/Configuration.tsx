import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Settings,
    Shield,
    Globe,
    Cloud,
    Save,
    Building,
    Mail,
    Phone,
    Clock,
    AlertTriangle,
    CheckCircle,
    Key
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"

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

export default function ConfigurationPage() {
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
            site_description: 'Sistema integral de gestión de visitas',
            contact_email: 'admin@sistema.com',
            contact_phone: '+34 900 000 000',
            system_timezone: 'Europe/Madrid',
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
            default_user_role: 'employee',
            enable_api: true,
            api_rate_limit: 1000,
            file_upload_max_size: 10,
            allowed_file_types: 'pdf,jpg,png,doc,docx',
            enable_notifications: true,
            notification_email: 'notifications@sistema.com',
            security_level: 'medium'
        }
    })

    const watchedValues = watch()

    const timezones = [
        'Europe/Madrid',
        'America/New_York',
        'America/Mexico_City',
        'America/Bogota',
        'America/Lima',
        'UTC'
    ]

    const backupFrequencies = [
        { value: 'hourly', label: 'Cada hora' },
        { value: 'daily', label: 'Diario' },
        { value: 'weekly', label: 'Semanal' },
        { value: 'monthly', label: 'Mensual' }
    ]

    const onSubmit = async (data: ConfigurationFormData) => {
        setIsLoading(true)
        try {
            // Simular guardado
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.success('✅ Configuración guardada exitosamente')
            console.log('Configuration saved:', data)
        } catch (error) {
            toast.error('Error al guardar configuración')
        } finally {
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'general', name: 'General', icon: Settings },
        { id: 'security', name: 'Seguridad', icon: Shield },
        { id: 'system', name: 'Sistema', icon: Globe },
        { id: 'backup', name: 'Respaldo', icon: Cloud }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            >
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Settings className="h-6 w-6 text-white" />
                                </div>
                                Configuración General
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Administra la configuración del sistema
                            </p>
                        </div>
                        {isDirty && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Hay cambios sin guardar
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                    >
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{tab.name}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                            {/* General Tab */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Building className="h-4 w-4 inline mr-1" />
                                                Nombre del Sistema
                                            </label>
                                            <Input
                                                {...register('site_name', { required: true })}
                                                className="border-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Mail className="h-4 w-4 inline mr-1" />
                                                Email de Contacto
                                            </label>
                                            <Input
                                                type="email"
                                                {...register('contact_email', { required: true })}
                                                className="border-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Descripción del Sistema
                                        </label>
                                        <textarea
                                            {...register('site_description')}
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Phone className="h-4 w-4 inline mr-1" />
                                                Teléfono de Contacto
                                            </label>
                                            <Input
                                                {...register('contact_phone')}
                                                className="border-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                <Clock className="h-4 w-4 inline mr-1" />
                                                Zona Horaria
                                            </label>
                                            <select
                                                {...register('system_timezone')}
                                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {timezones.map(tz => (
                                                    <option key={tz} value={tz}>{tz}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Configuración de Seguridad - Use con precaución
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tiempo de Sesión (minutos)
                                            </label>
                                            <Input
                                                type="number"
                                                {...register('session_timeout', { min: 5, max: 480 })}
                                                className="border-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Intentos Máximos de Login
                                            </label>
                                            <Input
                                                type="number"
                                                {...register('max_login_attempts', { min: 1, max: 10 })}
                                                className="border-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Duración de Bloqueo (minutos)
                                            </label>
                                            <Input
                                                type="number"
                                                {...register('lockout_duration', { min: 5, max: 1440 })}
                                                className="border-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Longitud Mínima de Contraseña
                                            </label>
                                            <Input
                                                type="number"
                                                {...register('password_min_length', { min: 4, max: 32 })}
                                                className="border-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { name: 'require_special_chars', label: 'Requerir Caracteres Especiales', desc: 'Las contraseñas deben incluir caracteres especiales' },
                                            { name: 'require_numbers', label: 'Requerir Números', desc: 'Las contraseñas deben incluir números' },
                                            { name: 'require_uppercase', label: 'Requerir Mayúsculas', desc: 'Las contraseñas deben incluir mayúsculas' },
                                            { name: 'enable_two_factor', label: 'Autenticación de Dos Factores', desc: 'Requerir 2FA para todos los usuarios' }
                                        ].map((item) => (
                                            <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register(item.name as any)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* System Tab */}
                            {activeTab === 'system' && (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Rol por Defecto
                                            </label>
                                            <select
                                                {...register('default_user_role')}
                                                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="employee">Empleado</option>
                                                <option value="recepcion">Recepción</option>
                                                <option value="supervisor">Supervisor</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Límite de API (requests/minuto)
                                            </label>
                                            <Input
                                                type="number"
                                                {...register('api_rate_limit', { min: 100, max: 10000 })}
                                                className="border-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tamaño Máximo de Archivos (MB)
                                            </label>
                                            <Input
                                                type="number"
                                                {...register('file_upload_max_size', { min: 1, max: 100 })}
                                                className="border-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tipos de Archivo Permitidos
                                            </label>
                                            <Input
                                                {...register('allowed_file_types')}
                                                placeholder="pdf,jpg,png,doc,docx"
                                                className="border-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { name: 'allow_user_registration', label: 'Registro de Usuarios', desc: 'Permitir registro de nuevos usuarios' },
                                            { name: 'require_email_verification', label: 'Verificación de Email', desc: 'Requerir verificación de email' },
                                            { name: 'maintenance_mode', label: 'Modo de Mantenimiento', desc: 'Activar modo de mantenimiento del sistema' }
                                        ].map((item) => (
                                            <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        {...register(item.name as any)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Backup Tab */}
                            {activeTab === 'backup' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
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
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Frecuencia de Respaldo
                                                </label>
                                                <select
                                                    {...register('backup_frequency')}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    {backupFrequencies.map(freq => (
                                                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Días de Retención
                                                </label>
                                                <Input
                                                    type="number"
                                                    {...register('backup_retention_days', { min: 1, max: 365 })}
                                                    className="border-2"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer with Save Button */}
                            <div className="flex items-center justify-between pt-6 mt-6 border-t-2 border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {isDirty && (
                                        <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                            <AlertTriangle className="h-4 w-4" />
                                            Hay cambios sin guardar
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5 mr-2" />
                                            Guardar Configuración
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
