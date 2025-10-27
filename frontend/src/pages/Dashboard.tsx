import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import UserRegistrationModal from "../components/admin/UserRegistrationModal"
import RoleManagementModal from "../components/admin/RoleManagementModal"
import PermissionManagementModal from "../components/admin/PermissionManagementModal"
import AuditManagementModal from "../components/admin/AuditManagementModal"
import UserViewModal from "../components/admin/UserViewModal"
import RegionSiteManagementModal from "../components/admin/RegionSiteManagementModal"
import DepartmentRankManagementModal from "../components/admin/DepartmentRankManagementModal"
import VisitorManagementModal from "../components/admin/VisitorManagementModal"
import GeneralConfigurationModal from "../components/admin/GeneralConfigurationModal"

import {
  BuildingRegular,
  PersonRegular,
  ArrowExitRegular,
  SettingsRegular,
  DatabaseRegular,
  DocumentTextRegular,
  DocumentRegular,
  ChartMultipleRegular,
  ArrowTrendingRegular,
  FilterRegular,
  ArrowDownloadRegular as DownloadRegular,
  CloudRegular,
  ShieldCheckmarkRegular,
  TaskListLtrRegular as TaskListRegular,
  TimePickerRegular,
  CheckmarkCircleRegular,
  GroupRegular,
  KeyRegular,
  EyeRegular,
  CalendarRegular,
  PeopleRegular,
  ClockRegular,
  MailRegular,
  AddRegular,
  SearchRegular,
  EditRegular,
  BadgeRegular,
  AlertRegular,
  DismissRegular,
  DocumentBulletListRegular as ReportRegular,
  BriefcaseRegular,
  ShareRegular
} from "@fluentui/react-icons"
import React, { useState, useEffect } from "react"

