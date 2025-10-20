"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VenezuelaMapWrapper } from "@/components/venezuela-map-wrapper"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  LockClosedRegular, 
  PersonRegular, 
  BuildingRegular, 
  ShieldCheckmarkRegular,
  EyeRegular,
  EyeOffRegular,
  InfoRegular,
  WarningRegular
} from "@fluentui/react-icons"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()
  
  // Estados para mejorar la UX
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState<{email?: string, password?: string}>({})

  // Efecto para manejar el bloqueo temporal
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false)
            setLoginAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isBlocked, blockTimeRemaining])

  // Validación de formulario
  const validateForm = () => {
    const errors: {email?: string, password?: string} = {}
    
    if (!formData.email) {
      errors.email = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de correo electrónico inválido'
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar errores de validación cuando el usuario empiece a escribir
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) return
    
    if (!validateForm()) return
    
    // Usar los datos del estado en lugar del FormData
    const result = await login({ login: formData.email, password: formData.password })
    
    if (result.success) {
      setLoginAttempts(0)
      navigate("/dashboard")
    } else {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      
      // Bloquear después de 3 intentos fallidos
      if (newAttempts >= 3) {
        setIsBlocked(true)
        setBlockTimeRemaining(300) // 5 minutos
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      {/* 3D Venezuela Map Background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-15">
        <VenezuelaMapWrapper />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-slate-50/50 to-slate-100/70 dark:from-slate-950/70 dark:via-slate-950/50 dark:to-slate-950/70" />

      {/* Theme Toggle */}
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      {/* Security Badge */}
      <div className="absolute left-6 top-6 z-20">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/90 px-3 py-2 backdrop-blur-sm dark:border-emerald-500/30 dark:bg-emerald-950/40">
          <ShieldCheckmarkRegular className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Conexión Segura SSL</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg border-slate-200/50 bg-white/90 p-8 backdrop-blur-xl transition-all duration-500 hover:border-blue-300/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-blue-900/30 dark:bg-slate-900/70 dark:hover:border-blue-500/30">
          {/* Logo and Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/40">
              <BuildingRegular className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">SENIAT</h1>
            <p className="text-blue-600 dark:text-blue-300 font-medium">Sistema de Gestión de Visitas</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Servicio Nacional Integrado de Administración Tributaria</p>
          </div>

          {/* Security Status */}
          <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-300/50 bg-emerald-50/50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-950/20">
            <ShieldCheckmarkRegular className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Acceso Autorizado Requerido</span>
          </div>

          {/* Error Messages */}
          {(error || loginAttempts > 0) && !isBlocked && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-950/30">
              <WarningRegular className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="text-sm">
                <p className="font-medium text-red-700 dark:text-red-300">
                  {error || 'Credenciales incorrectas'}
                </p>
                {loginAttempts > 0 && (
                  <p className="text-red-600 dark:text-red-400">
                    Intentos fallidos: {loginAttempts}/3
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Blocked Message */}
          {isBlocked && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-400 bg-red-100 px-4 py-3 dark:border-red-500/40 dark:bg-red-950/40">
              <WarningRegular className="h-5 w-5 text-red-700 dark:text-red-400" />
              <div className="text-sm">
                <p className="font-medium text-red-800 dark:text-red-300">
                  Acceso temporalmente bloqueado
                </p>
                <p className="text-red-700 dark:text-red-400">
                  Tiempo restante: {Math.floor(blockTimeRemaining / 60)}:{(blockTimeRemaining % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-blue-100 font-medium">
                Correo Electrónico Institucional
              </Label>
              <div className="relative">
                <PersonRegular className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600 dark:text-blue-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario@seniat.gob.ve"
                  className={`border-slate-300 bg-white/80 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-blue-900/50 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-blue-300/50 ${
                    validationErrors.email ? 'border-red-400 focus:border-red-500' : ''
                  }`}
                  disabled={isBlocked}
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <InfoRegular className="h-4 w-4" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-blue-100 font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <LockClosedRegular className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600 dark:text-blue-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className={`border-slate-300 bg-white/80 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-blue-900/50 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-blue-300/50 ${
                    validationErrors.password ? 'border-red-400 focus:border-red-500' : ''
                  }`}
                  disabled={isBlocked}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  disabled={isBlocked}
                >
                  {showPassword ? <EyeOffRegular className="h-5 w-5" /> : <EyeRegular className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <InfoRegular className="h-4 w-4" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || isBlocked}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 py-6 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verificando credenciales...
                </span>
              ) : isBlocked ? (
                <span className="flex items-center justify-center gap-2">
                  <LockClosedRegular className="h-5 w-5" />
                  Acceso Bloqueado
                </span>
              ) : (
                <>
                  <span className="relative z-10">Acceder al Sistema</span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 space-y-4 text-center text-sm">
            <Link
              to="#"
              className="block text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-300 dark:hover:text-blue-200"
            >
              ¿Olvidó su contraseña?
            </Link>
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 dark:border-amber-500/30 dark:bg-amber-950/30">
              <p className="text-amber-700 dark:text-amber-300 text-xs">
                <InfoRegular className="inline h-4 w-4 mr-1" />
                Sistema de acceso restringido - Solo personal autorizado
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-slate-200/50 bg-white/60 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs text-slate-600 dark:text-blue-200/60">
            © 2025 Servicio Nacional Integrado de Administración Tributaria - Todos los derechos reservados
          </p>
          <p className="text-xs text-slate-500 dark:text-blue-200/40 mt-1">
            Sistema protegido por medidas de seguridad avanzadas
          </p>
        </div>
      </footer>
    </div>
  )
}
