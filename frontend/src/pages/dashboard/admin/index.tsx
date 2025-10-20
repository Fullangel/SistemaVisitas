import React, { useState, useEffect } from 'react'
import { 
  UsersIcon,
  CogIcon,
  ShieldCheckIcon,
  KeyIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  ShieldIcon,
  DatabaseIcon,
  CloudIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserRegistrationModal from '@/components/admin/UserRegistrationModal'
import { useAuthStore } from '@/stores/auth'
import { VenezuelaMapWrapper } from '@/components/venezuela-map-wrapper'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'supervisor' | 'recepcion' | 'empleado'
  status: 'active' | 'inactive'
  last_login: string
  visitas_count: number
}

interface SystemStats {
  total_users: number
  active_visits: number
  total_visits: number
  pending_approvals: number
  system_health: 'good' | 'warning' | 'critical'
  last_backup: string
}

export default function AdminDashboard() {
  const [showUserModal, setShowUserModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<SystemStats>({
    total_users: 156,
    active_visits: 24,
    total_visits: 1284,
    pending_approvals: 8,
    system_health: 'good',
    last_backup: '2024-01-15 03:30:00'
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  const { user } = useAuthStore()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Cargar usuarios del sistema
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleUserCreated = () => {
    fetchUsers()
  }

  const adminSections = [
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      icon: UsersIcon,
      color: 'blue',
      actions: [
        { name: 'Crear Usuario', icon: UserPlusIcon, action: () => setShowUserModal(true), color: 'blue' },
        { name: 'Gestionar Roles', icon: ShieldIcon, action: () => console.log('Gestionar roles'), color: 'purple' },
        { name: 'Permisos', icon: KeyIcon, action: () => console.log('Gestionar permisos'), color: 'amber' },
        { name: 'Auditoría', icon: ShieldCheckIcon, action: () => console.log('Ver auditoría'), color: 'red' }
      ]
    },
    {
      id: 'system',
      title: 'Configuración del Sistema',
      icon: CogIcon,
      color: 'green',
      actions: [
        { name: 'Configuración General', icon: WrenchScrewdriverIcon, action: () => console.log('Config general'), color: 'slate' },
        { name: 'Base de Datos', icon: DatabaseIcon, action: () => console.log('Gestión BD'), color: 'green' },
        { name: 'Respaldos', icon: CloudIcon, action: () => console.log('Respaldos'), color: 'blue' },
        { name: 'Logs del Sistema', icon: ClipboardDocumentListIcon, action: () => console.log('Ver logs'), color: 'orange' }
      ]
    },
    {
      id: 'reports',
      title: 'Reportes Avanzados',
      icon: ChartBarIcon,
      color: 'purple',
      actions: [
        { name: 'Reportes Ejecutivos', icon: ChartPieIcon, action: () => console.log('Reportes ejecutivos'), color: 'indigo' },
        { name: 'Análisis de Datos', icon: ArrowTrendingUpIcon, action: () => console.log('Análisis datos'), color: 'purple' },
        { name: 'Exportar Datos', icon: DocumentTextIcon, action: () => console.log('Exportar datos'), color: 'green' },
        { name: 'Filtros Avanzados', icon: FunnelIcon, action: () => console.log('Filtros avanzados'), color: 'blue' }
      ]
    },
    {
      id: 'entities',
      title: 'Gestión de Entidades',
      icon: BuildingOfficeIcon,
      color: 'orange',
      actions: [
        { name: 'Entidades Ministeriales', icon: BuildingOfficeIcon, action: () => console.log('Entidades'), color: 'blue' },
        { name: 'Departamentos', icon: ClipboardDocumentListIcon, action: () => console.log('Departamentos'), color: 'green' },
        { name: 'Sedes', icon: MapPinIcon, action: () => console.log('Sedes'), color: 'purple' },
        { name: 'Personal', icon: UsersIcon, action: () => console.log('Personal'), color: 'orange' }
      ]
    }
  ]

  const getSystemHealthColor = () => {
    switch (stats.system_health) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSystemHealthIcon = () => {
    switch (stats.system_health) {
      case 'good': return CheckCircleIcon
      case 'warning': return ExclamationTriangleIcon
      case 'critical': return XCircleIcon
      default: return ClockIcon
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Venezuela Map Background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <VenezuelaMapWrapper />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] dark:bg-slate-950/60" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Control total del sistema - {currentTime.toLocaleTimeString('es-VE')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSystemHealthColor()}`}>
                <span className="flex items-center">
                  {React.createElement(getSystemHealthIcon(), { className: "w-3 h-3 mr-1" })}
                  Sistema {stats.system_health === 'good' ? 'Operativo' : stats.system_health === 'warning' ? 'Advertencia' : 'Crítico'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Usuario: {user?.name || 'Admin'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 p-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <UsersIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total_users}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {users.filter(u => u.status === 'active').length} activos
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Activas</CardTitle>
              <div className="h-4 w-4 text-green-600 bg-green-100 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active_visits}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">En este momento</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.total_visits}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Este mes</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending_approvals}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {adminSections.map((section) => (
            <Card key={section.id} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <section.icon className={`h-5 w-5 text-${section.color}-600`} />
                  <CardTitle className="capitalize">{section.title}</CardTitle>
                </div>
                <CardDescription>
                  Gestión de {section.id.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {section.actions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className={`justify-start text-${action.color}-600 hover:text-${action.color}-700 hover:bg-${action.color}-50`}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* User Registration Modal */}
      <UserRegistrationModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  )
}