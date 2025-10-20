// Función para limpiar el estado de autenticación si hay datos corruptos
export function cleanupAuthState() {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('auth-store')
    
    // Si hay token pero no hay usuario o el usuario es inválido, limpiar
    if (token) {
      try {
        const parsedUser = user ? JSON.parse(user) : null
        if (!parsedUser || !parsedUser.state || !parsedUser.state.user) {
          // Datos corruptos o incompletos, limpiar
          localStorage.removeItem('token')
          localStorage.removeItem('auth-store')
          console.log('Estado de autenticación corrupto limpiado')
        }
      } catch (error) {
        // Error al parsear, limpiar todo
        localStorage.removeItem('token')
        localStorage.removeItem('auth-store')
        console.log('Error al parsear datos de autenticación, limpiado')
      }
    }
  } catch (error) {
    console.error('Error al limpiar estado de autenticación:', error)
  }
}

// Llamar a la función al cargar la aplicación
cleanupAuthState()