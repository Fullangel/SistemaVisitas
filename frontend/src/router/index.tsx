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
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'

// Páginas de visitas, reportes y administración
import VisitasIndex from '@/pages/visitas/index'
import VisitasCreate from '@/pages/visitas/Create'
import Reports from '@/pages/reports'
import Admin from '@/pages/admin'

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
  // Registro público eliminado: el registro lo realizan roles internos (admin/supervisor/recepción)
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
          title: 'Reportes',
          breadcrumb: 'Reportes',
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