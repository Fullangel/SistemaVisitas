import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout'
import AuthLayout from '@/layouts/AuthLayout'

// Páginas principales
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/Dashboard'
import NotFound from '@/pages/NotFound'

// Páginas de visitas, reportes y administración
import VisitasIndex from '@/pages/visitas/index'
import VisitasCreate from '@/pages/visitas/Create'
import Reports from '@/pages/reports'
import Admin from '@/pages/admin'

// Dashboards por roles
import AdminDashboard from '@/pages/dashboard/admin'
import SupervisorDashboard from '@/pages/dashboard/supervisor'
import ReceptionDashboard from '@/pages/dashboard/reception'

// Guards
import { AuthGuard } from '@/guards/AuthGuard'
import { GuestGuard } from '@/guards/GuestGuard'
import { AdminGuard } from '@/guards/AdminGuard'
import { RoleGuard } from '@/guards/RoleGuard'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
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
    handle: {
      title: 'Iniciar Sesión',
    },
  },
  {
    path: '/auth/register',
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        index: true,
        element: <Register />,
        handle: {
          title: 'Registrarse',
        },
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <DefaultLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
        handle: {
          title: 'Panel de Control',
          breadcrumb: 'Dashboard',
        },
      },
    ],
  },
  // Dashboards por roles
  {
    path: '/dashboard/admin',
    element: (
      <RoleGuard allowedRoles={['admin']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
        handle: {
          title: 'Panel de Administración',
          breadcrumb: 'Admin Dashboard',
        },
      },
    ],
  },
  {
    path: '/dashboard/supervisor',
    element: (
      <RoleGuard allowedRoles={['supervisor']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <SupervisorDashboard />,
        handle: {
          title: 'Panel de Supervisión',
          breadcrumb: 'Supervisor Dashboard',
        },
      },
    ],
  },
  {
    path: '/dashboard/reception',
    element: (
      <RoleGuard allowedRoles={['recepcion', 'reception']}>
        <DefaultLayout />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <ReceptionDashboard />,
        handle: {
          title: 'Panel de Recepción',
          breadcrumb: 'Reception Dashboard',
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
    children: [
      {
        index: true,
        element: <VisitasIndex />,
        handle: {
          title: 'Gestión de Visitas',
          breadcrumb: 'Visitas',
        },
      },
      {
        path: 'crear',
        element: <VisitasCreate />,
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
    children: [
      {
        index: true,
        element: <Reports />,
        handle: {
          title: 'Reportes',
          breadcrumb: 'Reportes',
        },
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <DefaultLayout />
      </AdminGuard>
    ),
    children: [
      {
        index: true,
        element: <Admin />,
        handle: {
          title: 'Administración',
          breadcrumb: 'Administración',
        },
      },

    ],
  },
  {
    path: '*',
    element: <NotFound />,
    handle: {
      title: 'Página no encontrada',
    },
  },
]

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
  future: {
    v7_startTransition: true,
  },
})

export { RouterProvider }