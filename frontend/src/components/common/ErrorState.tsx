import { motion } from "framer-motion"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface ErrorStateProps {
    message?: string
    onRetry?: () => void
    showHomeButton?: boolean
}

export function ErrorState({
    message = "Error al cargar los datos",
    onRetry,
    showHomeButton = true
}: ErrorStateProps) {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Error Card */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 dark:border-red-800/30 p-8 text-center">
                    {/* Animated Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.1
                        }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 mb-6 relative"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-full bg-red-400/20 dark:bg-red-600/20"
                        />
                        <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400 relative z-10" />
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                    >
                        Algo salió mal
                    </motion.h3>

                    {/* Message */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                    >
                        {message}
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                size="lg"
                                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all group"
                            >
                                <RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                                Reintentar
                            </Button>
                        )}
                        {showHomeButton && (
                            <Button
                                onClick={() => navigate('/dashboard')}
                                variant="outline"
                                size="lg"
                                className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <Home className="h-5 w-5 mr-2" />
                                Ir al Dashboard
                            </Button>
                        )}
                    </motion.div>

                    {/* Help Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            💡 Si el problema persiste, contacta al administrador del sistema
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-400/20 dark:bg-red-600/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-3xl"
                    />
                </div>
            </motion.div>
        </div>
    )
}
