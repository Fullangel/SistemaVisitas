import React, { useState, useEffect } from 'react'
import {
  UserPlusIcon,
  UserMinusIcon,
  QrCodeIcon,
  ClipboardDocumentIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  ShareIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth'
import { VenezuelaMapWrapper } from '@/components/venezuela-map-wrapper'

interface Visit {
  id: number
  codigo: string
  visitante_nombre: string
  visitante_documento: string
  visitante_telefono?: string
  visitante_email?: string
  entidad_visitada: string
  motivo: string
  fecha_hora_ingreso: string
  fecha_hora_salida?: string
  estado: 'pendiente' | 'en_curso' | 'finalizada' | 'cancelada'
  observaciones?: string
  user_id: number
  registrado_por: string
  ubicacion?: string
  acompanantes?: number
}

interface ReceptionStats {
  pending_checkins: number
  active_visits: number
  completed_today: number
  pending_checkouts: number
  alerts_count: number
  average_duration: string
}

export default function ReceptionDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [visits, setVisits] = useState<Visit[]>([])
  const [stats, setStats] = useState<ReceptionStats>({
    pending_checkins: 8,
    active_visits: 12,
    completed_today: 24,
    pending_checkouts: 3,
    alerts_count: 1,
    average_duration: '45 min'
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [showVisitModal, setShowVisitModal] = useState(false)

  const { user } = useAuthStore()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Cargar visitas del día
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reception/visits', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setVisits(data.visits || [])
      }
    } catch (error) {
      console.error('Error fetching visits:', error)
    }
  }

  const handleCheckIn = async (visitId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reception/visits/${visitId}/checkin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        fetchVisits() // Recargar visitas
      }
    } catch (error) {
      console.error('Error checking in:', error)
    }
  }

  const handleCheckOut = async (visitId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reception/visits/${visitId}/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        fetchVisits() // Recargar visitas
      }
    } catch (error) {
      console.error('Error checking out:', error)
    }
  }

  const handleNewVisit = () => {
    console.log('Abrir formulario de nueva visita')
    // Aquí se abriría el modal/formulario de nueva visita
  }

  const handleViewDetails = (visit: Visit) => {
    setSelectedVisit(visit)
    setShowVisitModal(true)
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'en_curso':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">En Curso</Badge>
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case 'finalizada':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Finalizada</Badge>
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getPriorityColor = (count: number) => {
    if (count === 0) return 'bg-green-100 text-green-800'
    if (count <= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const filteredVisits = visits.filter(visit =>
    visit.visitante_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.entidad_visitada.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const receptionSections = [
    {
      id: 'checkin',
      title: 'Check-in',
      icon: UserPlusIcon,
      color: 'green',
      actions: [
        { name: 'Nueva Visita', icon: UserPlusIcon, action: handleNewVisit, color: 'green' },
        { name: 'Check-in Rápido', icon: QrCodeIcon, action: () => console.log('Check-in QR'), color: 'blue' },
        { name: 'Registrar Grupo', icon: UserGroupIcon, action: () => console.log('Registrar grupo'), color: 'purple' },
        { name: 'Verificar ID', icon: IdentificationIcon, action: () => console.log('Verificar ID'), color: 'orange' }
      ]
    },
    {
      id: 'checkout',
      title: 'Check-out',
      icon: UserMinusIcon,
      color: 'red',
      actions: [
        { name: 'Check-out Individual', icon: UserMinusIcon, action: () => console.log('Check-out individual'), color: 'red' },
        { name: 'Check-out Grupal', icon: UserGroupIcon, action: () => console.log('Check-out grupal'), color: 'rose' },
        { name: 'Generar Comprobante', icon: DocumentTextIcon, action: () => console.log('Generar comprobante'), color: 'indigo' },
        { name: 'Imprimir Reporte', icon: PrinterIcon, action: () => console.log('Imprimir reporte'), color: 'slate' }
      ]
    },
    {
      id: 'management',
      title: 'Gestión',
      icon: ClipboardDocumentIcon,
      color: 'blue',
      actions: [
        { name: 'Buscar Visita', icon: MagnifyingGlassIcon, action: () => console.log('Buscar visita'), color: 'blue' },
        { name: 'Editar Visita', icon: DocumentTextIcon, action: () => console.log('Editar visita'), color: 'cyan' },
        { name: 'Cancelar Visita', icon: XCircleIcon, action: () => console.log('Cancelar visita'), color: 'red' },
        { name: 'Reprogramar', icon: CalendarIcon, action: () => console.log('Reprogramar'), color: 'amber' }
      ]
    },
    {
      id: 'communication',
      title: 'Comunicación',
      icon: PhoneIcon,
      color: 'purple',
      actions: [
        { name: 'Notificar Llegada', icon: PhoneIcon, action: () => console.log('Notificar llegada'), color: 'blue' },
        { name: 'Enviar Correo', icon: EnvelopeIcon, action: () => console.log('Enviar correo'), color: 'green' },
        { name: 'Compartir Info', icon: ShareIcon, action: () => console.log('Compartir info'), color: 'purple' },
        { name: 'Alertas', icon: ExclamationTriangleIcon, action: () => console.log('Alertas'), color: 'red' }
      ]
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      {/* Venezuela Map Background */}
      <div className="absolute inset-0 opacity-15 dark:opacity-8">
        <VenezuelaMapWrapper />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] dark:bg-slate-950/70" />

      {/* Header */}
      <header className="relative z-10 border-b border-blue-200/50 bg-white/70 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Panel de Recepción
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gestión de visitas - {currentTime.toLocaleTimeString('es-VE')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(stats.alerts_count)}`}>
                <span className="flex items-center">
                  <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                  {stats.alerts_count} Alertas
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Recepcionista: {user?.name || 'Recepción'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 p-6">
        {/* Reception Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-ins Pendientes</CardTitle>
              <UserPlusIcon className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_checkins}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Por registrar</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Activas</CardTitle>
              <div className="h-4 w-4 text-green-600 bg-green-100 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active_visits}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">En curso</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-outs Pendientes</CardTitle>
              <UserMinusIcon className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending_checkouts}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Por salir</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completed_today}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Finalizadas</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duración Promedio</CardTitle>
              <ClockIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.average_duration}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Por visita</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.alerts_count}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              <CardDescription>Operaciones frecuentes de recepción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="default" size="sm" onClick={handleNewVisit} className="bg-green-600 hover:bg-green-700">
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Nueva Visita
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Check-in QR')}>
                  <QrCodeIcon className="h-4 w-4 mr-2" />
                  Check-in QR
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Check-out rápido')}>
                  <UserMinusIcon className="h-4 w-4 mr-2" />
                  Check-out
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Generar reporte')}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="text-lg">Búsqueda de Visitas</CardTitle>
              <CardDescription>Buscar visitas activas o recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, código o entidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('pendiente')}>
                    Pendientes
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('en_curso')}>
                    En Curso
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
                    Ver Todas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reception Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {receptionSections.map((section) => (
            <Card key={section.id} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <section.icon className={`h-5 w-5 text-${section.color}-600`} />
                  <CardTitle className="capitalize">{section.title}</CardTitle>
                </div>
                <CardDescription>
                  Gestión de {section.id.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {section.actions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className={`justify-start text-${action.color}-600 hover:text-${action.color}-700 hover:bg-${action.color}-50`}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visit List */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Lista de Visitas</CardTitle>
                <CardDescription>Visitas del día actual</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Mostrando {filteredVisits.length} de {visits.length} visitas
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredVisits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <QrCodeIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {visit.visitante_nombre}
                        </p>
                        {getStatusBadge(visit.estado)}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <IdentificationIcon className="w-3 h-3 mr-1" />
                          {visit.visitante_documento}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                          {visit.entidad_visitada}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          {new Date(visit.fecha_hora_ingreso).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(visit)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <InformationCircleIcon className="h-4 w-4" />
                    </Button>
                    {visit.estado === 'pendiente' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCheckIn(visit.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Check-in
                      </Button>
                    )}
                    {visit.estado === 'en_curso' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckOut(visit.id)}
                        className="border-orange-600 text-orange-600 hover:bg-orange-50"
                      >
                        <UserMinusIcon className="h-4 w-4 mr-1" />
                        Check-out
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {filteredVisits.length === 0 && (
                <div className="text-center py-8">
                  <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No se encontraron visitas</p>
                  <p className="text-sm text-gray-400 mt-1">Intenta con otro término de búsqueda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visit Details Modal */}
        {showVisitModal && selectedVisit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Detalles de la Visita</h3>
                <button
                  onClick={() => setShowVisitModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visitante</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedVisit.visitante_nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Documento</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedVisit.visitante_documento}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Entidad Visitada</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedVisit.entidad_visitada}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Motivo</label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedVisit.motivo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                  <div className="mt-1">{getStatusBadge(selectedVisit.estado)}</div>
                </div>
                {selectedVisit.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedVisit.observaciones}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVisitModal(false)}
                >
                  Cerrar
                </Button>
                {selectedVisit.estado === 'pendiente' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      handleCheckIn(selectedVisit.id)
                      setShowVisitModal(false)
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Check-in
                  </Button>
                )}
                {selectedVisit.estado === 'en_curso' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      handleCheckOut(selectedVisit.id)
                      setShowVisitModal(false)
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Check-out
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}