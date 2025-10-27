import { useState, useEffect } from 'react'
import {
  PersonRegular,
  ClockRegular,
  DocumentTextRegular,
  ChartMultipleRegular,
  CalendarRegular,
  EyeRegular,
  CheckmarkCircleRegular,
  InfoRegular,
  SettingsRegular,
  KeyRegular,
  EditRegular,
  CheckmarkCircleRegular as CheckCircleIcon,
  ClockRegular as ClockIcon,
  InfoRegular as InformationCircleIcon
} from '@fluentui/react-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth'
import { DashboardHeader, DashboardStatCard, DashboardActionCard } from '@/components/dashboard/shared'

interface Visit {
  id: number
  codigo: string
  visitante_nombre: string
  entidad_visitada: string
  motivo: string
  fecha_hora_ingreso: string
  fecha_hora_salida?: string
  estado: 'pendiente' | 'en_curso' | 'finalizada' | 'cancelada'
  observaciones?: string
}

interface EmployeeStats {
  pending_visits: number
  active_visits: number
  completed_today: number
  monthly_total: number
}

export default function EmployeeDashboard() {
  const [, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState<EmployeeStats>({
    pending_visits: 2,
    active_visits: 1,
    completed_today: 3,
    monthly_total: 45
  })
  const [recentVisits, setRecentVisits] = useState<Visit[]>([])

  const { user } = useAuthStore()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Cargar datos del empleado
    fetchEmployeeData()
  }, [])

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/employee/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || stats)
        setRecentVisits(data.recentVisits || [])
      }
    } catch (error) {
      console.error('Error fetching employee data:', error)
    }
  }

  const handleViewProfile = () => {
    console.log('Ver perfil de empleado')
  }

  const handleViewPendingVisits = () => {
    console.log('Ver visitas pendientes')
  }

  const handleViewHistory = () => {
    console.log('Ver historial de visitas')
  }

  const handleGenerateReport = () => {
    console.log('Generar reporte personal')
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

  const employeeSections = [
    {
      id: 'profile',
      title: 'Mi Perfil',
      icon: PersonRegular,
      color: 'blue' as const,
      actions: [
        { name: 'Ver Perfil', icon: PersonRegular, action: handleViewProfile, color: 'blue' as const },
        { name: 'Editar Datos', icon: EditRegular, action: () => console.log('Editar datos'), color: 'blue' as const },
        { name: 'Cambiar Contraseña', icon: KeyRegular, action: () => console.log('Cambiar contraseña'), color: 'purple' as const },
        { name: 'Mis Permisos', icon: SettingsRegular, action: () => console.log('Ver permisos'), color: 'green' as const }
      ]
    },
    {
      id: 'visits',
      title: 'Mis Visitas',
      icon: EyeRegular,
      color: 'green' as const,
      actions: [
        { name: 'Visitas Pendientes', icon: ClockRegular, action: handleViewPendingVisits, color: 'yellow' as const },
        { name: 'Historial de Visitas', icon: DocumentTextRegular, action: handleViewHistory, color: 'green' as const },
        { name: 'Estadísticas Personales', icon: ChartMultipleRegular, action: () => console.log('Ver estadísticas'), color: 'purple' as const },
        { name: 'Reporte Mensual', icon: CalendarRegular, action: handleGenerateReport, color: 'indigo' as const }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        title={`Bienvenido, ${user?.first_name || 'Empleado'}`}
        subtitle="Panel de control de empleado"
      />

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardStatCard
            title="Visitas Pendientes"
            value={stats.pending_visits}
            icon={ClockRegular}
            color="yellow"
          />
          <DashboardStatCard
            title="Visitas Activas"
            value={stats.active_visits}
            icon={EyeRegular}
            color="green"
          />
          <DashboardStatCard
            title="Completadas Hoy"
            value={stats.completed_today}
            icon={CheckmarkCircleRegular}
            color="blue"
          />
          <DashboardStatCard
            title="Total Mensual"
            value={stats.monthly_total}
            icon={ChartMultipleRegular}
            color="purple"
          />
        </div>

        {/* Secciones de acciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {employeeSections.map((section) => (
            <DashboardActionCard
              key={section.id}
              title={section.title}
              description={`Acceso a funciones de ${section.title.toLowerCase()}`}
              actions={section.actions}
              icon={section.icon}
              color={section.color as any}
            />
          ))}
        </div>

        {/* Visitas recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Visitas Recientes</CardTitle>
            <CardDescription>Últimas visitas asignadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisits.length > 0 ? (
                recentVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {visit.estado === 'en_curso' ? (
                          <CheckCircleIcon className="h-8 w-8 text-green-500" />
                        ) : visit.estado === 'pendiente' ? (
                          <ClockIcon className="h-8 w-8 text-yellow-500" />
                        ) : (
                          <InformationCircleIcon className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {visit.visitante_nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                          {visit.entidad_visitada} • {visit.motivo}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(visit.fecha_hora_ingreso).toLocaleString('es-VE')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(visit.estado)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Ver detalles', visit.id)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <InfoRegular className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No hay visitas recientes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}