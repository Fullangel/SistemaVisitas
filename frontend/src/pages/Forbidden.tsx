import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WarningRegular, ArrowLeftRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'

export default function Forbidden() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-6">
      <Card className="w-full max-w-md p-8 border-slate-200/50 bg-white/90 backdrop-blur-xl dark:border-blue-900/30 dark:bg-slate-900/70">
        <div className="flex items-center gap-3 mb-4">
          <WarningRegular className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Acceso denegado</h1>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-6">
          No tienes permisos suficientes para acceder a esta sección.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeftRegular className="h-4 w-4 mr-2" /> Volver
          </Button>
          <Button onClick={() => navigate('/dashboard')}>Ir al Dashboard</Button>
        </div>
      </Card>
    </div>
  )
}