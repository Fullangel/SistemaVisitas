import { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertRegular, ArrowClockwiseRegular } from '@fluentui/react-icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

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
                Ha ocurrido un error inesperado en la aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Detalles del error:
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                        Ver más detalles
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowClockwiseRegular className="h-4 w-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Recargar página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary