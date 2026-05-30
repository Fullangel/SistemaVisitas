import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import ErrorPage from '@/pages/ErrorPage'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout'
// import AuthLayout from '@/layouts/AuthLayout'

// Páginas principales
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
// import Register from '@/pages/auth/Register'
import Forbidden from '@/pages/Forbidden'
import Dashboard from '@/pages/DashboardNew'
import NotFound from '@/pages/NotFound'

// Páginas de visitas, reportes y administración
import VisitasIndex from '@/pages/visitas/index'
import VisitasCreate from '@/pages/visitas/Create'
import NewVisit from '@/pages/visits/NewVisit'
import ActiveVisits from '@/pages/visits/ActiveVisits.tsx'
import ApproveVisits from '@/pages/visits/ApproveVisits.tsx'
import BlockedVisitors from '@/pages/visits/BlockedVisitors.tsx'
import SearchVisitor from '@/pages/visits/SearchVisitor.tsx'
import VerifyVisitor from '@/pages/VerifyVisitor'
import Reports from '@/pages/reports'
import PorSede from '@/pages/reports/PorSede'
import PorPeriodo from '@/pages/reports/PorPeriodo'
import Estadisticas from '@/pages/reports/Estadisticas'
import Admin from '@/pages/admin'

// Páginas de organización
import Departments from '@/pages/organization/Departments'
import Positions from '@/pages/organization/Positions'

// Páginas de administración
import Permissions from '@/pages/admin/Permissions'
import Configuration from '@/pages/admin/Configuration'
import AdvancedConfiguration from '@/pages/admin/AdvancedConfiguration'
import SystemMonitoring from '@/pages/admin/SystemMonitoring'
import BotManagement from '@/pages/admin/BotManagement'

// Páginas de ubicaciones
import Regiones from '@/pages/locations/Regiones'
import Dependencias from '@/pages/locations/Dependencias'
import Sedes from '@/pages/locations/Sedes'

// Páginas de empleados
import Empleados from '@/pages/employees/Empleados'

// Páginas de auditoría
import Actividades from '@/pages/audit/Actividades'
import Visitas from '@/pages/audit/Visitas'
import Configuracion from '@/pages/audit/Configuracion'
import Accesos from '@/pages/audit/Accesos'
import Seguridad from '@/pages/audit/Seguridad'

// Dashboards por roles - Nueva estructura
import AdminDashboard from '@/pages/admin/dashboard'
import SupervisorDashboard from '@/pages/supervisor/dashboard'
import ReceptionDashboard from '@/pages/reception/dashboard'
import EmployeeDashboard from '@/pages/employee/dashboard'

