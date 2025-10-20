import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center space-x-3">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SNV</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Sistema Nacional de Visitas</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenido
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema integral de gestión de visitas a nivel nacional
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Sistema Nacional de Visitas. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout