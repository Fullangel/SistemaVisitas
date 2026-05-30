import { motion } from "framer-motion"
import { Activity } from "lucide-react"

interface LoadingStateProps {
    message?: string
}

export function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center">
            <div className="text-center">
                <Activity className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>
        </div>
    )
}
