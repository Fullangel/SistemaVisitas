import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UserIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ExclamationCircleIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    EnvelopeIcon,
    PhoneIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    XMarkIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface PendingVisit {
    id: number
    visitor_name: string
    visitor_email: string
    visitor_phone: string
    visitor_company: string
    visitor_document: string
    requested_date: string
    requested_time: string
    site: string
    department: string
    purpose: string
    priority: 'normal' | 'urgent'
    requested_by: string
    request_date: string
}

export default function ApproveVisitsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [siteFilter, setSiteFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [pendingVisits, setPendingVisits] = useState<PendingVisit[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedVisit, setSelectedVisit] = useState<PendingVisit | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [actionInProgress, setActionInProgress] = useState<number | null>(null)

    // Mock data
    useEffect(() => {
        setTimeout(() => {
            setPendingVisits([
                {
                    id: 1,
                    visitor_name: "Carlos Rodríguez García",
                    visitor_email: "carlos.rodriguez@techsolutions.com",
                    visitor_phone: "+34 600 123 456",
                    visitor_company: "Tech Solutions S.A.",
                    visitor_document: "12345678A",
                    requested_date: "2025-01-25",
                    requested_time: "10:00",
                    site: "Sede Central - Madrid",
                    department: "IT",
                    purpose: "Reunión técnica para discutir nueva implementación de software",
                    priority: "urgent",
                    requested_by: "Juan Pérez",
                    request_date: "2025-01-20"
                },
                {
                    id: 2,
                    visitor_name: "María González López",
                    visitor_email: "maria.gonzalez@consulting.com",
                    visitor_phone: "+34 611 234 567",
                    visitor_company: "Consulting Group",
                    visitor_document: "23456789B",
                    requested_date: "2025-01-26",
                    requested_time: "14:00",
                    site: "Sede Norte - Barcelona",
                    department: "Recursos Humanos",
                    purpose: "Entrevista de trabajo para posición senior",
                    priority: "normal",
                    requested_by: "Ana Martínez",
                    request_date: "2025-01-21"
                },
                {
                    id: 3,
                    visitor_name: "Roberto Sánchez Mora",
                    visitor_email: "roberto.sanchez@innovation.com",
                    visitor_phone: "+34 622 345 678",
                    visitor_company: "Innovation Labs",
                    visitor_document: "34567890C",
                    requested_date: "2025-01-25",
                    requested_time: "09:00",
                    site: "Sede Central - Madrid",
                    department: "Ventas",
                    purpose: "Presentación de nuevo producto",
                    priority: "urgent",
                    requested_by: "Pedro Fernández",
                    request_date: "2025-01-22"
                }
            ])
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredVisits = pendingVisits.filter(visit => {
        const matchesSearch =
            visit.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.visitor_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.purpose.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesSite = siteFilter === 'all' || visit.site.includes(siteFilter)
        const matchesPriority = priorityFilter === 'all' || visit.priority === priorityFilter

        return matchesSearch && matchesSite && matchesPriority
    })

    const handleApprove = async (visitId: number) => {
        setActionInProgress(visitId)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setPendingVisits(prev => prev.filter(v => v.id !== visitId))
            toast.success('✅ Visita aprobada exitosamente')
        } catch (error) {
            console.error('Error approving visit:', error)
            toast.error('Error al aprobar la visita')
        } finally {
            setActionInProgress(null)
        }
    }

    const handleReject = async (visitId: number) => {
        setActionInProgress(visitId)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setPendingVisits(prev => prev.filter(v => v.id !== visitId))
            toast.success('❌ Visita rechazada')
        } catch (error) {
            console.error('Error rejecting visit:', error)
            toast.error('Error al rechazar la visita')
        } finally {
            setActionInProgress(null)
        }
    }

    const handleViewDetails = (visit: PendingVisit) => {
        setSelectedVisit(visit)
        setShowDetailModal(true)
    }

    const stats = {
        total: filteredVisits.length,
        urgent: filteredVisits.filter(v => v.priority === 'urgent').length,
        normal: filteredVisits.filter(v => v.priority === 'normal').length
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950 dark:to-amber-950">
            {/* Modern Header with Stats */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            >
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                    <CheckCircleIcon className="h-6 w-6 text-white" />
                                </div>
                                Aprobar Visitas
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Gestión de solicitudes pendientes de aprobación
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-orange-500 text-white px-4 py-2 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                                Requiere Acción
                            </Badge>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Pendientes</p>
                                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <DocumentTextIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Urgentes</p>
                                    <p className="text-3xl font-bold mt-1">{stats.urgent}</p>
                                </div>
                                <ExclamationCircleIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Normales</p>
                                    <p className="text-3xl font-bold mt-1">{stats.normal}</p>
                                </div>
                                <ArrowTrendingUpIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="p-6">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Buscar por nombre, empresa, departamento o propósito..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500"
                            />
                        </div>

                        <select
                            value={siteFilter}
                            onChange={(e) => setSiteFilter(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="all">📍 Todas las Sedes</option>
                            <option value="Madrid">🏢 Madrid</option>
                            <option value="Barcelona">🏢 Barcelona</option>
                            <option value="Valencia">🏢 Valencia</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="all">⚡ Todas las Prioridades</option>
                            <option value="urgent">🔴 Urgente</option>
                            <option value="normal">🔵 Normal</option>
                        </select>
                    </div>
                </motion.div>

                {/* Visits List */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto" />
                        <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">Cargando solicitudes...</p>
                    </div>
                ) : filteredVisits.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                    >
                        <CheckCircleIcon className="h-20 w-20 text-green-400 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            ¡Todo al día!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            No hay solicitudes pendientes de aprobación
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredVisits.map((visit, index) => (
                            <motion.div
                                key={visit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all overflow-hidden"
                            >
                                {/* Priority Bar */}
                                <div className={`h-2 ${visit.priority === 'urgent' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />

                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left: Visit Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl">
                                                        {visit.visitor_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">
                                                            {visit.visitor_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {visit.visitor_company}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                            Doc: {visit.visitor_document}
                                                        </p>
                                                    </div>
                                                </div>
                                                {visit.priority === 'urgent' && (
                                                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                                        Urgente
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <CalendarIcon className="h-4 w-4 text-orange-500" />
                                                    <span className="font-medium">
                                                        {new Date(visit.requested_date).toLocaleDateString('es-ES', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <ClockIcon className="h-4 w-4 text-blue-500" />
                                                    <span>{visit.requested_time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <BuildingOfficeIcon className="h-4 w-4 text-purple-500" />
                                                    <span>{visit.site}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <BriefcaseIcon className="h-4 w-4 text-green-500" />
                                                    <span>{visit.department}</span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-3">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    <strong className="text-gray-900 dark:text-white">Propósito:</strong> {visit.purpose}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <UserIcon className="h-3 w-3" />
                                                <span>Solicitado por: <strong>{visit.requested_by}</strong></span>
                                                <span>•</span>
                                                <span>{new Date(visit.request_date).toLocaleDateString('es-ES')}</span>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex flex-col gap-3 lg:w-56">
                                            <Button
                                                onClick={() => handleViewDetails(visit)}
                                                variant="outline"
                                                className="w-full border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                Ver Detalles
                                            </Button>
                                            <Button
                                                onClick={() => handleApprove(visit.id)}
                                                disabled={actionInProgress === visit.id}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
                                            >
                                                {actionInProgress === visit.id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                        Procesando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <HandThumbUpIcon className="h-4 w-4 mr-2" />
                                                        Aprobar
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => handleReject(visit.id)}
                                                disabled={actionInProgress === visit.id}
                                                variant="outline"
                                                className="w-full border-2 border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-600"
                                            >
                                                <HandThumbDownIcon className="h-4 w-4 mr-2" />
                                                Rechazar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedVisit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-2xl font-bold">Solicitud de Visita</h2>
                                            {selectedVisit.priority === 'urgent' && (
                                                <Badge className="bg-red-500 text-white">
                                                    <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                                    Urgente
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-orange-100 text-sm">
                                            ID: #{selectedVisit.id.toString().padStart(6, '0')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Visitor Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-orange-500" />
                                        Información del Visitante
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre Completo</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.visitor_name}</p>
                                        </div>
                                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Empresa</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.visitor_company}</p>
                                        </div>
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Documento</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.visitor_document}</p>
                                        </div>
                                        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200 dark:border-red-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prioridad</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg capitalize">{selectedVisit.priority === 'urgent' ? 'Urgente' : 'Normal'}</p>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedVisit.visitor_email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedVisit.visitor_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Visit Details */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <CalendarIcon className="h-5 w-5 text-purple-500" />
                                        Detalles de la Visita
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fecha Solicitada</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(selectedVisit.requested_date).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hora</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.requested_time}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200 dark:border-green-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sede</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{selectedVisit.site}</p>
                                        </div>
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Departamento</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{selectedVisit.department}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Purpose */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Propósito de la Visita</h3>
                                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border-l-4 border-orange-500">
                                        {selectedVisit.purpose}
                                    </p>
                                </div>

                                {/* Request Info */}
                                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border-l-4 border-amber-500">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Información de la Solicitud</h3>
                                    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                        <p>
                                            <strong>Solicitado por:</strong> {selectedVisit.requested_by}
                                        </p>
                                        <p>
                                            <strong>Fecha de solicitud:</strong> {new Date(selectedVisit.request_date).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer with Actions */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDetailModal(false)}
                                        className="w-full sm:w-auto"
                                    >
                                        Cerrar
                                    </Button>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Button
                                            onClick={() => {
                                                handleReject(selectedVisit.id)
                                                setShowDetailModal(false)
                                            }}
                                            variant="outline"
                                            className="flex-1 sm:flex-none border-2 border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                        >
                                            <HandThumbDownIcon className="h-4 w-4 mr-2" />
                                            Rechazar
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleApprove(selectedVisit.id)
                                                setShowDetailModal(false)
                                            }}
                                            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
                                        >
                                            <HandThumbUpIcon className="h-4 w-4 mr-2" />
                                            Aprobar Visita
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
