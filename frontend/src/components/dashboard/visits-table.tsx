import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"

interface Visit {
    id: number
    subject: string
    tutor: string
    room: string
    date: string
    time: string
    status: "Confirmada" | "Pendiente" | "En Curso" | "Finalizada"
}

interface VisitsTableProps {
    sessions: Visit[]
}

const statusColors = {
    "Confirmada": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "Pendiente": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    "En Curso": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Finalizada": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
}

export function VisitsTable({ sessions }: VisitsTableProps) {
    return (
        <Card className="dark:bg-gray-800/50 backdrop-blur-sm border-2">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Próximas Visitas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {sessions.map((session) => (
                        <motion.div
                            key={session.id}
                            variants={item}
                            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:shadow-md transition-all"
                        >
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {session.subject}
                                    </h4>
                                    <Badge className={statusColors[session.status]}>
                                        {session.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium">Visitante:</span> {session.tutor}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium">Sede:</span> {session.room}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                    <span>{session.date}</span>
                                    <span>•</span>
                                    <span>{session.time}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    title="Ver detalles"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    title="Editar"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </CardContent>
        </Card>
    )
}
