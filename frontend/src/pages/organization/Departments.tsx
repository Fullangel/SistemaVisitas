import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Briefcase,
    Search,
    Plus,
    Edit,
    Trash2,
    Users,
    CheckCircle,
    X,
    AlertCircle,
    TrendingUp,
    Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Department {
    id: number
    name: string
    description: string
    manager: string
    email: string
    phone: string
    status: 'active' | 'inactive'
    positions_count: number
    employees_count: number
    created_at: string
}

interface DepartmentFormData {
    name: string
    description: string
    manager: string
    email: string
    phone: string
    status: 'active' | 'inactive'
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    const [formData, setFormData] = useState<DepartmentFormData>({
        name: '',
        description: '',
        manager: '',
        email: '',
        phone: '',
        status: 'active'
    })

    // Mock data
    const mockDepartments: Department[] = [
        {
            id: 1,
            name: "Recursos Humanos",
            description: "Gestión de personal y desarrollo organizacional",
            manager: "Ana García Martínez",
            email: "rrhh@empresa.com",
            phone: "+34 900 123 456",
            status: "active",
            positions_count: 8,
            employees_count: 25,
            created_at: "2024-01-15T10:00:00Z"
        },
        {
            id: 2,
            name: "Tecnología",
            description: "Desarrollo de software y sistemas",
            manager: "Carlos Rodríguez López",
            email: "tech@empresa.com",
            phone: "+34 900 123 457",
            status: "active",
            positions_count: 12,
            employees_count: 45,
            created_at: "2024-01-16T10:00:00Z"
        },
        {
            id: 3,
            name: "Ventas",
            description: "Comercial y atención al cliente",
            manager: "María López Sánchez",
            email: "ventas@empresa.com",
            phone: "+34 900 123 458",
            status: "active",
            positions_count: 10,
            employees_count: 35,
            created_at: "2024-01-17T10:00:00Z"
        },
        {
            id: 4,
            name: "Marketing",
            description: "Estrategia de marca y comunicación",
            manager: "Roberto Fernández",
            email: "marketing@empresa.com",
            phone: "+34 900 123 459",
            status: "active",
            positions_count: 6,
            employees_count: 18,
            created_at: "2024-01-18T10:00:00Z"
        },
        {
            id: 5,
            name: "Finanzas",
            description: "Contabilidad y gestión financiera",
            manager: "Laura Martín González",
            email: "finanzas@empresa.com",
            phone: "+34 900 123 460",
            status: "active",
            positions_count: 7,
            employees_count: 22,
            created_at: "2024-01-19T10:00:00Z"
        },
        {
            id: 6,
            name: "Operaciones",
            description: "Logística y procesos operativos",
            manager: "Pedro Sánchez Ruiz",
            email: "ops@empresa.com",
            phone: "+34 900 123 461",
            status: "inactive",
            positions_count: 5,
            employees_count: 15,
            created_at: "2024-01-20T10:00:00Z"
        }
    ]

    useEffect(() => {
        setTimeout(() => {
            setDepartments(mockDepartments)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredDepartments = departments.filter(dept => {
        const matchesSearch =
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.manager.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || dept.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const stats = {
        total: departments.length,
        active: departments.filter(d => d.status === 'active').length,
        inactive: departments.filter(d => d.status === 'inactive').length,
        totalEmployees: departments.reduce((sum, d) => sum + d.employees_count, 0)
    }

    const handleCreate = () => {
        setIsCreating(true)
        setSelectedDepartment(null)
        setFormData({
            name: '',
            description: '',
            manager: '',
            email: '',
            phone: '',
            status: 'active'
        })
        setShowModal(true)
    }

    const handleEdit = (department: Department) => {
        setIsCreating(false)
        setSelectedDepartment(department)
        setFormData({
            name: department.name,
            description: department.description,
            manager: department.manager,
            email: department.email,
            phone: department.phone,
            status: department.status
        })
        setShowModal(true)
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.manager || !formData.email) {
            toast.error('Por favor completa todos los campos requeridos')
            return
        }

        if (isCreating) {
            toast.success('✅ Departamento creado exitosamente')
        } else {
            toast.success('✅ Departamento actualizado exitosamente')
        }

        setShowModal(false)
        // Aquí iría la llamada al backend
    }

    const handleDelete = (id: number) => {
        toast.success('✅ Departamento eliminado exitosamente')
        setShowDeleteConfirm(null)
        // Aquí iría la llamada al backend
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
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
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <Briefcase className="h-6 w-6 text-white" />
                                </div>
                                Departamentos (Gerencias)
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Gestiona los departamentos y gerencias de la organización
                            </p>
                        </div>
                        <Button
                            onClick={handleCreate}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nuevo Departamento
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Departamentos</p>
                                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <Briefcase className="h-8 w-8 opacity-80" />
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
                                    <p className="text-sm opacity-90">Total Empleados</p>
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
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Buscar por nombre, descripción o gerente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="all">🔄 Todos los Estados</option>
                            <option value="active">✅ Activos</option>
                            <option value="inactive">❌ Inactivos</option>
                        </select>
                    </div>
                </motion.div>

                {/* Departments Grid */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto" />
                        <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">Cargando departamentos...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDepartments.map((dept, index) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-purple-500/50 transition-all overflow-hidden"
                            >
                                <div className={`h-2 ${dept.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`} />

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                                                {dept.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                    {dept.name}
                                                </h3>
                                                <Badge className={dept.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }>
                                                    {dept.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {dept.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <Users className="h-4 w-4 text-purple-500" />
                                            <span className="font-medium">{dept.manager}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Briefcase className="h-4 w-4 text-blue-500" />
                                            <span>{dept.positions_count} cargos</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Building2 className="h-4 w-4 text-green-500" />
                                            <span>{dept.employees_count} empleados</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(dept)}
                                            className="flex-1 border-2"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowDeleteConfirm(dept.id)}
                                            className="border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">
                                        {isCreating ? 'Crear Departamento' : 'Editar Departamento'}
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
                                        Nombre del Departamento *
                                    </label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ej: Recursos Humanos"
                                        className="border-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Describe las funciones del departamento..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gerente/Responsable *
                                    </label>
                                    <Input
                                        value={formData.manager}
                                        onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                                        placeholder="Nombre completo del gerente"
                                        className="border-2"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="email@empresa.com"
                                            className="border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Teléfono
                                        </label>
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="+34 900 000 000"
                                            className="border-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Estado
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                    </select>
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
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    {isCreating ? 'Crear Departamento' : 'Guardar Cambios'}
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
                                        ¿Eliminar Departamento?
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
