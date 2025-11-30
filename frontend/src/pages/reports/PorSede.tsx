import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, TrendingUp, Users, Clock, Download, Calendar, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SiteReport {
    id: number
    name: string
    region: string
    total_visits: number
    active_visits: number
    pending_visits: number
    completed_visits: number
    avg_duration: string
    trend: 'up' | 'down' | 'stable'
    trend_percentage: number
}

export default function ReportePorSede() {
    const [selectedPeriod, setSelectedPeriod] = useState('30')
    const [selectedRegion, setSelectedRegion] = useState('all')

    // Mock data
    const siteReports: SiteReport[] = [
        { id: 1, name: 'Sede Principal Caracas', region: 'Capital', total_visits: 456, active_visits: 12, pending_visits: 8, completed_visits: 436, avg_duration: '2h 15m', trend: 'up', trend_percentage: 12.5 },
        { id: 2, name: 'Oficina Chacao', region: 'Capital', total_visits: 342, active_visits: 8, pending_visits: 5, completed_visits: 329, avg_duration: '1h 45m', trend: 'up', trend_percentage: 8.3 },
        { id: 3, name: 'Sede Maracaibo', region: 'Occidental', total_visits: 289, active_visits: 6, pending_visits: 4, completed_visits: 279, avg_duration: '2h 30m', trend: 'stable', trend_percentage: 0 },
        { id: 4, name: 'Oficina Valencia', region: 'Central', total_visits: 234, active_visits: 5, pending_visits: 3, completed_visits: 226, avg_duration: '1h 50m', trend: 'down', trend_percentage: -5.2 },
        { id: 5, name: 'Sede Barquisimeto', region: 'Centro-Occidental', total_visits: 198, active_visits: 4, pending_visits: 2, completed_visits: 192, avg_duration: '2h 05m', trend: 'up', trend_percentage: 15.7 },
    ]

    const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
        if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
        if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
        return <div className="h-4 w-4 border-t-2 border-gray-400"></div>
    }

    const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
        if (trend === 'up') return 'text-green-600 bg-green-50'
        if (trend === 'down') return 'text-red-600 bg-red-50'
        return 'text-gray-600 bg-gray-50'
    }

    const handleExport = () => {
        console.log('Exportando reporte por sede...')
    }

    const totalVisits = siteReports.reduce((sum, site) => sum + site.total_visits, 0)
    const totalActive = siteReports.reduce((sum, site) => sum + site.active_visits, 0)
    const totalPending = siteReports.reduce((sum, site) => sum + site.pending_visits, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Reporte por Sede
                        </h1>
                        <p className="text-gray-600">Análisis detallado de visitas por ubicación</p>
                    </div>
                    <Button onClick={handleExport} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Reporte
                    </Button>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                            >
                                <option value="7">Últimos 7 días</option>
                                <option value="30">Últimos 30 días</option>
                                <option value="90">Últimos 90 días</option>
                                <option value="365">Último año</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                            >
                                <option value="all">Todas las regiones</option>
                                <option value="capital">Capital</option>
                                <option value="occidental">Occidental</option>
                                <option value="central">Central</option>
                                <option value="centro-occidental">Centro-Occidental</option>
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Total Visitas</p>
                            <p className="text-4xl font-bold mt-2">{totalVisits.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                            <Users className="h-8 w-8" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Visitas Activas</p>
                            <p className="text-4xl font-bold mt-2">{totalActive}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                            <Clock className="h-8 w-8" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Pendientes</p>
                            <p className="text-4xl font-bold mt-2">{totalPending}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                            <Calendar className="h-8 w-8" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Sites Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                        Desglose por Sede
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Sede</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Región</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Total Visitas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Activas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Pendientes</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Completadas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Duración Prom.</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Tendencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {siteReports.map((site, index) => (
                                <motion.tr
                                    key={site.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-lg">
                                                <Building2 className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{site.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline">{site.region}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-lg font-bold text-gray-900">{site.total_visits}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-green-100 text-green-700">{site.active_visits}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-orange-100 text-orange-700">{site.pending_visits}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-700">{site.completed_visits}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">{site.avg_duration}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getTrendColor(site.trend)}`}>
                                            {getTrendIcon(site.trend)}
                                            <span className="text-sm font-medium">
                                                {site.trend_percentage > 0 ? '+' : ''}{site.trend_percentage}%
                                            </span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
