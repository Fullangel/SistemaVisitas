import { useState } from "react"
import { User, Settings, Users, FileText, MapPin, BarChart3, Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VenezuelaMapWrapper } from "@/components/venezuela-map-wrapper-debug"

// Definir tipos de roles
const ROLES = {
  admin: {
    name: "Administrador",
    sections: ["usuarios", "visitas", "reportes", "configuracion"],
    actions: ["crear", "editar", "eliminar", "ver"]
  },
  supervisor: {
    name: "Supervisor",
    sections: ["visitas", "reportes"],
    actions: ["crear", "editar", "ver"]
  },
  recepcion: {
    name: "Recepción",
    sections: ["visitas"],
    actions: ["crear", "ver"]
  }
}

export default function Dashboard() {
  const [currentRole, setCurrentRole] = useState<keyof typeof ROLES>("admin")
  const [searchTerm, setSearchTerm] = useState("")

  const currentUserRole = ROLES[currentRole]

  const stats = [
    { title: "Visitas Hoy", value: "24", icon: Users, color: "text-blue-600" },
    { title: "Visitas Activas", value: "8", icon: MapPin, color: "text-green-600" },
    { title: "Reportes", value: "12", icon: FileText, color: "text-purple-600" },
    { title: "Usuarios", value: "156", icon: User, color: "text-orange-600" }
  ]

  const quickActions = [
    { title: "Nueva Visita", icon: Plus, action: () => console.log("Nueva visita") },
    { title: "Buscar Visita", icon: Search, action: () => console.log("Buscar visita") },
    { title: "Generar Reporte", icon: BarChart3, action: () => console.log("Generar reporte") },
    { title: "Configuración", icon: Settings, action: () => console.log("Configuración") }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Fondo con el mapa de Venezuela */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
          <VenezuelaMapWrapper />
        </div>
      </div>
      
      {/* Overlay semitransparente */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 z-10"></div>
      
      {/* Contenido principal */}
      <div className="relative z-20 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard de Visitas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Bienvenido, {currentUserRole.name}
              </p>
            </div>
            <div className="flex gap-2">
              {Object.entries(ROLES).map(([role, config]) => (
                <Button
                  key={role}
                  variant={currentRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentRole(role as keyof typeof ROLES)}
                >
                  {config.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar visitas, visitantes, departamentos..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70"
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.title}</span>
            </Button>
          ))}
        </div>

        {/* Secciones según rol */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentUserRole.sections.map((section) => (
            <Card key={section} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="capitalize">{section}</CardTitle>
                <CardDescription>
                  Gestión de {section}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Acciones disponibles:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentUserRole.actions.map((action) => (
                      <Button
                        key={action}
                        variant="outline"
                        size="sm"
                        className="capitalize"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}