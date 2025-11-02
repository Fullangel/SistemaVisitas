import React, { useState } from 'react'
import { 
  UsersIcon,
  CogIcon,
  ShieldCheckIcon,
  KeyIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import UserRegistrationModal from '../../components/admin/UserRegistrationModal'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  last_login: string
  visitas_count: number
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  
  // Datos simulados
  const users: User[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'admin',
      status: 'active',
      last_login: '2024-01-15 09:30',
      visitas_count: 45
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@example.com',
      role: 'user',
      status: 'active',
      last_login: '2024-01-14 14:20',
      visitas_count: 23
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@example.com',
      role: 'user',
      status: 'inactive',
      last_login: '2024-01-10 11:15',
      visitas_count: 12
    }
  ]
  
  const handleDeleteUser = (userId: number) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      alert(`Usuario ${userId} eliminado`)
    }
  }
  
  const handleToggleUserStatus = (userId: number) => {
    alert(`Estado del usuario ${userId} actualizado`)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Panel de Administración
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de usuarios, configuración del sistema y reportes administrativos
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UsersIcon className="inline h-4 w-4 mr-2" />
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CogIcon className="inline h-4 w-4 mr-2" />
            Configuración
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShieldCheckIcon className="inline h-4 w-4 mr-2" />
            Seguridad
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ChartBarIcon className="inline h-4 w-4 mr-2" />
            Reportes Admin
          </button>
        </nav>
      </div>
      
      {/* Content */}
      {activeTab === 'users' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Gestión de Usuarios
              </h3>
              <button 
                onClick={() => setIsRegistrationModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <UsersIcon className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </button>
            </div>
            
            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.visitas_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <KeyIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert(`Editar usuario ${user.id}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Configuración del Sistema
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de la Organización
                  </label>
                  <input
                    type="text"
                    defaultValue="Sistema de Visitas Nacional"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zona Horaria
                  </label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                    <option>UTC-6 (Centroamérica)</option>
                    <option>UTC-5 (Este de EE.UU.)</option>
                    <option>UTC-8 (Pacífico EE.UU.)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Configuración de Seguridad
            </h3>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  <KeyIcon className="inline h-5 w-5 mr-2 text-gray-400" />
                  Políticas de Contraseña
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <label className="ml-2 text-sm text-gray-700">Requerir contraseña segura</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <label className="ml-2 text-sm text-gray-700">Forzar cambio de contraseña cada 90 días</label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  <ShieldCheckIcon className="inline h-5 w-5 mr-2 text-gray-400" />
                  Autenticación de Dos Factores
                </h4>
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <label className="ml-2 text-sm text-gray-700">Habilitar 2FA para administradores</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'reports' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Reportes Administrativos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  <DocumentTextIcon className="inline h-5 w-5 mr-2 text-gray-400" />
                  Reporte de Actividad
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Generar reporte detallado de todas las actividades en el sistema
                </p>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Generar Reporte
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  <ChartBarIcon className="inline h-5 w-5 mr-2 text-gray-400" />
                  Estadísticas del Sistema
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Ver estadísticas generales del uso del sistema
                </p>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Ver Estadísticas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User Registration Modal */}
      <UserRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onUserCreated={() => {
          // Refresh user list or show success message
          alert('Usuario creado exitosamente')
        }}
      />
    </div>
  )
}

export default Admin