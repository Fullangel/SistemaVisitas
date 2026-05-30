import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    CheckCircle,
    XCircle,
    User,
    Building2,
    Calendar,
    Clock,
    Mail,
    Phone,
    FileText,
    Car,
    MapPin,
    ArrowLeft,
    Shield,
    AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import api from '@/lib/axios'

interface VisitData {
    id: number
    visit_code: string
    visitor_name: string
    visitor_identification: string
    visitor_email?: string
    visitor_phone?: string
    visitor_company?: string
    purpose: string
    description?: string
    status: string
    priority: string
    visit_date: string
    entry_time?: string
    exit_time?: string
    has_vehicle: boolean
    vehicle_plate?: string
    vehicle_model?: string
    vehicle_color?: string
    employee?: {
        first_name: string
        last_name: string
    }
    department?: {
        name: string
    }
    headquarter?: {
        name: string
        address?: string
    }
}

export default function VerifyVisitor() {
    const { visitCode } = useParams<{ visitCode: string }>()
    const navigate = useNavigate()
    const [visit, setVisit] = useState<VisitData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchVisit = async () => {
            try {
                const { data } = await api.get(`/visits/verify/${visitCode}`)
                setVisit(data)
            } catch (err: any) {
                setError(err.response?.data?.message || 'No se pudo verificar la visita')
            } finally {
                setLoading(false)
            }
        }

        if (visitCode) {
            fetchVisit()
        }
    }, [visitCode])

    const getStatusConfig = (status: string) => {
        const configs = {
            in_progress: {
                icon: CheckCircle,
                label: 'Acceso Autorizado',
                color: 'green',
                gradient: 'from-green-500 to-emerald-600',
                bg: 'bg-green-50 dark:bg-green-900/20',
                border: 'border-green-200 dark:border-green-800',
                text: 'text-green-700 dark:text-green-400'
            },
            approved: {
                icon: CheckCircle,
                label: 'Visita Aprobada',
                color: 'blue',
                gradient: 'from-blue-500 to-indigo-600',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-200 dark:border-blue-800',
                text: 'text-blue-700 dark:text-blue-400'
            },
            pending: {
                icon: AlertCircle,
                label: 'Pendiente de Aprobación',
                color: 'yellow',
                gradient: 'from-yellow-500 to-amber-600',
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                border: 'border-yellow-200 dark:border-yellow-800',
                text: 'text-yellow-700 dark:text-yellow-400'
            },
            completed: {
                icon: CheckCircle,
                label: 'Visita Completada',
                color: 'gray',
                gradient: 'from-gray-500 to-slate-600',
                bg: 'bg-gray-50 dark:bg-gray-900/20',
                border: 'border-gray-200 dark:border-gray-800',
                text: 'text-gray-700 dark:text-gray-400'
            },
            rejected: {
                icon: XCircle,
                label: 'Acceso Denegado',
                color: 'red',
                gradient: 'from-red-500 to-rose-600',
                bg: 'bg-red-50 dark:bg-red-900/20',
                border: 'border-red-200 dark:border-red-800',
                text: 'text-red-700 dark:text-red-400'
            }
        }
        return configs[status as keyof typeof configs] || configs.pending
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Verificando visita...</p>
                </motion.div>
            </div>
        )
    }

    if (error || !visit) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Visita No Encontrada
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error || 'El código de visita no es válido o ha expirado'}
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Inicio
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    const statusConfig = getStatusConfig(visit.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Sistema de Verificación de Visitas
                        </span>
                    </div>
                </motion.div>

                {/* Status Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`bg-gradient-to-r ${statusConfig.gradient} rounded-3xl p-1 shadow-2xl mb-8`}
                >
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center`}>
                                <StatusIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {statusConfig.label}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Código: {visit.visit_code}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Visitor Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-6"
                >
                    {/* Visitor Info */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center`}>
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {visit.visitor_name}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                {visit.visitor_company || 'Visitante Individual'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                {visit.visitor_identification}
                            </p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {visit.visitor_email && (
                            <InfoCard icon={Mail} label="Email" value={visit.visitor_email} />
                        )}
                        {visit.visitor_phone && (
                            <InfoCard icon={Phone} label="Teléfono" value={visit.visitor_phone} />
                        )}
                        {visit.headquarter && (
                            <InfoCard icon={Building2} label="Sede" value={visit.headquarter.name} />
                        )}
                        {visit.department && (
                            <InfoCard icon={Building2} label="Departamento" value={visit.department.name} />
                        )}
                        <InfoCard
                            icon={Calendar}
                            label="Fecha de Visita"
                            value={format(new Date(visit.visit_date), 'PPP', { locale: es })}
                        />
                        {visit.entry_time && (
                            <InfoCard icon={Clock} label="Hora de Entrada" value={visit.entry_time} />
                        )}
                    </div>

                    {/* Purpose */}
                    <div className={`mt-6 p-6 rounded-2xl ${statusConfig.bg} border-2 ${statusConfig.border}`}>
                        <div className="flex items-start gap-3">
                            <FileText className={`w-5 h-5 ${statusConfig.text} mt-1 flex-shrink-0`} />
                            <div className="flex-1">
                                <h3 className={`font-bold ${statusConfig.text} mb-2`}>Propósito de la Visita</h3>
                                <p className="text-gray-700 dark:text-gray-300">{visit.purpose}</p>
                                {visit.description && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                                        {visit.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Host Info */}
                    {visit.employee && (
                        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Anfitrión</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {visit.employee.first_name} {visit.employee.last_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vehicle Info */}
                    {visit.has_vehicle && (
                        <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <Car className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3">
                                        Información del Vehículo
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-blue-600 dark:text-blue-500 mb-1">Placa</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {visit.vehicle_plate || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-600 dark:text-blue-500 mb-1">Modelo</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {visit.vehicle_model || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-600 dark:text-blue-500 mb-1">Color</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {visit.vehicle_color || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sistema de Visitas Nacional • Verificación Automática
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

interface InfoCardProps {
    icon: React.ElementType
    label: string
    value: string
}

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
    return (
        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{value}</p>
            </div>
        </div>
    )
}
