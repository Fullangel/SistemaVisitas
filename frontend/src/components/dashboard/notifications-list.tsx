import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
    id: number
    type: "success" | "warning" | "error" | "info"
    title: string
    message: string
    time: string
    read?: boolean
}

const mockNotifications: Notification[] = [
    {
        id: 1,
        type: "success",
        title: "Visita Confirmada",
        message: "Nueva visita registrada exitosamente",
        time: "Hace 5 min"
    },
    {
        id: 2,
        type: "warning",
        title: "Visita Pendiente",
        message: "Visita requiere aprobación",
        time: "Hace 15 min"
    },
    {
        id: 3,
        type: "info",
        title: "Recordatorio",
        message: "Visita programada para hoy a las 3:00 PM",
        time: "Hace 1 hora"
    }
]

const notificationConfig = {
    success: {
        icon: CheckCircle,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/20"
    },
    warning: {
        icon: AlertCircle,
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    error: {
        icon: AlertCircle,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20"
    },
    info: {
        icon: Info,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20"
    }
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
}

export function NotificationsList() {
    return (
        <Card className="dark:bg-gray-800/50 backdrop-blur-sm border-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificaciones
                    </CardTitle>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {mockNotifications.length} nuevas
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {mockNotifications.map((notification) => {
                        const config = notificationConfig[notification.type]
                        const Icon = config.icon

                        return (
                            <motion.div
                                key={notification.id}
                                variants={item}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                className={`flex items-start gap-3 p-3 rounded-lg ${config.bg} border border-gray-200 dark:border-gray-700 transition-all`}
                            >
                                <div className={`flex-shrink-0 ${config.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        {notification.time}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 flex-shrink-0"
                                    title="Descartar"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </CardContent>
        </Card>
    )
}
