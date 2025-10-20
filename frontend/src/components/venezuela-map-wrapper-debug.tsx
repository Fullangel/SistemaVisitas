"use client"

import { lazy, Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { VenezuelaMapSimple } from "./venezuela-map-simple"

// Cargar el componente 3D de forma lazy para manejar errores mejor
const VenezuelaMap3D = lazy(() => 
  import("./venezuela-map-3d").then(module => ({
    default: module.VenezuelaMap3D
  })).catch((error) => {
    console.warn("Error al cargar componente 3D complejo:", error)
    return import("./venezuela-map-optimized").then(module => ({
      default: module.VenezuelaMapOptimized
    })).catch((error2) => {
      console.warn("Error al cargar componente 3D optimizado:", error2)
      return { default: () => <VenezuelaMapSimple /> }
    })
  })
)

// Componente de error mejorado con logging
function ErrorFallback({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) {
  console.error("ErrorBoundary capturado en VenezuelaMapWrapper:", error)
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-950 p-4">
      <div className="text-red-600 dark:text-red-400 text-sm mb-2">
        Error en mapa 3D: {error?.message || "Error desconocido"}
      </div>
      <VenezuelaMapSimple />
      <button 
        onClick={resetErrorBoundary}
        className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>
  )
}

// Componente de carga mejorado
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
}

// Componente principal con logging detallado
export function VenezuelaMapWrapper() {
  const [hasError, setHasError] = useState(false)
  const [errorInfo, setErrorInfo] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    console.log("VenezuelaMapWrapper: Montando componente")
    setIsClient(true)
    
    // Verificar soporte WebGL
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        console.warn("VenezuelaMapWrapper: WebGL no soportado")
      } else {
        console.log("VenezuelaMapWrapper: WebGL soportado")
      }
    } catch (error) {
      console.error("VenezuelaMapWrapper: Error verificando WebGL:", error)
    }
  }, [])

  const handleError = (error: Error, errorInfo: any) => {
    console.error("VenezuelaMapWrapper: Error capturado:", error, errorInfo)
    setHasError(true)
    setErrorInfo({ error, errorInfo })
  }

  if (!isClient) {
    console.log("VenezuelaMapWrapper: Renderizando en servidor")
    return <VenezuelaMapSimple />
  }

  if (hasError) {
    console.log("VenezuelaMapWrapper: Mostrando fallback por error")
    return (
      <div className="w-full h-full">
        <VenezuelaMapSimple />
        {errorInfo && (
          <div className="absolute bottom-2 left-2 text-xs text-red-600 bg-red-100 p-2 rounded">
            Error: {errorInfo.error?.message}
          </div>
        )}
      </div>
    )
  }

  console.log("VenezuelaMapWrapper: Renderizando componente 3D")
  
  return (
    <ErrorBoundary 
      fallbackRender={ErrorFallback}
      onError={handleError}
      onReset={() => {
        console.log("VenezuelaMapWrapper: Reset error boundary")
        setHasError(false)
        setErrorInfo(null)
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <VenezuelaMap3D />
      </Suspense>
    </ErrorBoundary>
  )
}