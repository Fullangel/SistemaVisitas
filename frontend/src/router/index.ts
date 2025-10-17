import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Páginas principales
import Home from '@/pages/Home.vue'
import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'
import Dashboard from '@/pages/Dashboard.vue'
import NotFound from '@/pages/NotFound.vue'

// Páginas de visitas
import VisitasIndex from '@/pages/visitas/Index.vue'
import VisitasCreate from '@/pages/visitas/Create.vue'
import VisitasShow from '@/pages/visitas/Show.vue'
import VisitasEdit from '@/pages/visitas/Edit.vue'

// Páginas de reportes
import ReportesIndex from '@/pages/reportes/Index.vue'

// Páginas de administración
import AdminIndex from '@/pages/admin/Index.vue'
import UsuariosIndex from '@/pages/admin/usuarios/Index.vue'
import ConfiguracionIndex from '@/pages/admin/configuracion/Index.vue'

// Guards
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      layout: 'default',
      title: 'Inicio',
    },
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: {
          title: 'Iniciar Sesión',
        },
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: {
          title: 'Registrarse',
        },
      },
    ],
  },
  {
    path: '/dashboard',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          title: 'Panel de Control',
          breadcrumb: 'Dashboard',
        },
      },
    ],
  },
  {
    path: '/visitas',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'visitas.index',
        component: VisitasIndex,
        meta: {
          title: 'Gestión de Visitas',
          breadcrumb: 'Visitas',
        },
      },
      {
        path: 'crear',
        name: 'visitas.create',
        component: VisitasCreate,
        meta: {
          title: 'Crear Visita',
          breadcrumb: 'Crear Visita',
        },
      },
      {
        path: ':id',
        name: 'visitas.show',
        component: VisitasShow,
        meta: {
          title: 'Detalles de Visita',
          breadcrumb: 'Detalles',
        },
      },
      {
        path: ':id/editar',
        name: 'visitas.edit',
        component: VisitasEdit,
        meta: {
          title: 'Editar Visita',
          breadcrumb: 'Editar',
        },
      },
    ],
  },
  {
    path: '/reportes',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'reportes.index',
        component: ReportesIndex,
        meta: {
          title: 'Reportes',
          breadcrumb: 'Reportes',
        },
      },
    ],
  },
  {
    path: '/admin',
    component: DefaultLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin.index',
        component: AdminIndex,
        meta: {
          title: 'Administración',
          breadcrumb: 'Administración',
        },
      },
      {
        path: 'usuarios',
        name: 'admin.usuarios',
        component: UsuariosIndex,
        meta: {
          title: 'Gestión de Usuarios',
          breadcrumb: 'Usuarios',
        },
      },
      {
        path: 'configuracion',
        name: 'admin.configuracion',
        component: ConfiguracionIndex,
        meta: {
          title: 'Configuración del Sistema',
          breadcrumb: 'Configuración',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: 'Página no encontrada',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Guards de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // Verificar si es invitado (no autenticado)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }
  
  // Verificar rol de administrador
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'dashboard' })
    return
  }
  
  // Establecer título de la página
  if (to.meta.title) {
    document.title = `${to.meta.title} - Sistema Nacional de Visitas`
  } else {
    document.title = 'Sistema Nacional de Visitas'
  }
  
  next()
})

export default router