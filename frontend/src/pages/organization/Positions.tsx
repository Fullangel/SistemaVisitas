import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Award,
    Search,
    Plus,
    Edit,
    Trash2,
    Users,
    CheckCircle,
    X,
    AlertCircle,
    Briefcase,
    DollarSign,
    TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Position {
    id: number
    title: string
    description: string
    department_id: number
    department_name: string
    level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager'
    salary_range: string
    status: 'active' | 'inactive'
    employees_count: number
    created_at: string
}

interface PositionFormData {
    title: string
    description: string
    department_id: number
    level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager'
    salary_range: string
    status: 'active' | 'inactive'
}

export default function PositionsPage() {
    const [positions, setPositions] = useState<Position[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState<number | 'all'>('all')
    const [levelFilter, setLevelFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    const [formData, setFormData] = useState<PositionFormData>({
        title: '',
        description: '',
        department_id: 0,
        level: 'mid',
        salary_range: '',
        status: 'active'
    })

    // Mock departments for filter
    const departments = [
        { id: 1, name: "Recursos Humanos" },
        { id: 2, name: "Tecnología" },
        { id: 3, name: "Ventas" },
        { id: 4, name: "Marketing" },
        { id: 5, name: "Finanzas" }
    ]

    // Mock data
    const mockPositions: Position[] = [
        {
            id: 1,
            title: "Desarrollador Full Stack",
            description: "Desarrollo de aplicaciones web con React y Node.js",
            department_id: 2,
            department_name: "Tecnología",
            level: "mid",
            salary_range: "€35,000 - €50,000",
            status: "active",
            employees_count: 8,
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 2,
            title: "Gerente de Recursos Humanos",
            description: "Gestión del equipo de RRHH y procesos de selección",
            department_id: 1,
            department_name: "Recursos Humanos",
            level: "manager",
            salary_range: "€50,000 - €70,000",
            status: "active",
            employees_count: 1,
            created_at: "2024-01-16T10:00:00Z"
        },
        {
            id: 3,
            title: "Ejecutivo de Ventas",
            description: "Venta de productos y servicios a clientes corporativos",
            department_id: 3,
            department_name: "Ventas",
            level: "mid",
            salary_range: "€30,000 - €45,000",
            status: "active",
            employees_count: 12,
            created_at: "2024-01-17T10:00:00Z"
        },
        {
            id: 4,
            title: "Especialista en Marketing Digital",
            department_id: 4,
            department_name: "Marketing",
            description: "Gestión de campañas digitales y redes sociales",
            level: "mid",
            salary_range: "€32,000 - €48,000",
            status: "active",
            employees_count: 5,
            created_at: "2024-01-18T10:00:00Z"
        },
        {
            id: 5,
            title: "Analista Financiero Senior",
            description: "Análisis financiero y reportes ejecutivos",
            department_id: 5,
            department_name: "Finanzas",
            level: "senior",
            salary_range: "€45,000 - €65,000",
            status: "active",
            employees_count: 3,
            created_at: "2024-01-19T10:00:00Z"
        },
        {
            id: 6,
            title: "Desarrollador Junior",
            description: "Soporte en desarrollo de software",
            department_id: 2,
            department_name: "Tecnología",
            level: "junior",
            salary_range: "€25,000 - €35,000",
            status: "active",
            employees_count: 6,
            created_at: "2024-01-20T10:00:00Z"
        },
        {
            id: 7,
            title: "Tech Lead",
            description: "Liderazgo técnico del equipo de desarrollo",
            department_id: 2,
            department_name: "Tecnología",
            level: "lead",
            salary_range: "€55,000 - €75,000",
            status: "active",
            employees_count: 2,
            created_at: "2024-01-21T10:00:00Z"
        },
        {
            id: 8,
            title: "Asistente de RRHH",
            description: "Apoyo administrativo en recursos humanos",
            department_id: 1,
            department_name: "Recursos Humanos",
            level: "junior",
            salary_range: "€22,000 - €30,000",
            status: "inactive",
            employees_count: 0,
            created_at: "2024-01-22T10:00:00Z"
        }
    ]

    useEffect(() => {
        setTimeout(() => {
            setPositions(mockPositions)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredPositions = positions.filter(pos => {
        const matchesSearch =
            pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pos.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pos.department_name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesDepartment = departmentFilter === 'all' || pos.department_id === departmentFilter
        const matchesLevel = levelFilter === 'all' || pos.level === levelFilter
        const matchesStatus = statusFilter === 'all' || pos.status === statusFilter

        return matchesSearch && matchesDepartment && matchesLevel && matchesStatus
    })

    const stats = {
        total: positions.length,
        active: positions.filter(p => p.status === 'active').length,
        inactive: positions.filter(p => p.status === 'inactive').length,
        totalEmployees: positions.reduce((sum, p) => sum + p.employees_count, 0)
    }

    const getLevelBadgeColor = (level: string) => {
        const colors = {
            junior: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            mid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            senior: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            lead: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            manager: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }
        return colors[level as keyof typeof colors] || colors.mid
    }

    const getLevelLabel = (level: string) => {
        const labels = {
            junior: 'Junior',
            mid: 'Mid-Level',
            senior: 'Senior',
            lead: 'Lead',
            manager: 'Manager'
        }
        return labels[level as keyof typeof labels] || level
    }

    const handleCreate = () => {
        setIsCreating(true)
        setSelectedPosition(null)
        setFormData({
            title: '',
            description: '',
            department_id: 0,
            level: 'mid',
            salary_range: '',
            status: 'active'
        })
        setShowModal(true)
    }

    const handleEdit = (position: Position) => {
        setIsCreating(false)
        setSelectedPosition(position)
        setFormData({
            title: position.title,
            description: position.description,
            department_id: position.department_id,
            level: position.level,
            salary_range: position.salary_range,
            status: position.status
        })
        setShowModal(true)
    }

    const handleSubmit = () => {
        if (!formData.title || !formData.department_id) {
            toast.error('Por favor completa todos los campos requeridos')
            return
        }

        if (isCreating) {
            toast.success('✅ Cargo creado exitosamente')
        } else {
            toast.success('✅ Cargo actualizado exitosamente')
        }

        setShowModal(false)
    }

    const handleDelete = (id: number) => {
        toast.success('✅ Cargo eliminado exitosamente')
        setShowDeleteConfirm(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950 dark:to-amber-950">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            >
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                                Cargos y Posiciones
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Gestiona los cargos disponibles en cada departamento
                            </p>
                        </div>
                        <Button
                            onClick={handleCreate}
                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nuevo Cargo
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Cargos</p>
                                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <Award className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Activos</p>
                                    <p className="text-3xl font-bold mt-1">{stats.active}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Inactivos</p>
                                    <p className="text-3xl font-bold mt-1">{stats.inactive}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Empleados</p>
                                    <p className="text-3xl font-bold mt-1">{stats.totalEmployees}</p>
                                </div>
                                <Users className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="p-6">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Buscar por título, descripción o departamento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500"
                            />
                        </div>

                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="all">🏢 Todos los Departamentos</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>

                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="all">📊 Todos los Niveles</option>
                            <option value="junior">Junior</option>
                            <option value="mid">Mid-Level</option>
                            <option value="senior">Senior</option>
                            <option value="lead">Lead</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                </motion.div>

                {/* Positions Table */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto" />
                        <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">Cargando cargos...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Cargo</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Departamento</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Nivel</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Rango Salarial</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Empleados</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredPositions.map((position, index) => (
                                        <motion.tr
                                            key={position.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {position.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {position.description}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-purple-500" />
                                                    <span className="text-gray-900 dark:text-white">
                                                        {position.department_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={getLevelBadgeColor(position.level)}>
                                                    {getLevelLabel(position.level)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <DollarSign className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">{position.salary_range}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-blue-500" />
                                                    <span className="text-gray-900 dark:text-white font-medium">
                                                        {position.employees_count}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={position.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }>
                                                    {position.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(position)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowDeleteConfirm(position.id)}
                                                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">
                                        {isCreating ? 'Crear Cargo' : 'Editar Cargo'}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Título del Cargo *
                                    </label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Ej: Desarrollador Full Stack"
                                        className="border-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Describe las responsabilidades del cargo..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Departamento *
                                        </label>
                                        <select
                                            value={formData.department_id}
                                            onChange={(e) => setFormData(prev => ({ ...prev, department_id: Number(e.target.value) }))}
                                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value={0}>Seleccionar departamento...</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nivel
                                        </label>
                                        <select
                                            value={formData.level}
                                            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="junior">Junior</option>
                                            <option value="mid">Mid-Level</option>
                                            <option value="senior">Senior</option>
                                            <option value="lead">Lead</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rango Salarial
                                        </label>
                                        <Input
                                            value={formData.salary_range}
                                            onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
                                            placeholder="Ej: €35,000 - €50,000"
                                            className="border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Estado
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="active">Activo</option>
                                            <option value="inactive">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    {isCreating ? 'Crear Cargo' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        ¿Eliminar Cargo?
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Esta acción no se puede deshacer
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
