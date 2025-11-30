import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: LucideIcon
    trend?: string
    color?: "blue" | "green" | "purple" | "orange" | "indigo"
}

const colorVariants = {
    blue: {
        icon: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-800"
    },
    green: {
        icon: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950/30",
        border: "border-green-200 dark:border-green-800"
    },
    purple: {
        icon: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950/30",
        border: "border-purple-200 dark:border-purple-800"
    },
    orange: {
        icon: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950/30",
        border: "border-orange-200 dark:border-orange-800"
    },
    indigo: {
        icon: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-950/30",
        border: "border-indigo-200 dark:border-indigo-800"
    }
}

export function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "blue"
}: MetricCardProps) {
    const colors = colorVariants[color]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${colors.bg}`}>
                        <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">
                            {trend}
                        </p>
                    )}
                </CardContent>

                {/* Decorative gradient */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg}`} />
            </Card>
        </motion.div>
    )
}
