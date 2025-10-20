"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { BuildingRegular, ClockRegular, ArrowExitRegular } from "@fluentui/react-icons"
import { useState, useEffect } from "react"

export default function DashboardSimplePage() {
  const [currentTime, setCurrentTime] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }))
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      <header className="border-b border-slate-200 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/50">
              <BuildingRegular className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">SENIAT</h1>
              <p className="text-xs text-blue-600 dark:text-blue-300">Panel de Control</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">
              <ClockRegular className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentTime}</span>
            </div>
            <ThemeToggle />
            <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600">
              <ArrowExitRegular className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Simplificado</h2>
          <p className="text-slate-600 dark:text-slate-400">Versión de prueba sin el mapa 3D</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Visitas Hoy</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">12</p>
          </Card>

          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Activas</h3>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">8</p>
          </Card>

          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Finalizadas</h3>
            <p className="text-3xl font-bold text-slate-600 dark:text-slate-400 mt-2">4</p>
          </Card>

          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pendientes</h3>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">2</p>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="border-slate-200 bg-white/80 p-6 backdrop-blur-xl dark:border-blue-900/50 dark:bg-slate-900/40">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Sistema Funcionando</h3>
            <p className="text-slate-600 dark:text-slate-400">
              El dashboard se está cargando correctamente. Si ves este mensaje, significa que el problema
              estaba relacionado con el componente 3D o WebGL.
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}