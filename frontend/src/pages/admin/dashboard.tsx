import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DashboardLayout, DashboardStatCard, DashboardActionCard, QuickActionButton } from '@/components/dashboard/shared'
import { useAuthStore } from '@/stores/auth'
import {
  PeopleCommunityRegular,
  PeopleRegular,
  EyeRegular,
  ShieldCheckmarkRegular,
  ChartMultipleRegular,
  TriangleRegular,
  CheckmarkCircleRegular,
  SettingsRegular,
  BuildingRegular,
  PersonAddRegular
} from '@fluentui/react-icons'

import UserRegistrationModal from '@/components/admin/UserRegistrationModal'
import GeneralConfigurationModal from '@/components/admin/GeneralConfigurationModal'
import RoleManagementModal from '@/components/admin/RoleManagementModal'
import PermissionManagementModal from '@/components/admin/PermissionManagementModal'
import AuditManagementModal from '@/components/admin/AuditManagementModal'
import UserViewModal from '@/components/admin/UserViewModal'
import RegionSiteManagementModal from '@/components/admin/RegionSiteManagementModal'
import DepartmentRankManagementModal from '@/components/admin/DepartmentRankManagementModal'
import VisitorManagementModal from '@/components/admin/VisitorManagementModal'

type AdminStats = {
  totalUsers: number
  activeVisits: number
  totalVisits: number
  pendingApprovals: number
  systemHealth: 'good' | 'warning' | 'critical'
  lastBackup: string
}

type SectionAction = {
  name: string
  color: string
  action: () => void
}

type SectionBlock = {
  id: string
  title: string
  color: string
  icon: any
  actions: SectionAction[]
}

const theme = {
  brand: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#0ea5e9'
  }
}

