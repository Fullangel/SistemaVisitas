import { LucideIcon } from "lucide-react"

interface InfoItemProps {
    icon: LucideIcon
    label?: string
    value: string | React.ReactNode
    iconColor?: string
}

export function InfoItem({ icon: Icon, label, value, iconColor = "text-gray-500" }: InfoItemProps) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            {label && <span className="font-medium">{label}:</span>}
            <span>{value}</span>
        </div>
    )
}
