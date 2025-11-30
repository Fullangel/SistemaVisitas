import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bot,
    MessageSquare,
    Activity,
    Settings,
    Power,
    PowerOff,
    TrendingUp,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Eye,
    Download,
    Plus,
    Edit,
    Trash2,
    BarChart3,
    Zap,
    Globe,
    Phone,
    Mail,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

interface BotConfig {
    id: number
    name: string
    type: 'whatsapp' | 'telegram' | 'webchat' | 'email'
    status: 'active' | 'inactive' | 'error'
    description: string
    created_at: string
    last_activity: string
    total_conversations: number
    pre_registrations: number
    success_rate: number
    avg_response_time: string
    active_conversations: number
    config: {
        auto_response: boolean
        working_hours: string
        max_concurrent: number
    }
}

interface BotLog {
    id: number
    bot_id: number
    timestamp: string
    user: string
    action: string
    status: 'success' | 'error' | 'pending'
}

export default function BotManagement() {
    const [bots, setBots] = useState<BotConfig[]>([])
    const [selectedBot, setSelectedBot] = useState<BotConfig | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showConfigModal, setShowConfigModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

    // Mock data
    useEffect(() => {
        const mockBots: BotConfig[] = [
            {
                id: 1,
                name: 'WhatsApp Pre-Registro',
                type: 'whatsapp',
                status: 'active',
                description: 'Bot para pre-registro de visitantes vía WhatsApp',
                created_at: '2025-01-15',
                last_activity: '2025-11-27 20:45:00',
                total_conversations: 1247,
                pre_registrations: 892,
                success_rate: 71.5,
                avg_response_time: '2.3s',
                active_conversations: 12,
                config: {
                    auto_response: true,
                    working_hours: '08:00 - 20:00',
                    max_concurrent: 50
                }
            },
            {
                id: 2,
                name: 'Telegram Notificaciones',
                type: 'telegram',
                status: 'active',
                description: 'Bot para envío de notificaciones y consultas',
                created_at: '2025-02-01',
                last_activity: '2025-11-27 20:30:00',
                total_conversations: 856,
                pre_registrations: 0,
                success_rate: 95.2,
                avg_response_time: '1.8s',
                active_conversations: 8,
                config: {
                    auto_response: true,
                    working_hours: '24/7',
                    max_concurrent: 30
                }
            },
            {
                id: 3,
                name: 'Chat Web Asistente',
                type: 'webchat',
                status: 'inactive',
                description: 'Asistente virtual en la página web',
                created_at: '2025-03-10',
                last_activity: '2025-11-25 18:00:00',
                total_conversations: 2341,
                pre_registrations: 456,
                success_rate: 68.9,
                avg_response_time: '3.1s',
                active_conversations: 0,
                config: {
                    auto_response: true,
                    working_hours: '08:00 - 22:00',
                    max_concurrent: 100
                }
            },
            {
                id: 4,
                name: 'Email Confirmaciones',
                type: 'email',
                status: 'active',
                description: 'Bot para confirmaciones automáticas por email',
                created_at: '2025-01-20',
                last_activity: '2025-11-27 20:50:00',
                total_conversations: 3421,
                pre_registrations: 1234,
                success_rate: 98.7,
                avg_response_time: '5.2s',
                active_conversations: 0,
                config: {
                    auto_response: true,
                    working_hours: '24/7',
                    max_concurrent: 200
                }
            }
        ]
        setBots(mockBots)
    }, [])

    const getBotIcon = (type: string) => {
        switch (type) {
            case 'whatsapp': return <Phone className="h-6 w-6" />
            case 'telegram': return <MessageSquare className="h-6 w-6" />
            case 'webchat': return <Globe className="h-6 w-6" />
            case 'email': return <Mail className="h-6 w-6" />
            default: return <Bot className="h-6 w-6" />
        }
    }

    const getBotColor = (type: string) => {
        switch (type) {
            case 'whatsapp': return 'from-green-500 to-emerald-600'
            case 'telegram': return 'from-blue-500 to-indigo-600'
            case 'webchat': return 'from-purple-500 to-pink-600'
            case 'email': return 'from-orange-500 to-red-600'
            default: return 'from-gray-500 to-gray-600'
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700">Activo</Badge>
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-700">Inactivo</Badge>
            case 'error':
                return <Badge className="bg-red-100 text-red-700">Error</Badge>
            default:
                return <Badge>Desconocido</Badge>
        }
    }

    const toggleBotStatus = (botId: number) => {
        setBots(prev => prev.map(bot => {
            if (bot.id === botId) {
                const newStatus = bot.status === 'active' ? 'inactive' : 'active'
                toast.success(`Bot ${newStatus === 'active' ? 'activado' : 'desactivado'} exitosamente`)
                return { ...bot, status: newStatus }
            }
            return bot
        }))
    }

    const filteredBots = bots.filter(bot => {
        const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bot.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || bot.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const totalConversations = bots.reduce((sum, bot) => sum + bot.total_conversations, 0)
    const totalPreRegistrations = bots.reduce((sum, bot) => sum + bot.pre_registrations, 0)
    const activeBots = bots.filter(bot => bot.status === 'active').length

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Gestión de Bots
                        </h1>
                        <p className="text-gray-600">Control y monitoreo de bots automatizados</p>
                    </div>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Bot
                    </Button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <Bot className="h-8 w-8" />
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Total</Badge>
                    </div>
                    <p className="text-white/80 text-sm">Bots Configurados</p>
                    <p className="text-3xl font-bold mt-2">{bots.length}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Activos</Badge>
                    </div>
                    <p className="text-white/80 text-sm">Bots Activos</p>
                    <p className="text-3xl font-bold mt-2">{activeBots}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <MessageSquare className="h-8 w-8" />
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Total</Badge>
                    </div>
                    <p className="text-white/80 text-sm">Conversaciones</p>
                    <p className="text-3xl font-bold mt-2">{totalConversations.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <Users className="h-8 w-8" />
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Pre-Reg</Badge>
                    </div>
                    <p className="text-white/80 text-sm">Pre-Registros</p>
                    <p className="text-3xl font-bold mt-2">{totalPreRegistrations.toLocaleString()}</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Bot className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar bots..."
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('all')}
                                className={filterStatus === 'all' ? 'bg-indigo-600' : ''}
                            >
                                Todos
                            </Button>
                            <Button
                                variant={filterStatus === 'active' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('active')}
                                className={filterStatus === 'active' ? 'bg-green-600' : ''}
                            >
                                Activos
                            </Button>
                            <Button
                                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                                onClick={() => setFilterStatus('inactive')}
                                className={filterStatus === 'inactive' ? 'bg-gray-600' : ''}
                            >
                                Inactivos
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Bots Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredBots.map((bot, index) => (
                    <motion.div
                        key={bot.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        {/* Bot Header */}
                        <div className={`bg-gradient-to-r ${getBotColor(bot.type)} p-6 text-white`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                        {getBotIcon(bot.type)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{bot.name}</h3>
                                        <p className="text-white/80 text-sm">{bot.description}</p>
                                    </div>
                                </div>
                                {getStatusBadge(bot.status)}
                            </div>
                        </div>

                        {/* Bot Stats */}
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <MessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-600">Conversaciones</p>
                                    <p className="text-lg font-bold text-gray-900">{bot.total_conversations}</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <Users className="h-5 w-5 text-green-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-600">Pre-Registros</p>
                                    <p className="text-lg font-bold text-gray-900">{bot.pre_registrations}</p>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-600">Tasa Éxito</p>
                                    <p className="text-lg font-bold text-gray-900">{bot.success_rate}%</p>
                                </div>
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                    <Zap className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-600">Resp. Prom.</p>
                                    <p className="text-lg font-bold text-gray-900">{bot.avg_response_time}</p>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-2 mb-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Última actividad: {bot.last_activity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    <span>Conversaciones activas: {bot.active_conversations}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setSelectedBot(bot)
                                        setShowDetailModal(true)
                                    }}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => toggleBotStatus(bot.id)}
                                    className={bot.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                                >
                                    {bot.status === 'active' ? (
                                        <PowerOff className="h-4 w-4" />
                                    ) : (
                                        <Power className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedBot(bot)
                                        setShowConfigModal(true)
                                    }}
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedBot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className={`bg-gradient-to-r ${getBotColor(selectedBot.type)} p-6 text-white`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getBotIcon(selectedBot.type)}
                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedBot.name}</h2>
                                            <p className="text-white/80">{selectedBot.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-bold mb-4">Configuración Actual</h3>
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Auto-Respuesta</p>
                                        <p className="font-bold">{selectedBot.config.auto_response ? 'Activada' : 'Desactivada'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Horario</p>
                                        <p className="font-bold">{selectedBot.config.working_hours}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Máx. Concurrentes</p>
                                        <p className="font-bold">{selectedBot.config.max_concurrent}</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
                                <div className="space-y-2">
                                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                        <p className="text-sm text-gray-600">Pre-registro completado</p>
                                        <p className="text-xs text-gray-500">Hace 5 minutos</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                        <p className="text-sm text-gray-600">Nueva conversación iniciada</p>
                                        <p className="text-xs text-gray-500">Hace 12 minutos</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                        <p className="text-sm text-gray-600">Pre-registro completado</p>
                                        <p className="text-xs text-gray-500">Hace 18 minutos</p>
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