// Interfaces de tipos
interface ActionConfig {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface SectionConfig {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  actions: ActionConfig[]
}

interface RoleConfig {
  title: string
  subtitle: string
  sections: SectionConfig[]
}

interface RoleConfigs {
  admin: RoleConfig
  supervisor: RoleConfig
  recepcion: RoleConfig
  employee: RoleConfig
  visitor: RoleConfig
}

// Configuración de roles centralizada
const roleConfig: RoleConfigs = {
  admin: {
    title: 'Panel de Administración',
    subtitle: 'Control total del sistema',
    sections: [
      {
        id: 'users',
        title: 'Gestión de Usuarios',
        icon: GroupRegular,
        actions: [
          { name: 'Crear Usuario', icon: PersonRegular, color: 'blue' },
          { name: 'Vista de Usuarios', icon: GroupRegular, color: 'green' },
          { name: 'Visitantes', icon: PersonRegular, color: 'teal' },
          { name: 'Gestión de Regiones y Sedes', icon: BuildingRegular, color: 'indigo' },
          { name: 'Gestión de Departamentos y Rangos', icon: BriefcaseRegular, color: 'cyan' },
          { name: 'Gestionar Roles', icon: SettingsRegular, color: 'purple' },
          { name: 'Permisos', icon: KeyRegular, color: 'amber' },
          { name: 'Auditoría', icon: ShieldCheckmarkRegular, color: 'red' },
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
          { name: 'Aprobar Solicitudes', icon: CheckmarkCircleRegular, color: 'green' },
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
          { name: 'Generar Pase', icon: KeyRegular, color: 'green' },
          { name: 'Control de Entrada/Salida', icon: ClockRegular, color: 'blue' },
          { name: 'Alertas de Seguridad', icon: AlertRegular, color: 'red' },
        ]
      },
      {
        id: 'reports',
        title: 'Reportes de Recepción',
        icon: DocumentTextRegular,
        actions: [
          { name: 'Reporte de Visitas', icon: DocumentTextRegular, color: 'green' },
          { name: 'Estadísticas de Acceso', icon: ArrowTrendingRegular, color: 'blue' },
          { name: 'Visitas por Fecha', icon: CalendarRegular, color: 'purple' },
          { name: 'Exportar Reportes', icon: DownloadRegular, color: 'orange' },
        ]
      }
    ]
  },
  employee: {
    title: 'Panel de Empleado',
    subtitle: 'Herramientas de trabajo',
    sections: [
      {
        id: 'visits',
        title: 'Gestión de Visitas',
        icon: EyeRegular,
        actions: [
          { name: 'Ver Mis Visitas', icon: EyeRegular, color: 'blue' },
          { name: 'Solicitar Visita', icon: AddRegular, color: 'green' },
          { name: 'Editar Visita', icon: EditRegular, color: 'amber' },
          { name: 'Cancelar Visita', icon: DismissRegular, color: 'red' },
        ]
      },
      {
        id: 'profile',
        title: 'Mi Perfil',
        icon: PersonRegular,
        actions: [
          { name: 'Ver Perfil', icon: PersonRegular, color: 'blue' },
          { name: 'Editar Datos', icon: EditRegular, color: 'amber' },
          { name: 'Cambiar Contraseña', icon: KeyRegular, color: 'purple' },
          { name: 'Notificaciones', icon: MailRegular, color: 'green' },
        ]
      },
      {
        id: 'reports',
        title: 'Reportes Personales',
        icon: DocumentTextRegular,
        actions: [
          { name: 'Mis Reportes', icon: DocumentTextRegular, color: 'green' },
          { name: 'Estadísticas', icon: ChartMultipleRegular, color: 'blue' },
          { name: 'Historial', icon: ClockRegular, color: 'purple' },
          { name: 'Exportar Datos', icon: DownloadRegular, color: 'orange' },
        ]
      }
    ]
  },
  visitor: {
    title: 'Panel de Visitante',
    subtitle: 'Acceso limitado al sistema',
    sections: [
      {
        id: 'profile',
        title: 'Mi Perfil',
        icon: PersonRegular,
        actions: [
          { name: 'Ver Perfil', icon: PersonRegular, color: 'blue' },
          { name: 'Editar Datos', icon: EditRegular, color: 'amber' },
          { name: 'Cambiar Contraseña', icon: KeyRegular, color: 'purple' },
        ]
      }
    ]
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  
  // Obtener el rol del usuario
  const userRole = user?.role?.name || 'admin'
  const currentConfig = roleConfig[userRole] || roleConfig.admin
  
  // Estado de modales
  const [modals, setModals] = useState({
    userRegistration: false,
    roleManagement: false,
    permissionManagement: false,
    auditManagement: false,
    userView: false,
    regionSiteManagement: false,
    departmentRankManagement: false,
    visitorManagement: false,
    generalConfiguration: false
  })

  // Actualizar hora actual
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Redirección basada en rol
  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }
    if (hasRedirected) return

    setIsLoading(false)

    // Redirigir según el rol del usuario
    let shouldRedirect = false
    let targetPath = ''
    
    switch (userRole) {
      case 'admin':
        shouldRedirect = true
        targetPath = '/admin/dashboard'
        break
      case 'supervisor':
        shouldRedirect = true
        targetPath = '/supervisor/dashboard'
        break
      case 'recepcion':
        shouldRedirect = true
        targetPath = '/reception/dashboard'
        break
      case 'employee':
      case 'visitor':
        shouldRedirect = true
        targetPath = '/employee/dashboard'
        break
      default:
        // Rol desconocido, permanecer en el dashboard actual
        break
    }

    if (shouldRedirect && targetPath !== window.location.pathname) {
      setHasRedirected(true)
      navigate(targetPath)
    }
  }, [authLoading, isAuthenticated, user, userRole, hasRedirected, navigate])

  // Función para manejar apertura/cierre de modales
  const toggleModal = (modalName: keyof typeof modals, open: boolean) => {
    setModals(prev => ({ ...prev, [modalName]: open }))
  }

  // Función para manejar acciones del dashboard
  const handleActionClick = (actionName: string) => {
    const actionMap: Record<string, keyof typeof modals> = {
      'Crear Usuario': 'userRegistration',
      'Vista de Usuarios': 'userView',
      'Gestionar Roles': 'roleManagement',
      'Permisos': 'permissionManagement',
      'Auditoría': 'auditManagement',
      'Gestión de Regiones y Sedes': 'regionSiteManagement',
      'Gestión de Departamentos y Rangos': 'departmentRankManagement',
      'Visitantes': 'visitorManagement',
      'Configuración General': 'generalConfiguration'
    }

    const modalKey = actionMap[actionName]
    if (modalKey) {
      toggleModal(modalKey, true)
    } else {
      console.log(`Acción no implementada: ${actionName}`)
    }
  }

  // Renderizado condicional
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-700/50 dark:bg-slate-800/90 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sistema de Visitas
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Panel de Control - {currentTime}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Rol: {user?.role?.name || 'Desconocido'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Usuario: {user?.name || 'Invitado'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <ArrowExitRegular className="h-4 w-4 mr-1" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 py-8" role="main">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" id="quick-actions-title">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="group" aria-labelledby="quick-actions-title">
            {currentConfig.sections.flatMap((section: SectionConfig) =>
              section.actions.map((action: ActionConfig, index: number) => (
                <DashboardActionCard
                  key={`${action.name}-${index}`}
                  title={action.name}
                  description="Haz clic para acceder"
                  icon={action.icon}
                  onClick={() => handleActionClick(action.name)}
                  role="button"
                  tabIndex={0}
                  aria-label={action.name}
                />
              ))
            )}
          </div>
        </div>

        {/* Estadísticas del sistema */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Estadísticas del sistema">
          <DashboardStatCard
            title="Estado del Sistema"
            value="Operativo"
            icon={CheckmarkCircleRegular}
            color="green"
            subtitle="Todo funcionando correctamente"
          />
          <DashboardStatCard
            title="Hora Actual"
            value={currentTime}
            icon={ClockRegular}
            color="blue"
            subtitle="Hora del servidor"
          />
          <DashboardStatCard
            title="Seguridad"
            value="Activa"
            icon={ShieldCheckmarkRegular}
            color="purple"
            subtitle="Sistema protegido"
          />
        </div>
      </main>

      {/* Modales */}
      <UserRegistrationModal 
        isOpen={modals.userRegistration} 
        onClose={() => toggleModal('userRegistration', false)}
        onUserCreated={() => console.log('Usuario creado exitosamente')}
      />
      <RoleManagementModal 
        isOpen={modals.roleManagement} 
        onClose={() => toggleModal('roleManagement', false)}
        onRoleUpdated={() => console.log('Rol actualizado exitosamente')}
      />
      <PermissionManagementModal 
        isOpen={modals.permissionManagement} 
        onClose={() => toggleModal('permissionManagement', false)}
        onPermissionUpdated={() => console.log('Permisos actualizados exitosamente')}
      />
      <AuditManagementModal 
        isOpen={modals.auditManagement} 
        onClose={() => toggleModal('auditManagement', false)}
        onAuditUpdated={() => console.log('Auditoría actualizada exitosamente')}
      />
      <UserViewModal 
        isOpen={modals.userView} 
        onClose={() => toggleModal('userView', false)}
        onUserUpdated={() => console.log('Usuario actualizado exitosamente')}
      />
      <RegionSiteManagementModal 
        isOpen={modals.regionSiteManagement} 
        onClose={() => toggleModal('regionSiteManagement', false)}
        onRegionSiteUpdated={() => console.log('Región/Sede actualizada exitosamente')}
      />
      <DepartmentRankManagementModal 
        isOpen={modals.departmentRankManagement} 
        onClose={() => toggleModal('departmentRankManagement', false)}
        onDepartmentRankUpdated={() => console.log('Departamento/Rango actualizado exitosamente')}
      />
      <VisitorManagementModal 
        isOpen={modals.visitorManagement} 
        onClose={() => toggleModal('visitorManagement', false)}
        onVisitorUpdated={() => console.log('Visitante actualizado exitosamente')}
      />
      <GeneralConfigurationModal 
        isOpen={modals.generalConfiguration} 
        onClose={() => toggleModal('generalConfiguration', false)}
        onConfigurationUpdated={() => console.log('Configuración actualizada exitosamente')}
      />
    </div>
  )
}
