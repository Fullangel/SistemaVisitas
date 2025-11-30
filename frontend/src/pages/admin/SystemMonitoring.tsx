import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Activity,
    Database,
    Server,
    Users,
    HardDrive,
    Cpu,
    Wifi,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Clock,
    BarChart3,
    Zap,
    Globe
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SystemMetric {
    label: string
    value: string | number
    unit?: string
    status: 'good' | 'warning' | 'critical'
    trend?: 'up' | 'down' | 'stable'
    trendValue?: number
}

interface DatabaseMetric {
    name: string
    size: string
    tables: number
    connections: number
    status: 'online' | 'offline'
}

export default function SystemMonitoring() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
    const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetric[]>([])
    const [activeUsers, setActiveUsers] = useState(0)
    const [requestsPerMinute, setRequestsPerMinute] = useState(0)

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Simulate real-time metrics updates
    useEffect(() => {
        const updateMetrics = () => {
            // System metrics
            const cpuUsage = Math.floor(Math.random() * 40) + 20 // 20-60%
            const memoryUsage = Math.floor(Math.random() * 30) + 40 // 40-70%
            const diskUsage = Math.floor(Math.random() * 20) + 30 // 30-50%
            const networkLatency = Math.floor(Math.random() * 50) + 10 // 10-60ms

            setSystemMetrics([
                {
                    label: 'CPU',
                    value: cpuUsage,
                    unit: '%',
                    status: cpuUsage > 80 ? 'critical' : cpuUsage > 60 ? 'warning' : 'good',
                    trend: cpuUsage > 50 ? 'up' : 'down',
                    trendValue: Math.floor(Math.random() * 10)
                },
                {
                    label: 'Memoria RAM',
                    value: memoryUsage,
                    unit: '%',
                    status: memoryUsage > 85 ? 'critical' : memoryUsage > 70 ? 'warning' : 'good',
                    trend: memoryUsage > 60 ? 'up' : 'down',
                    trendValue: Math.floor(Math.random() * 8)
                },
                {
                    label: 'Disco',
                    value: diskUsage,
                    unit: '%',
                    status: diskUsage > 90 ? 'critical' : diskUsage > 75 ? 'warning' : 'good',
                    trend: 'stable',
                    trendValue: 0
                },
                {
                    label: 'Latencia',
                    value: networkLatency,
                    unit: 'ms',
                    status: networkLatency > 100 ? 'critical' : networkLatency > 50 ? 'warning' : 'good',
                    trend: networkLatency < 30 ? 'down' : 'up',
                    trendValue: Math.floor(Math.random() * 5)
                }
            ])

            // Active users and requests
            setActiveUsers(Math.floor(Math.random() * 50) + 10)
            setRequestsPerMinute(Math.floor(Math.random() * 200) + 50)

            // Database metrics
            setDatabaseMetrics([
                {
                    name: 'MySQL Principal',
                    size: '2.4 GB',
                    tables: 45,
                    connections: Math.floor(Math.random() * 20) + 5,
                    status: 'online'
                },
                {
                    name: 'Redis Cache',
                    size: '512 MB',
                    tables: 8,
                    connections: Math.floor(Math.random() * 10) + 2,
                    status: 'online'
                }
            ])
        }

        updateMetrics()
        const interval = setInterval(updateMetrics, 3000) // Update every 3 seconds
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
        switch (status) {
            case 'good': return 'text-green-600 bg-green-50 border-green-200'
            case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200'
            case 'critical': return 'text-red-600 bg-red-50 border-red-200'
        }
    }

    const getStatusBadge = (status: 'good' | 'warning' | 'critical') => {
        switch (status) {
            case 'good': return <Badge className="bg-green-100 text-green-700">Óptimo</Badge>
            case 'warning': return <Badge className="bg-orange-100 text-orange-700">Alerta</Badge>
            case 'critical': return <Badge className="bg-red-100 text-red-700">Crítico</Badge>
        }
    }

    const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />
            case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />
            default: return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Monitoreo del Sistema
                        </h1>
                        <p className="text-gray-600">Métricas en tiempo real del sistema y base de datos</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Clock className="h-5 w-5" />
                            <span className="text-2xl font-bold font-mono">
                                {currentTime.toLocaleTimeString('es-ES')}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            {currentTime.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Live Status Indicators */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">En Línea</span>
                        </div>
                    </div>
                    <p className="text-white/80 text-sm">Estado del Sistema</p>
                    <p className="text-3xl font-bold mt-2">Operativo</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <Users className="h-8 w-8" />
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Activos</Badge>
                    </div>
                    <p className="text-white/80 text-sm">Usuarios Conectados</p>
                    <p className="text-3xl font-bold mt-2">{activeUsers}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <Zap className="h-8 w-8" />
                        </div>
                        <Badge className="bg-white/20 text-white border-0">RPM</Badge>
                    </div>
                    <p className="text-white/80 text-sm">Peticiones/Minuto</p>
                    <p className="text-3xl font-bold mt-2">{requestsPerMinute}</p>
                </div>
            </motion.div>

            {/* System Metrics */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Server className="h-6 w-6 text-indigo-600" />
                            Recursos del Servidor
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {systemMetrics.map((metric, index) => (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className={`p-6 rounded-xl border-2 ${getStatusColor(metric.status)}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium">{metric.label}</span>
                                        {getStatusBadge(metric.status)}
                                    </div>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-bold">
                                            {metric.value}
                                        </span>
                                        <span className="text-xl text-gray-600 mb-1">{metric.unit}</span>
                                    </div>
                                    {metric.trend && (
                                        <div className="flex items-center gap-2 text-sm">
                                            {getTrendIcon(metric.trend)}
                                            <span className="text-gray-600">
                                                {metric.trendValue}% vs anterior
                                            </span>
                                        </div>
                                    )}
                                    {/* Progress bar */}
                                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.value}%` }}
                                            transition={{ duration: 0.5 }}
                                            className={`h-full ${metric.status === 'good' ? 'bg-green-500' :
                                                    metric.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                                                }`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Database Metrics */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Database className="h-6 w-6 text-green-600" />
                            Estado de Bases de Datos
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {databaseMetrics.map((db, index) => (
                                <motion.div
                                    key={db.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">{db.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <Badge className="bg-green-100 text-green-700">{db.status}</Badge>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-white rounded-lg">
                                            <HardDrive className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                                            <p className="text-xs text-gray-600">Tamaño</p>
                                            <p className="text-lg font-bold text-gray-900">{db.size}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg">
                                            <BarChart3 className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                                            <p className="text-xs text-gray-600">Tablas</p>
                                            <p className="text-lg font-bold text-gray-900">{db.tables}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg">
                                            <Wifi className="h-5 w-5 text-green-500 mx-auto mb-2" />
                                            <p className="text-xs text-gray-600">Conexiones</p>
                                            <p className="text-lg font-bold text-gray-900">{db.connections}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Cpu className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Uptime</p>
                            <p className="text-xl font-bold text-gray-900">99.9%</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Disponibilidad del sistema en los últimos 30 días</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <Globe className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tráfico Total</p>
                            <p className="text-xl font-bold text-gray-900">1.2M</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Peticiones procesadas este mes</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Rendimiento</p>
                            <p className="text-xl font-bold text-gray-900">Excelente</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">Tiempo de respuesta promedio: 45ms</p>
                </div>
            </motion.div>
        </div>
    )
}
