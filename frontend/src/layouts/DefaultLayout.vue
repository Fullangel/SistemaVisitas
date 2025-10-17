<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo y navegación -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">SNV</span>
              </div>
              <span class="text-xl font-semibold text-gray-900">Sistema Nacional de Visitas</span>
            </router-link>
            
            <!-- Navegación principal -->
            <nav class="hidden md:flex ml-10 space-x-8">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                :class="[
                  $route.name === item.name
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
                ]"
              >
                <component :is="item.icon" class="w-4 h-4 mr-2" />
                {{ item.name }}
              </router-link>
            </nav>
          </div>
          
          <!-- Usuario y menú -->
          <div class="flex items-center space-x-4">
            <!-- Notificaciones -->
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span class="sr-only">Ver notificaciones</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <!-- Menú de usuario -->
            <div class="relative">
              <button
                @click="isUserMenuOpen = !isUserMenuOpen"
                type="button"
                class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">
                    {{ userInitials }}
                  </span>
                </div>
                <span class="hidden md:block text-gray-700">{{ userName }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Menú desplegable -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <router-link
                    to="/perfil"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isUserMenuOpen = false"
                  >
                    Mi Perfil
                  </router-link>
                  <router-link
                    v-if="isAdmin"
                    to="/admin"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isUserMenuOpen = false"
                  >
                    Administración
                  </router-link>
                  <hr class="my-1" />
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">
            © {{ currentYear }} Sistema Nacional de Visitas. Todos los derechos reservados.
          </p>
          <p class="text-sm text-gray-500">
            v{{ appVersion }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { toast } from 'vue-toastification'

const authStore = useAuthStore()
const router = useRouter()

// Estado
const isUserMenuOpen = ref(false)

// Computed
const userName = computed(() => {
  return authStore.user?.name || 'Usuario'
})

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const isAdmin = computed(() => authStore.isAdmin)

const currentYear = computed(() => new Date().getFullYear())

const appVersion = computed(() => '1.0.0')

// Navegación
const navigation = computed(() => [
  {
    name: 'Dashboard',
    to: { name: 'dashboard' },
    icon: 'HomeIcon',
  },
  {
    name: 'Visitas',
    to: { name: 'visitas.index' },
    icon: 'UsersIcon',
  },
  {
    name: 'Reportes',
    to: { name: 'reportes.index' },
    icon: 'ChartBarIcon',
  },
])

// Métodos
const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Sesión cerrada correctamente')
    router.push({ name: 'login' })
  } catch (error) {
    toast.error('Error al cerrar sesión')
  }
  isUserMenuOpen.value = false
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu-container')) {
    isUserMenuOpen.value = false
  }
}

// Registrar event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<script lang="ts">
// Importar iconos como componentes
import { 
  HomeIcon, 
  UsersIcon, 
  ChartBarIcon 
} from '@heroicons/vue/24/outline'

import { onMounted, onUnmounted } from 'vue'

export default {
  components: {
    HomeIcon,
    UsersIcon,
    ChartBarIcon,
  },
}
</script>