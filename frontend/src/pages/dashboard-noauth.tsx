export default function DashboardNoAuth() {
  console.log("DashboardNoAuth: Renderizando componente sin autenticación")
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
            Dashboard de Prueba - SIN AUTENTICACIÓN
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Este dashboard se carga sin autenticación para diagnosticar el problema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-2 border-red-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prueba 1</h3>
            <div className="text-2xl font-bold text-red-600">SIN AUTH</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prueba 2</h3>
            <div className="text-2xl font-bold text-green-600">FUNCIONA</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prueba 3</h3>
            <div className="text-2xl font-bold text-purple-600">DIAGNOSTICO</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prueba 4</h3>
            <div className="text-2xl font-bold text-orange-600">ACTIVO</div>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 p-4 rounded-lg">
          <h3 className="text-green-800 dark:text-green-200 font-medium">✅ Dashboard Cargado Exitosamente</h3>
          <p className="text-green-700 dark:text-green-300 text-sm mt-1">
            Si ves este dashboard, significa que el problema está en el AuthGuard o en la autenticación.
            El componente base y el router están funcionando correctamente.
          </p>
        </div>
      </div>
    </div>
  )
}