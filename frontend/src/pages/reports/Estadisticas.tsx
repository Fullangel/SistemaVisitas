import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Download, TrendingUp, Users, Clock, Building2, Calendar, Award, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Estadisticas() {
    const [period, setPeriod] = useState('30')

    // Mock statistics data
    const stats = {
        total_visits: 1247,
        avg_daily: 41.6,
        avg_duration: '2h 15m',
        completion_rate: 92.5,
        approval_rate: 88.3,
        peak_hour: '10:00 - 11:00 AM',
        busiest_day: 'Jueves',
        top_sede: 'Sede Principal Caracas',
        growth_rate: 15.7,
        unique_visitors: 892
    }

    const topVisitors = [
        { name: 'Carlos Rodríguez', company: 'Tech Solutions S.A.', visits: 45, last_visit: '2025-11-25' },
        { name: 'Ana Martínez', company: 'Global Consulting', visits: 38, last_visit: '2025-11-24' },
        { name: 'Luis Pérez', company: 'Innovation Labs', visits: 32, last_visit: '2025-11-23' },
        { name: 'María González', company: 'Digital Agency', visits: 28, last_visit: '2025-11-22' },
        { name: 'Juan Sánchez', company: 'Creative Studio', visits: 25, last_visit: '2025-11-21' },
    ]

    const visitsByPurpose = [
        { purpose: 'Reunión de Negocios', count: 456, percentage: 36.6 },
        { purpose: 'Entrevista', count: 342, percentage: 27.4 },
        { purpose: 'Capacitación', count: 234, percentage: 18.8 },
        { purpose: 'Proveedor', count: 156, percentage: 12.5 },
        { purpose: 'Otros', count: 59, percentage: 4.7 },
    ]

    const handleExport = () => {
        console.log('Exportando estadísticas...')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Estadísticas Avanzadas
                        </h1>
                        <p className="text-gray-600">Métricas clave y análisis de rendimiento</p>
                    </div>
                    <Button onClick={handleExport} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Estadísticas
                    </Button>
                </div>
            </motion.div>

            {/* Filter */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Período:</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg"
                        >
                            <option value="7">Últimos 7 días</option>
                            <option value="30">Últimos 30 días</option>
                            <option value="90">Últimos 90 días</option>
                            <option value="365">Último año</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Key Metrics Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-xl">
                    <Users className="h-8 w-8 mb-3 text-white/80" />
                    <p className="text-3xl font-bold">{stats.total_visits.toLocaleString()}</p>
                    <p className="text-white/80 text-sm mt-1">Total Visitas</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
                    <Target className="h-8 w-8 mb-3 text-white/80" />
                    <p className="text-3xl font-bold">{stats.avg_daily}</p>
                    <p className="text-white/80 text-sm mt-1">Promedio Diario</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-xl">
                    <Clock className="h-8 w-8 mb-3 text-white/80" />
                    <p className="text-3xl font-bold">{stats.avg_duration}</p>
                    <p className="text-white/80 text-sm mt-1">Duración Prom.</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-xl">
                    <Award className="h-8 w-8 mb-3 text-white/80" />
                    <p className="text-3xl font-bold">{stats.completion_rate}%</p>
                    <p className="text-white/80 text-sm mt-1">Tasa Completadas</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-5 text-white shadow-xl">
                    <TrendingUp className="h-8 w-8 mb-3 text-white/80" />
                    <p className="text-3xl font-bold">+{stats.growth_rate}%</p>
                    <p className="text-white/80 text-sm mt-1">Crecimiento</p>
                </div>
            </motion.div>

            {/* Additional Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                            <Clock className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Hora Pico</p>
                            <p className="text-xl font-bold text-gray-900">{stats.peak_hour}</p>
                        </div>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-700">Mayor tráfico</Badge>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Día más Activo</p>
                            <p className="text-xl font-bold text-gray-900">{stats.busiest_day}</p>
                        </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Más visitas</Badge>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <Building2 className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Sede Principal</p>
                            <p className="text-xl font-bold text-gray-900">{stats.top_sede}</p>
                        </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">Top sede</Badge>
                </motion.div>
            </div>

            {/* Tables Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Visitors */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="h-6 w-6 text-indigo-600" />
                            Visitantes Frecuentes
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {topVisitors.map((visitor, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-bold">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{visitor.name}</p>
                                            <p className="text-sm text-gray-600">{visitor.company}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-indigo-100 text-indigo-700">{visitor.visits} visitas</Badge>
                                        <p className="text-xs text-gray-500 mt-1">{visitor.last_visit}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Visits by Purpose */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-green-600" />
                            Visitas por Motivo
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {visitsByPurpose.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">{item.purpose}</span>
                                        <span className="text-sm font-bold text-gray-900">{item.count} ({item.percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
