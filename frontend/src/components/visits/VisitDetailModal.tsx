import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    Building2,
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    FileText,
    Car,
    QrCode,
    CheckCircle,
    XCircle,
    X
} from "lucide-react"
import type { Visit } from "@/services/api/visits"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { QRCodeSVG } from 'qrcode.react'

interface VisitDetailModalProps {
    visit: Visit | null
    open: boolean
    onClose: () => void
    onCheckOut?: (visitId: number) => void
    isCheckingOut?: boolean
}

// Helper function to safely format dates
const safeFormatDate = (dateValue: string | null | undefined, formatString: string, fallback: string = 'N/A'): string => {
    if (!dateValue) return fallback
    try {
        const date = new Date(dateValue)
        if (isNaN(date.getTime())) return fallback
        return format(date, formatString, { locale: es })
    } catch {
        return fallback
    }
}

export function VisitDetailModal({ visit, open, onClose, onCheckOut, isCheckingOut }: VisitDetailModalProps) {
    if (!visit) return null

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            approved: { label: 'Aprobada', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            in_progress: { label: 'En Proceso', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            completed: { label: 'Completada', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
            rejected: { label: 'Rechazada', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        return <Badge className={config.className}>{config.label}</Badge>
    }

    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            low: { label: 'Baja', className: 'bg-gray-100 text-gray-800' },
            medium: { label: 'Media', className: 'bg-blue-100 text-blue-800' },
            high: { label: 'Alta', className: 'bg-orange-100 text-orange-800' },
            urgent: { label: 'Urgente', className: 'bg-red-100 text-red-800' },
        }
        const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
        return <Badge className={config.className}>{config.label}</Badge>
    }

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'from-yellow-500 to-amber-600',
            approved: 'from-blue-500 to-indigo-600',
            in_progress: 'from-green-500 to-emerald-600',
            completed: 'from-gray-500 to-slate-600',
            rejected: 'from-red-500 to-rose-600',
        }
        return colors[status as keyof typeof colors] || colors.in_progress
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <div className="flex gap-6 max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
                        {/* Digital Badge Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-96 flex-shrink-0"
                        >
                            <div className={`bg-gradient-to-br ${getStatusColor(visit.status)} rounded-3xl p-1 shadow-2xl`}>
                                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6">
                                    <div className="text-center mb-6">
                                        <div className={`inline-block px-4 py-2 bg-gradient-to-r ${getStatusColor(visit.status)} rounded-full text-white font-bold text-sm mb-4`}>
                                            {visit.status === 'in_progress' ? '✓ ACCESO AUTORIZADO' :
                                                visit.status === 'pending' ? '⏳ PENDIENTE' :
                                                    visit.status === 'completed' ? '✓ COMPLETADA' : '✓ APROBADA'}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            ID: {visit.visit_code}
                                        </div>
                                    </div>

                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className={`h-40 w-40 rounded-full bg-gradient-to-br ${getStatusColor(visit.status)} flex items-center justify-center text-white p-1`}>
                                                <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                                    <User className="h-20 w-20 text-gray-400" />
                                                </div>
                                            </div>
                                            <div className={`absolute bottom-2 right-2 h-8 w-8 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br ${getStatusColor(visit.status)} flex items-center justify-center`}>
                                                {visit.status === 'in_progress' ? <CheckCircle className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-white" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="text-center">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                                {visit.visitor_name}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {visit.visitor_company || 'Visitante Individual'}
                                            </p>
                                        </div>

                                        <div className={`space-y-2 bg-${visit.status === 'in_progress' ? 'green' : 'blue'}-50 dark:bg-${visit.status === 'in_progress' ? 'green' : 'blue'}-900/20 rounded-xl p-4 border-2 border-${visit.status === 'in_progress' ? 'green' : 'blue'}-200 dark:border-${visit.status === 'in_progress' ? 'green' : 'blue'}-800`}>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-indigo-500" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {visit.headquarter?.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-purple-500" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {visit.department?.name || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {safeFormatDate(visit.visit_date, 'PPP')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-green-500" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {safeFormatDate(visit.entry_time, 'p', 'Pendiente')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR code with URL for verification */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-center border-2 border-indigo-300 dark:border-indigo-700">
                                        <div className="mb-2">
                                            <QRCodeSVG
                                                value={`${window.location.origin}/verify/${visit.visit_code}`}
                                                size={180}
                                                level="M"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                                            <QrCode className="h-3 w-3" />
                                            <span>Código de Acceso</span>
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {visit.visit_code}
                                        </div>
                                        {visit.qr_scanned_at && (
                                            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                                                ✓ Escaneado: {safeFormatDate(visit.qr_scanned_at, 'PPp')}
                                            </div>
                                        )}
                                    </div>


                                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                                        <div className={`bg-${visit.status === 'in_progress' ? 'green' : 'blue'}-100 dark:bg-${visit.status === 'in_progress' ? 'green' : 'blue'}-900/30 rounded-lg p-2 mb-2`}>
                                            <p className={`text-xs font-bold text-${visit.status === 'in_progress' ? 'green' : 'blue'}-700 dark:text-${visit.status === 'in_progress' ? 'green' : 'blue'}-400`}>
                                                {visit.status === 'in_progress' ? '✓ VISITANTE AUTORIZADO' : '⏳ EN PROCESO'}
                                            </p>
                                        </div>
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Sistema de Visitas Nacional
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Detail Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className={`sticky top-0 bg-gradient-to-r ${getStatusColor(visit.status)} text-white p-6 rounded-t-2xl`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Detalles de la Visita</h2>
                                        <p className="text-white/80 text-sm mt-1">Información completa del visitante</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status and Priority */}
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(visit.status)}
                                    {getPriorityBadge(visit.priority)}
                                </div>

                                {/* Visitor Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5 text-indigo-600" />
                                        Información del Visitante
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem icon={User} label="Nombre" value={visit.visitor_name} />
                                        <InfoItem icon={FileText} label="Identificación" value={visit.visitor_identification} />
                                        <InfoItem icon={Mail} label="Email" value={visit.visitor_email || 'N/A'} />
                                        <InfoItem icon={Phone} label="Teléfono" value={visit.visitor_phone || 'N/A'} />
                                    </div>
                                </div>

                                <Separator />

                                {/* Visit Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                        Detalles de la Visita
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoItem
                                            icon={FileText}
                                            label="Propósito"
                                            value={visit.purpose}
                                            fullWidth
                                        />
                                        {visit.description && (
                                            <InfoItem
                                                icon={FileText}
                                                label="Descripción"
                                                value={visit.description}
                                                fullWidth
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Employee Information */}
                                {visit.employee && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                <User className="h-5 w-5 text-indigo-600" />
                                                Anfitrión
                                            </h3>
                                            <InfoItem
                                                icon={User}
                                                label="Empleado"
                                                value={`${visit.employee.first_name} ${visit.employee.last_name}`}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Vehicle Information */}
                                {visit.has_vehicle && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                <Car className="h-5 w-5 text-indigo-600" />
                                                Información del Vehículo
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <InfoItem icon={Car} label="Placa" value={visit.vehicle_plate || 'N/A'} />
                                                <InfoItem icon={Car} label="Modelo" value={visit.vehicle_model || 'N/A'} />
                                                <InfoItem icon={Car} label="Color" value={visit.vehicle_color || 'N/A'} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            {visit.status === 'in_progress' && onCheckOut && (
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex justify-end gap-3">
                                    <Button variant="outline" onClick={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button
                                        onClick={() => onCheckOut(visit.id)}
                                        disabled={isCheckingOut}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    >
                                        {isCheckingOut ? (
                                            <>Procesando...</>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Realizar Check-out
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

interface InfoItemProps {
    icon: React.ElementType
    label: string
    value: string
    fullWidth?: boolean
    className?: string
}

function InfoItem({ icon: Icon, label, value, fullWidth, className }: InfoItemProps) {
    return (
        <div className={`${fullWidth ? 'col-span-full' : ''} ${className || ''}`}>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 break-words">{value}</p>
                </div>
            </div>
        </div>
    )
}
