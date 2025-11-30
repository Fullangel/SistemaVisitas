import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Search,
    Clock,
    Building2,
    CheckCircle,
    Eye,
    UserCheck,
    MapPin,
    Phone,
    Mail,
    Briefcase,
    Calendar,
    Activity,
    X,
    QrCode,
    User,
    CreditCard,
    Download,
    ImageOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { QRCodeSVG } from 'qrcode.react'

interface ActiveVisit {
    id: number
    visitor_name: string
    visitor_email: string
    visitor_phone: string
    visitor_company: string
    visitor_document: string
    visitor_photo?: string
    id_card_photo?: string  // Photo of ID card
    site: string
    department: string
    check_in_time: string
    purpose: string
    status: 'in_progress' | 'waiting'
    duration: string
    host_name: string
    room?: string
    notes?: string
}

export default function ActiveVisitsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [siteFilter, setSiteFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [activeVisits, setActiveVisits] = useState<ActiveVisit[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedVisit, setSelectedVisit] = useState<ActiveVisit | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showIdCardModal, setShowIdCardModal] = useState(false)

    // Function to download ID card photo
    const downloadIdCardPhoto = (photoUrl: string, visitorName: string) => {
        const link = document.createElement('a')
        link.href = photoUrl
        link.download = `cedula_${visitorName.replace(/\s+/g, '_')}_${new Date().getTime()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Foto descargada exitosamente')
    }

    // Mock data
    useEffect(() => {
        setTimeout(() => {
            const mockVisits: ActiveVisit[] = [
                {
                    id: 1,
                    visitor_name: "Carlos Rodríguez García",
                    visitor_email: "carlos.rodriguez@techsolutions.com",
                    visitor_phone: "+34 600 123 456",
                    visitor_company: "Tech Solutions S.A.",
                    visitor_document: "12345678A",
                    id_card_photo: "https://via.placeholder.com/800x500/4F46E5/FFFFFF?text=ID+Card+Sample", // Has ID card photo
                    site: "Sede Central - Madrid",
                    department: "IT",
                    check_in_time: "09:30",
                    purpose: "Reunión técnica con el equipo de desarrollo",
                    status: "in_progress",
                    duration: "2h 15m",
                    host_name: "Juan Pérez",
                    room: "Sala 301"
                },
                {
                    id: 2,
                    visitor_name: "María González López",
                    visitor_email: "maria.gonzalez@consulting.com",
                    visitor_phone: "+34 611 234 567",
                    visitor_company: "Consulting Group",
                    visitor_document: "23456789B",
                    // No ID card photo
                    site: "Sede Norte - Barcelona",
                    department: "Recursos Humanos",
                    check_in_time: "10:15",
                    purpose: "Entrevista de trabajo",
                    status: "waiting",
                    duration: "45m",
                    host_name: "Ana Martínez"
                },
                {
                    id: 3,
                    visitor_name: "Roberto Sánchez Mora",
                    visitor_email: "roberto.sanchez@innovation.com",
                    visitor_phone: "+34 622 345 678",
                    visitor_company: "Innovation Labs",
                    visitor_document: "34567890C",
                    id_card_photo: "https://via.placeholder.com/800x500/10B981/FFFFFF?text=Cedula+Verificada", // Has ID card photo
                    site: "Sede Sur - Valencia",
                    department: "Marketing",
                    check_in_time: "11:00",
                    purpose: "Presentación de propuesta comercial",
                    status: "in_progress",
                    duration: "1h 30m",
                    host_name: "Laura Fernández",
                    room: "Sala 205"
                }
            ]
            setActiveVisits(mockVisits)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredVisits = activeVisits.filter(visit => {
        const matchesSearch =
            visit.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.visitor_company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visit.department.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesSite = siteFilter === 'all' || visit.site.includes(siteFilter)
        const matchesStatus = statusFilter === 'all' || visit.status === statusFilter

        return matchesSearch && matchesSite && matchesStatus
    })

    const handleCheckOut = async (visitId: number) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            setActiveVisits(prev => prev.filter(v => v.id !== visitId))
            toast.success('✅ Check-out realizado exitosamente')
        } catch (error) {
            console.error('Error during check-out:', error)
            toast.error('Error al realizar check-out')
        }
    }

    const handleViewDetails = (visit: ActiveVisit) => {
        setSelectedVisit(visit)
        setShowDetailModal(true)
    }

    const stats = {
        total: activeVisits.length,
        inProgress: activeVisits.filter(v => v.status === 'in_progress').length,
        waiting: activeVisits.filter(v => v.status === 'waiting').length
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
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
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                Visitas Activas
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Monitoreo en tiempo real de visitantes en las instalaciones
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-indigo-500 text-white px-4 py-2 text-sm">
                                <Activity className="h-4 w-4 mr-2 animate-pulse" />
                                En Vivo
                            </Badge>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Activas</p>
                                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <Users className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">En Proceso</p>
                                    <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">En Espera</p>
                                    <p className="text-3xl font-bold mt-1">{stats.waiting}</p>
                                </div>
                                <Clock className="h-8 w-8 opacity-80" />
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
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Buscar por nombre, empresa o departamento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500"
                            />
                        </div>

                        <select
                            value={siteFilter}
                            onChange={(e) => setSiteFilter(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">📍 Todas las Sedes</option>
                            <option value="Madrid">🏢 Madrid</option>
                            <option value="Barcelona">🏢 Barcelona</option>
                            <option value="Valencia">🏢 Valencia</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">🔄 Todos los Estados</option>
                            <option value="in_progress">✅ En Proceso</option>
                            <option value="waiting">⏳ En Espera</option>
                        </select>
                    </div>
                </motion.div>

                {/* Visits List */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto" />
                        <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">Cargando visitas activas...</p>
                    </div>
                ) : filteredVisits.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50"
                    >
                        <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No hay visitas activas
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Todas las visitas han finalizado
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredVisits.map((visit, index) => (
                            <motion.div
                                key={visit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all overflow-hidden"
                            >
                                <div className={`h-2 ${visit.status === 'in_progress' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-amber-500'}`} />

                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left: Visit Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                                        {visit.visitor_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">
                                                            {visit.visitor_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                            <Building2 className="h-4 w-4" />
                                                            {visit.visitor_company}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                            Doc: {visit.visitor_document}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={visit.status === 'in_progress'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }>
                                                    {visit.status === 'in_progress' ? 'En Proceso' : 'En Espera'}
                                                </Badge>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <Clock className="h-4 w-4 text-indigo-500" />
                                                    <span>Check-in: {visit.check_in_time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <Activity className="h-4 w-4 text-purple-500" />
                                                    <span>Duración: {visit.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <Building2 className="h-4 w-4 text-blue-500" />
                                                    <span>{visit.site}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <Briefcase className="h-4 w-4 text-green-500" />
                                                    <span>{visit.department}</span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-3">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    <strong className="text-gray-900 dark:text-white">Propósito:</strong> {visit.purpose}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <UserCheck className="h-3 w-3" />
                                                <span>Anfitrión: <strong>{visit.host_name}</strong></span>
                                                {visit.room && (
                                                    <>
                                                        <span>•</span>
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{visit.room}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex flex-col gap-3 lg:w-48">
                                            <Button
                                                onClick={() => handleViewDetails(visit)}
                                                variant="outline"
                                                className="w-full border-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-500"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Ver Detalles
                                            </Button>
                                            <Button
                                                onClick={() => handleCheckOut(visit.id)}
                                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                                            >
                                                <UserCheck className="h-4 w-4 mr-2" />
                                                Check-out
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal with Digital Badge */}
            <AnimatePresence>
                {showDetailModal && selectedVisit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <div className="flex gap-6 max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
                            {/* Digital Badge Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="w-96 flex-shrink-0"
                            >
                                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-1 shadow-2xl">
                                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6">
                                        <div className="text-center mb-6">
                                            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-bold text-sm mb-4">
                                                VISITANTE REGISTRADO
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                ID: #{selectedVisit.id.toString().padStart(6, '0')}
                                            </div>
                                        </div>

                                        <div className="flex justify-center mb-6">
                                            <div className="relative">
                                                <div className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white p-1">
                                                    <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                                        <User className="h-20 w-20 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className={`absolute bottom-2 right-2 h-8 w-8 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center ${selectedVisit.status === 'in_progress' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}>
                                                    <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="text-center">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                                    {selectedVisit.visitor_name}
                                                </h3>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {selectedVisit.visitor_company}
                                                </p>
                                            </div>

                                            <div className="space-y-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                                {selectedVisit.site && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Building2 className="h-4 w-4 text-blue-500" />
                                                        <span className="text-gray-700 dark:text-gray-300">{selectedVisit.site}</span>
                                                    </div>
                                                )}
                                                {selectedVisit.department && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Briefcase className="h-4 w-4 text-indigo-500" />
                                                        <span className="text-gray-700 dark:text-gray-300">{selectedVisit.department}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-purple-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {selectedVisit.check_in_time} - {selectedVisit.room || 'En curso'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4 text-pink-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {new Date().toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                                    <User className="h-4 w-4 text-orange-500" />
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                        Doc: {selectedVisit.visitor_document}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-col items-center border-2 border-gray-200 dark:border-gray-700">
                                            <div className="mb-2">
                                                <QRCodeSVG
                                                    value={JSON.stringify({
                                                        id: selectedVisit.id,
                                                        name: selectedVisit.visitor_name,
                                                        company: selectedVisit.visitor_company,
                                                        document: selectedVisit.visitor_document,
                                                        site: selectedVisit.site,
                                                        checkIn: selectedVisit.check_in_time
                                                    })}
                                                    size={180}
                                                    level="H"
                                                    includeMargin={true}
                                                />
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <QrCode className="h-3 w-3" />
                                                <span>Código de Verificación</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Sistema de Visitas Nacional
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Válido solo durante la visita
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
                                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold">Detalles de la Visita</h2>
                                            <p className="text-indigo-100 text-sm mt-1">Información completa del visitante</p>
                                        </div>
                                        <button
                                            onClick={() => setShowDetailModal(false)}
                                            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <User className="h-5 w-5 text-blue-500" />
                                            Información del Visitante
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre Completo</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.visitor_name}</p>
                                            </div>
                                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Empresa</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.visitor_company}</p>
                                            </div>
                                            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Documento</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.visitor_document}</p>
                                            </div>
                                            <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border-2 border-pink-200 dark:border-pink-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Anfitrión</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.host_name}</p>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{selectedVisit.visitor_email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{selectedVisit.visitor_phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ID Card Photo Section */}
                                    <div className="border-t-2 border-gray-200 pt-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-indigo-500" />
                                            Foto de Cédula
                                        </h3>

                                        {selectedVisit.id_card_photo ? (
                                            <div className="space-y-4">
                                                {/* Miniature view with expand option */}
                                                <div className="relative group">
                                                    <div
                                                        className="relative w-full aspect-[16/10] max-w-md mx-auto rounded-xl overflow-hidden border-4 border-green-500 shadow-lg cursor-pointer transition-transform hover:scale-105"
                                                        onClick={() => setShowIdCardModal(true)}
                                                    >
                                                        <img
                                                            src={selectedVisit.id_card_photo}
                                                            alt="Cédula del visitante"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-4 py-2 rounded-full">
                                                                <Eye className="h-5 w-5 text-gray-900 inline mr-2" />
                                                                <span className="text-sm font-medium text-gray-900">Ver completa</span>
                                                            </div>
                                                        </div>
                                                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            ✓ Verificada
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Download button */}
                                                <div className="flex justify-center">
                                                    <Button
                                                        onClick={() => downloadIdCardPhoto(selectedVisit.id_card_photo!, selectedVisit.visitor_name)}
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Descargar Cédula
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* No ID card photo */
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                                <ImageOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                                                    Sin foto de cédula
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                                    El visitante no proporcionó una foto de su documento de identidad
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-purple-500" />
                                            Detalles de la Visita
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200 dark:border-green-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sede</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedVisit.site}</p>
                                            </div>
                                            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border-2 border-cyan-200 dark:border-cyan-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Departamento</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedVisit.department}</p>
                                            </div>
                                            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hora de Entrada</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.check_in_time}</p>
                                            </div>
                                            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duración</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedVisit.duration}</p>
                                            </div>
                                            {selectedVisit.room && (
                                                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-lg border-2 border-rose-200 dark:border-rose-800">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ubicación</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedVisit.room}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Propósito de la Visita</h3>
                                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border-l-4 border-indigo-500">
                                            {selectedVisit.purpose}
                                        </p>
                                    </div>

                                    {selectedVisit.notes && (
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Notas Adicionales</h3>
                                            <p className="text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border-l-4 border-amber-500">
                                                {selectedVisit.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                                        Cerrar
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handleCheckOut(selectedVisit.id)
                                            setShowDetailModal(false)
                                        }}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                    >
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        Realizar Check-out
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ID Card Photo Expanded Modal */}
            <AnimatePresence>
                {showIdCardModal && selectedVisit?.id_card_photo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowIdCardModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setShowIdCardModal(false)}
                                className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Image */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-6 w-6" />
                                        <div>
                                            <h3 className="text-xl font-bold">Cédula de Identidad</h3>
                                            <p className="text-sm text-white/80">{selectedVisit.visitor_name}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => downloadIdCardPhoto(selectedVisit.id_card_photo!, selectedVisit.visitor_name)}
                                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Descargar
                                    </Button>
                                </div>
                                <div className="p-6 bg-gray-100">
                                    <img
                                        src={selectedVisit.id_card_photo}
                                        alt="Cédula del visitante - Vista completa"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
