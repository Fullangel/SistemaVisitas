import { motion } from "framer-motion"
import { UserPlus, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface EmptyVisitsStateProps {
    title?: string
    message?: string
    showAddButton?: boolean
}

export function EmptyVisitsState({
    title = "No hay visitas activas",
    message = "No se encontraron visitantes en las instalaciones en este momento",
    showAddButton = true
}: EmptyVisitsStateProps) {
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
        >
            {/* Main Card */}
            <div className="text-center py-16 px-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl backdrop-blur-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/50 shadow-xl">
                {/* Animated Icon Container */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.1
                    }}
                    className="relative inline-flex items-center justify-center w-28 h-28 mb-6"
                >
                    {/* Pulsing Background */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/20 dark:to-purple-600/20 blur-xl"
                    />

                    {/* Icon Circle */}
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-lg">
                        <Users className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />

                        {/* Sparkle Effect */}
                        <motion.div
                            animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                            className="absolute -top-2 -right-2"
                        >
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                >
                    {title}
                </motion.h3>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed text-lg"
                >
                    {message}
                </motion.p>

                {/* Action Button */}
                {showAddButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            onClick={() => navigate('/visitas/nueva')}
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all group px-8 py-6 text-lg"
                        >
                            <UserPlus className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                            Registrar Nueva Visita
                        </Button>
                    </motion.div>
                )}

                {/* Info Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                            <div className="text-2xl mb-1">📋</div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Registro</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Crea una nueva visita</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
                            <div className="text-2xl mb-1">✅</div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Aprobación</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Espera la autorización</p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                            <div className="text-2xl mb-1">🚪</div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Check-in</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Aparecerá aquí</p>
                        </div>
                    </div>
                </motion.div>

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        💡 Las visitas aparecerán automáticamente una vez que sean aprobadas y el visitante haga check-in
                    </p>
                </motion.div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3
                    }}
                    className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl"
                />
            </div>
        </motion.div>
    )
}
