"use client"

import { motion } from "framer-motion"
import {
    Users,
    Clock,
    Calendar,
    TrendingUp,
    UserPlus,
    FileText,
    Settings,
    Bell,
    Search
} from "lucide-react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { VisitsTable } from "@/components/dashboard/visits-table"
import { MaterialsList } from "@/components/dashboard/recent-visitors-list"
import { NotificationsList } from "@/components/dashboard/notifications-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/auth"
import { useMemo } from "react"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
}

const metrics = [
    {
        title: "Visitas Hoy",
        value: "12",
        subtitle: "En las instalaciones",
        icon: Calendar,
        trend: "+3 vs ayer",
        color: "blue" as const
    },
    {
        title: "Visitas Activas",
        value: "5",
        subtitle: "En curso ahora",
        icon: Users,
        trend: "2 finalizarán pronto",
        color: "green" as const
    },
    {
        title: "Programadas Hoy",
        value: "8",
        subtitle: "Pendientes",
        icon: Clock,
        trend: "3 en las próximas 2 horas",
        color: "purple" as const
    },
    {
        title: "Total del Mes",
        value: "247",
        subtitle: "Febrero 2025",
        icon: TrendingUp,
        trend: "+15% vs mes anterior",
        color: "indigo" as const
    },
]

const nextSessions = [
    {
        id: 1,
        subject: "Juan Pérez - Tech Solutions",
        tutor: "Juan Pérez",
        room: "Sede Central",
        date: "15 Feb 2025",
        time: "10:00 AM",
        status: "Confirmada" as const,
    },
    {
        id: 2,
        subject: "María González - Consultores SAP",
        tutor: "María González",
        room: "Sede Norte",
        date: "15 Feb 2025",
        time: "2:00 PM",
        status: "Pendiente" as const,
    },
    {
        id: 3,
        subject: "Carlos Ramírez - Proveedor IT",
        tutor: "Carlos Ramírez",
        room: "Sede Sur",
        date: "15 Feb 2025",
        time: "11:00 AM",
        status: "En Curso" as const,
    },
    {
        id: 4,
        subject: "Ana Martínez - Auditoría Externa",
        tutor: "Ana Martínez",
        room: "Sede Central",
        date: "15 Feb 2025",
        time: "4:00 PM",
        status: "Confirmada" as const,
    },
]

const recentMaterials = [
    {
        id: 1,
        name: "Pedro Sánchez",
        type: "PDF",
        size: "Tech Corp",
        uploadedAt: "Hace 10 min",
        downloads: 1,
    },
    {
        id: 2,
        name: "Laura Díaz",
        type: "PPTX",
        size: "Consultora XYZ",
        uploadedAt: "Hace 25 min",
        downloads: 1,
    },
    {
        id: 3,
        name: "Roberto Gómez",
        type: "PDF",
        size: "Proveedor ABC",
        uploadedAt: "Hace 1 hora",
        downloads: 1,
    },
]

export default function DashboardPage() {
    const { user } = useAuthStore()

    const fullName = useMemo(() => {
        if (!user) return 'Usuario'
        const name = `${user.first_name || ''} ${user.last_name || ''}`.trim()
        return name || user.username || 'Usuario'
    }, [user])

    const currentTime = new Date().toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit'
    })

    const currentDate = new Date().toLocaleDateString('es-VE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="min-h-screen">
            {/* Modern Header with Glassmorphism */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            >
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Welcome & Time */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                        {fullName.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        ¡Hola, {fullName}! 👋
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                        {currentDate} • {currentTime}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Search & Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="hidden md:flex relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar visitas..."
                                    className="pl-10 w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                />
                            </div>

                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                                    3
                                </Badge>
                            </Button>

                            {/* Quick Action */}
                            <Button className="hidden lg:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Nueva Visita
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content - Full Width */}
            <div className="p-6">
                {/* Innovative Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl overflow-hidden relative"
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        {/* Left: Message & Progress */}
                        <div>
                            <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                                📊 Dashboard Ejecutivo
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Centro de Control de Visitas</h2>
                            <p className="text-blue-100 mb-6">
                                Monitorea y gestiona todas las visitas en tiempo real con eficiencia
                            </p>

                            {/* Progress Ring */}
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="rgba(255,255,255,0.2)"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="white"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(12 / 20) * 251.2} 251.2`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">60%</div>
                                            <div className="text-xs">Completado</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm opacity-90">Visitas del día</div>
                                    <div className="text-2xl font-bold">12 de 20</div>
                                    <div className="text-xs opacity-75">8 visitas restantes</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Upcoming Visits Preview */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Próximas Visitas
                                </h3>
                                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Hoy</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                        JP
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">Juan Pérez</div>
                                        <div className="text-xs opacity-75">10:00 AM • Sede Central</div>
                                    </div>
                                    <div className="text-xs bg-green-500/30 px-2 py-1 rounded">
                                        En 30min
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                        MG
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">María González</div>
                                        <div className="text-xs opacity-75">2:00 PM • Sede Norte</div>
                                    </div>
                                    <div className="text-xs bg-blue-500/30 px-2 py-1 rounded">
                                        En 4h
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Metrics Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6"
                >
                    {metrics.map((metric) => (
                        <motion.div key={metric.title} variants={item}>
                            <MetricCard {...metric} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions - Horizontal below metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            className="h-auto flex-col py-4 gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border-2"
                        >
                            <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium">Registrar Visita</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto flex-col py-4 gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border-2"
                        >
                            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium">Ver Visitantes</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto flex-col py-4 gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border-2"
                        >
                            <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium">Reportes</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto flex-col py-4 gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border-2"
                        >
                            <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm font-medium">Configuración</span>
                        </Button>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Visits Table - Takes 2 columns on large screens */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <VisitsTable sessions={nextSessions} />
                    </motion.div>

                    {/* Sidebar with Recent Visitors and Notifications */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <MaterialsList materials={recentMaterials} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <NotificationsList />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
