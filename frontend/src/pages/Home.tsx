import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { VenezuelaMapWrapper } from "@/components/venezuela-map-wrapper" // Temporalmente desactivado
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  ClockIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline"

export default function Home() {
  const features = [
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: "Registro de Visitantes",
      description: "Sistema integral para el registro y control de visitantes con validación de identidad y propósito de visita.",
      color: "from-blue-600 to-blue-800"
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Seguridad Avanzada",
      description: "Protocolos de seguridad robustos con autenticación multifactor y control de acceso por roles.",
      color: "from-green-600 to-green-800"
    },
    {
      icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
      title: "Gestión de Reportes",
      description: "Generación automática de reportes detallados con análisis estadístico y exportación de datos.",
      color: "from-purple-600 to-purple-800"
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Análisis y Métricas",
      description: "Dashboard con métricas en tiempo real y análisis de patrones de visitas institucionales.",
      color: "from-orange-600 to-orange-800"
    },
    {
      icon: <BuildingOfficeIcon className="h-8 w-8" />,
      title: "Control Departamental",
      description: "Gestión por departamentos con asignación específica de visitantes y control de flujo.",
      color: "from-indigo-600 to-indigo-800"
    },
    {
      icon: <ClockIcon className="h-8 w-8" />,
      title: "Horarios y Citas",
      description: "Sistema de programación de citas con notificaciones automáticas y control de horarios.",
      color: "from-teal-600 to-teal-800"
    }
  ]

  const stats = [
    { label: "Visitantes Registrados", value: "15,847", icon: <IdentificationIcon className="h-6 w-6" /> },
    { label: "Departamentos Activos", value: "24", icon: <BuildingOfficeIcon className="h-6 w-6" /> },
    { label: "Nivel de Seguridad", value: "99.9%", icon: <LockClosedIcon className="h-6 w-6" /> },
    { label: "Tiempo Promedio", value: "3.2 min", icon: <ClockIcon className="h-6 w-6" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Mapa de fondo con overlay mejorado - TEMPORALMENTE DESACTIVADO */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        {/* <VenezuelaMapWrapper /> Componente 3D temporalmente desactivado */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/20 dark:to-indigo-900/20" />
      </div>
      
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-100/80 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90" />
      
      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header gubernamental */}
        <header className="border-b border-blue-200/50 bg-white/80 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-2 shadow-lg">
                    <BuildingOfficeIcon className="h-full w-full text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">SENIAT</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Servicio Nacional Integrado de Administración Tributaria</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link to="/auth/login">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <LockClosedIcon className="mr-2 h-5 w-5" />
                    Acceso al Sistema
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-5xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Sistema Nacional de
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Gestión de Visitas</span>
              </h2>
              <p className="mb-8 text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Plataforma integral para el control, registro y gestión de visitantes en instituciones gubernamentales, 
                garantizando los más altos estándares de seguridad y eficiencia operativa.
              </p>
              
              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-slate-200/50 dark:bg-slate-800/70 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/login">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3"
                  >
                    <UserGroupIcon className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-950/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3"
                >
                  <ClipboardDocumentListIcon className="mr-2 h-5 w-5" />
                  Documentación
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Características del Sistema
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Solución tecnológica avanzada diseñada específicamente para las necesidades 
                de seguridad y gestión de las instituciones gubernamentales venezolanas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group bg-white/80 backdrop-blur-sm border-slate-200/50 dark:bg-slate-800/80 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer gubernamental */}
        <footer className="bg-slate-800 dark:bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-2">
                    <BuildingOfficeIcon className="h-full w-full text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">SENIAT</h4>
                    <p className="text-sm text-slate-400">Sistema de Gestión de Visitas</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Plataforma oficial del Servicio Nacional Integrado de Administración Tributaria 
                  para la gestión segura y eficiente de visitantes institucionales.
                </p>
              </div>
              
              <div>
                <h5 className="text-lg font-semibold mb-4">Enlaces Importantes</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Portal SENIAT</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Normativas</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Soporte Técnico</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-blue-400 transition-colors">Contacto</a></li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-lg font-semibold mb-4">Información de Contacto</h5>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>📧 soporte@seniat.gob.ve</p>
                  <p>📞 0800-SENIAT (736428)</p>
                  <p>🏢 Caracas, Venezuela</p>
                  <p>🕒 Lun - Vie: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-700 mt-8 pt-8 text-center">
              <p className="text-slate-400 text-sm">
                © 2024 SENIAT - Servicio Nacional Integrado de Administración Tributaria. 
                Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}