export default function AdminDashboard() {
  const { user } = useAuthStore()

  const [showUserModal, setShowUserModal] = useState(false)
  const [showGeneralConfigModal, setShowGeneralConfigModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showUserViewModal, setShowUserViewModal] = useState(false)
  const [showRegionSiteModal, setShowRegionSiteModal] = useState(false)
  const [showDepartmentRankModal, setShowDepartmentRankModal] = useState(false)
  const [showVisitorModal, setShowVisitorModal] = useState(false)

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 42,
    activeVisits: 5,
    totalVisits: 128,
    pendingApprovals: 3,
    systemHealth: 'good',
    lastBackup: 'hace 2 horas'
  })

  const [search, setSearch] = useState('')

  useEffect(() => {
    setStats(s => ({ ...s }))
  }, [])

  const fullName = useMemo(() => {
    return (user?.first_name || user?.username || 'Usuario') + (user?.last_name ? ` ${user.last_name}` : '')
  }, [user])

  const sections: SectionBlock[] = [
    {
      id: 'users',
      title: 'Usuarios',
      color: 'blue',
      icon: PeopleCommunityRegular,
      actions: [
        { name: 'Registrar Usuario', color: 'blue', action: () => setShowUserModal(true) },
        { name: 'Ver Usuarios', color: 'green', action: () => setShowUserViewModal(true) },
        { name: 'Roles', color: 'indigo', action: () => setShowRoleModal(true) },
        { name: 'Permisos', color: 'amber', action: () => setShowPermissionModal(true) }
      ]
    },
    {
      id: 'structure',
      title: 'Estructura',
      color: 'indigo',
      icon: BuildingRegular,
      actions: [
        { name: 'Regiones y Sedes', color: 'indigo', action: () => setShowRegionSiteModal(true) },
        { name: 'Departamentos y Rangos', color: 'cyan', action: () => setShowDepartmentRankModal(true) },
        { name: 'Visitantes', color: 'teal', action: () => setShowVisitorModal(true) }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      color: 'slate',
      icon: SettingsRegular,
      actions: [
        { name: 'Configuración General', color: 'slate', action: () => setShowGeneralConfigModal(true) },
        { name: 'Auditoría', color: 'red', action: () => setShowAuditModal(true) }
      ]
    },
    {
      id: 'reports',
      title: 'Reportes',
      color: 'purple',
      icon: ChartMultipleRegular,
      actions: [
        { name: 'Reportes Ejecutivos', color: 'indigo', action: () => {} },
        { name: 'Estadísticas', color: 'purple', action: () => {} },
        { name: 'Exportar Datos', color: 'green', action: () => {} }
      ]
    }
  ]

  const filteredSections = sections.map(s => ({
    ...s,
    actions: s.actions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
  }))

  const resolveActionIcon = (name: string) => {
    switch (name) {
      case 'Registrar Usuario':
        return PersonAddRegular
      case 'Ver Usuarios':
        return EyeRegular
      case 'Roles':
        return PeopleRegular
      case 'Permisos':
        return ShieldCheckmarkRegular
      case 'Regiones y Sedes':
        return BuildingRegular
      case 'Departamentos y Rangos':
        return PeopleRegular
      case 'Visitantes':
        return PeopleCommunityRegular
      case 'Configuración General':
        return SettingsRegular
      case 'Reportes Ejecutivos':
      case 'Estadísticas':
        return ChartMultipleRegular
      case 'Exportar Datos':
        return EyeRegular
      default:
        return EyeRegular
    }
  }

  const heroStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${theme.brand.primary} 0%, ${theme.brand.secondary} 45%, ${theme.brand.accent} 100%)`
  }

  return (
    <DashboardLayout title="Administración" subtitle="Sistema de Visitas">
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-6">
              <div className="rounded-2xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bienvenido</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{fullName}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">ADM</span>
                </div>
                <div className="mt-6">
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar acciones" className="bg-white/30 dark:bg-gray-900/30 border-white/20" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <QuickActionButton icon={PeopleCommunityRegular} label="Usuarios" color="blue" onClick={() => setShowUserViewModal(true)} />
                  <QuickActionButton icon={SettingsRegular} label="Config." color="purple" onClick={() => setShowGeneralConfigModal(true)} />
                  <QuickActionButton icon={PeopleRegular} label="Roles" color="indigo" onClick={() => setShowRoleModal(true)} />
                  <QuickActionButton icon={ShieldCheckmarkRegular} label="Permisos" color="amber" onClick={() => setShowPermissionModal(true)} />
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/10">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Atajos</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="ghost" className="justify-start">Panel principal</Button>
                  <Button variant="ghost" className="justify-start">Auditoría</Button>
                  <Button variant="ghost" className="justify-start">Respaldos</Button>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-6">
            <div className="rounded-3xl overflow-hidden text-white shadow-2xl" style={heroStyle}>
              <div className="px-8 py-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">Panel de Administración</h1>
                  <p className="text-white/80">Control total del sistema de visitas</p>
                </div>
                <div className="hidden md:flex gap-3">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30">Configurar</Button>
                  <Button className="bg-white text-indigo-700 hover:bg-indigo-50">Crear reporte</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardStatCard title="Total Usuarios" value={stats.totalUsers} icon={PeopleCommunityRegular} color="blue" subtitle={`Activos`} trend={{ value: 1.2, direction: 'up' }} />
              <DashboardStatCard title="Visitas Activas" value={stats.activeVisits} icon={CheckmarkCircleRegular} color="green" subtitle="Ahora" trend={{ value: 3.4, direction: 'up' }} />
              <DashboardStatCard title="Total Visitas" value={stats.totalVisits} icon={ChartMultipleRegular} color="purple" subtitle="Este mes" />
              <DashboardStatCard title="Pendientes" value={stats.pendingApprovals} icon={TriangleRegular} color="orange" subtitle="Atención" trend={{ value: 0.8, direction: 'down' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSections.map((section) => (
                <DashboardActionCard
                  key={section.id}
                  title={section.title}
                  description={`Gestión de ${section.title.toLowerCase()}`}
                  actions={section.actions.map((a, idx) => ({
                    name: a.name,
                    icon: resolveActionIcon(a.name),
                    action: a.action,
                    color: a.color as any,
                    variant: idx === 0 ? 'default' : 'outline'
                  }))}
                  icon={section.icon}
                  color={section.color as any}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded bg-blue-600" />
                        <span className="text-sm">Se creó un nuevo usuario</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">hace 5 min</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded bg-green-600" />
                        <span className="text-sm">Aprobada una solicitud de visita</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">hace 20 min</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded bg-indigo-600" />
                        <span className="text-sm">Generado reporte mensual</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">ayer</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
                <CardHeader>
                  <CardTitle>Alertas del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded bg-orange-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Revisión de respaldos</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Último respaldo: {stats.lastBackup}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded bg-green-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Seguridad activa</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Estado del sistema: {stats.systemHealth}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Ver detalles</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <UserRegistrationModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} onUserCreated={() => setStats(p => ({ ...p, totalUsers: p.totalUsers + 1 }))} />
      <GeneralConfigurationModal isOpen={showGeneralConfigModal} onClose={() => setShowGeneralConfigModal(false)} onConfigurationUpdated={() => {}} />
      <RoleManagementModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} onRoleUpdated={() => {}} />
      <PermissionManagementModal isOpen={showPermissionModal} onClose={() => setShowPermissionModal(false)} onPermissionUpdated={() => {}} />
      <AuditManagementModal isOpen={showAuditModal} onClose={() => setShowAuditModal(false)} onAuditUpdated={() => {}} />
      <UserViewModal isOpen={showUserViewModal} onClose={() => setShowUserViewModal(false)} onUserUpdated={() => {}} />
      <RegionSiteManagementModal isOpen={showRegionSiteModal} onClose={() => setShowRegionSiteModal(false)} onRegionSiteUpdated={() => {}} />
      <DepartmentRankManagementModal isOpen={showDepartmentRankModal} onClose={() => setShowDepartmentRankModal(false)} onDepartmentRankUpdated={() => {}} />
      <VisitorManagementModal isOpen={showVisitorModal} onClose={() => setShowVisitorModal(false)} onVisitorUpdated={() => {}} />
    </DashboardLayout>
  )
}