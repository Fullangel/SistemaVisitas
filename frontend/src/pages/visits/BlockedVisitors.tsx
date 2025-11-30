import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShieldExclamationIcon,
    MagnifyingGlassIcon,
    UserIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    ExclamationTriangleIcon,
    LockClosedIcon,
    LockOpenIcon,
    EyeIcon,
    XMarkIcon,
    CheckCircleIcon,
    QrCodeIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'

interface BlockedVisitor {
    id: number
    nombre: string
    empresa: string
    email: string
    telefono: string
    razon_bloqueo: string
    bloqueado_por: string
    fecha_bloqueo: string
    incidentes: number
    ultima_visita?: string
    region: string
    sede: string
}

export default function BlockedVisitorsPage() {
    const [blockedVisitors, setBlockedVisitors] = useState<BlockedVisitor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedVisitor, setSelectedVisitor] = useState<BlockedVisitor | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showUnblockModal, setShowUnblockModal] = useState(false)
    const [isUnblocking, setIsUnblocking] = useState(false)

    useEffect(() => {
        loadBlockedVisitors()
    }, [])

    const loadBlockedVisitors = async () => {
        setIsLoading(true)
        setTimeout(() => {
            setBlockedVisitors([
                {
                    id: 1,
                    nombre: "Roberto Sánchez Mora",
                    empresa: "Empresa Suspendida S.L.",
                    email: "roberto.sanchez@suspendida.com",
                    telefono: "+34 600 111 222",
                    razon_bloqueo: "Comportamiento inapropiado durante visita anterior. Faltó al respeto al personal de seguridad.",
                    bloqueado_por: "Admin Principal",
                    fecha_bloqueo: "2025-01-15",
                    incidentes: 3,
                    ultima_visita: "2025-01-14",
                    region: "Centro",
                    sede: "Sede Central - Madrid"
                },
                {
                    id: 2,
                    nombre: "Laura Martínez Ruiz",
                    empresa: "Competencia Directa Inc.",
                    email: "laura.martinez@competencia.com",
                    telefono: "+34 611 222 333",
                    razon_bloqueo: "Intento de acceso a áreas restringidas sin autorización. Posible espionaje industrial.",
                    bloqueado_por: "Jefe de Seguridad",
                    fecha_bloqueo: "2025-01-20",
                    incidentes: 2,
                    ultima_visita: "2025-01-19",
                    region: "Norte",
                    sede: "Sede Norte - Barcelona"
                },
                {
                    id: 3,
                    nombre: "Miguel Ángel Torres",
                    empresa: "Proveedores Dudosos",
                    email: "miguel.torres@dudosos.es",
                    telefono: "+34 622 333 444",
                    razon_bloqueo: "Documentación falsa presentada en múltiples ocasiones. Identidad no verificada.",
                    bloqueado_por: "Admin Principal",
                    fecha_bloqueo: "2024-12-10",
                    incidentes: 5,
                    ultima_visita: "2024-12-09",
                    region: "Centro",
                    sede: "Sede Central - Madrid"
                },
                {
                    id: 4,
                    nombre: "Carmen López García",
                    empresa: "Servicios No Autorizados",
                    email: "carmen.lopez@noautorizados.com",
                    telefono: "+34 633 444 555",
                    razon_bloqueo: "Violación de políticas de seguridad. Fotografió áreas confidenciales sin permiso.",
                    bloqueado_por: "Supervisor de Seguridad",
                    fecha_bloqueo: "2025-02-01",
                    incidentes: 1,
                    ultima_visita: "2025-01-31",
                    region: "Este",
                    sede: "Sede Este - Valencia"
                },
                {
                    id: 5,
                    nombre: "Antonio Fernández Díaz",
                    empresa: "Empresa Sancionada",
                    email: "antonio.fernandez@sancionada.es",
                    telefono: "+34 644 555 666",
                    razon_bloqueo: "Empresa en lista negra por incumplimiento de contratos. Acceso denegado por orden ejecutiva.",
                    bloqueado_por: "Dirección General",
                    fecha_bloqueo: "2024-11-25",
                    incidentes: 1,
                    ultima_visita: "2024-11-24",
                    region: "Sur",
                    sede: "Sede Sur - Sevilla"
                }
            ])
            setIsLoading(false)
        }, 1000)
    }

    const filteredVisitors = blockedVisitors.filter(visitor =>
        visitor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.razon_bloqueo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleViewDetails = (visitor: BlockedVisitor) => {
        setSelectedVisitor(visitor)
        setShowDetailModal(true)
    }

    const handleUnblockRequest = (visitor: BlockedVisitor) => {
        setSelectedVisitor(visitor)
        setShowUnblockModal(true)
    }

    const confirmUnblock = async () => {
        if (!selectedVisitor) return

        setIsUnblocking(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))

            setBlockedVisitors(prev => prev.filter(v => v.id !== selectedVisitor.id))
            toast.success(`${selectedVisitor.nombre} ha sido desbloqueado exitosamente`)
            setShowUnblockModal(false)
            setSelectedVisitor(null)
        } catch (error) {
            console.error('Error unblocking visitor:', error)
            toast.error('Error al desbloquear visitante')
        } finally {
            setIsUnblocking(false)
        }
    }

    const stats = {
        total: blockedVisitors.length,
        highRisk: blockedVisitors.filter(v => v.incidentes >= 3).length,
        recent: blockedVisitors.filter(v => {
            const blockDate = new Date(v.fecha_bloqueo)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            return blockDate >= thirtyDaysAgo
        }).length
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-950 dark:via-red-950 dark:to-orange-950">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            >
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                                    <ShieldExclamationIcon className="h-6 w-6 text-white" />
                                </div>
                                Visitantes Bloqueados
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Gestión de visitantes con acceso restringido
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-red-500 text-white px-4 py-2 text-sm">
                                <LockClosedIcon className="h-4 w-4 mr-2" />
                                Acceso Restringido
                            </Badge>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Bloqueados</p>
                                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <ShieldExclamationIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Alto Riesgo</p>
                                    <p className="text-3xl font-bold mt-1">{stats.highRisk}</p>
                                </div>
                                <ExclamationTriangleIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Últimos 30 días</p>
                                    <p className="text-3xl font-bold mt-1">{stats.recent}</p>
                                </div>
                                <CalendarIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="p-6">
                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6"
                >
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre, empresa o razón de bloqueo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-red-500"
                        />
                    </div>
                </motion.div>

                {/* Blocked Visitors List */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto" />
                        <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">Cargando visitantes bloqueados...</p>
                    </div>
                ) : filteredVisitors.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                    >
                        <CheckCircleIcon className="h-20 w-20 text-green-400 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {searchTerm ? 'No se encontraron resultados' : 'No hay visitantes bloqueados'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {searchTerm ? 'Intenta ajustar tu búsqueda' : 'Todos los visitantes tienen acceso permitido'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredVisitors.map((visitor, index) => (
                            <motion.div
                                key={visitor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all overflow-hidden"
                            >
                                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500" />

                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl relative">
                                                        {visitor.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-red-600 rounded-full flex items-center justify-center">
                                                            <LockClosedIcon className="h-3 w-3 text-white" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">
                                                            {visitor.nombre}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                            <BuildingOfficeIcon className="h-4 w-4" />
                                                            {visitor.empresa}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={visitor.incidentes >= 3
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                }>
                                                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                                    {visitor.incidentes} Incidente{visitor.incidentes !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <CalendarIcon className="h-4 w-4 text-red-500" />
                                                    <span>Bloqueado: {new Date(visitor.fecha_bloqueo).toLocaleDateString('es-ES')}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <UserIcon className="h-4 w-4 text-orange-500" />
                                                    <span>Por: {visitor.bloqueado_por}</span>
                                                </div>
                                            </div>

                                            <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border-l-4 border-red-500">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                                    Razón del Bloqueo:
                                                </p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {visitor.razon_bloqueo}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 lg:w-48">
                                            <Button
                                                onClick={() => handleViewDetails(visitor)}
                                                variant="outline"
                                                className="w-full border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                Ver Detalles
                                            </Button>
                                            <Button
                                                onClick={() => handleUnblockRequest(visitor)}
                                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                                            >
                                                <LockOpenIcon className="h-4 w-4 mr-2" />
                                                Desbloquear
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal with Badge Card */}
            <AnimatePresence>
                {showDetailModal && selectedVisitor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <div className="flex gap-6 max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
                            {/* Digital Badge Card - BLOCKED */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-96 flex-shrink-0"
                            >
                                <div className="bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 rounded-3xl p-1 shadow-2xl">
                                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6">
                                        <div className="text-center mb-6">
                                            <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-white font-bold text-sm mb-4">
                                                ⛔ ACCESO BLOQUEADO
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                ID: #{selectedVisitor.id.toString().padStart(6, '0')}
                                            </div>
                                        </div>

                                        <div className="flex justify-center mb-6">
                                            <div className="relative">
                                                <div className="h-40 w-40 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white p-1">
                                                    <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                                        <UserIcon className="h-20 w-20 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full border-4 border-white dark:border-gray-900 bg-red-600 flex items-center justify-center">
                                                    <LockClosedIcon className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="text-center">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                                    {selectedVisitor.nombre}
                                                </h3>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {selectedVisitor.empresa}
                                                </p>
                                            </div>

                                            <div className="space-y-2 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-800">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <ShieldExclamationIcon className="h-4 w-4 text-red-500" />
                                                    <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                                        {selectedVisitor.incidentes} Incidente{selectedVisitor.incidentes !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <BuildingOfficeIcon className="h-4 w-4 text-orange-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {selectedVisitor.sede}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <CalendarIcon className="h-4 w-4 text-amber-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        Bloqueado: {new Date(selectedVisitor.fecha_bloqueo).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <UserIcon className="h-4 w-4 text-yellow-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        Por: {selectedVisitor.bloqueado_por}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-center border-2 border-red-300 dark:border-red-700">
                                            <div className="mb-2 relative">
                                                <QRCodeSVG
                                                    value={JSON.stringify({
                                                        id: selectedVisitor.id,
                                                        name: selectedVisitor.nombre,
                                                        company: selectedVisitor.empresa,
                                                        status: 'BLOCKED',
                                                        blocked_date: selectedVisitor.fecha_bloqueo
                                                    })}
                                                    size={180}
                                                    level="H"
                                                    includeMargin={true}
                                                />
                                                <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center rounded">
                                                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        BLOQUEADO
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-semibold">
                                                <QrCodeIcon className="h-3 w-3" />
                                                <span>Acceso Denegado</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                                            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-2 mb-2">
                                                <p className="text-xs font-bold text-red-700 dark:text-red-400">
                                                    ⚠️ VISITANTE NO AUTORIZADO
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
                                <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold">Detalles del Visitante Bloqueado</h2>
                                            <p className="text-red-100 text-sm mt-1">Información de seguridad</p>
                                        </div>
                                        <button
                                            onClick={() => setShowDetailModal(false)}
                                            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-red-500" />
                                            Información del Visitante
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200 dark:border-red-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre Completo</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisitor.nombre}</p>
                                            </div>
                                            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Empresa</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisitor.empresa}</p>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{selectedVisitor.telefono}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <ShieldExclamationIcon className="h-5 w-5 text-orange-500" />
                                            Información del Bloqueo
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Región</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisitor.region}</p>
                                            </div>
                                            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border-2 border-cyan-200 dark:border-cyan-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sede de Bloqueo</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisitor.sede}</p>
                                            </div>
                                            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fecha de Bloqueo</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date(selectedVisitor.fecha_bloqueo).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bloqueado Por</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedVisitor.bloqueado_por}</p>
                                            </div>
                                            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border-2 border-red-200 dark:border-red-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Número de Incidentes</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-2xl">{selectedVisitor.incidentes}</p>
                                            </div>
                                            {selectedVisitor.ultima_visita && (
                                                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Última Visita</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {new Date(selectedVisitor.ultima_visita).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Razón del Bloqueo</h3>
                                        <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border-l-4 border-red-500">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {selectedVisitor.razon_bloqueo}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border-l-4 border-yellow-500">
                                        <div className="flex items-start gap-3">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Advertencia de Seguridad</h3>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Este visitante tiene acceso restringido. Cualquier intento de acceso debe ser reportado inmediatamente al departamento de seguridad.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                                        Cerrar
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowDetailModal(false)
                                            handleUnblockRequest(selectedVisitor)
                                        }}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                    >
                                        <LockOpenIcon className="h-4 w-4 mr-2" />
                                        Desbloquear Visitante
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Unblock Confirmation Modal */}
            <AnimatePresence>
                {showUnblockModal && selectedVisitor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowUnblockModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <LockOpenIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar Desbloqueo</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    ¿Estás seguro de que deseas desbloquear a <strong>{selectedVisitor.nombre}</strong>?
                                    Esta acción permitirá que el visitante pueda registrar nuevas visitas.
                                </p>
                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg mb-6">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <strong>Nota:</strong> Se recomienda revisar el historial de incidentes antes de proceder.
                                    </p>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setShowUnblockModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={confirmUnblock}
                                        disabled={isUnblocking}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {isUnblocking ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Desbloqueando...
                                            </>
                                        ) : (
                                            <>
                                                <LockOpenIcon className="h-4 w-4 mr-2" />
                                                Desbloquear
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
