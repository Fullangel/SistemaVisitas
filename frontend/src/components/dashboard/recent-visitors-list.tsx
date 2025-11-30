import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Material {
    id: number
    name: string
    type: string
    size: string
    uploadedAt: string
    downloads: number
}

interface MaterialsListProps {
    materials: Material[]
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

const typeColors: Record<string, string> = {
    PDF: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    PPTX: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    DOCX: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    XLSX: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
}

export function MaterialsList({ materials }: MaterialsListProps) {
    return (
        <Card className="dark:bg-gray-800/50 backdrop-blur-sm border-2">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Visitantes Recientes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {materials.map((material) => (
                        <motion.div
                            key={material.id}
                            variants={item}
                            whileHover={{ x: 4, transition: { duration: 0.2 } }}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {material.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded ${typeColors[material.type] || typeColors.PDF}`}>
                                            {material.type}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {material.size}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        {material.uploadedAt} • {material.downloads} descargas
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 flex-shrink-0"
                                title="Descargar"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </CardContent>
        </Card>
    )
}
