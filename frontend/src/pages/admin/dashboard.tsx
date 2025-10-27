import React, { useState, useEffect } from 'react'
import { 
  PeopleRegular,
  SettingsRegular,
  ShieldCheckmarkRegular,
  KeyRegular,
  ChartMultipleRegular,
  DocumentTextRegular,
  BuildingRegular,
  PersonAddRegular,
  ShieldRegular,
  DatabaseRegular,
  CloudRegular,
  WrenchRegular,
  TaskListLtrRegular,
  ChartPersonRegular,
  ArrowTrendingRegular,
  FilterRegular,
  ShareRegular,
  ClockRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  WarningRegular,
  LocationRegular,
  PeopleCommunityRegular,
  TriangleRegular
} from '@fluentui/react-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserRegistrationModal from '@/components/admin/UserRegistrationModal'
import GeneralConfigurationModal from '@/components/admin/GeneralConfigurationModal'
import RoleManagementModal from '@/components/admin/RoleManagementModal'
import PermissionManagementModal from '@/components/admin/PermissionManagementModal'
import AuditManagementModal from '@/components/admin/AuditManagementModal'
import UserViewModal from '@/components/admin/UserViewModal'
import RegionSiteManagementModal from '@/components/admin/RegionSiteManagementModal'
import DepartmentRankManagementModal from '@/components/admin/DepartmentRankManagementModal'
import VisitorManagementModal from '@/components/admin/VisitorManagementModal'
import { useAuthStore } from '@/stores/auth'
import { VenezuelaMapWrapper } from '@/components/venezuela-map-wrapper'
import { DashboardHeader, DashboardStatCard, DashboardActionCard } from '@/components/dashboard/shared'

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
  const [showGeneralConfigModal, setShowGeneralConfigModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showUserViewModal, setShowUserViewModal] = useState(false)
  const [showRegionSiteModal, setShowRegionSiteModal] = useState(false)
  const [showDepartmentRankModal, setShowDepartmentRankModal] = useState(false)
  const [showVisitorModal, setShowVisitorModal] = useState(false)
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
      if (!token) {
        console.error('No authentication token found')
        setUsers([])
        return
      }

      const axios = (await import('axios')).default
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      const response = await axios.get('/api/admin/users', config)
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    }
  }

  const handleUserCreated = () => {
    fetchUsers()
  }

  const adminSections = [
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      icon: PeopleRegular,
      color: 'blue',
      actions: [
        { name: 'Crear Usuario', icon: PersonAddRegular, action: () => setShowUserModal(true), color: 'blue' },
        { name: 'Gestionar Roles', icon: ShieldRegular, action: () => setShowRoleModal(true), color: 'purple' },
        { name: 'Permisos', icon: KeyRegular, action: () => setShowPermissionModal(true), color: 'amber' },
        { name: 'Auditoría', icon: ShieldCheckmarkRegular, action: () => setShowAuditModal(true), color: 'red' }
      ]
    },
    {
      id: 'system',
      title: 'Configuración del Sistema',
      icon: SettingsRegular,
      color: 'green',
      actions: [
        { name: 'Configuración General', icon: WrenchRegular, action: () => setShowGeneralConfigModal(true), color: 'slate' },
        { name: 'Base de Datos', icon: DatabaseRegular, action: () => console.log('Gestión BD'), color: 'green' },
        { name: 'Respaldos', icon: CloudRegular, action: () => console.log('Respaldos'), color: 'blue' },
        { name: 'Logs del Sistema', icon: TaskListLtrRegular, action: () => console.log('Ver logs'), color: 'orange' }
      ]
    },
    {
      id: 'reports',
      title: 'Reportes Avanzados',
      icon: ChartMultipleRegular,
      color: 'purple',
      actions: [
        { name: 'Reportes Ejecutivos', icon: ChartPersonRegular, action: () => console.log('Reportes ejecutivos'), color: 'indigo' },
        { name: 'Análisis de Datos', icon: ArrowTrendingRegular, action: () => console.log('Análisis datos'), color: 'purple' },
        { name: 'Exportar Datos', icon: DocumentTextRegular, action: () => console.log('Exportar datos'), color: 'green' },
        { name: 'Filtros Avanzados', icon: FilterRegular, action: () => console.log('Filtros avanzados'), color: 'blue' }
      ]
    },
    {
      id: 'entities',
      title: 'Gestión de Entidades',
      icon: BuildingRegular,
      color: 'orange',
      actions: [
        { name: 'Entidades Ministeriales', icon: BuildingRegular, action: () => setShowUserViewModal(true), color: 'blue' },
        { name: 'Departamentos', icon: TaskListLtrRegular, action: () => setShowDepartmentRankModal(true), color: 'green' },
        { name: 'Sedes', icon: LocationRegular, action: () => setShowRegionSiteModal(true), color: 'purple' },
        { name: 'Personal', icon: PeopleRegular, action: () => setShowVisitorModal(true), color: 'orange' }
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
      case 'good': return CheckmarkCircleRegular
      case 'warning': return WarningRegular
      case 'critical': return DismissCircleRegular
      default: return ClockRegular
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-700/50 dark:bg-slate-800/90 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" role="status" aria-live="polite">
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
              <PeopleCommunityRegular className="h-4 w-4 text-blue-600" />
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
              <ChartMultipleRegular className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.total_visits}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Este mes</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <TriangleRegular className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending_approvals}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminSections.map((section) => (
            <DashboardActionCard
              key={section.id}
              title={section.title}
              description={`Gestión de ${section.title.toLowerCase()}`}
              actions={section.actions}
              icon={section.icon}
              color={section.color}
            />
          ))}
        </div>
      </main>

      {/* User Registration Modal */}
      <UserRegistrationModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserCreated={handleUserCreated}
      />

      {/* General Configuration Modal */}
      <GeneralConfigurationModal
        isOpen={showGeneralConfigModal}
        onClose={() => setShowGeneralConfigModal(false)}
        onConfigurationUpdated={() => {
          // Recargar datos si es necesario
          console.log('Configuración actualizada')
        }}
      />

      {/* Role Management Modal */}
      <RoleManagementModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleUpdated={() => console.log('Rol actualizado')}
      />

      {/* Permission Management Modal */}
      <PermissionManagementModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onPermissionUpdated={() => console.log('Permisos actualizados')}
      />

      {/* Audit Management Modal */}
      <AuditManagementModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        onAuditUpdated={() => console.log('Auditoría actualizada')}
      />

      {/* User View Modal */}
      <UserViewModal
        isOpen={showUserViewModal}
        onClose={() => setShowUserViewModal(false)}
        onUserUpdated={() => console.log('Usuario actualizado')}
      />

      {/* Region Site Management Modal */}
      <RegionSiteManagementModal
        isOpen={showRegionSiteModal}
        onClose={() => setShowRegionSiteModal(false)}
        onRegionSiteUpdated={() => console.log('Región/Sede actualizada')}
      />

      {/* Department Rank Management Modal */}
      <DepartmentRankManagementModal
        isOpen={showDepartmentRankModal}
        onClose={() => setShowDepartmentRankModal(false)}
        onDepartmentRankUpdated={() => console.log('Departamento/Rango actualizado')}
      />

      {/* Visitor Management Modal */}
      <VisitorManagementModal
        isOpen={showVisitorModal}
        onClose={() => setShowVisitorModal(false)}
        onVisitorUpdated={() => console.log('Visitante actualizado')}
      />
    </div>
  )
}