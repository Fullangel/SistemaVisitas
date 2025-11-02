// Función para limpiar el estado de autenticación si hay datos corruptos
export function cleanupAuthState() {
  try {
    const token = localStorage.getItem('token')
    const persisted = localStorage.getItem('auth-storage')

    // Parsear el estado persistido de zustand (auth-storage)
    let parsed: any = null
    if (persisted) {
      try {
        parsed = JSON.parse(persisted)
      } catch (e) {
        // Si el JSON está corrupto, limpiar todo
        localStorage.removeItem('token')
        localStorage.removeItem('auth-storage')
        console.log('Auth persistido corrupto; limpiado')
        return
      }
    }

    const state = parsed?.state || parsed || null
    const hasUser = !!state?.user
    const hasToken = !!token && token !== 'null' && token !== 'undefined'

    // Reglas de coherencia: si hay token sin usuario o usuario sin token, limpiar ambos
    if ((hasToken && !hasUser) || (!hasToken && hasUser)) {
      localStorage.removeItem('token')
      localStorage.removeItem('auth-storage')
      console.log('Coherencia de auth inválida; token/usuario limpiados')
      return
    }

    // Validaciones adicionales del usuario
    if (hasUser) {
      const u = state.user
      const roleName = u?.role?.name
      // Si el usuario no tiene rol válido o campos mínimos, limpiar
      if (!roleName || typeof roleName !== 'string') {
        localStorage.removeItem('token')
        localStorage.removeItem('auth-storage')
        console.log('Usuario sin rol válido; auth limpiado')
      }
    }
  } catch (error) {
    console.error('Error al limpiar estado de autenticación:', error)
  }
}

// Llamar a la función al cargar la aplicación
cleanupAuthState()