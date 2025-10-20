import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const VisitasCreate: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre_visitante: '',
    empresa: '',
    fecha: '',
    hora_entrada: '',
    motivo: '',
    contacto: '',
    observaciones: ''
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Visita creada exitosamente')
      navigate('/visitas')
    } catch (error) {
      toast.error('Error al crear la visita')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Nueva Visita
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Registra una nueva visita en el sistema
          </p>
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Visitante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre_visitante" className="block text-sm font-medium text-gray-700">
                  <UserIcon className="inline h-4 w-4 mr-1" />
                  Nombre del Visitante
                </label>
                <input
                  type="text"
                  id="nombre_visitante"
                  name="nombre_visitante"
                  required
                  value={formData.nombre_visitante}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Juan Pérez García"
                />
              </div>
              
              <div>
                <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">
                  <BuildingOfficeIcon className="inline h-4 w-4 mr-1" />
                  Empresa/Organización
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  required
                  value={formData.empresa}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Tech Solutions S.A."
                />
              </div>
            </div>
            
            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                  <CalendarIcon className="inline h-4 w-4 mr-1" />
                  Fecha de la Visita
                </label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  required
                  value={formData.fecha}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="hora_entrada" className="block text-sm font-medium text-gray-700">
                  <ClockIcon className="inline h-4 w-4 mr-1" />
                  Hora de Entrada
                </label>
                <input
                  type="time"
                  id="hora_entrada"
                  name="hora_entrada"
                  required
                  value={formData.hora_entrada}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Motivo y Contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
                  <DocumentTextIcon className="inline h-4 w-4 mr-1" />
                  Motivo de la Visita
                </label>
                <input
                  type="text"
                  id="motivo"
                  name="motivo"
                  required
                  value={formData.motivo}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Reunión de negocios"
                />
              </div>
              
              <div>
                <label htmlFor="contacto" className="block text-sm font-medium text-gray-700">
                  Persona a Visitar
                </label>
                <input
                  type="text"
                  id="contacto"
                  name="contacto"
                  required
                  value={formData.contacto}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Ing. María López"
                />
              </div>
            </div>
            
            {/* Observaciones */}
            <div>
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                rows={3}
                value={formData.observaciones}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Información adicional sobre la visita..."
              />
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/visitas')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </>
                ) : (
                  'Crear Visita'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VisitasCreate