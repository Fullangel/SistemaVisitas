import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Shield,
    Search,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    X,
    AlertCircle,
    Key,
    Users as UsersIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Permission {
    id: number
    name: string
    display_name: string
    description: string
    group: string
    created_at: string
    updated_at: string
    roles_count?: number
}

interface PermissionFormData {
    name: string
    display_name: string
    description: string
    group: string
}

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [groupFilter, setGroupFilter] = useState<string>('all')
    const [showModal, setShowModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    const [formData, setFormData] = useState<PermissionFormData>({
        name: '',
        display_name: '',
        description: '',
        group: ''
    })

    // Mock data
    const mockPermissions: Permission[] = [
        { id: 1, name: 'users.create', display_name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 3 },
        { id: 2, name: 'users.read', display_name: 'Ver Usuarios', description: 'Permite ver información de usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 5 },
        { id: 3, name: 'users.update', display_name: 'Editar Usuarios', description: 'Permite actualizar información de usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 4, name: 'users.delete', display_name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios', group: 'Usuarios', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 1 },
        { id: 5, name: 'roles.create', display_name: 'Crear Roles', description: 'Permite crear nuevos roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 6, name: 'roles.read', display_name: 'Ver Roles', description: 'Permite ver información de roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 4 },
        { id: 7, name: 'roles.update', display_name: 'Editar Roles', description: 'Permite actualizar roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 8, name: 'roles.delete', display_name: 'Eliminar Roles', description: 'Permite eliminar roles', group: 'Roles', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 1 },
        { id: 9, name: 'visits.create', display_name: 'Crear Visitas', description: 'Permite crear nuevas visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 3 },
        { id: 10, name: 'visits.read', display_name: 'Ver Visitas', description: 'Permite ver información de visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 6 },
        { id: 11, name: 'visits.update', display_name: 'Editar Visitas', description: 'Permite actualizar visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 },
        { id: 12, name: 'visits.delete', display_name: 'Eliminar Visitas', description: 'Permite eliminar visitas', group: 'Visitas', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 1 },
        { id: 13, name: 'reports.read', display_name: 'Ver Reportes', description: 'Permite ver reportes', group: 'Reportes', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 4 },
        { id: 14, name: 'reports.export', display_name: 'Exportar Reportes', description: 'Permite exportar reportes', group: 'Reportes', created_at: '2024-01-01', updated_at: '2024-01-01', roles_count: 2 }
    ]

    useEffect(() => {
        setTimeout(() => {
            setPermissions(mockPermissions)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredPermissions = permissions.filter(perm => {
        const matchesSearch =
            perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perm.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perm.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesGroup = groupFilter === 'all' || perm.group === groupFilter

        return matchesSearch && matchesGroup
    })

    const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
        const group = permission.group || 'General'
        if (!groups[group]) {
            groups[group] = []
        }
        groups[group].push(permission)
        return groups
    }, {} as Record<string, Permission[]>)

    const uniqueGroups = Array.from(new Set(permissions.map(p => p.group)))

    const stats = {
        total: permissions.length,
        groups: uniqueGroups.length,
        totalRoles: permissions.reduce((sum, p) => sum + (p.roles_count || 0), 0)
    }

    const handleCreate = () => {
        setIsCreating(true)
        setSelectedPermission(null)
        setFormData({
            name: '',
            display_name: '',
            description: '',
            group: ''
        })
        setShowModal(true)
    }

    const handleEdit = (permission: Permission) => {
        setIsCreating(false)
        setSelectedPermission(permission)
        setFormData({
            name: permission.name,
            display_name: permission.display_name,
            description: permission.description,
            group: permission.group
        })
        setShowModal(true)
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.display_name || !formData.group) {
            toast.error('Por favor completa todos los campos requeridos')
            return
        }

        if (isCreating) {
            toast.success('✅ Permiso creado exitosamente')
        } else {
            toast.success('✅ Permiso actualizado exitosamente')
        }

        setShowModal(false)
    }

    const handleDelete = (id: number) => {
        toast.success('✅ Permiso eliminado exitosamente')
        setShowDeleteConfirm(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-slate-950 dark:via-amber-950 dark:to-orange-950">
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
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                Gestión de Permisos
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Administra los permisos del sistema y controla el acceso
                            </p>
                        </div>
                        <Button
                            onClick={handleCreate}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nuevo Permiso
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Permisos</p>
                                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                                </div>
                                <Key className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Grupos</p>
                                    <p className="text-3xl font-bold mt-1">{stats.groups}</p>
                                </div>
                                <Shield className="h-8 w-8 opacity-80" />
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Asignaciones</p>
                                    <p className="text-3xl font-bold mt-1">{stats.totalRoles}</p>
                                </div>
                                <UsersIcon className="h-8 w-8 opacity-80" />
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
                                placeholder="Buscar por nombre, código o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500"
                            />
                        </div>

                        <select
                            value={groupFilter}
                            onChange={(e) => setGroupFilter(e.target.value)}
                            className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="all">🔐 Todos los Grupos</option>
                            {uniqueGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Permissions Grid */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto" />
                        <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg">Cargando permisos...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                            <motion.div
                                key={group}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-6 w-6" />
                                        <h3 className="text-xl font-bold">{group}</h3>
                                        <Badge className="bg-white/20 text-white border-white/30">
                                            {groupPermissions.length} permisos
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-6 grid md:grid-cols-2 gap-4">
                                    {groupPermissions.map((permission, index) => (
                                        <motion.div
                                            key={permission.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-700 dark:to-amber-900/10 rounded-xl p-4 border-2 border-gray-200/50 dark:border-gray-600/50 hover:border-amber-500/50 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                                        <Key className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                                            {permission.display_name}
                                                        </h4>
                                                        <code className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                            {permission.name}
                                                        </code>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {permission.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <UsersIcon className="h-4 w-4 text-amber-500" />
                                                    <span>{permission.roles_count || 0} roles</span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(permission)}
                                                        className="border-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowDeleteConfirm(permission.id)}
                                                        className="border-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
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
                            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">
                                        {isCreating ? 'Crear Permiso' : 'Editar Permiso'}
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
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Código del Sistema *
                                        </label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Ej: users.create"
                                            className="border-2 font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nombre para Mostrar *
                                        </label>
                                        <Input
                                            value={formData.display_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                                            placeholder="Ej: Crear Usuarios"
                                            className="border-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Grupo *
                                    </label>
                                    <Input
                                        value={formData.group}
                                        onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                                        placeholder="Ej: Usuarios, Roles, Visitas"
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
                                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="Describe qué hace este permiso..."
                                    />
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
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    {isCreating ? 'Crear Permiso' : 'Guardar Cambios'}
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
                                        ¿Eliminar Permiso?
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
