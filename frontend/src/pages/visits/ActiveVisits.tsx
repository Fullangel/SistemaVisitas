import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Users,
    Search,
    Clock,
    CheckCircle,
    Activity,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useActiveVisits, useCheckOutVisit } from "@/hooks/useVisits"
import { ErrorState } from "@/components/common/ErrorState"
import { StatsCard } from "@/components/common/StatsCard"
import { VisitCard } from "@/components/visits/VisitCard"
import { VisitsLoadingSkeleton } from "@/components/visits/VisitCardSkeleton"
import { EmptyVisitsState } from "@/components/visits/EmptyVisitsState"
import { VisitDetailModal } from "@/components/visits/VisitDetailModal"
import type { Visit } from "@/services/api/visits"

export default function ActiveVisitsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [siteFilter, setSiteFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

    // Fetch active visits from API
    const { data: activeVisits = [], isLoading, error, refetch } = useActiveVisits()
    const { mutate: checkOut, isLoading: isCheckingOut } = useCheckOutVisit()

    // Debug logging
    useEffect(() => {
        console.log('🔍 ActiveVisits Debug:', {
            isLoading,
            error: error ? (error as any).message || String(error) : null,
            visitsCount: activeVisits.length,
            visits: activeVisits
        })
    }, [isLoading, error, activeVisits])

    // Handle checkout
    const handleCheckOut = (visitId: number) => {
        checkOut(visitId, {
            onSuccess: () => {
                setShowDetailModal(false)
            }
        })
    }

    const handleViewDetails = (visit: Visit) => {
        setSelectedVisit(visit)
        setShowDetailModal(true)
    }

    // Filter visits based on search and filters
    const filteredVisits = activeVisits.filter(visit => {
        const matchesSearch =
            visit.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (visit.visitor_company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (visit.department?.name.toLowerCase() || '').includes(searchTerm.toLowerCase())

        const matchesSite = siteFilter === 'all' || visit.headquarter?.name === siteFilter
        const matchesStatus = statusFilter === 'all' || visit.status === statusFilter

        return matchesSearch && matchesSite && matchesStatus
    })

    // Calculate stats
    const stats = {
        total: activeVisits.length,
        inProgress: activeVisits.filter(v => v.status === 'in_progress').length,
        waiting: activeVisits.filter(v => v.status === 'pending').length
    }

    // Get unique sites for filter dropdown
    const uniqueSites = Array.from(new Set(activeVisits.map(v => v.headquarter?.name).filter(Boolean))) as string[]

    // Error state
    if (error) {
        console.error('❌ Error loading visits:', error)
        return <ErrorState message="Error al cargar las visitas activas" onRetry={refetch} />
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
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatsCard
                            title="Total Activas"
                            value={stats.total}
                            icon={Users}
                            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                        />
                        <StatsCard
                            title="En Proceso"
                            value={stats.inProgress}
                            icon={CheckCircle}
                            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
                        />
                        <StatsCard
                            title="Pendientes"
                            value={stats.waiting}
                            icon={Clock}
                            gradient="bg-gradient-to-br from-yellow-500 to-amber-600"
                        />
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
                            {uniqueSites.map(site => (
                                <option key={site} value={site}>🏢 {site}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">🔄 Todos los Estados</option>
                            <option value="in_progress">✅ En Proceso</option>
                            <option value="pending">⏳ Pendiente</option>
                        </select>
                    </div>
                </motion.div>

                {/* Visits List with Loading State */}
                {isLoading ? (
                    <VisitsLoadingSkeleton />
                ) : filteredVisits.length === 0 ? (
                    <EmptyVisitsState
                        title={searchTerm || siteFilter !== 'all' || statusFilter !== 'all'
                            ? "No se encontraron visitas"
                            : "No hay visitas activas"}
                        message={searchTerm || siteFilter !== 'all' || statusFilter !== 'all'
                            ? "Intenta ajustar los filtros de búsqueda para encontrar visitas"
                            : "No hay visitantes en las instalaciones en este momento"}
                        showAddButton={!searchTerm && siteFilter === 'all' && statusFilter === 'all'}
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredVisits.map((visit, index) => (
                            <VisitCard
                                key={visit.id}
                                visit={visit}
                                index={index}
                                onViewDetails={handleViewDetails}
                                onCheckOut={handleCheckOut}
                                isCheckingOut={isCheckingOut}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Visit Detail Modal */}
            <VisitDetailModal
                visit={selectedVisit}
                open={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                onCheckOut={handleCheckOut}
                isCheckingOut={isCheckingOut}
            />
            {/* TODO: Add IDCardModal component */}
        </div>
    )
}

