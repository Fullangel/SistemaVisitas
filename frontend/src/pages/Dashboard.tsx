"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import { VenezuelaMapWrapper } from "@/components/venezuela-map-wrapper" // Temporalmente desactivado
import { ThemeToggle } from "@/components/theme-toggle"
import { useNavigate } from 'react-router-dom'
import {
  PersonRegular,
  BuildingRegular,
  ClockRegular,
  ArrowExitRegular,
  SearchRegular,
  AddRegular,
  DocumentTextRegular,
  PeopleRegular,
  ShieldCheckmarkRegular,
  CalendarRegular,
  LocationRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  ArrowTrendingRegular,
  ChartMultipleRegular,
  AlertRegular,
  SettingsRegular,
  PersonAddRegular,
  DatabaseRegular,
  DocumentTextRegular as ReportRegular,
  KeyRegular,
  OrganizationRegular,
  BadgeRegular,
  PrintRegular,
  MailRegular,
  PhoneRegular,
  EditRegular,
  DeleteRegular,
  EyeRegular,
  FilterRegular,
  ShareRegular,
  ArrowDownloadRegular as DownloadRegular,
  CloudRegular,
  ShieldCheckmarkRegular as SecurityRegular,
  TaskListLtrRegular as TaskListRegular,
  TimePickerRegular,
  CheckmarkCircleRegular as ApprovalRegular,
  GroupRegular,
} from "@fluentui/react-icons"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<'admin' | 'supervisor' | 'recepcion'>('admin')

  // Redirect to role-based dashboard
  useEffect(() => {
    // In a real app, this would come from your auth context or API
    const actualUserRole = userRole // This would be from auth context
    
    switch (actualUserRole) {
      case 'admin':
        navigate('/dashboard/admin')
        break
      case 'supervisor':
        navigate('/dashboard/supervisor')
        break
      case 'recepcion':
        navigate('/dashboard/reception')
        break
      default:
        // Stay on this dashboard if no specific role
        break
    }
  }, [userRole, navigate])
  const [activeSection, setActiveSection] = useState('dashboard')

  // Simulación de obtener el rol del usuario
  useEffect(() => {
    // En una implementación real, esto vendría del contexto de autenticación
    const role = localStorage.getItem('userRole') as 'admin' | 'supervisor' | 'recepcion' || 'admin'
    setUserRole(role)
  }, [])

  // Configuración de opciones por rol
  const roleConfig = {
    admin: {
      title: 'Panel de Administración',
      subtitle: 'Control total del sistema',
      sections: [
        {
          id: 'users',
          title: 'Gestión de Usuarios',
          icon: GroupRegular,
          actions: [
            { name: 'Crear Usuario', icon: PersonAddRegular, color: 'blue' },
            { name: 'Gestionar Roles', icon: BadgeRegular, color: 'purple' },
            { name: 'Permisos', icon: KeyRegular, color: 'amber' },
            { name: 'Auditoría', icon: SecurityRegular, color: 'red' },
          ]
        },
        {
          id: 'system',
          title: 'Configuración del Sistema',
          icon: SettingsRegular,
          actions: [
            { name: 'Configuración General', icon: SettingsRegular, color: 'slate' },
            { name: 'Base de Datos', icon: DatabaseRegular, color: 'green' },
            { name: 'Respaldos', icon: CloudRegular, color: 'blue' },
            { name: 'Logs del Sistema', icon: DocumentTextRegular, color: 'orange' },
          ]
        },
        {
          id: 'reports',
          title: 'Reportes Avanzados',
          icon: ChartMultipleRegular,
          actions: [
            { name: 'Reportes Ejecutivos', icon: ReportRegular, color: 'indigo' },
            { name: 'Análisis de Datos', icon: ChartMultipleRegular, color: 'purple' },
            { name: 'Exportar Datos', icon: DownloadRegular, color: 'green' },
            { name: 'Programar Reportes', icon: TimePickerRegular, color: 'blue' },
          ]
        }
      ]
    },
    supervisor: {
      title: 'Panel de Supervisión',
      subtitle: 'Supervisión y control operativo',
      sections: [
        {
          id: 'visits',
          title: 'Supervisión de Visitas',
          icon: EyeRegular,
          actions: [
            { name: 'Monitorear Visitas', icon: EyeRegular, color: 'blue' },
            { name: 'Aprobar Solicitudes', icon: ApprovalRegular, color: 'green' },
            { name: 'Gestionar Horarios', icon: CalendarRegular, color: 'purple' },
            { name: 'Control de Acceso', icon: ShieldCheckmarkRegular, color: 'red' },
          ]
        },
        {
          id: 'staff',
          title: 'Gestión de Personal',
          icon: PeopleRegular,
          actions: [
            { name: 'Asignar Tareas', icon: TaskListRegular, color: 'amber' },
            { name: 'Evaluar Desempeño', icon: ChartMultipleRegular, color: 'indigo' },
            { name: 'Horarios de Trabajo', icon: ClockRegular, color: 'slate' },
            { name: 'Comunicaciones', icon: MailRegular, color: 'blue' },
          ]
        },
        {
          id: 'reports',
          title: 'Reportes Operativos',
          icon: DocumentTextRegular,
          actions: [
            { name: 'Reportes Diarios', icon: DocumentTextRegular, color: 'green' },
            { name: 'Estadísticas', icon: ArrowTrendingRegular, color: 'blue' },
            { name: 'Filtros Avanzados', icon: FilterRegular, color: 'purple' },
            { name: 'Compartir Reportes', icon: ShareRegular, color: 'orange' },
          ]
        }
      ]
    },
    recepcion: {
      title: 'Panel de Recepción',
      subtitle: 'Gestión de visitantes y accesos',
      sections: [
        {
          id: 'visitors',
          title: 'Gestión de Visitantes',
          icon: PersonRegular,
          actions: [
            { name: 'Registrar Visita', icon: AddRegular, color: 'green' },
            { name: 'Buscar Visitante', icon: SearchRegular, color: 'blue' },
            { name: 'Editar Información', icon: EditRegular, color: 'amber' },
            { name: 'Finalizar Visita', icon: CheckmarkCircleRegular, color: 'red' },
          ]
        },
        {
          id: 'access',
          title: 'Control de Acceso',
          icon: BuildingRegular,
          actions: [
            { name: 'Verificar Identidad', icon: BadgeRegular, color: 'purple' },
            { name: 'Imprimir Gafete', icon: PrintRegular, color: 'slate' },
            { name: 'Notificar Anfitrión', icon: PhoneRegular, color: 'blue' },
            { name: 'Registro de Entrada', icon: LocationRegular, color: 'green' },
          ]
        },
        {
          id: 'daily',
          title: 'Operaciones Diarias',
          icon: CalendarRegular,
          actions: [
            { name: 'Lista de Visitas', icon: DocumentTextRegular, color: 'indigo' },
            { name: 'Citas Programadas', icon: CalendarRegular, color: 'purple' },
            { name: 'Emergencias', icon: AlertRegular, color: 'red' },
            { name: 'Comunicaciones', icon: MailRegular, color: 'blue' },
          ]
        }
      ]
    }
  }

  const currentConfig = roleConfig[userRole]
  const [currentTime] = useState(new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }))

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Venezuela Map Background - TEMPORALMENTE DESACTIVADO */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        {/* <VenezuelaMapWrapper /> Componente 3D temporalmente desactivado */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/20 dark:to-indigo-900/20" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] dark:bg-slate-950/60" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                <BuildingRegular className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SENIAT</h1>
                <p className="text-sm text-slate-600 dark:text-blue-300/70">Sistema Nacional de Visitas</p>
              </div>
            </div>
            
            {/* Role Selector for Demo */}
            <div className="ml-8 flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-blue-200">Rol:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'admin' | 'supervisor' | 'recepcion')}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-700 dark:bg-slate-800 dark:text-blue-100 dark:hover:border-blue-500"
              >
                <option value="admin">Administrador</option>
                <option value="supervisor">Supervisor</option>
                <option value="recepcion">Recepción</option>
              </select>
              <span className="text-xs text-slate-500 dark:text-blue-300/50">(Redirigiendo a dashboard específico)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-2 shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-900/60 dark:ring-blue-900/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 ring-1 ring-blue-500/30">
                <PersonRegular className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin Usuario</p>
                <p className="text-xs text-slate-600 dark:text-blue-300/70">{currentConfig.subtitle}</p>
              </div>
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 bg-white text-red-700 hover:bg-red-50 dark:border-red-400/50 dark:bg-red-950/50 dark:text-red-100 dark:hover:border-red-400 dark:hover:bg-red-900/70"
            >
              <ArrowExitRegular className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{currentConfig.title}</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-blue-300/70">{currentConfig.subtitle}</p>
        </div>

        {/* Role-based Action Sections */}
        <div className="mb-8 space-y-8">
          {currentConfig.sections.map((section) => (
            <Card key={section.id} className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 ring-1 ring-blue-500/30">
                  <section.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-blue-300/70">Herramientas y funciones disponibles</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {section.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`group h-auto flex-col gap-3 p-6 transition-all hover:scale-105 hover:shadow-lg ${
                      action.color === 'blue' ? 'border-blue-300 bg-blue-50/50 text-blue-700 hover:bg-blue-100 dark:border-blue-400/50 dark:bg-blue-950/30 dark:text-blue-100 dark:hover:bg-blue-900/50' :
                      action.color === 'green' ? 'border-green-300 bg-green-50/50 text-green-700 hover:bg-green-100 dark:border-green-400/50 dark:bg-green-950/30 dark:text-green-100 dark:hover:bg-green-900/50' :
                      action.color === 'purple' ? 'border-purple-300 bg-purple-50/50 text-purple-700 hover:bg-purple-100 dark:border-purple-400/50 dark:bg-purple-950/30 dark:text-purple-100 dark:hover:bg-purple-900/50' :
                      action.color === 'amber' ? 'border-amber-300 bg-amber-50/50 text-amber-700 hover:bg-amber-100 dark:border-amber-400/50 dark:bg-amber-950/30 dark:text-amber-100 dark:hover:bg-amber-900/50' :
                      action.color === 'red' ? 'border-red-300 bg-red-50/50 text-red-700 hover:bg-red-100 dark:border-red-400/50 dark:bg-red-950/30 dark:text-red-100 dark:hover:bg-red-900/50' :
                      action.color === 'indigo' ? 'border-indigo-300 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-400/50 dark:bg-indigo-950/30 dark:text-indigo-100 dark:hover:bg-indigo-900/50' :
                      action.color === 'orange' ? 'border-orange-300 bg-orange-50/50 text-orange-700 hover:bg-orange-100 dark:border-orange-400/50 dark:bg-orange-950/30 dark:text-orange-100 dark:hover:bg-orange-900/50' :
                      'border-slate-300 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-400/50 dark:bg-slate-950/30 dark:text-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                      action.color === 'blue' ? 'bg-blue-500/20 ring-1 ring-blue-500/30' :
                      action.color === 'green' ? 'bg-green-500/20 ring-1 ring-green-500/30' :
                      action.color === 'purple' ? 'bg-purple-500/20 ring-1 ring-purple-500/30' :
                      action.color === 'amber' ? 'bg-amber-500/20 ring-1 ring-amber-500/30' :
                      action.color === 'red' ? 'bg-red-500/20 ring-1 ring-red-500/30' :
                      action.color === 'indigo' ? 'bg-indigo-500/20 ring-1 ring-indigo-500/30' :
                      action.color === 'orange' ? 'bg-orange-500/20 ring-1 ring-orange-500/30' :
                      'bg-slate-500/20 ring-1 ring-slate-500/30'
                    }`}>
                      <action.icon className={`h-6 w-6 ${
                        action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        action.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        action.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                        action.color === 'red' ? 'text-red-600 dark:text-red-400' :
                        action.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                        action.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                        'text-slate-600 dark:text-slate-400'
                      }`} />
                    </div>
                    <span className="text-sm font-medium">{action.name}</span>
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-blue-300/70">Visitas Hoy</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">127</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">+12% vs ayer</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 ring-1 ring-blue-500/30">
                <PeopleRegular className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-blue-300/70">Visitas Activas</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">23</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">En las instalaciones</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 ring-1 ring-emerald-500/30">
                <CheckmarkCircleRegular className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-blue-300/70">Sedes Conectadas</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Todas operativas</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 ring-1 ring-purple-500/30">
                <BuildingRegular className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-blue-300/70">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">2.4h</p>
                <p className="text-sm text-amber-600 dark:text-amber-400">Duración de visitas</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 ring-1 ring-amber-500/30">
                <ClockRegular className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
          <h3 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">Estado del Sistema</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheckmarkRegular className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Seguridad</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Óptimo</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-emerald-300/70">Todos los protocolos activos</p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BuildingRegular className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Sedes Conectadas</span>
                </div>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">12/12</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-full bg-gradient-to-r from-blue-500 to-blue-400" />
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-blue-300/70">Conexión estable</p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/50 dark:bg-purple-950/30">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DatabaseRegular className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Base de Datos</span>
                </div>
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">98%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-[98%] bg-gradient-to-r from-purple-500 to-purple-400" />
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-purple-300/70">Rendimiento óptimo</p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertRegular className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Alertas</span>
                </div>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">0</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-full bg-gradient-to-r from-amber-500 to-amber-400" />
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-amber-300/70">Sin alertas pendientes</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
