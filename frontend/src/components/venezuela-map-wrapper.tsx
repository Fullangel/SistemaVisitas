"use client"

import React, { lazy, Suspense, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { VenezuelaMapSimple } from "./venezuela-map-simple"
// import { VenezuelaMapLoader, VenezuelaMapError } from "./venezuela-map-loader" // TEMPORALMENTE DESACTIVADO

// Cargar el componente 3D de forma lazy para manejar errores mejor - TEMPORALMENTE DESACTIVADO
// const VenezuelaMap3D = lazy(() => 
//   import("./venezuela-map-3d-optimized").then(module => ({
//     default: module.VenezuelaMap3DOptimized
//   })).catch(() => {
//     console.log("Error al cargar componente 3D optimizado, usando versión alternativa")
//     return import("./venezuela-map-3d").then(module => ({
//       default: module.VenezuelaMap3D
//     }))
//   })
// )

// Componente fallback SVG simple para cuando Three.js no cargue
function VenezuelaMapFallback() {
  return <VenezuelaMapSimple />
}

// Componentes temporales mientras se restaura el loader
function VenezuelaMapLoader({ onLoadComplete }: { onLoadComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadComplete()
    }, 1000)
    return () => clearTimeout(timer)
  }, [onLoadComplete])
  
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

function VenezuelaMapError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-4">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">Error al cargar el mapa</h3>
      <p className="text-sm text-gray-600 mb-4">El mapa 3D no está disponible temporalmente</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Reintentar
      </button>
    </div>
  )
}

// Componente wrapper que maneja errores y carga - VERSION SIMPLIFICADA TEMPORAL
export function VenezuelaMapWrapper({ className }: { className?: string }) {
  // Temporalmente desactivada toda la lógica de carga y error del componente 3D
  // const [hasError, setHasError] = useState(false)
  // const [isClient, setIsClient] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  // // Si no estamos en el cliente, no renderizar nada para evitar hidratación
  // if (!isClient) {
  //   return <div className={cn("w-full h-full", className)} />
  // }

  // // Si hubo un error, usar el fallback con mensaje de error
  // if (hasError) {
  //   return (
  //     <div className={cn("w-full h-full", className)}>
  //       <VenezuelaMapError 
  //         onRetry={() => {
  //           setHasError(false)
  //           setIsLoading(true)
  //         }}
  //       />
  //     </div>
  //   )
  // }

  // // Si está cargando, mostrar el loader
  // if (isLoading) {
  //   return (
  //     <div className={cn("w-full h-full", className)}>
  //       <VenezuelaMapLoader 
  //         onLoadComplete={() => setIsLoading(false)}
  //       />
  //     </div>
  //   )
  // }

  return (
    <div className={cn("w-full h-full", className)}>
      {/* Componente 3D temporalmente desactivado - usando versión simple */}
      <VenezuelaMapFallback />
      {/* 
      <Suspense fallback={<VenezuelaMapFallback />}>
        <ErrorBoundary onError={() => setHasError(true)}>
          <VenezuelaMap3D />
        </ErrorBoundary>
      </Suspense>
      */}
    </div>
  )
}

// Componente ErrorBoundary personalizado
class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  onError: () => void
}> {
  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.props.children
  }
}
