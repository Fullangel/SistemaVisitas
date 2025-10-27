import { useRouteError } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertRegular, ArrowClockwiseRegular } from '@fluentui/react-icons'

export default function ErrorPage() {
  const error = useRouteError() as any

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertRegular className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            ¡Algo salió mal!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Ha ocurrido un error al cargar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Detalles del error:
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                {error.message || 'Error desconocido'}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowClockwiseRegular className="h-4 w-4 mr-2" />
              Recargar página
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Ir al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}