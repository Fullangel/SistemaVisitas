import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Download, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PeriodData {
    period: string
    total_visits: number
    approved: number
    rejected: number
    pending: number
    avg_duration: string
    peak_day: string
    growth: number
}

export default function ReportePorPeriodo() {
    const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
    const [year, setYear] = useState('2025')

    // Mock data
    const monthlyData: PeriodData[] = [
        { period: 'Enero 2025', total_visits: 342, approved: 298, rejected: 12, pending: 32, avg_duration: '2h 15m', peak_day: 'Lunes', growth: 12.5 },
        { period: 'Febrero 2025', total_visits: 389, approved: 345, rejected: 15, pending: 29, avg_duration: '2h 05m', peak_day: 'Martes', growth: 13.7 },
        { period: 'Marzo 2025', total_visits: 412, approved: 378, rejected: 10, pending: 24, avg_duration: '2h 20m', peak_day: 'Miércoles', growth: 5.9 },
        { period: 'Abril 2025', total_visits: 456, approved: 421, rejected: 8, pending: 27, avg_duration: '2h 10m', peak_day: 'Jueves', growth: 10.7 },
        { period: 'Mayo 2025', total_visits: 398, approved: 362, rejected: 14, pending: 22, avg_duration: '2h 25m', peak_day: 'Viernes', growth: -12.7 },
        { period: 'Junio 2025', total_visits: 445, approved: 405, rejected: 11, pending: 29, avg_duration: '2h 15m', peak_day: 'Lunes', growth: 11.8 },
    ]

    const weeklyData: PeriodData[] = [
        { period: 'Semana 1', total_visits: 98, approved: 89, rejected: 3, pending: 6, avg_duration: '2h 10m', peak_day: 'Miércoles', growth: 8.5 },
        { period: 'Semana 2', total_visits: 112, approved: 102, rejected: 4, pending: 6, avg_duration: '2h 15m', peak_day: 'Jueves', growth: 14.3 },
        { period: 'Semana 3', total_visits: 105, approved: 96, rejected: 2, pending: 7, avg_duration: '2h 05m', peak_day: 'Martes', growth: -6.3 },
        { period: 'Semana 4', total_visits: 130, approved: 118, rejected: 5, pending: 7, avg_duration: '2h 20m', peak_day: 'Lunes', growth: 23.8 },
    ]

    const dailyData: PeriodData[] = [
        { period: 'Lunes', total_visits: 45, approved: 41, rejected: 1, pending: 3, avg_duration: '2h 15m', peak_day: '10:00 AM', growth: 12.5 },
        { period: 'Martes', total_visits: 52, approved: 48, rejected: 2, pending: 2, avg_duration: '2h 10m', peak_day: '11:00 AM', growth: 15.6 },
        { period: 'Miércoles', total_visits: 48, approved: 44, rejected: 1, pending: 3, avg_duration: '2h 20m', peak_day: '09:00 AM', growth: -7.7 },
        { period: 'Jueves', total_visits: 56, approved: 51, rejected: 2, pending: 3, avg_duration: '2h 05m', peak_day: '10:30 AM', growth: 16.7 },
        { period: 'Viernes', total_visits: 42, approved: 38, rejected: 1, pending: 3, avg_duration: '2h 25m', peak_day: '02:00 PM', growth: -25.0 },
    ]

    const getCurrentData = () => {
        switch (viewType) {
            case 'daily': return dailyData
            case 'weekly': return weeklyData
            case 'monthly': return monthlyData
            default: return monthlyData
        }
    }

    const data = getCurrentData()
    const totalVisits = data.reduce((sum, item) => sum + item.total_visits, 0)
    const totalApproved = data.reduce((sum, item) => sum + item.approved, 0)
    const totalRejected = data.reduce((sum, item) => sum + item.rejected, 0)
    const totalPending = data.reduce((sum, item) => sum + item.pending, 0)

    const handleExport = () => {
        console.log('Exportando reporte por período...')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Reporte por Período
                        </h1>
                        <p className="text-gray-600">Análisis temporal de visitas y tendencias</p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vista</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewType('daily')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewType === 'daily'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Diario
                                </button>
                                <button
                                    onClick={() => setViewType('weekly')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewType === 'weekly'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Semanal
                                </button>
                                <button
                                    onClick={() => setViewType('monthly')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewType === 'monthly'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Mensual
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                            >
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="h-6 w-6 text-white/80" />
                        <Badge className="bg-white/20 text-white border-0">Total</Badge>
                    </div>
                    <p className="text-3xl font-bold">{totalVisits}</p>
                    <p className="text-white/80 text-sm mt-1">Visitas</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="h-6 w-6 text-white/80" />
                        <Badge className="bg-white/20 text-white border-0">Aprobadas</Badge>
                    </div>
                    <p className="text-3xl font-bold">{totalApproved}</p>
                    <p className="text-white/80 text-sm mt-1">{((totalApproved / totalVisits) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-5 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="h-6 w-6 text-white/80" />
                        <Badge className="bg-white/20 text-white border-0">Rechazadas</Badge>
                    </div>
                    <p className="text-3xl font-bold">{totalRejected}</p>
                    <p className="text-white/80 text-sm mt-1">{((totalRejected / totalVisits) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-5 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Calendar className="h-6 w-6 text-white/80" />
                        <Badge className="bg-white/20 text-white border-0">Pendientes</Badge>
                    </div>
                    <p className="text-3xl font-bold">{totalPending}</p>
                    <p className="text-white/80 text-sm mt-1">{((totalPending / totalVisits) * 100).toFixed(1)}%</p>
                </div>
            </motion.div>

            {/* Period Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                        Desglose por {viewType === 'daily' ? 'Día' : viewType === 'weekly' ? 'Semana' : 'Mes'}
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Período</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Total Visitas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Aprobadas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Rechazadas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Pendientes</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Duración Prom.</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Día Pico</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Crecimiento</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-lg">
                                                <Calendar className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{item.period}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-lg font-bold text-gray-900">{item.total_visits}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-green-100 text-green-700">{item.approved}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-red-100 text-red-700">{item.rejected}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-orange-100 text-orange-700">{item.pending}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">{item.avg_duration}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-700">{item.peak_day}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${item.growth > 0 ? 'text-green-600 bg-green-50' : item.growth < 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'
                                            }`}>
                                            {item.growth > 0 ? <TrendingUp className="h-4 w-4" /> : item.growth < 0 ? <TrendingUp className="h-4 w-4 rotate-180" /> : null}
                                            <span className="text-sm font-medium">
                                                {item.growth > 0 ? '+' : ''}{item.growth}%
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
