import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Building2,
    UserCircle,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Sun,
    Moon,
    Bell,
    Calendar,
    BarChart3,
    Shield,
    UserPlus,
    ClipboardList,
    MapPin,
    Briefcase,
    Map,
    Activity,
    Lock,
    Bot
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SidebarItemConfig {
    id: string
    label: string
    icon: any
    path?: string
    badge?: number
    children?: {
        label: string
        path: string
        icon?: any
    }[]
    roles?: string[]
}

const sidebarConfig: SidebarItemConfig[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard"
    },
    {
        id: "visits",
        label: "Visitas",
        icon: Users,
        badge: 3,
        children: [
            { label: "Nueva Visita", path: "/visitas/nueva", icon: UserPlus },
            { label: "Visitas Activas", path: "/visitas/activas", icon: Users },
            { label: "Aprobar Visitas", path: "/visitas/aprobar", icon: ClipboardList },
            { label: "Historial", path: "/visitas", icon: Calendar },
            { label: "Visitantes Bloqueados", path: "/visitas/bloqueados", icon: Shield },
            { label: "Buscar Visitante", path: "/visitas/buscar", icon: Users }
        ]
    },
    {
        id: "organization",
        label: "Organización",
        icon: Briefcase,
        roles: ["admin", "supervisor"],
        children: [
            { label: "Departamentos (Gerencias)", path: "/organizacion/departamentos", icon: Briefcase },
            { label: "Cargos", path: "/organizacion/cargos", icon: UserCircle }
        ]
    },
    {
        id: "locations",
        label: "Ubicaciones",
        icon: MapPin,
        roles: ["admin", "supervisor"],
        children: [
            { label: "Regiones", path: "/ubicaciones/regiones", icon: Map },
            { label: "Dependencias", path: "/ubicaciones/dependencias", icon: Building2 },
            { label: "Sedes", path: "/ubicaciones/sedes", icon: Building2 }
        ]
    },
    {
        id: "employees",
        label: "Empleados",
        icon: UserCircle,
        path: "/empleados",
        roles: ["admin", "supervisor"]
    },
    {
        id: "audit",
        label: "Auditoría",
        icon: Shield,
        roles: ["admin"],
        children: [
            { label: "Registro de Actividades", path: "/auditoria/actividades", icon: Activity },
            { label: "Historial de Visitas", path: "/auditoria/visitas", icon: ClipboardList },
            { label: "Cambios en Configuración", path: "/auditoria/configuracion", icon: Settings },
            { label: "Accesos al Sistema", path: "/auditoria/accesos", icon: Lock },
            { label: "Reportes de Seguridad", path: "/auditoria/seguridad", icon: Shield }
        ]
    },
    {
        id: "reports",
        label: "Reportes",
        icon: BarChart3,
        children: [
            { label: "Reporte General", path: "/reportes", icon: FileText },
            { label: "Por Sede", path: "/reportes/sede", icon: Building2 },
            { label: "Por Período", path: "/reportes/periodo", icon: Calendar },
            { label: "Estadísticas", path: "/reportes/stats", icon: BarChart3 }
        ]
    },
    {
        id: "admin",
        label: "Administración",
        icon: Settings,
        roles: ["admin", "supervisor"],
        children: [
            { label: "Monitoreo del Sistema", path: "/admin/monitoring", icon: Activity },
            { label: "Gestión de Bots", path: "/admin/bots", icon: Bot },
            { label: "Permisos", path: "/admin/permissions", icon: Shield },
            { label: "Configuración", path: "/admin/config", icon: Settings },
            { label: "Config. Avanzada", path: "/admin/advanced-config", icon: Settings }
        ]
    }
]

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuthStore()
    const { theme, toggleTheme, actualTheme } = useTheme()

    const userRole = user?.role?.name?.toLowerCase() || "employee"

    const filteredItems = sidebarConfig.filter(item => {
        if (!item.roles) return true
        return item.roles.includes(userRole)
    })

    const handleItemClick = (item: SidebarItemConfig) => {
        if (item.children) {
            setMegaMenuOpen(megaMenuOpen === item.id ? null : item.id)
        } else if (item.path) {
            navigate(item.path)
            setMegaMenuOpen(null)
        }
    }

    const handleChildClick = (path: string) => {
        navigate(path)
        setMegaMenuOpen(null)
    }

    const isActive = (path?: string) => {
        if (!path) return false
        // Exact match for paths
        if (location.pathname === path) return true
        // For parent paths, only match if it's a child route
        if (path !== '/visitas' && path !== '/reportes' && path !== '/admin') {
            return location.pathname.startsWith(path + "/")
        }
        // For base paths like /visitas, only match exactly
        return false
    }

    return (
        <>
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 72 : 280 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                    "fixed left-0 top-0 h-screen z-50",
                    "bg-white/70 dark:bg-gray-900/70",
                    "backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50",
                    "shadow-xl",
                    className
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                        {!isCollapsed ? (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        Sistema Visitas
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        Nacional
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center"
                            >
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                        {filteredItems.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.path)
                            const hasChildren = item.children && item.children.length > 0

                            return (
                                <div key={item.id} className="relative">
                                    <motion.button
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleItemClick(item)}
                                        onMouseEnter={() => setHoveredItem(item.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                                            "transition-all duration-200",
                                            "group relative",
                                            active
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        )}
                                    >
                                        {/* Active Indicator */}
                                        {active && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "mx-auto")} />

                                        {!isCollapsed && (
                                            <>
                                                <span className="flex-1 text-left text-sm font-medium truncate">
                                                    {item.label}
                                                </span>

                                                {item.badge && item.badge > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-red-500 text-white text-xs px-1.5 min-w-[20px] h-5"
                                                    >
                                                        {item.badge}
                                                    </Badge>
                                                )}

                                                {hasChildren && (
                                                    <ChevronRight
                                                        className={cn(
                                                            "h-4 w-4 transition-transform",
                                                            megaMenuOpen === item.id && "rotate-90"
                                                        )}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </motion.button>

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && hoveredItem === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="absolute left-full ml-2 top-0 z-50 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-xl whitespace-nowrap"
                                        >
                                            {item.label}
                                            {item.badge && item.badge > 0 && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-red-500 rounded text-xs">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 space-y-1">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className={cn(
                                "w-full justify-start gap-3",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            {actualTheme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                            {!isCollapsed && (
                                <span className="text-sm">
                                    {actualTheme === "dark" ? "Modo Claro" : "Modo Oscuro"}
                                </span>
                            )}
                        </Button>

                        {/* User Profile */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/profile")}
                            className={cn(
                                "w-full justify-start gap-3",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            <UserCircle className="h-5 w-5" />
                            {!isCollapsed && (
                                <span className="text-sm truncate">
                                    {user?.first_name || user?.username || "Usuario"}
                                </span>
                            )}
                        </Button>

                        {/* Logout */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className={cn(
                                "w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            <LogOut className="h-5 w-5" />
                            {!isCollapsed && <span className="text-sm">Cerrar Sesión</span>}
                        </Button>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-50"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-3 w-3" />
                        ) : (
                            <ChevronLeft className="h-3 w-3" />
                        )}
                    </button>
                </div>
            </motion.aside>

            {/* Mega Menu */}
            <AnimatePresence>
                {megaMenuOpen && !isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-[280px] top-0 h-screen w-80 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
                    >
                        {(() => {
                            const item = filteredItems.find(i => i.id === megaMenuOpen)
                            if (!item?.children) return null

                            return (
                                <div className="p-6 h-full overflow-y-auto">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        {item.label}
                                    </h3>
                                    <div className="space-y-2">
                                        {item.children.map((child, idx) => {
                                            const ChildIcon = child.icon
                                            return (
                                                <motion.button
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => handleChildClick(child.path)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left",
                                                        "transition-all duration-200",
                                                        isActive(child.path)
                                                            ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                                                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                    )}
                                                >
                                                    {ChildIcon && <ChildIcon className="h-5 w-5" />}
                                                    <span className="text-sm font-medium">{child.label}</span>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for mobile */}
            {megaMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => setMegaMenuOpen(null)}
                />
            )}
        </>
    )
}
