import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, Plus, Edit, Trash2, Search, Map, Save, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Site {
    id: number
    name: string
    code: string
    dependency_id: number
    dependency_name: string
    region_id: number
    region_name: string
    address: string
    phone: string
    status: 'active' | 'inactive'
}

interface Dependency { id: number; name: string; region_id: number; region_name: string }
interface Region { id: number; name: string }

export default function SedesPage() {
    const [sites, setSites] = useState<Site[]>([])
    const [dependencies, setDependencies] = useState<Dependency[]>([])
    const [regions, setRegions] = useState<Region[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [regionFilter, setRegionFilter] = useState<number | 'all'>('all')
    const [depFilter, setDepFilter] = useState<number | 'all'>('all')
    const [showModal, setShowModal] = useState(false)
    const [selectedSite, setSelectedSite] = useState<Site | null>(null)
    const [formData, setFormData] = useState({ name: '', code: '', dependency_id: 1, address: '', phone: '', status: 'active' as 'active' | 'inactive' })

    const mockRegions: Region[] = [
        { id: 1, name: 'Región Capital' },
        { id: 2, name: 'Región Central' }
    ]

    const mockDeps: Dependency[] = [
        { id: 1, name: 'Ministerio del Poder Popular', region_id: 1, region_name: 'Región Capital' },
        { id: 2, name: 'Dirección General', region_id: 1, region_name: 'Región Capital' },
        { id: 3, name: 'Oficina Regional Central', region_id: 2, region_name: 'Región Central' }
    ]

    const mockSites: Site[] = [
        { id: 1, name: 'Sede Principal Caracas', code: 'SPC', dependency_id: 1, dependency_name: 'Ministerio del Poder Popular', region_id: 1, region_name: 'Región Capital', address: 'Av. Urdaneta, Caracas', phone: '0212-555-0001', status: 'active' },
        { id: 2, name: 'Oficina Administrativa', code: 'OA', dependency_id: 1, dependency_name: 'Ministerio del Poder Popular', region_id: 1, region_name: 'Región Capital', address: 'Parque Central, Caracas', phone: '0212-555-0002', status: 'active' },
        { id: 3, name: 'Sede Chacao', code: 'SCH', dependency_id: 2, dependency_name: 'Dirección General', region_id: 1, region_name: 'Región Capital', address: 'Chacao, Miranda', phone: '0212-555-0003', status: 'active' },
        { id: 4, name: 'Sede Maracay', code: 'SMA', dependency_id: 3, dependency_name: 'Oficina Regional Central', region_id: 2, region_name: 'Región Central', address: 'Centro, Maracay', phone: '0243-555-0001', status: 'active' },
        { id: 5, name: 'Oficina Valencia', code: 'OV', dependency_id: 3, dependency_name: 'Oficina Regional Central', region_id: 2, region_name: 'Región Central', address: 'Valencia, Carabobo', phone: '0241-555-0001', status: 'inactive' }
    ]

    useEffect(() => {
        setTimeout(() => {
            setRegions(mockRegions)
            setDependencies(mockDeps)
            setSites(mockSites)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredSites = sites.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRegion = regionFilter === 'all' || s.region_id === regionFilter
        const matchesDep = depFilter === 'all' || s.dependency_id === depFilter
        return matchesSearch && matchesRegion && matchesDep
    })

    const filteredDeps = dependencies.filter(d => regionFilter === 'all' || d.region_id === regionFilter)

    const stats = {
        total: sites.length,
        active: sites.filter(s => s.status === 'active').length,
        inactive: sites.filter(s => s.status === 'inactive').length
    }

    const handleCreate = () => {
        setSelectedSite(null)
        setFormData({ name: '', code: '', dependency_id: 1, address: '', phone: '', status: 'active' })
        setShowModal(true)
    }

    const handleEdit = (site: Site) => {
        setSelectedSite(site)
        setFormData({ name: site.name, code: site.code, dependency_id: site.dependency_id, address: site.address, phone: site.phone, status: site.status })
        setShowModal(true)
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.code) {
            toast.error('Complete los campos requeridos')
            return
        }
        toast.success(selectedSite ? '✅ Sede actualizada' : '✅ Sede creada')
        setShowModal(false)
    }

    const selectedDep = dependencies.find(d => d.id === formData.dependency_id)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                Sedes
                            </h1>
                            <p className="text-sm text-gray-600 mt-2 ml-15">Gestión de sedes por dependencia y región</p>
                        </div>
                        <Button onClick={handleCreate} className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                            <Plus className="h-5 w-5 mr-2" />
                            Nueva Sede
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Total Sedes', value: stats.total, color: 'from-orange-500 to-orange-600' },
                            { label: 'Activas', value: stats.active, color: 'from-amber-500 to-amber-600' },
                            { label: 'Inactivas', value: stats.inactive, color: 'from-red-500 to-red-600' }
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
                        <select value={regionFilter} onChange={(e) => { setRegionFilter(e.target.value === 'all' ? 'all' : Number(e.target.value)); setDepFilter('all'); }} className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                            <option value="all">Todas las Regiones</option>
                            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <select value={depFilter} onChange={(e) => setDepFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                            <option value="all">Todas las Dependencias</option>
                            {filteredDeps.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="text-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto" /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSites.map((site, i) => (
                            <motion.div key={site.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 overflow-hidden">
                                <div className={`h-2 ${site.status === 'active' ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gray-400'}`} />
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{site.name}</h3>
                                            <code className="text-xs text-gray-500">{site.code}</code>
                                        </div>
                                        <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>{site.status === 'active' ? 'Activa' : 'Inactiva'}</Badge>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Map className="h-4 w-4 text-green-500" />
                                            <span>{site.region_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Building2 className="h-4 w-4 text-blue-500" />
                                            <span>{site.dependency_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 text-orange-500" />
                                            <span>{site.address}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(site)} className="flex-1 border-2">
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
                        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">{selectedSite ? 'Editar Sede' : 'Nueva Sede'}</h2>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dependencia *</label>
                                <select value={formData.dependency_id} onChange={(e) => setFormData({ ...formData, dependency_id: Number(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                    {dependencies.map(d => <option key={d.id} value={d.id}>{d.name} ({d.region_name})</option>)}
                                </select>
                                {selectedDep && (
                                    <p className="text-sm text-gray-500 mt-1">Región: {selectedDep.region_name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="border-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border-2" />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button onClick={handleSubmit} className="bg-gradient-to-r from-orange-600 to-amber-600">
                                <Save className="h-5 w-5 mr-2" />{selectedSite ? 'Guardar' : 'Crear'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
