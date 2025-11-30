import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Plus, Edit, Trash2, Search, Building2, Briefcase, MapPin, Mail, Phone, IdCard, Save, X, Eye, Upload, Camera, User, Calendar, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { QRCodeSVG } from 'qrcode.react'

interface Employee {
    id: number
    name: string
    email: string
    phone: string
    document: string
    department_id: number
    department_name: string
    position_id: number
    position_name: string
    region_id: number
    region_name: string
    site_id: number
    site_name: string
    status: 'active' | 'inactive'
    photo?: string
}

interface Department { id: number; name: string }
interface Position { id: number; name: string; department_id: number }
interface Region { id: number; name: string }
interface Site { id: number; name: string; region_id: number }

const VirtualIDCard = ({ employee, department, position, site }: { employee: any, department?: string, position?: string, site?: string }) => (
    <div className="w-96 flex-shrink-0">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-6">
                <div className="text-center mb-6">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-bold text-sm mb-4">
                        EMPLEADO REGISTRADO
                    </div>
                    <div className="text-xs text-gray-500">
                        ID: #{employee.id?.toString().padStart(6, '0') || '000000'}
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="relative">
                        {employee.photo ? (
                            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    <img src={employee.photo} alt={employee.name} className="h-full w-full object-cover" />
                                </div>
                            </div>
                        ) : (
                            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white p-1">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                                    <User className="h-20 w-20 text-gray-400" />
                                </div>
                            </div>
                        )}
                        <div className={`absolute bottom-2 right-2 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center ${employee.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                            <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {employee.name || 'Nombre Completo'}
                        </h3>
                        <p className="text-sm font-medium text-gray-600">
                            {department || employee.department_name || 'Departamento'}
                        </p>
                    </div>

                    <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                        {(site || employee.site_name) && (
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-700">{site || employee.site_name}</span>
                            </div>
                        )}
                        {(position || employee.position_name) && (
                            <div className="flex items-center gap-2 text-sm">
                                <Briefcase className="h-4 w-4 text-indigo-500" />
                                <span className="text-gray-700">{position || employee.position_name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-700">
                                {new Date().toLocaleDateString('es-ES')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm border-t border-gray-200 pt-2 mt-2">
                            <User className="h-4 w-4 text-orange-500" />
                            <span className="text-gray-700 font-medium">
                                Doc: {employee.document || 'V-00000000'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 flex flex-col items-center border-2 border-gray-200">
                    <div className="mb-2">
                        <QRCodeSVG
                            value={JSON.stringify({
                                id: employee.id,
                                name: employee.name,
                                document: employee.document,
                                department: department || employee.department_name,
                                position: position || employee.position_name,
                                site: site || employee.site_name
                            })}
                            size={180}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <QrCode className="h-3 w-3" />
                        <span>Código de Verificación</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                    <p className="text-xs font-medium text-gray-700">
                        Sistema de Visitas Nacional
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Válido como identificación oficial
                    </p>
                </div>
            </div>
        </div>
    </div>
)

export default function EmpleadosPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const [positions, setPositions] = useState<Position[]>([])
    const [regions, setRegions] = useState<Region[]>([])
    const [sites, setSites] = useState<Site[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [deptFilter, setDeptFilter] = useState<number | 'all'>('all')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [showModal, setShowModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string>('')
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', document: '',
        department_id: 1, position_id: 1, region_id: 1, site_id: 1, status: 'active' as 'active' | 'inactive', photo: ''
    })

    const mockDepts: Department[] = [
        { id: 1, name: 'Recursos Humanos' },
        { id: 2, name: 'Tecnología' },
        { id: 3, name: 'Administración' },
        { id: 4, name: 'Operaciones' }
    ]

    const mockPositions: Position[] = [
        { id: 1, name: 'Director', department_id: 1 },
        { id: 2, name: 'Analista', department_id: 1 },
        { id: 3, name: 'Desarrollador Senior', department_id: 2 },
        { id: 4, name: 'Desarrollador Junior', department_id: 2 },
        { id: 5, name: 'Contador', department_id: 3 },
        { id: 6, name: 'Asistente Administrativo', department_id: 3 }
    ]

    const mockRegions: Region[] = [
        { id: 1, name: 'Región Capital' },
        { id: 2, name: 'Región Central' },
        { id: 3, name: 'Región Occidental' }
    ]

    const mockSites: Site[] = [
        { id: 1, name: 'Sede Principal Caracas', region_id: 1 },
        { id: 2, name: 'Oficina Chacao', region_id: 1 },
        { id: 3, name: 'Sede Maracay', region_id: 2 },
        { id: 4, name: 'Sede Maracaibo', region_id: 3 }
    ]

    const mockEmployees: Employee[] = [
        { id: 1, name: 'María González', email: 'maria.gonzalez@sistema.com', phone: '0414-555-0001', document: 'V-12345678', department_id: 1, department_name: 'Recursos Humanos', position_id: 1, position_name: 'Director', region_id: 1, region_name: 'Región Capital', site_id: 1, site_name: 'Sede Principal Caracas', status: 'active' },
        { id: 2, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@sistema.com', phone: '0424-555-0002', document: 'V-23456789', department_id: 2, department_name: 'Tecnología', position_id: 3, position_name: 'Desarrollador Senior', region_id: 1, region_name: 'Región Capital', site_id: 1, site_name: 'Sede Principal Caracas', status: 'active' },
        { id: 3, name: 'Ana Martínez', email: 'ana.martinez@sistema.com', phone: '0412-555-0003', document: 'V-34567890', department_id: 2, department_name: 'Tecnología', position_id: 4, position_name: 'Desarrollador Junior', region_id: 1, region_name: 'Región Capital', site_id: 2, site_name: 'Oficina Chacao', status: 'active' },
        { id: 4, name: 'Luis Pérez', email: 'luis.perez@sistema.com', phone: '0416-555-0004', document: 'V-45678901', department_id: 3, department_name: 'Administración', position_id: 5, position_name: 'Contador', region_id: 1, region_name: 'Región Capital', site_id: 1, site_name: 'Sede Principal Caracas', status: 'active' },
        { id: 5, name: 'Carmen Silva', email: 'carmen.silva@sistema.com', phone: '0426-555-0005', document: 'V-56789012', department_id: 3, department_name: 'Administración', position_id: 6, position_name: 'Asistente Administrativo', region_id: 2, region_name: 'Región Central', site_id: 3, site_name: 'Sede Maracay', status: 'inactive' }
    ]

    useEffect(() => {
        setTimeout(() => {
            setDepartments(mockDepts)
            setPositions(mockPositions)
            setRegions(mockRegions)
            setSites(mockSites)
            setEmployees(mockEmployees)
            setIsLoading(false)
        }, 1000)
    }, [])

    const filteredEmployees = employees.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.document.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDept = deptFilter === 'all' || e.department_id === deptFilter
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter
        return matchesSearch && matchesDept && matchesStatus
    })

    const filteredPositions = positions.filter(p => p.department_id === formData.department_id)
    const filteredSites = sites.filter(s => s.region_id === formData.region_id)
    const selectedDept = departments.find(d => d.id === formData.department_id)
    const selectedPosition = positions.find(p => p.id === formData.position_id)
    const selectedRegion = regions.find(r => r.id === formData.region_id)
    const selectedSite = sites.find(s => s.id === formData.site_id)

    const stats = {
        total: employees.length,
        active: employees.filter(e => e.status === 'active').length,
        inactive: employees.filter(e => e.status === 'inactive').length,
        byDept: departments.map(d => ({
            name: d.name,
            count: employees.filter(e => e.department_id === d.id).length
        }))
    }

    const handleCreate = () => {
        setSelectedEmp(null)
        setFormData({ name: '', email: '', phone: '', document: '', department_id: 1, position_id: 1, region_id: 1, site_id: 1, status: 'active', photo: '' })
        setPhotoPreview('')
        setShowModal(true)
    }

    const handleEdit = (emp: Employee) => {
        setSelectedEmp(emp)
        setFormData({
            name: emp.name, email: emp.email, phone: emp.phone, document: emp.document,
            department_id: emp.department_id, position_id: emp.position_id, region_id: emp.region_id, site_id: emp.site_id, status: emp.status, photo: emp.photo || ''
        })
        setPhotoPreview(emp.photo || '')
        setShowModal(true)
    }

    const handleView = (emp: Employee) => {
        setSelectedEmp(emp)
        setShowViewModal(true)
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setPhotoPreview(result)
                setFormData({ ...formData, photo: result })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.document) {
            toast.error('Complete los campos requeridos')
            return
        }
        toast.success(selectedEmp ? '✅ Empleado actualizado' : '✅ Empleado creado')
        setShowModal(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                Empleados
                            </h1>
                            <p className="text-sm text-gray-600 mt-2 ml-15">Gestión del personal de la organización</p>
                        </div>
                        <Button onClick={handleCreate} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <Plus className="h-5 w-5 mr-2" />
                            Nuevo Empleado
                        </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Total Empleados', value: stats.total, color: 'from-indigo-500 to-indigo-600', icon: Users },
                            { label: 'Activos', value: stats.active, color: 'from-green-500 to-emerald-600', icon: Users },
                            { label: 'Inactivos', value: stats.inactive, color: 'from-red-500 to-red-600', icon: Users },
                            { label: 'Departamentos', value: departments.length, color: 'from-purple-500 to-pink-600', icon: Briefcase }
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
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input placeholder="Buscar por nombre, email o documento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12 border-2" />
                        </div>
                        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                            <option value="all">Todos los Departamentos</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
                            <option value="all">Todos los Estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="text-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto" /></div>
                ) : (
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Empleado</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Contacto</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Departamento</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Cargo</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Sede</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredEmployees.map((emp, i) => (
                                        <motion.tr key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-indigo-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {emp.photo ? (
                                                        <img src={emp.photo} alt={emp.name} className="h-10 w-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{emp.name}</p>
                                                        <p className="text-xs text-gray-500">{emp.document}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="h-4 w-4 text-indigo-500" />
                                                        <span>{emp.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="h-4 w-4 text-indigo-500" />
                                                        <span>{emp.phone}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-purple-500" />
                                                    <span className="text-sm text-gray-900">{emp.department_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline">{emp.position_name}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-orange-500" />
                                                    <span className="text-sm text-gray-600">{emp.site_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                                                    {emp.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleView(emp)} title="Ver detalles">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(emp)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="border-red-200 text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Creación/Edición */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="flex gap-6 max-w-7xl w-full items-start" onClick={(e) => e.stopPropagation()}>
                        {/* Carnet Virtual - Lado Izquierdo (se actualiza en tiempo real) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex-shrink-0"
                        >
                            <VirtualIDCard
                                employee={{ ...formData, id: selectedEmp?.id || 999, photo: photoPreview }}
                                department={selectedDept?.name}
                                position={selectedPosition?.name}
                                site={selectedSite?.name}
                            />
                        </motion.div>

                        {/* Modal de Formulario - Lado Derecho */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="flex-1 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedEmp ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
                                        <p className="text-indigo-100 text-sm mt-1">Complete la información del empleado</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Foto de Perfil */}
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-full object-cover border-4 border-indigo-200" />
                                        ) : (
                                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                                <Camera className="h-6 w-6" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil (Opcional)</label>
                                            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                            <label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                                <Upload className="h-4 w-4" />
                                                Subir Foto
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">JPG, PNG o GIF (máx. 2MB)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Documento *</label>
                                        <Input value={formData.document} onChange={(e) => setFormData({ ...formData, document: e.target.value })} placeholder="V-12345678" className="border-2" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                        <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0414-555-0000" className="border-2" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Departamento *</label>
                                        <select value={formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: Number(e.target.value), position_id: filteredPositions[0]?.id || 1 })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cargo *</label>
                                        <select value={formData.position_id} onChange={(e) => setFormData({ ...formData, position_id: Number(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                            {filteredPositions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Región *</label>
                                        <select value={formData.region_id} onChange={(e) => setFormData({ ...formData, region_id: Number(e.target.value), site_id: filteredSites[0]?.id || 1 })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sede *</label>
                                        <select value={formData.site_id} onChange={(e) => setFormData({ ...formData, site_id: Number(e.target.value) })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                            {filteredSites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg">
                                            <option value="active">Activo</option>
                                            <option value="inactive">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                                <Button variant="outline" onClick={() => setShowModal(false)} className="hover:bg-gray-100">
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {selectedEmp ? 'Guardar Cambios' : 'Crear Empleado'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Modal de Vista de Empleado */}
            {showViewModal && selectedEmp && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
                    <div className="flex gap-6 max-w-7xl w-full items-start" onClick={(e) => e.stopPropagation()}>
                        {/* Carnet Virtual - Lado Izquierdo */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex-shrink-0"
                        >
                            <VirtualIDCard employee={selectedEmp} />
                        </motion.div>

                        {/* Modal de Detalles - Lado Derecho */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="flex-1 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">Detalles del Empleado</h2>
                                        <p className="text-indigo-100 text-sm mt-1">Información completa del empleado</p>
                                    </div>
                                    <button onClick={() => setShowViewModal(false)} className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        {selectedEmp.photo ? (
                                            <img src={selectedEmp.photo} alt={selectedEmp.name} className="h-20 w-20 rounded-full object-cover border-4 border-indigo-200" />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                                                {selectedEmp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{selectedEmp.name}</h3>
                                            <p className="text-gray-600">{selectedEmp.document}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <User className="h-5 w-5 text-blue-500" />
                                            Información del Empleado
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-indigo-600" />
                                                    <p className="font-semibold text-gray-900">{selectedEmp.email}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                                                <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-indigo-600" />
                                                    <p className="font-semibold text-gray-900">{selectedEmp.phone}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                                                <p className="text-sm text-gray-600 mb-1">Departamento</p>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                                    <p className="font-semibold text-gray-900">{selectedEmp.department_name}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                                                <p className="text-sm text-gray-600 mb-1">Cargo</p>
                                                <div className="flex items-center gap-2">
                                                    <IdCard className="h-4 w-4 text-indigo-600" />
                                                    <p className="font-semibold text-gray-900">{selectedEmp.position_name}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                                                <p className="text-sm text-gray-600 mb-1">Sede</p>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-orange-600" />
                                                    <p className="font-semibold text-gray-900">{selectedEmp.site_name}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                                <p className="text-sm text-gray-600 mb-1">Estado</p>
                                                <Badge variant={selectedEmp.status === 'active' ? 'default' : 'secondary'} className="text-base px-4 py-1">
                                                    {selectedEmp.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
                                <Button variant="outline" onClick={() => setShowViewModal(false)} className="hover:bg-gray-100">
                                    Cerrar
                                </Button>
                                <Button
                                    onClick={() => { setShowViewModal(false); handleEdit(selectedEmp); }}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar Empleado
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    )
}
