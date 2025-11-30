import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Users, Calendar, Clock, Building2, TrendingUp, BarChart3, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ReportData {
  total_visitas: number
  visitas_mes: number
  promedio_diario: number
  visitantes_unicos: number
  empresas_mas_visitadas: Array<{ nombre: string; visitas: number }>
  horas_pico: Array<{ hora: string; visitas: number }>
}

export default function ReporteGeneral() {
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
    console.log(`Exportando reporte en formato ${format.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Reporte General
            </h1>
            <p className="text-gray-600">Análisis completo de visitas y estadísticas del sistema</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleExport('pdf')} variant="outline" className="shadow-md">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={() => handleExport('excel')} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Rango de Fechas:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Último año</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas Generales */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
            <TrendingUp className="h-6 w-6 text-white/80" />
          </div>
          <p className="text-white/80 text-sm">Total Visitas</p>
          <p className="text-4xl font-bold mt-2">{reportData.total_visitas.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Calendar className="h-8 w-8" />
            </div>
            <Badge className="bg-white/20 text-white border-0">Este Mes</Badge>
          </div>
          <p className="text-white/80 text-sm">Visitas del Mes</p>
          <p className="text-4xl font-bold mt-2">{reportData.visitas_mes.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Clock className="h-8 w-8" />
            </div>
            <BarChart3 className="h-6 w-6 text-white/80" />
          </div>
          <p className="text-white/80 text-sm">Promedio Diario</p>
          <p className="text-4xl font-bold mt-2">{reportData.promedio_diario}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
            <Badge className="bg-white/20 text-white border-0">Únicos</Badge>
          </div>
          <p className="text-white/80 text-sm">Visitantes Únicos</p>
          <p className="text-4xl font-bold mt-2">{reportData.visitantes_unicos.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Tablas de Detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empresas más visitadas */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-indigo-600" />
              Empresas más Visitadas
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {reportData.empresas_mas_visitadas.map((empresa, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{empresa.nombre}</span>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 px-4 py-1">
                    {empresa.visitas} visitas
                  </Badge>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Horas pico */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-6 w-6 text-green-600" />
              Horas Pico de Visitas
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {reportData.horas_pico.map((hora, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">{hora.hora}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 px-4 py-1">
                    {hora.visitas} visitas
                  </Badge>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}