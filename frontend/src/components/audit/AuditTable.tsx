import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, Eye, User, MapPin, Clock, X, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface AuditLog {
    id: number
    timestamp: string
    user_id: number
    user_name: string
    user_role: string
    action: string
    module: string
    description: string
    ip_address: string
    status: 'success' | 'warning' | 'error'
    details?: any
}

interface AuditTableProps {
    title: string
    description: string
    logs: AuditLog[]
    getActionIcon: (action: string) => JSX.Element
    getActionColor: (action: string) => string
}

export default function AuditTable({ title, description, logs, getActionIcon, getActionColor }: AuditTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading] = useState(false)
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
    const [showModal, setShowModal] = useState(false)

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.module.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const getStatusBadge = (status: 'success' | 'warning' | 'error') => {
        switch (status) {
            case 'success':
                return <Badge className="bg-green-100 text-green-700 border-green-200">Exitoso</Badge>
            case 'warning':
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Advertencia</Badge>
            case 'error':
                return <Badge className="bg-red-100 text-red-700 border-red-200">Error</Badge>
        }
    }

    const handleExport = () => {
        // Crear CSV con los logs filtrados
        const headers = ['Fecha/Hora', 'Usuario', 'Rol', 'Acción', 'Módulo', 'Descripción', 'IP', 'Estado']
        const csvData = filteredLogs.map(log => [
            log.timestamp,
            log.user_name,
            log.user_role,
            log.action,
            log.module,
            log.description,
            log.ip_address,
            log.status
        ])

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `auditoria_${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleViewDetails = (log: AuditLog) => {
        setSelectedLog(log)
        setShowModal(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            {title}
                        </h1>
                        <p className="text-gray-600">{description}</p>
                    </div>
                    <Button onClick={handleExport} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar a CSV
                    </Button>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Buscar en logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select className="px-4 py-2 border-2 border-gray-300 rounded-lg">
                            <option value="today">Hoy</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                            <option value="all">Todo el tiempo</option>
                        </select>
                        <select className="px-4 py-2 border-2 border-gray-300 rounded-lg">
                            <option value="all">Todos los módulos</option>
                            <option value="visits">Visitas</option>
                            <option value="employees">Empleados</option>
                            <option value="config">Configuración</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Logs Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha/Hora</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Acción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Módulo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">IP</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Detalles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        Cargando logs...
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron registros
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-900">{log.timestamp}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{log.user_name}</p>
                                                    <p className="text-xs text-gray-500">{log.user_role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getActionColor(log.action)}`}>
                                                {getActionIcon(log.action)}
                                                <span className="text-sm font-medium capitalize">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline">{log.module}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{log.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                {log.ip_address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(log.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal de Detalles - Diseño Mejorado */}
            <AnimatePresence>
                {showModal && selectedLog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
                        >
                            {/* Header con Gradiente Vibrante */}
                            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-8">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold">Detalles del Log</h2>
                                            <p className="text-white/80 mt-1">Información completa del registro</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all hover:rotate-90 duration-300"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Content con Scroll */}
                            <div className="p-8 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                                {/* ID y Timestamp - Cards con Gradiente */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-indigo-100"
                                    >
                                        <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                            ID del Log
                                        </label>
                                        <p className="mt-2 text-2xl font-bold text-indigo-900">#{selectedLog.id}</p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100"
                                    >
                                        <label className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Fecha y Hora
                                        </label>
                                        <p className="mt-2 text-xl font-bold text-purple-900">{selectedLog.timestamp}</p>
                                    </motion.div>
                                </div>

                                {/* Usuario - Card Destacado */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                                >
                                    <label className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-white/90">
                                        <User className="h-5 w-5" />
                                        Información del Usuario
                                    </label>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                            <User className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">{selectedLog.user_name}</p>
                                            <div className="flex items-center gap-3 mt-2 text-white/80">
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">ID: {selectedLog.user_id}</span>
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm capitalize">{selectedLog.user_role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Acción y Módulo */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md"
                                    >
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Acción Realizada</label>
                                        <div className={`mt-3 inline-flex items-center gap-3 px-5 py-3 rounded-xl ${getActionColor(selectedLog.action)} shadow-sm`}>
                                            <div className="scale-125">
                                                {getActionIcon(selectedLog.action)}
                                            </div>
                                            <span className="text-lg font-bold capitalize">{selectedLog.action}</span>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md"
                                    >
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Módulo Afectado</label>
                                        <div className="mt-3">
                                            <Badge variant="outline" className="text-lg px-5 py-2 border-2 border-indigo-200 text-indigo-700 bg-indigo-50">
                                                {selectedLog.module}
                                            </Badge>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Descripción - Card Expandido */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200"
                                >
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Descripción Detallada
                                    </label>
                                    <p className="mt-3 text-gray-900 text-base leading-relaxed">{selectedLog.description}</p>
                                </motion.div>

                                {/* IP y Estado */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 border-2 border-cyan-100"
                                    >
                                        <label className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Dirección IP
                                        </label>
                                        <p className="mt-3 text-xl font-bold text-cyan-900 font-mono">{selectedLog.ip_address}</p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.45 }}
                                        className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md"
                                    >
                                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Estado del Log</label>
                                        <div className="mt-3 transform scale-110 origin-left">
                                            {getStatusBadge(selectedLog.status)}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Footer con Gradiente Sutil */}
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-5 border-t-2 border-gray-100 flex justify-between items-center">
                                <p className="text-sm text-gray-500">Log registrado en el sistema</p>
                                <Button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all px-8"
                                >
                                    Cerrar
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
