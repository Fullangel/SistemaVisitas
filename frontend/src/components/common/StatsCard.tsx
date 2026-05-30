import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: number
    icon: LucideIcon
    gradient: string
}

export function StatsCard({ title, value, icon: Icon, gradient }: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${gradient} rounded-xl p-4 text-white`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-90">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <Icon className="h-8 w-8 opacity-80" />
            </div>
        </motion.div>
    )
}
