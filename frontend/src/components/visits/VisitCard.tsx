import { motion } from "framer-motion"
import {
    Building2,
    Briefcase,
    Clock,
    Activity,
    UserCheck,
    Eye
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Visit } from "@/services/api/visits"
import {
    calculateVisitDuration,
    getVisitorInitials,
    getEmployeeName
} from "@/utils/visitHelpers"

interface VisitCardProps {
    visit: Visit
    index: number
    onViewDetails: (visit: Visit) => void
    onCheckOut: (visitId: number) => void
    isCheckingOut?: boolean
}

export function VisitCard({
    visit,
    index,
    onViewDetails,
    onCheckOut,
    isCheckingOut
}: VisitCardProps) {
    const duration = calculateVisitDuration(visit)
    const initials = getVisitorInitials(visit.visitor_name)
    const employeeName = getEmployeeName(visit)

    return (
        <motion.div
            key={visit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all overflow-hidden"
        >
            <div className={`h-2 ${visit.status === 'in_progress' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-amber-500'}`} />

            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Visit Info */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                    {initials}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">
                                        {visit.visitor_name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        {visit.visitor_company || 'Sin empresa'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        Doc: {visit.visitor_identification}
                                    </p>
                                </div>
                            </div>
                            <Badge className={visit.status === 'in_progress'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }>
                                {visit.status === 'in_progress' ? 'En Proceso' : 'Pendiente'}
                            </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Clock className="h-4 w-4 text-indigo-500" />
                                <span>Check-in: {visit.entry_time || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Activity className="h-4 w-4 text-purple-500" />
                                <span>Duración: {duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Building2 className="h-4 w-4 text-blue-500" />
                                <span>{visit.headquarter?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Briefcase className="h-4 w-4 text-green-500" />
                                <span>{visit.department?.name || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">Propósito:</strong> {visit.purpose}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <UserCheck className="h-3 w-3" />
                            <span>Anfitrión: <strong>{employeeName}</strong></span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                        <Button
                            onClick={() => onViewDetails(visit)}
                            variant="outline"
                            className="w-full border-2 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                        </Button>
                        <Button
                            onClick={() => onCheckOut(visit.id)}
                            disabled={isCheckingOut}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            {isCheckingOut ? 'Procesando...' : 'Check-out'}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
