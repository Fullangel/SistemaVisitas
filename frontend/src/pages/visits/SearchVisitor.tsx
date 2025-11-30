import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MagnifyingGlassIcon,
    UserIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    ShieldExclamationIcon,
    ChartBarIcon,
    DocumentTextIcon,
    XMarkIcon,
    LockClosedIcon,
    LockOpenIcon,
    PencilIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

interface Visitor {
    id: number
    nombre: string
    empresa: string
    email: string
    telefono: string
    documento: string
    total_visitas: number
    ultima_visita?: string
    estado: 'activo' | 'bloqueado' | 'inactivo'
    visitas_completadas: number
    visitas_pendientes: number
    visitas_canceladas: number
    fecha_registro: string
}

interface VisitHistory {
    id: number
    fecha: string
    hora_entrada: string
    hora_salida?: string
    sede: string
    departamento: string
    motivo: string
    estado: 'completada' | 'en_proceso' | 'cancelada'
    anfitrion: string
}

export default function SearchVisitorPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<Visitor[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [visitHistory, setVisitHistory] = useState<VisitHistory[]>([])
    const [showBlockModal, setShowBlockModal] = useState(false)
    const [blockReason, setBlockReason] = useState('')
    const [isBlocking, setIsBlocking] = useState(false)

    // Mock visitors database
    const mockVisitors: Visitor[] = [
        {
            id: 1,
            nombre: "Carlos Rodríguez García",
            empresa: "Tech Solutions S.A.",
            email: "carlos.rodriguez@techsolutions.com",
            telefono: "+34 600 123 456",
            documento: "12345678A",
            total_visitas: 15,
            ultima_visita: "2025-01-20",
            estado: "activo",
            visitas_completadas: 14,
            visitas_pendientes: 1,
            visitas_canceladas: 0,
            fecha_registro: "2024-06-15"
        },
        {
            id: 2,
            nombre: "María González López",
            empresa: "Consulting Group",
            email: "maria.gonzalez@consulting.com",
            telefono: "+34 611 234 567",
            documento: "23456789B",
            total_visitas: 8,
            ultima_visita: "2025-01-18",
            estado: "activo",
            visitas_completadas: 7,
            visitas_pendientes: 0,
            visitas_canceladas: 1,
            fecha_registro: "2024-08-20"
        },
        {
            id: 3,
            nombre: "Roberto Sánchez Mora",
            empresa: "Empresa Suspendida S.L.",
            email: "roberto.sanchez@suspendida.com",
            telefono: "+34 600 111 222",
            documento: "34567890C",
            total_visitas: 5,
            ultima_visita: "2025-01-14",
            estado: "bloqueado",
            visitas_completadas: 2,
            visitas_pendientes: 0,
            visitas_canceladas: 3,
            fecha_registro: "2024-10-05"
        },
        {
            id: 4,
            nombre: "Ana Martínez Ruiz",
            empresa: "Innovation Labs",
            email: "ana.martinez@innovation.com",
            telefono: "+34 622 345 678",
            documento: "45678901D",
            total_visitas: 22,
            ultima_visita: "2025-01-22",
            estado: "activo",
            visitas_completadas: 21,
            visitas_pendientes: 1,
            visitas_canceladas: 0,
            fecha_registro: "2024-03-10"
        },
        {
            id: 5,
            nombre: "Pedro Fernández Díaz",
            empresa: "Global Services",
            email: "pedro.fernandez@global.com",
            telefono: "+34 633 456 789",
            documento: "56789012E",
            total_visitas: 3,
            ultima_visita: "2024-11-30",
            estado: "inactivo",
            visitas_completadas: 3,
            visitas_pendientes: 0,
            visitas_canceladas: 0,
            fecha_registro: "2024-09-01"
        }
    ]

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            toast.error('Por favor ingresa un término de búsqueda')
            return
        }

        setIsSearching(true)

        setTimeout(() => {
            const results = mockVisitors.filter(visitor =>
                visitor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.documento.toLowerCase().includes(searchTerm.toLowerCase())
            )

            setSearchResults(results)
            setIsSearching(false)

            if (results.length === 0) {
                toast.error('No se encontraron visitantes')
            } else {
                toast.success(`Se encontraron ${results.length} visitante${results.length !== 1 ? 's' : ''}`)
            }
        }, 800)
    }

    const handleViewDetails = (visitor: Visitor) => {
        setSelectedVisitor(visitor)
        loadVisitHistory(visitor.id)
        setShowDetailModal(true)
    }

    const loadVisitHistory = (visitorId: number) => {
        // Mock visit history
        const mockHistory: VisitHistory[] = [
            {
                id: 1,
                fecha: "2025-01-20",
                hora_entrada: "09:30",
                hora_salida: "11:45",
                sede: "Sede Central - Madrid",
                departamento: "IT",
                motivo: "Reunión técnica",
                estado: "completada",
                anfitrion: "Juan Pérez"
            },
            {
                id: 2,
                fecha: "2025-01-15",
                hora_entrada: "14:00",
                hora_salida: "16:30",
                sede: "Sede Central - Madrid",
                departamento: "Recursos Humanos",
                motivo: "Entrevista",
                estado: "completada",
                anfitrion: "María López"
            },
            {
                id: 3,
                fecha: "2025-01-10",
                hora_entrada: "10:00",
                sede: "Sede Norte - Barcelona",
                departamento: "Ventas",
                motivo: "Presentación comercial",
                estado: "en_proceso",
                anfitrion: "Carlos Ruiz"
            }
        ]
        setVisitHistory(mockHistory)
    }

    const handleBlockVisitor = () => {
        if (!blockReason.trim()) {
            toast.error('Por favor ingresa la razón del bloqueo')
            return
        }

        setIsBlocking(true)
        setTimeout(() => {
            if (selectedVisitor) {
                toast.success(`${selectedVisitor.nombre} ha sido bloqueado`)
                setShowBlockModal(false)
                setShowDetailModal(false)
                setBlockReason('')
                // Update visitor status in results
                setSearchResults(prev => prev.map(v =>
                    v.id === selectedVisitor.id ? { ...v, estado: 'bloqueado' as const } : v
                ))
            }
            setIsBlocking(false)
        }, 1500)
    }

    const handleUnblockVisitor = () => {
        if (selectedVisitor) {
            toast.success(`${selectedVisitor.nombre} ha sido desbloqueado`)
            setSearchResults(prev => prev.map(v =>
                v.id === selectedVisitor.id ? { ...v, estado: 'activo' as const } : v
            ))
            setShowDetailModal(false)
        }
    }

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
                                    <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                                </div>
                                Buscar Visitante
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Búsqueda global de visitantes y su historial completo
                            </p>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="p-6 max-w-7xl mx-auto">
                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8"
                >
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Buscar por nombre, empresa, email o documento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-12 h-14 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 text-lg"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg"
                        >
                            {isSearching ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                                    Buscar
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="mt-4 flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Sugerencias:</span>
                        <button onClick={() => setSearchTerm('Carlos')} className="text-blue-600 hover:underline">Carlos</button>
                        <span>•</span>
                        <button onClick={() => setSearchTerm('Tech Solutions')} className="text-blue-600 hover:underline">Tech Solutions</button>
                        <span>•</span>
                        <button onClick={() => setSearchTerm('12345678A')} className="text-blue-600 hover:underline">12345678A</button>
                    </div>
                </motion.div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Resultados de búsqueda ({searchResults.length})
                        </h2>

                        {searchResults.map((visitor, index) => (
                            <motion.div
                                key={visitor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left: Visitor Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${visitor.estado === 'bloqueado' ? 'bg-gradient-to-br from-red-500 to-orange-600' :
                                                            visitor.estado === 'inactivo' ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                                                'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                        }`}>
                                                        {visitor.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">
                                                            {visitor.nombre}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                            <BuildingOfficeIcon className="h-4 w-4" />
                                                            {visitor.empresa}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                            Doc: {visitor.documento}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={
                                                    visitor.estado === 'bloqueado' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        visitor.estado === 'inactivo' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' :
                                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                }>
                                                    {visitor.estado === 'bloqueado' && <LockClosedIcon className="h-3 w-3 mr-1" />}
                                                    {visitor.estado === 'activo' ? 'Activo' : visitor.estado === 'bloqueado' ? 'Bloqueado' : 'Inactivo'}
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <EnvelopeIcon className="h-4 w-4 text-blue-500" />
                                                    <span className="truncate">{visitor.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <PhoneIcon className="h-4 w-4 text-green-500" />
                                                    <span>{visitor.telefono}</span>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-4 gap-3">
                                                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                                                    <p className="text-2xl font-bold text-blue-600">{visitor.total_visitas}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                                                </div>
                                                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center">
                                                    <p className="text-2xl font-bold text-green-600">{visitor.visitas_completadas}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Completadas</p>
                                                </div>
                                                <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3 text-center">
                                                    <p className="text-2xl font-bold text-yellow-600">{visitor.visitas_pendientes}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Pendientes</p>
                                                </div>
                                                <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center">
                                                    <p className="text-2xl font-bold text-red-600">{visitor.visitas_canceladas}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Canceladas</p>
                                                </div>
                                            </div>

                                            {visitor.ultima_visita && (
                                                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    Última visita: {new Date(visitor.ultima_visita).toLocaleDateString('es-ES')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex flex-col gap-3 lg:w-48">
                                            <Button
                                                onClick={() => handleViewDetails(visitor)}
                                                variant="outline"
                                                className="w-full border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-2" />
                                                Ver Detalles
                                            </Button>
                                            {visitor.estado === 'bloqueado' ? (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedVisitor(visitor)
                                                        handleUnblockVisitor()
                                                    }}
                                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                                >
                                                    <LockOpenIcon className="h-4 w-4 mr-2" />
                                                    Desbloquear
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedVisitor(visitor)
                                                        setShowBlockModal(true)
                                                    }}
                                                    variant="outline"
                                                    className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                                                    Bloquear
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedVisitor && (
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
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Perfil del Visitante</h2>
                                        <p className="text-blue-100 text-sm mt-1">Información completa e historial</p>
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
                                {/* Visitor Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-blue-500" />
                                        Información Personal
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre Completo</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisitor.nombre}</p>
                                        </div>
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Empresa</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisitor.empresa}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Documento</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisitor.documento}</p>
                                        </div>
                                        <div className="p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border-2 border-cyan-200 dark:border-cyan-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg capitalize">{selectedVisitor.estado}</p>
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

                                {/* Visit History */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
                                        Historial de Visitas
                                    </h3>
                                    <div className="space-y-3">
                                        {visitHistory.map((visit) => (
                                            <div key={visit.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border-l-4 border-blue-500">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{visit.motivo}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{visit.sede} • {visit.departamento}</p>
                                                    </div>
                                                    <Badge className={
                                                        visit.estado === 'completada' ? 'bg-green-100 text-green-700' :
                                                            visit.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                    }>
                                                        {visit.estado === 'completada' ? 'Completada' : visit.estado === 'en_proceso' ? 'En Proceso' : 'Cancelada'}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <CalendarIcon className="h-4 w-4" />
                                                        {new Date(visit.fecha).toLocaleDateString('es-ES')}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <ClockIcon className="h-4 w-4" />
                                                        {visit.hora_entrada} {visit.hora_salida && `- ${visit.hora_salida}`}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <UserIcon className="h-4 w-4" />
                                                        {visit.anfitrion}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                                    Cerrar
                                </Button>
                                {selectedVisitor.estado !== 'bloqueado' && (
                                    <Button
                                        onClick={() => {
                                            setShowDetailModal(false)
                                            setShowBlockModal(true)
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                                        Bloquear Visitante
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Block Modal */}
            <AnimatePresence>
                {showBlockModal && selectedVisitor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowBlockModal(false)}
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
                                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bloquear Visitante</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Estás a punto de bloquear a <strong>{selectedVisitor.nombre}</strong>.
                                    Esta acción impedirá que el visitante pueda registrar nuevas visitas.
                                </p>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Razón del bloqueo *
                                    </label>
                                    <textarea
                                        value={blockReason}
                                        onChange={(e) => setBlockReason(e.target.value)}
                                        placeholder="Describe la razón del bloqueo..."
                                        className="w-full h-24 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setShowBlockModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleBlockVisitor}
                                        disabled={isBlocking}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isBlocking ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Bloqueando...
                                            </>
                                        ) : (
                                            <>
                                                <LockClosedIcon className="h-4 w-4 mr-2" />
                                                Bloquear
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
