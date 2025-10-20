"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Sparkles } from "@react-three/drei"
import { Suspense, useState, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { VenezuelaMapSimple } from "./venezuela-map-simple"

// Componente 3D optimizado y simplificado
function OptimizedVenezuela3D() {
  const [performanceMode, setPerformanceMode] = useState(false)

  useEffect(() => {
    // Detectar si es un dispositivo de bajo rendimiento
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setPerformanceMode(true)
      return
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      if (renderer.toLowerCase().includes('intel')) {
        setPerformanceMode(true)
      }
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={performanceMode ? 1 : window.devicePixelRatio}
      gl={{ antialias: !performanceMode, alpha: true }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Silueta de Venezuela como un plano */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[4, 5]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.6}
            side={2}
          />
        </mesh>
        
        {/* Puntos para ciudades principales */}
        <mesh position={[-0.5, 0.8, 0.1]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        
        <mesh position={[-0.8, 0.2, 0.1]}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        
        <mesh position={[0.3, -0.4, 0.1]}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        
        {/* Efectos visuales solo en modo de alto rendimiento */}
        {!performanceMode && (
          <>
            <Sparkles 
              count={50} 
              scale={[8, 8, 8]} 
              size={2} 
              speed={0.5}
              opacity={0.6}
            />
          </>
        )}
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          autoRotate={!performanceMode}
          autoRotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  )
}

// Componente de manejo de errores
function ErrorFallback() {
  return <VenezuelaMapSimple />
}

// Componente principal exportable
export function VenezuelaMapOptimized() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="w-full h-full">
        <OptimizedVenezuela3D />
      </div>
    </ErrorBoundary>
  )
}