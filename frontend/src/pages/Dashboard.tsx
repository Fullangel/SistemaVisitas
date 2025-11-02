import React, { useEffect, useMemo, useState } from 'react'
import { DashboardLayout, DashboardStatCard, DashboardActionCard, QuickActionButton } from '@/components/dashboard/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'
import {
  PeopleCommunityRegular,
  PeopleRegular,
  EyeRegular,
  ShieldCheckmarkRegular,
  PersonAddRegular,
  ChartMultipleRegular,
  TriangleRegular,
  CheckmarkCircleRegular,
  SettingsRegular,
  BuildingRegular,
  AddRegular
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

type MetricStat = {
  totalUsers: number
  activeVisits: number
  totalVisits: number
  pendingApprovals: number
}

type ActionItem = {
  name: string
  color: string
  icon: any
  action: () => void
}

type ModuleBlock = {
  id: string
  title: string
  color: string
  icon: any
  actions: ActionItem[]
}

const theme = {
  brand: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#0ea5e9'
  },
  surface: {
    glassLight: 'rgba(255,255,255,0.7)',
    glassDark: 'rgba(17,24,39,0.7)'
  }
}

export default function Dashboard() {
  const { user } = useAuthStore()

  const [stats, setStats] = useState<MetricStat>({
    totalUsers: 42,
    activeVisits: 5,
    totalVisits: 128,
    pendingApprovals: 3
  })

  const [search, setSearch] = useState('')

  const [showUserModal, setShowUserModal] = useState(false)
  const [showGeneralConfigModal, setShowGeneralConfigModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showUserViewModal, setShowUserViewModal] = useState(false)
  const [showRegionSiteModal, setShowRegionSiteModal] = useState(false)
  const [showDepartmentRankModal, setShowDepartmentRankModal] = useState(false)
  const [showVisitorModal, setShowVisitorModal] = useState(false)

  useEffect(() => {
    setStats(s => ({ ...s }))
  }, [])

  const fullName = useMemo(() => {
    return (user?.first_name || user?.username || 'Usuario') + (user?.last_name ? ` ${user.last_name}` : '')
  }, [user])

  const modules: ModuleBlock[] = [
    {
      id: 'visits',
      title: 'Visitas',
      color: 'blue',
      icon: CheckmarkCircleRegular,
      actions: [
        { name: 'Registrar Visita', color: 'blue', icon: AddRegular, action: () => setShowVisitorModal(true) },
        { name: 'Ver Visitas', color: 'green', icon: EyeRegular, action: () => setShowUserViewModal(true) }
      ]
    },
    {
      id: 'entities',
      title: 'Entidades y Sedes',
      color: 'indigo',
      icon: BuildingRegular,
      actions: [
        { name: 'Gestionar Sedes', color: 'indigo', icon: BuildingRegular, action: () => setShowRegionSiteModal(true) },
        { name: 'Departamentos y Rangos', color: 'cyan', icon: PeopleRegular, action: () => setShowDepartmentRankModal(true) }
      ]
    },
    {
      id: 'users',
      title: 'Usuarios',
      color: 'purple',
      icon: PeopleCommunityRegular,
      actions: [
        { name: 'Crear Usuario', color: 'purple', icon: PersonAddRegular, action: () => setShowUserModal(true) },
        { name: 'Ver Usuarios', color: 'green', icon: EyeRegular, action: () => setShowUserViewModal(true) }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      color: 'slate',
      icon: SettingsRegular,
      actions: [
        { name: 'Configuración', color: 'slate', icon: SettingsRegular, action: () => setShowGeneralConfigModal(true) },
        { name: 'Permisos', color: 'amber', icon: ShieldCheckmarkRegular, action: () => setShowPermissionModal(true) }
      ]
    }
  ]

  const filteredModules = modules.map(m => ({
    ...m,
    actions: m.actions.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
  }))

  const heroStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${theme.brand.primary} 0%, ${theme.brand.secondary} 45%, ${theme.brand.accent} 100%)`
  }

  return (
    <DashboardLayout title="Inicio" subtitle="Sistema de Visitas">
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-6">
              <div className="rounded-2xl p-6 backdrop-blur-xl border border-white/10 shadow-xl" style={{ backgroundColor: theme.surface.glassLight }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hola</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{fullName}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">USR</span>
                </div>
                <div className="mt-6">
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar acciones" className="bg-white/30 dark:bg-gray-900/30 border-white/20" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <QuickActionButton icon={PersonAddRegular} label="Crear" color="blue" onClick={() => setShowUserModal(true)} />
                  <QuickActionButton icon={SettingsRegular} label="Config." color="purple" onClick={() => setShowGeneralConfigModal(true)} />
                  <QuickActionButton icon={BuildingRegular} label="Sedes" color="indigo" onClick={() => setShowRegionSiteModal(true)} />
                  <QuickActionButton icon={ShieldCheckmarkRegular} label="Permisos" color="amber" onClick={() => setShowPermissionModal(true)} />
                </div>
              </div>

              <div className="rounded-2xl p-6 border border-white/10" style={{ backgroundColor: theme.surface.glassLight }}>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Accesos rápidos</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="ghost" className="justify-start">Mis visitas</Button>
                  <Button variant="ghost" className="justify-start">Usuarios</Button>
                  <Button variant="ghost" className="justify-start">Reportes</Button>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-6">
            <div className="rounded-3xl overflow-hidden text-white shadow-2xl" style={heroStyle}>
              <div className="px-8 py-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">Sistema de Visitas</h1>
                  <p className="text-white/80">Resumen y accesos rápidos</p>
                </div>
                <div className="hidden md:flex gap-3">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30">Nueva visita</Button>
                  <Button className="bg-white text-indigo-700 hover:bg-indigo-50">Generar reporte</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardStatCard title="Usuarios" value={stats.totalUsers} icon={PeopleCommunityRegular} color="blue" subtitle="Activos" trend={{ value: 1.2, direction: 'up' }} />
              <DashboardStatCard title="Visitas Activas" value={stats.activeVisits} icon={CheckmarkCircleRegular} color="green" subtitle="Ahora" trend={{ value: 3.4, direction: 'up' }} />
              <DashboardStatCard title="Visitas Totales" value={stats.totalVisits} icon={ChartMultipleRegular} color="purple" subtitle="Este mes" />
              <DashboardStatCard title="Pendientes" value={stats.pendingApprovals} icon={TriangleRegular} color="orange" subtitle="Atención" trend={{ value: 0.8, direction: 'down' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredModules.map((module) => (
                <DashboardActionCard
                  key={module.id}
                  title={module.title}
                  description={`Acciones de ${module.title.toLowerCase()}`}
                  actions={module.actions.map((a, idx) => ({
                    name: a.name,
                    icon: a.icon,
                    action: a.action,
                    color: a.color as any,
                    variant: idx === 0 ? 'default' : 'outline'
                  }))}
                  icon={module.icon}
                  color={module.color as any}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 backdrop-blur-sm" style={{ backgroundColor: theme.surface.glassLight }}>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded bg-blue-600" />
                        <span className="text-sm">Nueva visita registrada</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">hace 10 min</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded bg-purple-600" />
                        <span className="text-sm">Reporte generado</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">ayer</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm" style={{ backgroundColor: theme.surface.glassLight }}>
                <CardHeader>
                  <CardTitle>Acciones rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <QuickActionButton label="Nueva visita" color="blue" icon={AddRegular} onClick={() => setShowVisitorModal(true)} />
                    <QuickActionButton label="Configurar" icon={SettingsRegular} color="purple" onClick={() => setShowGeneralConfigModal(true)} />
                    <QuickActionButton label="Usuarios" icon={PeopleCommunityRegular} color="indigo" onClick={() => setShowUserViewModal(true)} />
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