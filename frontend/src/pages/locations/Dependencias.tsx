import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, Plus, Edit, Trash2, Search, Map, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Dependency {
    id: number
    name: string
    code: string
    region_id: number
    region_name: string
    description: string
    status: 'active' | 'inactive'
    sites_count: number
}

interface Region {
    id: number
    name: string
}

export default function DependenciasPage() {
    const [dependencies, setDependencies] = useState<Dependency[]>([])
    const [regions, setRegions] = useState<Region[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [regionFilter, setRegionFilter] = useState<number | 'all'>('all')
    const [showModal, setShowModal] = useState(false)
    const [selectedDep, setSelectedDep] = useState<Dependency | null>(null)
    const [formData, setFormData] = useState({ name: '', code: '', region_id: 1, description: '', status: 'active' as 'active' | 'inactive' })

    const mockRegions: Region[] = [
        { id: 1, name: 'Región Capital' },
        { id: 2, name: 'Región Central' },
        { id: 3, name: 'Región Oriental' },
        { id: 4, name: 'Región Occidental' }
    ]

    const mockDependencies: Dependency[] = [
        { id: 1, name: 'Ministerio del Poder Popular', code: 'MPP', region_id: 1, region_name: 'Región Capital', description: 'Oficina central', status: 'active', sites_count: 3 },
        { id: 2, name: 'Dirección General', code: 'DG', region_id: 1, region_name: 'Región Capital', description: 'Dirección administrativa', status: 'active', sites_count: 2 },
        { id: 3, name: 'Oficina Regional Central', code: 'ORC', region_id: 2, region_name: 'Región Central', description: 'Sede regional', status: 'active', sites_count: 2 },
        { id: 4, name: 'Dirección Estadal Aragua', code: 'DEA', region_id: 2, region_name: 'Región Central', description: 'Oficina estadal', status: 'active', sites_count: 1 },
        { id: 5, name: 'Oficina Regional Oriental', code: 'ORO', region_id: 3, region_name: 'Región Oriental', description: 'Sede regional', status: 'active', sites_count: 2 }
    ]

    useEffect(() => {
        setTimeout(() => {
            setRegions(mockRegions)
            setDependencies(mockDependencies)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredDeps = dependencies.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRegion = regionFilter === 'all' || d.region_id === regionFilter
        return matchesSearch && matchesRegion
    })

    const stats = {
        total: dependencies.length,
        active: dependencies.filter(d => d.status === 'active').length,
        totalSites: dependencies.reduce((sum, d) => sum + d.sites_count, 0)
    }

    const handleCreate = () => {
        setSelectedDep(null)
        setFormData({ name: '', code: '', region_id: 1, description: '', status: 'active' })
        setShowModal(true)
    }

    const handleEdit = (dep: Dependency) => {
        setSelectedDep(dep)
        setFormData({ name: dep.name, code: dep.code, region_id: dep.region_id, description: dep.description, status: dep.status })
        setShowModal(true)
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.code) {
            toast.error('Complete los campos requeridos')
            return
        }
        toast.success(selectedDep ? '✅ Dependencia actualizada' : '✅ Dependencia creada')
        setShowModal(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                Dependencias
                            </h1>
                            <p className="text-sm text-gray-600 mt-2 ml-15">Gestión de dependencias por región</p>
                        </div>
                        <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                            <Plus className="h-5 w-5 mr-2" />
                            Nueva Dependencia
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Total Dependencias', value: stats.total, color: 'from-blue-500 to-blue-600' },
                            { label: 'Activas', value: stats.active, color: 'from-cyan-500 to-cyan-600' },
                            { label: 'Total Sedes', value: stats.totalSites, color: 'from-green-500 to-emerald-600' }
                        ].map((stat, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.02 }} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}>
                                <p className="text-sm opacity-90">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.header>

            <div className="p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12 border-2" />
                        </div>
                        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                            <option value="all">Todas las Regiones</option>
                            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="text-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto" /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDeps.map((dep, i) => (
                            <motion.div key={dep.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600" />
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{dep.name}</h3>
                                            <code className="text-xs text-gray-500">{dep.code}</code>
                                        </div>
                                        <Badge>{dep.status === 'active' ? 'Activa' : 'Inactiva'}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                                        <Map className="h-4 w-4 text-blue-500" />
                                        <span>{dep.region_name}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">{dep.description}</p>
                                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                        <p className="text-xs text-gray-500">Sedes</p>
                                        <p className="text-lg font-bold text-gray-900">{dep.sites_count}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(dep)} className="flex-1 border-2">
                                            <Edit className="h-4 w-4 mr-1" />Editar
                                        </Button>
                                        <Button variant="outline" size="sm" className="border-2 border-red-200 text-red-600">
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
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">{selectedDep ? 'Editar Dependencia' : 'Nueva Dependencia'}</h2>
                                <button onClick={() => setShowModal(false)} className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"><X className="h-5 w-5" /></button>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Región *</label>
                                <select value={formData.region_id} onChange={(e) => setFormData({ ...formData, region_id: Number(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                                <Save className="h-5 w-5 mr-2" />{selectedDep ? 'Guardar' : 'Crear'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
