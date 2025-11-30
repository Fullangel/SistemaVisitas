import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Map, Plus, Edit, Trash2, Search, Building2, AlertCircle, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Region {
    id: number
    name: string
    code: string
    description: string
    status: 'active' | 'inactive'
    dependencies_count: number
    sites_count: number
    created_at: string
}

export default function RegionesPage() {
    const [regions, setRegions] = useState<Region[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
    const [formData, setFormData] = useState({ name: '', code: '', description: '', status: 'active' as 'active' | 'inactive' })

    const mockRegions: Region[] = [
        { id: 1, name: 'Región Capital', code: 'RC', description: 'Caracas y Miranda', status: 'active', dependencies_count: 5, sites_count: 12, created_at: '2024-01-01' },
        { id: 2, name: 'Región Central', code: 'RCE', description: 'Aragua, Carabobo', status: 'active', dependencies_count: 4, sites_count: 8, created_at: '2024-01-01' },
        { id: 3, name: 'Región Oriental', code: 'RO', description: 'Anzoátegui, Monagas', status: 'active', dependencies_count: 3, sites_count: 6, created_at: '2024-01-01' },
        { id: 4, name: 'Región Occidental', code: 'ROC', description: 'Zulia, Falcón', status: 'active', dependencies_count: 3, sites_count: 7, created_at: '2024-01-01' },
        { id: 5, name: 'Región Los Llanos', code: 'RLL', description: 'Guárico, Apure', status: 'inactive', dependencies_count: 2, sites_count: 4, created_at: '2024-01-01' }
    ]

    useEffect(() => {
        setTimeout(() => {
            setRegions(mockRegions)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredRegions = regions.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = {
        total: regions.length,
        active: regions.filter(r => r.status === 'active').length,
        inactive: regions.filter(r => r.status === 'inactive').length,
        totalDependencies: regions.reduce((sum, r) => sum + r.dependencies_count, 0)
    }

    const handleCreate = () => {
        setSelectedRegion(null)
        setFormData({ name: '', code: '', description: '', status: 'active' })
        setShowModal(true)
    }

    const handleEdit = (region: Region) => {
        setSelectedRegion(region)
        setFormData({ name: region.name, code: region.code, description: region.description, status: region.status })
        setShowModal(true)
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.code) {
            toast.error('Complete los campos requeridos')
            return
        }
        toast.success(selectedRegion ? '✅ Región actualizada' : '✅ Región creada')
        setShowModal(false)
    }

    const handleDelete = (id: number) => {
        toast.success('✅ Región eliminada')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <Map className="h-6 w-6 text-white" />
                                </div>
                                Regiones
                            </h1>
                            <p className="text-sm text-gray-600 mt-2 ml-15">Gestión de regiones geográficas</p>
                        </div>
                        <Button onClick={handleCreate} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                            <Plus className="h-5 w-5 mr-2" />
                            Nueva Región
                        </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Total Regiones', value: stats.total, color: 'from-green-500 to-green-600', icon: Map },
                            { label: 'Activas', value: stats.active, color: 'from-emerald-500 to-emerald-600', icon: Map },
                            { label: 'Inactivas', value: stats.inactive, color: 'from-red-500 to-red-600', icon: Map },
                            { label: 'Dependencias', value: stats.totalDependencies, color: 'from-blue-500 to-cyan-600', icon: Building2 }
                        ].map((stat, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.02 }} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">{stat.label}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <stat.icon className="h-8 w-8 opacity-80" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.header>

            <div className="p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input placeholder="Buscar por nombre o código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12 border-2" />
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRegions.map((region, i) => (
                            <motion.div key={region.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 overflow-hidden hover:border-green-500/50 transition-all">
                                <div className={`h-2 ${region.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-400'}`} />
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                                {region.code}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{region.name}</h3>
                                                <Badge variant={region.status === 'active' ? 'default' : 'secondary'}>{region.status === 'active' ? 'Activa' : 'Inactiva'}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">{region.description}</p>
                                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-500">Dependencias</p>
                                            <p className="text-lg font-bold text-gray-900">{region.dependencies_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Sedes</p>
                                            <p className="text-lg font-bold text-gray-900">{region.sites_count}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(region)} className="flex-1 border-2">
                                            <Edit className="h-4 w-4 mr-1" />
                                            Editar
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(region.id)} className="border-2 border-red-200 text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">{selectedRegion ? 'Editar Región' : 'Nueva Región'}</h2>
                                <button onClick={() => setShowModal(false)} className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                                    <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="border-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                    <option value="active">Activa</option>
                                    <option value="inactive">Inactiva</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-600 to-emerald-600">
                                <Save className="h-5 w-5 mr-2" />
                                {selectedRegion ? 'Guardar Cambios' : 'Crear Región'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
