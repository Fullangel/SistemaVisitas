import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    UserPlus,
    Search,
    CheckCircle,
    Calendar,
    Clock,
    Building2,
    Briefcase,
    FileText,
    ArrowRight,
    ArrowLeft,
    User,
    Mail,
    Phone,
    CreditCard,
    MapPin,
    AlertCircle,
    Sparkles,
    X,
    Camera,
    RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface Visitor {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    identification: string
    company: string
    address?: string
    city?: string
}

interface VisitorFormData {
    first_name: string
    last_name: string
    email: string
    phone: string
    identification: string
    company: string
    address: string
    city: string
}

interface VisitFormData {
    date: string
    time: string
    site: string
    department: string
    host: string
    purpose: string
    duration: string
}

export default function NewVisitPage() {
    // Wizard steps
    const [currentStep, setCurrentStep] = useState(1)

    // Visitor search and selection
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<Visitor[]>([])
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    // New visitor form
    const [newVisitorData, setNewVisitorData] = useState<VisitorFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        identification: '',
        company: '',
        address: '',
        city: ''
    })

    // Camera and photo capture (visitor photo)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)

    // Camera and photo capture (ID card)
    const idVideoRef = useRef<HTMLVideoElement>(null)
    const idCanvasRef = useRef<HTMLCanvasElement>(null)
    const [idStream, setIdStream] = useState<MediaStream | null>(null)
    const [capturedIdPhoto, setCapturedIdPhoto] = useState<string | null>(null)
    const [isIdCameraActive, setIsIdCameraActive] = useState(false)

    // Visit details
    const [visitData, setVisitData] = useState<VisitFormData>({
        date: new Date().toISOString().split('T')[0],
        time: '',
        site: '',
        department: '',
        host: '',
        purpose: '',
        duration: ''
    })

    // Mock data for visitors
    const mockVisitors: Visitor[] = [
        {
            id: 1,
            first_name: "Carlos",
            last_name: "Rodríguez García",
            email: "carlos.rodriguez@techsolutions.com",
            phone: "+34 600 123 456",
            identification: "12345678A",
            company: "Tech Solutions S.A.",
            city: "Madrid"
        },
        {
            id: 2,
            first_name: "María",
            last_name: "González López",
            email: "maria.gonzalez@consulting.com",
            phone: "+34 611 234 567",
            identification: "23456789B",
            company: "Consulting Group",
            city: "Barcelona"
        },
        {
            id: 3,
            first_name: "Roberto",
            last_name: "Sánchez Mora",
            email: "roberto.sanchez@innovation.com",
            phone: "+34 622 345 678",
            identification: "34567890C",
            company: "Innovation Labs",
            city: "Valencia"
        }
    ]

    const sites = [
        { id: 1, name: "Sede Central - Madrid" },
        { id: 2, name: "Sede Norte - Barcelona" },
        { id: 3, name: "Sede Sur - Valencia" },
    ]

    const departments = [
        { id: 1, name: "Recursos Humanos" },
        { id: 2, name: "Tecnología" },
        { id: 3, name: "Ventas" },
        { id: 4, name: "Marketing" },
        { id: 5, name: "Finanzas" },
    ]

    // Search visitors with debounce
    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        const timer = setTimeout(() => {
            const results = mockVisitors.filter(visitor =>
                visitor.identification.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${visitor.first_name} ${visitor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visitor.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setSearchResults(results)
            setIsSearching(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const handleSelectVisitor = (visitor: Visitor) => {
        setSelectedVisitor(visitor)
        setSearchTerm('')
        setSearchResults([])
        setShowCreateForm(false)
    }

    const handleCreateNewVisitor = () => {
        // Pre-fill identification if it was searched
        if (searchTerm && searchResults.length === 0) {
            setNewVisitorData(prev => ({ ...prev, identification: searchTerm }))
        }
        setShowCreateForm(true)
        setSearchResults([])
    }

    const handleSaveNewVisitor = () => {
        // Validate required fields
        if (!newVisitorData.first_name || !newVisitorData.last_name || !newVisitorData.email ||
            !newVisitorData.phone || !newVisitorData.identification || !newVisitorData.company) {
            toast.error('Por favor completa todos los campos requeridos')
            return
        }

        // Validate photo
        if (!capturedPhoto) {
            toast.error('Por favor captura una foto del visitante')
            return
        }

        // Stop camera
        stopCamera()

        // Create visitor object
        const newVisitor: Visitor = {
            id: Date.now(),
            ...newVisitorData
        }

        setSelectedVisitor(newVisitor)
        setShowCreateForm(false)
        setCapturedPhoto(null)
        setIsCameraActive(false)
        toast.success('✅ Visitante creado exitosamente')
    }

    // Camera functions
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setIsCameraActive(true)
        } catch (error) {
            console.error('Error accessing camera:', error)
            toast.error('No se pudo acceder a la cámara')
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setIsCameraActive(false)
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(video, 0, 0)
                const photoData = canvas.toDataURL('image/jpeg')
                setCapturedPhoto(photoData)
                stopCamera()
            }
        }
    }

    const retakePhoto = () => {
        setCapturedPhoto(null)
        startCamera()
    }

    // ID Card Camera functions
    const startIdCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 1280, height: 720 }
            })
            setIdStream(mediaStream)
            if (idVideoRef.current) {
                idVideoRef.current.srcObject = mediaStream
            }
            setIsIdCameraActive(true)
        } catch (error) {
            console.error('Error accessing camera:', error)
            toast.error('No se pudo acceder a la cámara')
        }
    }

    const stopIdCamera = () => {
        if (idStream) {
            idStream.getTracks().forEach(track => track.stop())
            setIdStream(null)
        }
        setIsIdCameraActive(false)
    }

    const captureIdPhoto = () => {
        if (idVideoRef.current && idCanvasRef.current) {
            const video = idVideoRef.current
            const canvas = idCanvasRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(video, 0, 0)
                const photoData = canvas.toDataURL('image/jpeg')
                setCapturedIdPhoto(photoData)
                stopIdCamera()
            }
        }
    }

    const retakeIdPhoto = () => {
        setCapturedIdPhoto(null)
        startIdCamera()
    }

    // Cleanup cameras on unmount
    useEffect(() => {
        return () => {
            stopCamera()
            stopIdCamera()
        }
    }, [])

    const handleNextStep = () => {
        if (currentStep === 1 && !selectedVisitor) {
            toast.error('Por favor selecciona o crea un visitante')
            return
        }
        if (currentStep === 2) {
            if (!visitData.date || !visitData.time || !visitData.site || !visitData.department) {
                toast.error('Por favor completa todos los campos requeridos')
                return
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, 3))
    }

    const handlePreviousStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmitVisit = () => {
        console.log('Creating visit:', {
            visitor: selectedVisitor,
            visit: visitData
        })
        toast.success('🎉 Visita registrada exitosamente!')
        // Reset form
        setTimeout(() => {
            setCurrentStep(1)
            setSelectedVisitor(null)
            setVisitData({
                date: new Date().toISOString().split('T')[0],
                time: '',
                site: '',
                department: '',
                host: '',
                purpose: '',
                duration: ''
            })
        }, 2000)
    }

    const stepVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
            {/* Modern Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            >
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <UserPlus className="h-6 w-6 text-white" />
                                </div>
                                Nueva Visita
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-15">
                                Registra una nueva visita de forma rápida y sencilla
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-emerald-500 text-white px-4 py-2 text-sm">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Paso {currentStep} de 3
                            </Badge>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="p-6 max-w-6xl mx-auto">
                {/* Progress Stepper */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-center">
                        {[
                            { num: 1, label: 'Visitante', icon: User },
                            { num: 2, label: 'Detalles', icon: FileText },
                            { num: 3, label: 'Confirmar', icon: CheckCircle }
                        ].map((step, index) => (
                            <div key={step.num} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className={`
                                            h-16 w-16 rounded-full flex items-center justify-center font-bold text-lg
                                            transition-all duration-300 shadow-lg
                                            ${currentStep >= step.num
                                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                                        `}
                                    >
                                        <step.icon className="h-8 w-8" />
                                    </motion.div>
                                    <span className={`mt-2 text-sm font-medium ${currentStep >= step.num ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < 2 && (
                                    <div className={`
                                        w-32 h-1 mx-4 rounded-full transition-all duration-300
                                        ${currentStep > step.num
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                                            : 'bg-gray-200 dark:bg-gray-700'}
                                    `} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8"
                    >
                        {/* Step 1: Visitor Search/Create */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                        <User className="h-6 w-6 text-emerald-600" />
                                        Buscar o Crear Visitante
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Busca por cédula, nombre o email. Si no existe, podrás crear uno nuevo.
                                    </p>
                                </div>

                                {!selectedVisitor ? (
                                    <>
                                        {/* Search Bar */}
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Buscar por cédula, nombre o email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-14 pr-4 py-6 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                                            />
                                            {isSearching && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Search Results */}
                                        {searchResults.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-3"
                                            >
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {searchResults.length} visitante{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                                                </p>
                                                {searchResults.map(visitor => (
                                                    <motion.div
                                                        key={visitor.id}
                                                        whileHover={{ scale: 1.02 }}
                                                        onClick={() => handleSelectVisitor(visitor)}
                                                        className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 cursor-pointer hover:border-emerald-400 transition-all"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                                                                {visitor.first_name.charAt(0)}{visitor.last_name.charAt(0)}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                                    {visitor.first_name} {visitor.last_name}
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-400">{visitor.company}</p>
                                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <CreditCard className="h-4 w-4" />
                                                                        {visitor.identification}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Mail className="h-4 w-4" />
                                                                        {visitor.email}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}

                                        {/* No Results - Create New */}
                                        {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && !showCreateForm && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center py-8"
                                            >
                                                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    No se encontró ningún visitante
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                    ¿Deseas crear un nuevo visitante?
                                                </p>
                                                <Button
                                                    onClick={handleCreateNewVisitor}
                                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                                                >
                                                    <UserPlus className="h-5 w-5 mr-2" />
                                                    Crear Nuevo Visitante
                                                </Button>
                                            </motion.div>
                                        )}

                                        {/* Create Form */}
                                        {showCreateForm && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-800"
                                            >
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                                        <UserPlus className="h-8 w-8 text-emerald-600" />
                                                        Crear Nuevo Visitante
                                                    </h3>
                                                    <button
                                                        onClick={() => setShowCreateForm(false)}
                                                        className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Nombre *
                                                        </label>
                                                        <Input
                                                            value={newVisitorData.first_name}
                                                            onChange={(e) => setNewVisitorData(prev => ({ ...prev, first_name: e.target.value }))}
                                                            placeholder="Nombre"
                                                            className="border-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Apellidos *
                                                        </label>
                                                        <Input
                                                            value={newVisitorData.last_name}
                                                            onChange={(e) => setNewVisitorData(prev => ({ ...prev, last_name: e.target.value }))}
                                                            placeholder="Apellidos"
                                                            className="border-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Cédula/Documento *
                                                        </label>
                                                        <div className="relative">
                                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                            <Input
                                                                value={newVisitorData.identification}
                                                                onChange={(e) => setNewVisitorData(prev => ({ ...prev, identification: e.target.value }))}
                                                                placeholder="12345678A"
                                                                className="pl-10 border-2"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Email *
                                                        </label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                            <Input
                                                                type="email"
                                                                value={newVisitorData.email}
                                                                onChange={(e) => setNewVisitorData(prev => ({ ...prev, email: e.target.value }))}
                                                                placeholder="email@ejemplo.com"
                                                                className="pl-10 border-2"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Teléfono *
                                                        </label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                            <Input
                                                                type="tel"
                                                                value={newVisitorData.phone}
                                                                onChange={(e) => setNewVisitorData(prev => ({ ...prev, phone: e.target.value }))}
                                                                placeholder="+34 600 000 000"
                                                                className="pl-10 border-2"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Empresa *
                                                        </label>
                                                        <Input
                                                            value={newVisitorData.company}
                                                            onChange={(e) => setNewVisitorData(prev => ({ ...prev, company: e.target.value }))}
                                                            placeholder="Nombre de la empresa"
                                                            className="border-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Ciudad
                                                        </label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                            <Input
                                                                value={newVisitorData.city}
                                                                onChange={(e) => setNewVisitorData(prev => ({ ...prev, city: e.target.value }))}
                                                                placeholder="Ciudad"
                                                                className="pl-10 border-2"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Dirección
                                                        </label>
                                                        <Input
                                                            value={newVisitorData.address}
                                                            onChange={(e) => setNewVisitorData(prev => ({ ...prev, address: e.target.value }))}
                                                            placeholder="Dirección completa"
                                                            className="border-2"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Photo Capture Section */}
                                                <div className="mt-8 border-t-2 border-gray-200 pt-6">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                                        <Camera className="inline h-5 w-5 mr-2 text-emerald-600" />
                                                        Foto del Visitante *
                                                    </label>

                                                    <div className="flex flex-col items-center gap-6">
                                                        {/* Camera/Photo Display - Circular */}
                                                        <div className="relative">
                                                            {!capturedPhoto ? (
                                                                <>
                                                                    {/* Video Preview - Circular */}
                                                                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl bg-gray-900">
                                                                        <video
                                                                            ref={videoRef}
                                                                            autoPlay
                                                                            playsInline
                                                                            className="w-full h-full object-cover"
                                                                            style={{ transform: 'scaleX(-1)' }}
                                                                        />
                                                                        {!isCameraActive && (
                                                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                                                <Camera className="h-24 w-24 text-gray-600" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {/* Circular border animation when camera is active */}
                                                                    {isCameraActive && (
                                                                        <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-pulse"></div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                /* Photo Preview - Circular */
                                                                <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-green-500 shadow-2xl">
                                                                    <img
                                                                        src={capturedPhoto}
                                                                        alt="Foto capturada"
                                                                        className="w-full h-full object-cover"
                                                                        style={{ transform: 'scaleX(-1)' }}
                                                                    />
                                                                    <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                                                                        <CheckCircle className="h-6 w-6" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Camera Controls */}
                                                        <div className="flex gap-3">
                                                            {!capturedPhoto ? (
                                                                <>
                                                                    {!isCameraActive ? (
                                                                        <Button
                                                                            type="button"
                                                                            onClick={startCamera}
                                                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                                                                        >
                                                                            <Camera className="h-5 w-5 mr-2" />
                                                                            Activar Cámara
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            type="button"
                                                                            onClick={capturePhoto}
                                                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-8"
                                                                        >
                                                                            <Camera className="h-5 w-5 mr-2" />
                                                                            Capturar Foto
                                                                        </Button>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    type="button"
                                                                    onClick={retakePhoto}
                                                                    variant="outline"
                                                                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                                                                >
                                                                    <RotateCcw className="h-5 w-5 mr-2" />
                                                                    Tomar Otra Foto
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {/* Hidden canvas for photo capture */}
                                                        <canvas ref={canvasRef} className="hidden" />
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-end gap-3">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setShowCreateForm(false)}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        onClick={handleSaveNewVisitor}
                                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                                                    >
                                                        <CheckCircle className="h-5 w-5 mr-2" />
                                                        Guardar Visitante
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border-2 border-emerald-500 dark:border-emerald-600"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                                    {selectedVisitor.first_name.charAt(0)}{selectedVisitor.last_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                            {selectedVisitor.first_name} {selectedVisitor.last_name}
                                                        </h3>
                                                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 font-medium">{selectedVisitor.company}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <CreditCard className="h-4 w-4" />
                                                            {selectedVisitor.identification}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-4 w-4" />
                                                            {selectedVisitor.email}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="h-4 w-4" />
                                                            {selectedVisitor.phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => setSelectedVisitor(null)}
                                                className="border-2"
                                            >
                                                Cambiar
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Visit Details */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                        <FileText className="h-6 w-6 text-emerald-600" />
                                        Detalles de la Visita
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Completa la información sobre la visita programada
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Calendar className="inline h-4 w-4 mr-1" />
                                            Fecha *
                                        </label>
                                        <Input
                                            type="date"
                                            value={visitData.date}
                                            onChange={(e) => setVisitData(prev => ({ ...prev, date: e.target.value }))}
                                            className="border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Clock className="inline h-4 w-4 mr-1" />
                                            Hora *
                                        </label>
                                        <Input
                                            type="time"
                                            value={visitData.time}
                                            onChange={(e) => setVisitData(prev => ({ ...prev, time: e.target.value }))}
                                            className="border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Building2 className="inline h-4 w-4 mr-1" />
                                            Sede *
                                        </label>
                                        <select
                                            value={visitData.site}
                                            onChange={(e) => setVisitData(prev => ({ ...prev, site: e.target.value }))}
                                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="">Seleccionar sede...</option>
                                            {sites.map(site => (
                                                <option key={site.id} value={site.name}>{site.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Briefcase className="inline h-4 w-4 mr-1" />
                                            Departamento *
                                        </label>
                                        <select
                                            value={visitData.department}
                                            onChange={(e) => setVisitData(prev => ({ ...prev, department: e.target.value }))}
                                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="">Seleccionar departamento...</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <User className="inline h-4 w-4 mr-1" />
                                            Anfitrión
                                        </label>
                                        <Input
                                            value={visitData.host}
                                            onChange={(e) => setVisitData(prev => ({ ...prev, host: e.target.value }))}
                                            placeholder="Nombre del anfitrión"
                                            className="border-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Clock className="inline h-4 w-4 mr-1" />
                                            Duración Estimada
                                        </label>
                                        <select
                                            value={visitData.duration}
                                            onChange={(e) => setVisitData(prev => ({ ...prev, duration: e.target.value }))}
                                            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="">Seleccionar duración...</option>
                                            <option value="30min">30 minutos</option>
                                            <option value="1h">1 hora</option>
                                            <option value="2h">2 horas</option>
                                            <option value="4h">4 horas</option>
                                            <option value="full">Jornada completa</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Propósito de la Visita
                                        </label>
                                        <textarea
                                            value={visitData.purpose}
                                            onChange={(e) => setVisitData(prev => ({ ...prev, purpose: e.target.value }))}
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Describe el motivo de la visita..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {currentStep === 3 && selectedVisitor && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                                        Confirmar Visita
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Revisa la información antes de registrar la visita
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Visitor Summary */}
                                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <User className="h-5 w-5 text-emerald-600" />
                                            Información del Visitante
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {selectedVisitor.first_name} {selectedVisitor.last_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Empresa</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedVisitor.company}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Documento</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedVisitor.identification}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedVisitor.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{selectedVisitor.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visit Summary */}
                                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            Detalles de la Visita
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha y Hora</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date(visitData.date).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })} - {visitData.time}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Sede</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{visitData.site}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Departamento</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{visitData.department}</p>
                                            </div>
                                            {visitData.host && (
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Anfitrión</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{visitData.host}</p>
                                                </div>
                                            )}
                                            {visitData.duration && (
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Duración</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{visitData.duration}</p>
                                                </div>
                                            )}
                                            {visitData.purpose && (
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Propósito</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{visitData.purpose}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ID Card Photo Capture Section - Optional */}
                                <div className="mt-8 border-t-2 border-gray-200 pt-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                        <CreditCard className="inline h-5 w-5 mr-2 text-blue-600" />
                                        Foto de la Cédula (Opcional)
                                    </label>

                                    <div className="flex flex-col items-center gap-6">
                                        {/* Camera/Photo Display - Rectangular (ID Card format) */}
                                        <div className="relative">
                                            {!capturedIdPhoto ? (
                                                <>
                                                    {/* Video Preview - Rectangular */}
                                                    <div className="relative w-full max-w-2xl aspect-[16/10] rounded-2xl overflow-hidden border-4 border-blue-500 shadow-2xl bg-gray-900">
                                                        <video
                                                            ref={idVideoRef}
                                                            autoPlay
                                                            playsInline
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {!isIdCameraActive && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 gap-4">
                                                                <CreditCard className="h-32 w-32 text-gray-600" />
                                                                <p className="text-gray-400 text-lg">Posiciona la cédula horizontalmente</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Border animation when camera is active */}
                                                    {isIdCameraActive && (
                                                        <div className="absolute inset-0 rounded-2xl border-4 border-blue-400 animate-pulse"></div>
                                                    )}
                                                </>
                                            ) : (
                                                /* Photo Preview - Rectangular */
                                                <div className="relative w-full max-w-2xl aspect-[16/10] rounded-2xl overflow-hidden border-4 border-green-500 shadow-2xl">
                                                    <img
                                                        src={capturedIdPhoto}
                                                        alt="Foto de cédula capturada"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                                        <CheckCircle className="h-5 w-5" />
                                                        <span className="font-medium">Capturada</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Camera Controls */}
                                        <div className="flex gap-3">
                                            {!capturedIdPhoto ? (
                                                <>
                                                    {!isIdCameraActive ? (
                                                        <Button
                                                            type="button"
                                                            onClick={startIdCamera}
                                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                                                        >
                                                            <Camera className="h-5 w-5 mr-2" />
                                                            Activar Cámara
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            onClick={captureIdPhoto}
                                                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg px-8"
                                                        >
                                                            <Camera className="h-5 w-5 mr-2" />
                                                            Capturar Cédula
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    onClick={retakeIdPhoto}
                                                    variant="outline"
                                                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                                                >
                                                    <RotateCcw className="h-5 w-5 mr-2" />
                                                    Tomar Otra Foto
                                                </Button>
                                            )}
                                        </div>

                                        {/* Hidden canvas for photo capture */}
                                        <canvas ref={idCanvasRef} className="hidden" />

                                        {/* Helper text */}
                                        <p className="text-sm text-gray-500 text-center max-w-md">
                                            💡 Asegúrate de que la cédula esté bien iluminada y todos los datos sean legibles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between mt-8"
                >
                    <Button
                        variant="outline"
                        onClick={handlePreviousStep}
                        disabled={currentStep === 1}
                        className="border-2"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Anterior
                    </Button>

                    {currentStep < 3 ? (
                        <Button
                            onClick={handleNextStep}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                        >
                            Siguiente
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmitVisit}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                        >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Registrar Visita
                        </Button>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
