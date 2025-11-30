import { useState } from "react"
import { motion } from "framer-motion"
import {
    Settings, Shield, Eye, Database, Zap, FileText, Bell, Lock,
    Activity, HardDrive, Network, Code, AlertTriangle, Save, Server,
    Cpu, MemoryStick, Wifi, Terminal, Bug, Fingerprint, UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"

type TabType = 'privacy' | 'audit' | 'email' | 'database' | 'performance' | 'logging' | 'advanced'

interface AdvancedConfigData {
    // Privacy
    data_retention_days: number
    anonymize_old_data: boolean
    gdpr_compliance: boolean
    cookie_consent: boolean
    track_user_activity: boolean
    share_analytics: boolean

    // Audit
    enable_audit_log: boolean
    audit_retention_days: number
    log_login_attempts: boolean
    log_data_changes: boolean
    log_api_calls: boolean
    alert_suspicious_activity: boolean

    // Email/Notifications
    smtp_host: string
    smtp_port: number
    smtp_user: string
    smtp_encryption: string
    email_from_address: string
    email_from_name: string
    enable_email_queue: boolean
    max_emails_per_hour: number

    // Database
    db_connection_pool_size: number
    db_query_timeout: number
    enable_query_cache: boolean
    cache_ttl: number
    auto_vacuum: boolean
    enable_replication: boolean

    // Performance
    enable_caching: boolean
    cache_driver: string
    session_driver: string
    queue_driver: string
    enable_compression: boolean
    minify_assets: boolean
    lazy_loading: boolean
    cdn_enabled: boolean

    // Logging
    log_level: string
    log_channel: string
    max_log_files: number
    log_rotation_days: number
    enable_error_tracking: boolean
    enable_performance_monitoring: boolean

    // Advanced
    debug_mode: boolean
    developer_mode: boolean
    allow_cors: boolean
    cors_origins: string
    rate_limit_enabled: boolean
    max_requests_per_minute: number
    enable_webhooks: boolean
    webhook_secret: string
}

export default function AdvancedConfigurationPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('privacy')

    const { register, handleSubmit, watch, formState: { isDirty } } = useForm<AdvancedConfigData>({
        defaultValues: {
            data_retention_days: 365,
            anonymize_old_data: true,
            gdpr_compliance: true,
            cookie_consent: true,
            track_user_activity: true,
            share_analytics: false,
            enable_audit_log: true,
            audit_retention_days: 90,
            log_login_attempts: true,
            log_data_changes: true,
            log_api_calls: false,
            alert_suspicious_activity: true,
            smtp_host: 'smtp.gmail.com',
            smtp_port: 587,
            smtp_user: 'noreply@sistema.com',
            smtp_encryption: 'tls',
            email_from_address: 'noreply@sistema.com',
            email_from_name: 'Sistema de Visitas',
            enable_email_queue: true,
            max_emails_per_hour: 100,
            db_connection_pool_size: 10,
            db_query_timeout: 30,
            enable_query_cache: true,
            cache_ttl: 3600,
            auto_vacuum: true,
            enable_replication: false,
            enable_caching: true,
            cache_driver: 'redis',
            session_driver: 'redis',
            queue_driver: 'redis',
            enable_compression: true,
            minify_assets: true,
            lazy_loading: true,
            cdn_enabled: false,
            log_level: 'info',
            log_channel: 'daily',
            max_log_files: 14,
            log_rotation_days: 7,
            enable_error_tracking: true,
            enable_performance_monitoring: true,
            debug_mode: false,
            developer_mode: false,
            allow_cors: false,
            cors_origins: '*',
            rate_limit_enabled: true,
            max_requests_per_minute: 60,
            enable_webhooks: false,
            webhook_secret: ''
        }
    })

    const watchedValues = watch()

    const onSubmit = async (data: AdvancedConfigData) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.success('✅ Configuración avanzada guardada')
            console.log('Advanced config saved:', data)
        } catch (error) {
            toast.error('Error al guardar configuración')
        } finally {
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'privacy', name: 'Privacidad', icon: Eye, color: 'purple' },
        { id: 'audit', name: 'Auditoría', icon: Shield, color: 'blue' },
        { id: 'email', name: 'Email/Notif.', icon: Bell, color: 'green' },
        { id: 'database', name: 'Base de Datos', icon: Database, color: 'cyan' },
        { id: 'performance', name: 'Rendimiento', icon: Zap, color: 'yellow' },
        { id: 'logging', name: 'Registros', icon: FileText, color: 'orange' },
        { id: 'advanced', name: 'Avanzado', icon: Terminal, color: 'red' }
    ]

    const ToggleSwitch = ({ name, label, desc }: any) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" {...register(name)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            >
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <Settings className="h-6 w-6 text-white" />
                                </div>
                                Configuración Avanzada
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Control profundo del sistema - Solo para administradores
                            </p>
                        </div>
                        {isDirty && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Cambios sin guardar
                            </Badge>
                        )}
                    </div>
                </div>
            </motion.header>

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                    >
                        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`flex flex-col items-center justify-center gap-2 px-4 py-4 font-medium transition-all ${activeTab === tab.id
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="text-xs">{tab.name}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-5 w-5 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                                                Configuración de Privacidad y Protección de Datos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Retención de Datos (días)
                                            </label>
                                            <Input type="number" {...register('data_retention_days', { min: 30, max: 3650 })} className="border-2" />
                                            <p className="text-xs text-gray-500 mt-1">Tiempo que se mantienen los datos antes de ser archivados</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleSwitch name="anonymize_old_data" label="Anonimizar Datos Antiguos" desc="Anonimizar automáticamente datos después del período de retención" />
                                        <ToggleSwitch name="gdpr_compliance" label="Cumplimiento GDPR" desc="Habilitar funciones de cumplimiento con GDPR/RGPD" />
                                        <ToggleSwitch name="cookie_consent" label="Consentimiento de Cookies" desc="Requerir consentimiento explícito para cookies" />
                                        <ToggleSwitch name="track_user_activity" label="Rastrear Actividad de Usuarios" desc="Registrar acciones de usuarios para análisis" />
                                        <ToggleSwitch name="share_analytics" label="Compartir Analíticas" desc="Compartir datos analíticos anónimos para mejoras" />
                                    </div>
                                </div>
                            )}

                            {/* Audit Tab */}
                            {activeTab === 'audit' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                Sistema de Auditoría y Trazabilidad
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Retención de Auditoría (días)
                                            </label>
                                            <Input type="number" {...register('audit_retention_days', { min: 30, max: 730 })} className="border-2" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleSwitch name="enable_audit_log" label="Habilitar Registro de Auditoría" desc="Registrar todas las acciones críticas del sistema" />
                                        <ToggleSwitch name="log_login_attempts" label="Registrar Intentos de Login" desc="Guardar todos los intentos de inicio de sesión" />
                                        <ToggleSwitch name="log_data_changes" label="Registrar Cambios de Datos" desc="Rastrear todas las modificaciones de datos" />
                                        <ToggleSwitch name="log_api_calls" label="Registrar Llamadas API" desc="Guardar todas las peticiones a la API" />
                                        <ToggleSwitch name="alert_suspicious_activity" label="Alertar Actividad Sospechosa" desc="Notificar cuando se detecte actividad inusual" />
                                    </div>
                                </div>
                            )}

                            {/* Email Tab */}
                            {activeTab === 'email' && (
                                <div className="space-y-6">
                                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                                Configuración de Email y Notificaciones
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Servidor SMTP
                                            </label>
                                            <Input {...register('smtp_host')} className="border-2" placeholder="smtp.gmail.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Puerto SMTP
                                            </label>
                                            <Input type="number" {...register('smtp_port')} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Usuario SMTP
                                            </label>
                                            <Input {...register('smtp_user')} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Encriptación
                                            </label>
                                            <select {...register('smtp_encryption')} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                                <option value="tls">TLS</option>
                                                <option value="ssl">SSL</option>
                                                <option value="none">Ninguna</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Remitente
                                            </label>
                                            <Input type="email" {...register('email_from_address')} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nombre Remitente
                                            </label>
                                            <Input {...register('email_from_name')} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Máx. Emails por Hora
                                            </label>
                                            <Input type="number" {...register('max_emails_per_hour')} className="border-2" />
                                        </div>
                                    </div>

                                    <ToggleSwitch name="enable_email_queue" label="Cola de Emails" desc="Procesar emails en segundo plano" />
                                </div>
                            )}

                            {/* Database Tab */}
                            {activeTab === 'database' && (
                                <div className="space-y-6">
                                    <div className="bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <Database className="h-5 w-5 text-cyan-600" />
                                            <span className="text-sm font-medium text-cyan-800 dark:text-cyan-200">
                                                Optimización de Base de Datos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Pool de Conexiones
                                            </label>
                                            <Input type="number" {...register('db_connection_pool_size', { min: 5, max: 100 })} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Timeout de Consultas (seg)
                                            </label>
                                            <Input type="number" {...register('db_query_timeout', { min: 10, max: 300 })} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                TTL de Caché (seg)
                                            </label>
                                            <Input type="number" {...register('cache_ttl', { min: 60, max: 86400 })} className="border-2" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleSwitch name="enable_query_cache" label="Caché de Consultas" desc="Cachear resultados de consultas frecuentes" />
                                        <ToggleSwitch name="auto_vacuum" label="Auto-Vacuum" desc="Limpieza automática de base de datos" />
                                        <ToggleSwitch name="enable_replication" label="Replicación" desc="Habilitar replicación de base de datos" />
                                    </div>
                                </div>
                            )}

                            {/* Performance Tab */}
                            {activeTab === 'performance' && (
                                <div className="space-y-6">
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-yellow-600" />
                                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Optimización de Rendimiento
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Driver de Caché
                                            </label>
                                            <select {...register('cache_driver')} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                                <option value="redis">Redis</option>
                                                <option value="memcached">Memcached</option>
                                                <option value="file">Archivo</option>
                                                <option value="database">Base de Datos</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Driver de Sesión
                                            </label>
                                            <select {...register('session_driver')} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                                <option value="redis">Redis</option>
                                                <option value="database">Base de Datos</option>
                                                <option value="file">Archivo</option>
                                                <option value="cookie">Cookie</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Driver de Cola
                                            </label>
                                            <select {...register('queue_driver')} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                                <option value="redis">Redis</option>
                                                <option value="database">Base de Datos</option>
                                                <option value="sync">Síncrono</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleSwitch name="enable_caching" label="Habilitar Caché" desc="Activar sistema de caché global" />
                                        <ToggleSwitch name="enable_compression" label="Compresión" desc="Comprimir respuestas HTTP" />
                                        <ToggleSwitch name="minify_assets" label="Minificar Assets" desc="Minificar CSS y JavaScript" />
                                        <ToggleSwitch name="lazy_loading" label="Carga Diferida" desc="Cargar recursos bajo demanda" />
                                        <ToggleSwitch name="cdn_enabled" label="CDN" desc="Usar CDN para assets estáticos" />
                                    </div>
                                </div>
                            )}

                            {/* Logging Tab */}
                            {activeTab === 'logging' && (
                                <div className="space-y-6">
                                    <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-orange-600" />
                                            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                                Sistema de Registros y Monitoreo
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nivel de Log
                                            </label>
                                            <select {...register('log_level')} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                                <option value="debug">Debug</option>
                                                <option value="info">Info</option>
                                                <option value="warning">Warning</option>
                                                <option value="error">Error</option>
                                                <option value="critical">Critical</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Canal de Log
                                            </label>
                                            <select {...register('log_channel')} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                                                <option value="daily">Diario</option>
                                                <option value="single">Archivo Único</option>
                                                <option value="syslog">Syslog</option>
                                                <option value="errorlog">Error Log</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Máx. Archivos de Log
                                            </label>
                                            <Input type="number" {...register('max_log_files', { min: 1, max: 90 })} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Rotación de Logs (días)
                                            </label>
                                            <Input type="number" {...register('log_rotation_days', { min: 1, max: 30 })} className="border-2" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleSwitch name="enable_error_tracking" label="Rastreo de Errores" desc="Enviar errores a servicio de tracking" />
                                        <ToggleSwitch name="enable_performance_monitoring" label="Monitoreo de Rendimiento" desc="Rastrear métricas de rendimiento" />
                                    </div>
                                </div>
                            )}

                            {/* Advanced Tab */}
                            {activeTab === 'advanced' && (
                                <div className="space-y-6">
                                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                            <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                                ⚠️ Configuración Avanzada - Solo para expertos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Orígenes CORS
                                            </label>
                                            <Input {...register('cors_origins')} className="border-2" placeholder="*" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Máx. Requests/Minuto
                                            </label>
                                            <Input type="number" {...register('max_requests_per_minute', { min: 10, max: 1000 })} className="border-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Webhook Secret
                                            </label>
                                            <Input type="password" {...register('webhook_secret')} className="border-2" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleSwitch name="debug_mode" label="Modo Debug" desc="⚠️ Mostrar errores detallados (solo desarrollo)" />
                                        <ToggleSwitch name="developer_mode" label="Modo Desarrollador" desc="Habilitar herramientas de desarrollo" />
                                        <ToggleSwitch name="allow_cors" label="Permitir CORS" desc="Habilitar Cross-Origin Resource Sharing" />
                                        <ToggleSwitch name="rate_limit_enabled" label="Rate Limiting" desc="Limitar peticiones por IP" />
                                        <ToggleSwitch name="enable_webhooks" label="Webhooks" desc="Habilitar sistema de webhooks" />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-6 mt-6 border-t-2 border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {isDirty && (
                                        <span className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                            <AlertTriangle className="h-4 w-4" />
                                            Cambios sin guardar
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5 mr-2" />
                                            Guardar Configuración Avanzada
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