// Guards
import { AuthGuard } from '@/guards/AuthGuard'
import { GuestGuard } from '@/guards/GuestGuard'
import { AdminGuard } from '@/guards/AdminGuard'
import { RoleGuard } from '@/guards/RoleGuard'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    handle: {
      title: 'Inicio',
    },
  },
  {
    path: '/verify/:visitCode',
    element: <VerifyVisitor />,
    errorElement: <ErrorPage />,
    handle: {
      title: 'Verificar Visita',
    },
  },
  {
    path: '/auth/login',
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
    errorElement: <ErrorPage />,
    handle: {
      title: 'Iniciar Sesión',
    },
  },
  // Ubicaciones (Regiones, Dependencias, Sedes)
  {
    path: '/ubicaciones',
    element: (
      <RoleGuard allowedRoles={['admin', 'supervisor']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'regiones',
        element: <Regiones />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Regiones',
          breadcrumb: 'Regiones',
        },
      },
      {
        path: 'dependencias',
        element: <Dependencias />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Dependencias',
          breadcrumb: 'Dependencias',
        },
      },
      {
        path: 'sedes',
        element: <Sedes />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Sedes',
          breadcrumb: 'Sedes',
        },
      },
    ],
  },
  // Empleados
  {
    path: '/empleados',
    element: (
      <RoleGuard allowedRoles={['admin', 'supervisor']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Empleados />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Empleados',
          breadcrumb: 'Empleados',
        },
      },
    ],
  },
  // Reportestro público eliminado: el registro lo realizan roles internos (admin/supervisor/recepción)
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <DefaultLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Panel de Control',
          breadcrumb: 'Dashboard',
        },
      },
    ],
  },
  // Dashboards por roles - Nueva estructura más lógica
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['admin']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Admin />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Administración',
          breadcrumb: 'Administración',
        },
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Panel de Administración',
          breadcrumb: 'Admin Dashboard',
        },
      },
      {
        path: 'monitoring',
        element: <SystemMonitoring />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Monitoreo del Sistema',
          breadcrumb: 'Monitoreo',
        },
      },
      {
        path: 'bots',
        element: <BotManagement />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Bots',
          breadcrumb: 'Bots',
        },
      },
      {
        path: 'permissions',
        element: <Permissions />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Permisos',
          breadcrumb: 'Permisos',
        },
      },
      {
        path: 'config',
        element: <Configuration />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Configuración General',
          breadcrumb: 'Configuración',
        },
      },
      {
        path: 'advanced-config',
        element: <AdvancedConfiguration />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Configuración Avanzada',
          breadcrumb: 'Config. Avanzada',
        },
      },
    ],
  },
  {
    path: '/supervisor',
    element: (
      <RoleGuard allowedRoles={['supervisor']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <SupervisorDashboard />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Panel de Supervisión',
          breadcrumb: 'Supervisor Dashboard',
        },
      },
    ],
  },
  {
    path: '/reception',
    element: (
      <RoleGuard allowedRoles={['recepcion']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <ReceptionDashboard />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Panel de Recepción',
          breadcrumb: 'Reception Dashboard',
        },
      },
    ],
  },
  {
    path: '/employee',
    element: (
      <RoleGuard allowedRoles={['employee']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <EmployeeDashboard />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Panel de Empleado',
          breadcrumb: 'Employee Dashboard',
        },
      },
    ],
  },
  {
    path: '/visitas',
    element: (
      <AuthGuard>
        <DefaultLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <VisitasIndex />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Visitas',
          breadcrumb: 'Visitas',
        },
      },
      {
        path: 'crear',
        element: <VisitasCreate />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Crear Visita',
          breadcrumb: 'Crear Visita',
        },
      },
      {
        path: 'nueva',
        element: <NewVisit />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Nueva Visita',
          breadcrumb: 'Nueva Visita',
        },
      },
      {
        path: 'activas',
        element: <ActiveVisits />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Visitas Activas',
          breadcrumb: 'Visitas Activas',
        },
      },
      {
        path: 'aprobar',
        element: <ApproveVisits />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Aprobar Visitas',
          breadcrumb: 'Aprobar Visitas',
        },
      },
      {
        path: 'bloqueados',
        element: <BlockedVisitors />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Visitantes Bloqueados',
          breadcrumb: 'Visitantes Bloqueados',
        },
      },
      {
        path: 'buscar',
        element: <SearchVisitor />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Buscar Visitante',
          breadcrumb: 'Buscar Visitante',
        },
      },

    ],
  },
  {
    path: '/organizacion',
    element: (
      <RoleGuard allowedRoles={['admin', 'supervisor']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'departamentos',
        element: <Departments />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Departamentos (Gerencias)',
          breadcrumb: 'Departamentos',
        },
      },
      {
        path: 'cargos',
        element: <Positions />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Cargos y Posiciones',
          breadcrumb: 'Cargos',
        },
      },
    ],
  },
  // Empleados
  {
    path: '/empleados',
    element: (
      <RoleGuard allowedRoles={['admin', 'supervisor']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Empleados />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Gestión de Empleados',
          breadcrumb: 'Empleados',
        },
      },
    ],
  },
  // Auditoría
  {
    path: '/auditoria',
    element: (
      <RoleGuard allowedRoles={['admin']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'actividades',
        element: <Actividades />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Registro de Actividades',
          breadcrumb: 'Actividades',
        },
      },
      {
        path: 'visitas',
        element: <Visitas />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Historial de Visitas',
          breadcrumb: 'Historial de Visitas',
        },
      },
      {
        path: 'configuracion',
        element: <Configuracion />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Cambios en Configuración',
          breadcrumb: 'Configuración',
        },
      },
      {
        path: 'accesos',
        element: <Accesos />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Accesos al Sistema',
          breadcrumb: 'Accesos',
        },
      },
      {
        path: 'seguridad',
        element: <Seguridad />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Reportes de Seguridad',
          breadcrumb: 'Seguridad',
        },
      },
    ],
  },
  {
    path: '/reportes',
    element: (
      <AuthGuard>
        <DefaultLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Reports />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Reporte General',
          breadcrumb: 'Reporte General',
        },
      },
      {
        path: 'sede',
        element: <PorSede />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Reporte por Sede',
          breadcrumb: 'Por Sede',
        },
      },
      {
        path: 'periodo',
        element: <PorPeriodo />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Reporte por Período',
          breadcrumb: 'Por Período',
        },
      },
      {
        path: 'stats',
        element: <Estadisticas />,
        errorElement: <ErrorPage />,
        handle: {
          title: 'Estadísticas Avanzadas',
          breadcrumb: 'Estadísticas',
        },
      },
    ],
  },
  // Ruta duplicada de /admin eliminada (se unifica bajo RoleGuard)
  {
    path: '/forbidden',
    element: <Forbidden />,
    errorElement: <ErrorPage />,
    handle: {
      title: 'Acceso denegado',
      breadcrumb: '403',
    },
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <ErrorPage />,
    handle: {
      title: 'Página no encontrada',
    },
  },
]

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})

export { RouterProvider }