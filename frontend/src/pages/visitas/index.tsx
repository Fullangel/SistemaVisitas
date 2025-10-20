import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface Visita {
  id: number
  nombre_visitante: string
  empresa: string
  fecha: string
  hora_entrada: string
  hora_salida: string | null
  motivo: string
  estado: 'pendiente' | 'en_proceso' | 'completada'
  usuario_registro: string
}

const VisitasIndex: React.FC = () => {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('')
  
  useEffect(() => {
    // Simular carga de datos
    const loadVisitas = async () => {
      setIsLoading(true)
      // Aquí iría la llamada real a la API
      setTimeout(() => {
        setVisitas([
          {
            id: 1,
            nombre_visitante: 'Juan Pérez',
            empresa: 'Tech Solutions',
            fecha: '2023-10-15',
            hora_entrada: '09:30',
            hora_salida: '11:00',
            motivo: 'Reunión de negocios',
            estado: 'completada',
            usuario_registro: 'Admin'
          },
          {
            id: 2,
            nombre_visitante: 'María García',
            empresa: 'Global Corp',
            fecha: '2023-10-16',
            hora_entrada: '14:00',
            hora_salida: null,
            motivo: 'Entrevista de trabajo',
            estado: 'en_proceso',
            usuario_registro: 'Admin'
          },
          {
            id: 3,
            nombre_visitante: 'Carlos Rodríguez',
            empresa: 'Innovation Labs',
            fecha: '2023-10-17',
            hora_entrada: '10:00',
            hora_salida: null,
            motivo: 'Presentación de producto',
            estado: 'pendiente',
            usuario_registro: 'Admin'
          }
        ])
        setIsLoading(false)
      }, 1000)
    }
    
    loadVisitas()
  }, [])
  
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800'
      case 'en_proceso':
        return 'bg-yellow-100 text-yellow-800'
      case 'pendiente':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const filteredVisitas = visitas.filter(visita => {
    const matchesSearch = visita.nombre_visitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visita.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = !filterEstado || visita.estado === filterEstado
    return matchesSearch && matchesEstado
  })
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Gestión de Visitas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Administra y registra todas las visitas al sistema
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/visitas/nueva"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
            Nueva Visita
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Buscar por nombre o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              id="estado"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando visitas...</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredVisitas.map((visita) => (
              <li key={visita.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {visita.nombre_visitante}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <BuildingOfficeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {visita.empresa}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-900 flex items-center">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {visita.fcha}
                        </p>
                        <p className="text-sm text-gray-500">
                          {visita.hora_entrada} - {visita.hora_salida || 'En curso'}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(visita.estado)}`}>
                        {visita.estado.charAt(0).toUpperCase() + visita.estado.slice(1).replace('_', ' ')}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/visitas/${visita.id}`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/visitas/${visita.id}/editar`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => {
                            // Aquí iría la lógica de eliminación
                            console.log('Eliminar visita:', visita.id)
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Motivo: {visita.motivo}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Registrado por: {visita.usuario_registro}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {filteredVisitas.length === 0 && (
              <li className="px-4 py-8 text-center text-gray-500">
                No se encontraron visitas
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default VisitasIndex