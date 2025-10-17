import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Importar estilos
import './assets/css/main.css'

// Importar plugins adicionales
import { createHead } from '@vueuse/head'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Crear instancia de la aplicación
const app = createApp(App)

// Configurar Pinia store
const pinia = createPinia()

// Configurar Vue Head para SEO
const head = createHead()

// Configuración de Toast
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

// Usar plugins
app.use(pinia)
app.use(router)
app.use(head)
app.use(Toast, toastOptions)

// Configuración global de propiedades
app.config.globalProperties.$filters = {
  currency(value: number, currency = 'USD') {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(value)
  },
  
  date(value: string | Date, format: Intl.DateTimeFormatOptions = {}) {
    const date = new Date(value)
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...format,
    }).format(date)
  },
  
  number(value: number, options: Intl.NumberFormatOptions = {}) {
    return new Intl.NumberFormat('es-ES', options).format(value)
  },
}

// Montar la aplicación
app.mount('#app')