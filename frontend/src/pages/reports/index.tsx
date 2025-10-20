import React, { useState } from 'react'
import { 
  DocumentChartBarIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface ReportData {
  total_visitas: number
  visitas_mes: number
  promedio_diario: number
  visitantes_unicos: number
  empresas_mas_visitadas: Array<{ nombre: string; visitas: number }>
  horas_pico: Array<{ hora: string; visitas: number }>
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('general')
  const [dateRange, setDateRange] = useState('30')
  
  // Datos simulados
  const reportData: ReportData = {
    total_visitas: 1247,
    visitas_mes: 342,
    promedio_diario: 11.4,
    visitantes_unicos: 892,
    empresas_mas_visitadas: [
      { nombre: 'Tech Solutions S.A.', visitas: 45 },
      { nombre: 'Global Consulting', visitas: 38 },
      { nombre: 'Innovation Labs', visitas: 32 },
      { nombre: 'Digital Agency', visitas: 28 },
      { nombre: 'Creative Studio', visitas: 25 }
    ],
    horas_pico: [
      { hora: '09:00 - 10:00', visitas: 45 },
      { hora: '10:00 - 11:00', visitas: 38 },
      { hora: '14:00 - 15:00', visitas: 32 },
      { hora: '15:00 - 16:00', visitas: 28 },
      { hora: '11:00 - 12:00', visitas: 25 }
    ]
  }
  
  const handleExport = (format: 'pdf' | 'excel') => {
    // Simular exportación
    alert(`Exportando reporte en formato ${format.toUpperCase()}`)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reportes y Estadísticas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Análisis detallado de las visitas y estadísticas del sistema
          </p>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                Tipo de Reporte
              </label>
              <select
                id="reportType"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="general">Reporte General</option>
                <option value="visitas">Visitas por Empresa</option>
                <option value="horas">Horas Pico</option>
                <option value="mensual">Reporte Mensual</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                Rango de Fechas
              </label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="7">Últimos 7 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
                <option value="365">Último año</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-3">
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <DocumentChartBarIcon className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Exportar Excel
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Visitas</p>
                <p className="text-2xl font-semibold text-gray-900">{reportData.total_visitas.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Este Mes</p>
                <p className="text-2xl font-semibold text-gray-900">{reportData.visitas_mes.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio Diario</p>
                <p className="text-2xl font-semibold text-gray-900">{reportData.promedio_diario}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Visitantes Únicos</p>
                <p className="text-2xl font-semibold text-gray-900">{reportData.visitantes_unicos.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tablas de Detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empresas más visitadas */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              <BuildingOfficeIcon className="inline h-5 w-5 mr-2 text-gray-400" />
              Empresas más Visitadas
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {reportData.empresas_mas_visitadas.map((empresa, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {empresa.nombre}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {empresa.visitas} visitas
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Horas pico */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              <ClockIcon className="inline h-5 w-5 mr-2 text-gray-400" />
              Horas Pico de Visitas
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {reportData.horas_pico.map((hora, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {hora.hora}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {hora.visitas} visitas
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports