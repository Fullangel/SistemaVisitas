import React from 'react'
import { 
  PersonRegular,
  ShieldCheckmarkRegular,
  ClockRegular,
  DocumentTextRegular,
  AlertRegular,
  SettingsRegular,
  SignOutRegular,
  HomeRegular,
  ChartMultipleRegular,
  PeopleRegular,
  QrCodeRegular,
  EyeRegular,
  CheckmarkCircleRegular,
  CalendarRegular,
  DismissRegular
} from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  showTime?: boolean
  children?: React.ReactNode
}

export function DashboardHeader({ title, subtitle, showTime = true, children }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const { user } = useAuthStore()

  React.useEffect(() => {
    if (showTime) {
      const timer = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [showTime])

  return (
    <header className="relative z-10 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl dark:border-gray-700/50 dark:bg-slate-900/30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subtitle} {showTime && `- ${currentTime.toLocaleTimeString('es-VE')}`}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {children}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {user ? `${user.first_name} ${user.last_name}` : 'Usuario'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

interface DashboardStatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange' | 'indigo'
  subtitle?: string
  trend?: { value: number; direction: 'up' | 'down' }
}

export function DashboardStatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  subtitle,
  trend
}: DashboardStatCardProps) {
  const colorClasses = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    indigo: 'text-indigo-600 bg-indigo-100'
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600'
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClasses[color].split(' ')[0]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
        {trend && (
          <div className={`flex items-center text-xs ${trendColors[trend.direction]} mt-1`}>
            <span>{trend.direction === 'up' ? '↑' : '↓'} {trend.value}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardActionCardProps {
  title: string
  description: string
  actions: Array<{
    name: string
    icon: React.ComponentType<{ className?: string }>
    action: () => void
    color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange' | 'indigo' | 'gray'
    variant?: 'default' | 'outline'
  }>
  icon: React.ComponentType<{ className?: string }>
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange' | 'indigo'
}

export function DashboardActionCard({ 
  title, 
  description, 
  actions, 
  icon: Icon, 
  color = 'blue' 
}: DashboardActionCardProps) {
  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    gray: 'text-gray-600'
  }

  const buttonVariants = {
    green: 'bg-green-600 hover:bg-green-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    yellow: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    orange: 'bg-orange-600 hover:bg-orange-700 text-white',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white'
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${colorClasses[color]}`} aria-hidden="true" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.action}
              className={action.variant === 'default' && action.color ? buttonVariants[action.color] : ''}
              aria-label={action.name}
            >
              <action.icon className="h-4 w-4 mr-2" aria-hidden="true" />
              {action.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface VisitStatusBadgeProps {
  status: 'pendiente' | 'en_curso' | 'finalizada' | 'cancelada' | 'aprobada' | 'rechazada'
}

export function VisitStatusBadge({ status }: VisitStatusBadgeProps) {
  const statusConfig = {
    pendiente: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    en_curso: { label: 'En Curso', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    finalizada: { label: 'Finalizada', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
    cancelada: { label: 'Cancelada', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    aprobada: { label: 'Aprobada', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    rechazada: { label: 'Rechazada', className: 'bg-red-100 text-red-800 hover:bg-red-100' }
  }

  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  )
}

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Venezuela Map Background */}
      <div className="absolute inset-0 opacity-15 dark:opacity-8">
        {/* Este componente se importaría del proyecto principal */}
        {/* <VenezuelaMapWrapper /> */}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] dark:bg-slate-950/70" />

      {/* Header */}
      <DashboardHeader title={title} subtitle={subtitle} />

      {/* Main Content */}
      <main className="relative z-20 p-6">
        {children}
      </main>
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function DashboardModal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full mx-4 ${sizeClasses[size]}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <DismissRegular className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  variant?: 'default' | 'outline'
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange' | 'indigo'
}

export function QuickActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'outline',
  color = 'blue'
}: QuickActionButtonProps) {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    yellow: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    orange: 'bg-orange-600 hover:bg-orange-700 text-white',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white'
  }

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={variant === 'default' ? colorClasses[color] : ''}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}

export default {
  DashboardHeader,
  DashboardStatCard,
  DashboardActionCard,
  VisitStatusBadge,
  DashboardLayout,
  DashboardModal,
  QuickActionButton
}