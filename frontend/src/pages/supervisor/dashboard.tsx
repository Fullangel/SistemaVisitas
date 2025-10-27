import { useState, useEffect } from 'react'
import { 
  EyeRegular,
  CheckmarkCircleRegular,
  CalendarRegular,
  ShieldCheckmarkRegular,
  ChartMultipleRegular,
  DocumentTextRegular,
  PeopleRegular,
  ClockRegular,
  ChartMultipleRegular as ChartPieIcon,
  DataTrendingRegular,
  FilterRegular,
  ShareRegular,
  ClipboardTaskList16Regular,
  WarningRegular,
  PeopleTeamRegular,
  AlertRegular,
  QrCodeRegular,
  MailRegular
} from '@fluentui/react-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth'
import { VenezuelaMapWrapper } from '@/components/venezuela-map-wrapper'

interface Visit {
  id: number
  codigo: string
  visitante_nombre: string
  visitante_documento: string
  entidad_visitada: string
  motivo: string
  fecha_hora_ingreso: string
  fecha_hora_salida?: string
  estado: 'pendiente' | 'en_curso' | 'finalizada' | 'cancelada'
  observaciones?: string
  user_id: number
  registrado_por: string
}

interface SupervisorStats {
  active_visits: number
  pending_approvals: number
  visits_today: number
  staff_on_duty: number
  alerts_count: number
  completion_rate: number
}

export default function SupervisorDashboard() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [stats] = useState<SupervisorStats>({
    active_visits: 18,
    pending_approvals: 5,
    visits_today: 32,
    staff_on_duty: 8,
    alerts_count: 2,
    completion_rate: 94
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
    // Cargar visitas que requieren supervisión
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/supervisor/visits', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setVisits(data.visits || [])
      }
    } catch (error) {
      console.error('Error fetching visits:', error)
    }
  }

  const supervisorSections = [
    {
      id: 'visits',
      title: 'Supervisión de Visitas',
      icon: EyeRegular,
      color: 'blue',
      actions: [
        { name: 'Monitorear Visitas', icon: EyeRegular, action: () => console.log('Monitorear visitas'), color: 'blue' },
        { name: 'Aprobar Solicitudes', icon: CheckmarkCircleRegular, action: () => console.log('Aprobar solicitudes'), color: 'green' },
        { name: 'Gestionar Horarios', icon: CalendarRegular, action: () => console.log('Gestionar horarios'), color: 'purple' },
        { name: 'Control de Acceso', icon: ShieldCheckmarkRegular, action: () => console.log('Control acceso'), color: 'red' }
      ]
    },
    {
      id: 'staff',
      title: 'Gestión de Personal',
      icon: PeopleRegular,
      color: 'green',
      actions: [
        { name: 'Asignar Tareas', icon: ClipboardTaskList16Regular, action: () => console.log('Asignar tareas'), color: 'amber' },
        { name: 'Evaluar Desempeño', icon: ChartMultipleRegular, action: () => console.log('Evaluar desempeño'), color: 'indigo' },
        { name: 'Horarios de Trabajo', icon: ClockRegular, action: () => console.log('Horarios trabajo'), color: 'slate' },
        { name: 'Comunicaciones', icon: MailRegular, action: () => console.log('Comunicaciones'), color: 'blue' }
      ]
    },
    {
      id: 'reports',
      title: 'Reportes Operativos',
      icon: DocumentTextRegular,
      color: 'purple',
      actions: [
        { name: 'Reportes Diarios', icon: DocumentTextRegular, action: () => console.log('Reportes diarios'), color: 'green' },
        { name: 'Estadísticas', icon: DataTrendingRegular, action: () => console.log('Estadísticas'), color: 'blue' },
        { name: 'Filtros Avanzados', icon: FilterRegular, action: () => console.log('Filtros avanzados'), color: 'purple' },
        { name: 'Compartir Reportes', icon: ShareRegular, action: () => console.log('Compartir reportes'), color: 'orange' }
      ]
    },
    {
      id: 'quality',
      title: 'Control de Calidad',
      icon: ShieldCheckmarkRegular,
      color: 'orange',
      actions: [
        { name: 'Verificar Procesos', icon: ShieldCheckmarkRegular, action: () => console.log('Verificar procesos'), color: 'blue' },
        { name: 'Incidentes', icon: WarningRegular, action: () => console.log('Incidentes'), color: 'red' },
        { name: 'Mejora Continua', icon: ChartPieIcon, action: () => console.log('Mejora continua'), color: 'green' },
        { name: 'Capacitación', icon: PeopleTeamRegular, action: () => console.log('Capacitación'), color: 'purple' }
      ]
    }
  ]

  const getAlertColor = (count: number) => {
    if (count === 0) return 'bg-green-100 text-green-800'
    if (count <= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'en_curso':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">En Curso</Badge>
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case 'finalizada':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Finalizada</Badge>
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-green-50 to-blue-100 dark:from-slate-950 dark:via-green-950 dark:to-blue-950">
      {/* Venezuela Map Background */}
      <div className="absolute inset-0 opacity-15 dark:opacity-8">
        <VenezuelaMapWrapper />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] dark:bg-slate-950/70" />

      {/* Header */}
      <header className="relative z-10 border-b border-green-200/50 bg-white/70 backdrop-blur-xl dark:border-green-900/50 dark:bg-slate-900/30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Panel de Supervisión
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Supervisión y control operativo - {currentTime.toLocaleTimeString('es-VE')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getAlertColor(stats.alerts_count)}`}>
                <span className="flex items-center">
                  <AlertRegular className="w-3 h-3 mr-1" />
                  {stats.alerts_count} Alertas
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Supervisor: {user ? `${user.first_name} ${user.last_name}` : 'Supervisor'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 p-6">
        {/* Supervisor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Activas</CardTitle>
              <div className="h-4 w-4 text-green-600 bg-green-100 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active_visits}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">En curso</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <WarningRegular className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_approvals}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Por aprobar</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Hoy</CardTitle>
              <CalendarRegular className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.visits_today}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Registradas</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personal Activo</CardTitle>
              <PeopleRegular className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.staff_on_duty}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">En servicio</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
              <ChartMultipleRegular className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.completion_rate}%</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tasa de éxito</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              <CardDescription>Operaciones frecuentes de supervisión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => console.log('Aprobar visita')}>
                  <CheckmarkCircleRegular className="h-4 w-4 mr-2" />
                  Aprobar Visita
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Ver visita')}>
                  <EyeRegular className="h-4 w-4 mr-2" />
                  Ver Visita
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Generar reporte')}>
                  <DocumentTextRegular className="h-4 w-4 mr-2" />
                  Reporte Rápido
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Enviar notificación')}>
                  <AlertRegular className="h-4 w-4 mr-2" />
                  Notificar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-lg">Visitas Recientes</CardTitle>
              <CardDescription>Últimas visitas que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {visits.slice(0, 3).map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <QrCodeRegular className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{visit.visitante_nombre}</p>
                        <p className="text-xs text-gray-500">{visit.entidad_visitada}</p>
                      </div>
                    </div>
                    {getStatusBadge(visit.estado)}
                  </div>
                ))}
                {visits.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No hay visitas recientes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supervisor Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {supervisorSections.map((section) => (
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
    </div>
  )
}