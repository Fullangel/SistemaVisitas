"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { 
  OrbitControls, 
  Environment, 
  Float, 
  Sparkles,
  Sphere
} from "@react-three/drei"
import { useRef, useMemo, useState, useEffect, Suspense, useCallback } from "react"
import * as THREE from "three"
import { useTheme } from "./theme-provider"

// Shader personalizado para efectos de brillo
const glowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glowFragmentShader = `
  uniform float c;
  uniform float p;
  uniform vec3 glowColor;
  uniform float time;
  
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    float intensity = pow(c - dot(vNormal, vPositionNormal), p);
    intensity += sin(time * 2.0) * 0.1;
    gl_FragColor = vec4(glowColor, intensity);
  }
`

// Sistema de partículas optimizado con LOD
function OptimizedParticles({ theme }: { theme: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [particleCount, setParticleCount] = useState(75) // Reducido por defecto
  const { camera } = useThree()

  // LOD dinámico para partículas basado en distancia de cámara
  const updateLOD = useCallback(() => {
    if (!camera) return
    
    const distance = camera.position.length()
    let newCount = 75
    
    if (distance < 12) {
      newCount = 150 // Cerca: máximo detalle
    } else if (distance < 18) {
      newCount = 100 // Medio: detalle moderado
    } else {
      newCount = 50 // Lejos: mínimo detalle
    }
    
    if (newCount !== particleCount) {
      setParticleCount(newCount)
    }
  }, [camera, particleCount])

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5

      const color = new THREE.Color(theme === "dark" ? "#60a5fa" : "#3b82f6")
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 0.08 + 0.015 // Tamaños más pequeños
    }

    return { positions, colors, sizes }
  }, [theme, particleCount])

  useFrame((state) => {
    // Actualizar LOD cada 30 frames para evitar cálculos excesivos
    if (state.frame % 30 === 0) {
      updateLOD()
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0008 // Rotación más lenta
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08
    }

    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        vertexColors
        uniforms={{
          time: { value: 0 },
          pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        }}
        vertexShader={`
          attribute float size;
          uniform float time;
          uniform float pixelRatio;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * pixelRatio * (250.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.2);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            gl_FragColor = vec4(vColor, alpha * 0.6);
          }
        `}
      />
    </points>
  )
}

// Componente de ciudades con LOD
function OptimizedCities({ theme }: { theme: string }) {
  const { camera } = useThree()
  const [showCities, setShowCities] = useState(true)

  const cities = useMemo(() => [
    { name: "Caracas", position: [0, 2, 0.5] },
    { name: "Maracaibo", position: [-3, 3, 0.5] },
    { name: "Valencia", position: [-1, 1, 0.5] },
    { name: "Barquisimeto", position: [-2, 2, 0.5] },
  ], [])

  useFrame(() => {
    if (!camera) return
    
    const distance = camera.position.length()
    const shouldShow = distance < 20 // Solo mostrar ciudades cuando esté cerca
    
    if (shouldShow !== showCities) {
      setShowCities(shouldShow)
    }
  })

  if (!showCities) return null

  return (
    <group>
      {cities.map((city) => (
        <Float key={city.name} speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
          <group position={city.position as [number, number, number]}>
            <Sphere args={[0.08, 12, 12]}> {/* Geometría simplificada */}
              <meshStandardMaterial
                color={theme === "dark" ? "#fbbf24" : "#f59e0b"}
                emissive={theme === "dark" ? "#f59e0b" : "#d97706"}
                emissiveIntensity={0.3}
              />
            </Sphere>
          </group>
        </Float>
      ))}
    </group>
  )
}

// Componente de partículas mejoradas
function EnhancedParticles({ theme }: { theme: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const particleCount = 150
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5

      const color = new THREE.Color(theme === "dark" ? "#60a5fa" : "#3b82f6")
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 0.1 + 0.02
    }

    return { positions, colors, sizes }
  }, [theme])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }

    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        vertexColors
        uniforms={{
          time: { value: 0 },
          pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        }}
        vertexShader={`
          attribute float size;
          uniform float time;
          uniform float pixelRatio;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.3);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            gl_FragColor = vec4(vColor, alpha * 0.8);
          }
        `}
      />
    </points>
  )
}












// Componente de ciudades simplificado
function CulledCities({ theme }: { theme: string }) {
  const { camera } = useThree()
  const [showCities, setShowCities] = useState(true)

  const cities = useMemo(() => [
    { name: "Caracas", position: [0, 2, 0.5] },
    { name: "Maracaibo", position: [-3, 3, 0.5] },
    { name: "Valencia", position: [-1, 1, 0.5] },
    { name: "Barquisimeto", position: [-2, 2, 0.5] },
  ], [])

  useFrame(() => {
    if (!camera) return
    
    const distance = camera.position.length()
    const shouldShow = distance < 22
    
    if (shouldShow !== showCities) {
      setShowCities(shouldShow)
    }
  })

  if (!showCities) return null

  return (
    <group>
      {cities.map((city) => (
        <Float key={city.name} speed={1.2} rotationIntensity={0.03} floatIntensity={0.1}>
          <group position={city.position as [number, number, number]}>
            <Sphere args={[0.06, 10, 10]}>
              <meshStandardMaterial
                color={theme === "dark" ? "#fbbf24" : "#f59e0b"}
                emissive={theme === "dark" ? "#f59e0b" : "#d97706"}
                emissiveIntensity={0.25}
              />
            </Sphere>
          </group>
        </Float>
      ))}
    </group>
  )
}

// Componente de ciudades principales

const venezuelaCoordinates = [
  [-71.5, 12.0],
  [-71.0, 11.8],
  [-70.5, 11.5],
  [-70.0, 11.3],
  [-69.5, 11.0],
  [-69.0, 10.8],
  [-68.5, 10.5],
  [-68.0, 10.3],
  [-67.5, 10.2],
  [-67.0, 10.0],
  [-66.5, 9.8],
  [-66.0, 9.5],
  [-65.5, 9.3],
  [-65.0, 9.0],
  [-64.5, 8.8],
  [-64.0, 8.5],
  [-63.5, 8.3],
  [-63.0, 8.0],
  [-62.5, 7.8],
  [-62.0, 7.5],
  [-61.5, 7.3],
  [-61.0, 7.0],
  [-60.5, 6.8],
  [-60.0, 6.5],
  [-60.0, 7.0],
  [-60.5, 7.5],
  [-61.0, 8.0],
  [-61.5, 8.5],
  [-62.0, 9.0],
  [-62.5, 9.5],
  [-63.0, 10.0],
  [-63.5, 10.5],
  [-64.0, 11.0],
  [-64.5, 11.5],
  [-65.0, 11.8],
  [-65.5, 12.0],
  [-66.0, 12.2],
  [-66.5, 12.3],
  [-67.0, 12.4],
  [-67.5, 12.5],
  [-68.0, 12.5],
  [-68.5, 12.4],
  [-69.0, 12.3],
  [-69.5, 12.2],
  [-70.0, 12.1],
  [-70.5, 12.0],
  [-71.0, 12.0],
  [-71.5, 12.0],
]

// Componente optimizado del mapa con LOD
function OptimizedVenezuelaShape() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const [hovered, setHovered] = useState(false)
  const [detailLevel, setDetailLevel] = useState(2) // 0: bajo, 1: medio, 2: alto
  const { theme } = useTheme()
  const { camera } = useThree()

  // Geometrías con diferentes niveles de detalle
  const geometries = useMemo(() => {
    const shape = new THREE.Shape()
    venezuelaCoordinates.forEach((coord, i) => {
      const x = (coord[0] + 66) * 2
      const y = (coord[1] - 9) * 2
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    })

    return {
      high: {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      },
      medium: {
        depth: 0.25,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      },
      low: {
        depth: 0.2,
        bevelEnabled: false,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.01,
        bevelThickness: 0.01,
      }
    }
  }, [])

  // LOD dinámico basado en distancia de cámara
  const updateLOD = useCallback(() => {
    if (!camera) return
    
    const distance = camera.position.length()
    let newLevel = 2
    
    if (distance > 20) {
      newLevel = 0 // Lejos: bajo detalle
    } else if (distance > 15) {
      newLevel = 1 // Medio: detalle moderado
    } else {
      newLevel = 2 // Cerca: alto detalle
    }
    
    if (newLevel !== detailLevel) {
      setDetailLevel(newLevel)
    }
  }, [camera, detailLevel])

  const currentGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    venezuelaCoordinates.forEach((coord, i) => {
      const x = (coord[0] + 66) * 2
      const y = (coord[1] - 9) * 2
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    })

    const settings = detailLevel === 2 ? geometries.high : 
                    detailLevel === 1 ? geometries.medium : 
                    geometries.low

    return { shape, settings }
  }, [detailLevel, geometries])

  // Animación optimizada
  useFrame((state) => {
    // Actualizar LOD cada 60 frames
    if (state.frame % 60 === 0) {
      updateLOD()
    }

    if (meshRef.current) {
      // Animaciones más sutiles para mejor rendimiento
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.015
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
    }

    if (glowRef.current && materialRef.current && detailLevel > 0) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03)
    }
  })

  const mapColor = theme === "dark" ? "#1e40af" : "#3b82f6"
  const glowColor = theme === "dark" ? "#60a5fa" : "#1d4ed8"

  return (
    <group>
      {/* Mapa principal optimizado */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <extrudeGeometry args={[currentGeometry.shape, currentGeometry.settings]} />
        <meshStandardMaterial
          color={mapColor}
          metalness={detailLevel > 1 ? 0.3 : 0.1}
          roughness={detailLevel > 1 ? 0.2 : 0.4}
          emissive={hovered ? glowColor : "#000000"}
          emissiveIntensity={hovered ? 0.15 : 0}
          envMapIntensity={detailLevel > 0 ? 0.8 : 0.4}
        />
      </mesh>

      {/* Efecto de brillo solo en detalle alto y medio */}
      {detailLevel > 0 && (
        <mesh ref={glowRef} scale={1.08} position={[0, 0, 0]}>
          <extrudeGeometry args={[currentGeometry.shape, { ...currentGeometry.settings, depth: 0.08 }]} />
          <shaderMaterial
            ref={materialRef}
            transparent
            side={THREE.BackSide}
            uniforms={{
              c: { value: 1.0 },
              p: { value: detailLevel === 2 ? 3.0 : 2.5 },
              glowColor: { value: new THREE.Color(glowColor) },
              time: { value: 0 }
            }}
            vertexShader={glowVertexShader}
            fragmentShader={glowFragmentShader}
          />
        </mesh>
      )}

      {/* Outline simplificado */}
      {detailLevel > 0 && (
        <lineLoop position={[0, 0, 0.25]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={venezuelaCoordinates.length}
              array={
                new Float32Array(venezuelaCoordinates.flatMap((coord) => [(coord[0] + 66) * 2, (coord[1] - 9) * 2, 0]))
              }
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={theme === "dark" ? "#60a5fa" : "#3b82f6"} linewidth={1.5} />
        </lineLoop>
      )}

      {/* Componentes optimizados */}
          <EnhancedParticles theme={theme} />
          <CulledCities theme={theme} />

      {/* Luces optimizadas */}
      <pointLight 
        position={[0, 0, 4]} 
        intensity={theme === "dark" ? 0.6 : 0.4} 
        color="#3b82f6" 
        distance={15}
        decay={2}
      />
      {detailLevel > 1 && (
        <pointLight 
          position={[4, 4, 0]} 
          intensity={theme === "dark" ? 0.3 : 0.2} 
          color="#60a5fa" 
          distance={12}
          decay={2}
        />
      )}
      <ambientLight intensity={theme === "dark" ? 0.15 : 0.25} />
    </group>
  )
}

// Componente principal optimizado
export function VenezuelaMap3D() {
  const { theme } = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const [performanceMode, setPerformanceMode] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    
    // Detectar dispositivos de bajo rendimiento
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        // Activar modo de rendimiento en dispositivos móviles o GPUs integradas
        if (renderer.includes('Mali') || renderer.includes('Adreno') || 
            renderer.includes('PowerVR') || renderer.includes('Intel')) {
          setPerformanceMode(true)
        }
      }
    }
  }, [])

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    console.warn('Contexto WebGL perdido en VenezuelaMap3D')
  }, [])

  const handleContextCreationError = useCallback((event: Event) => {
    console.error('Error al crear contexto WebGL:', event)
  }, [])

  const handleError = useCallback((error: any) => {
    console.error('Error en Three.js Canvas:', error)
  }, [])

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Canvas 
        className="h-full w-full"
        onContextLost={handleContextLost}
        onContextCreateError={handleContextCreationError}
        onError={handleError}
        gl={{ 
          antialias: !performanceMode, // Desactivar antialiasing en modo rendimiento
          alpha: true, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          logarithmicDepthBuffer: false, // Desactivar para mejor rendimiento
        }}
        dpr={performanceMode ? 1 : Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, 0, 15], fov: 50, near: 0.1, far: 100 }}
        frameloop="demand" // Solo renderizar cuando sea necesario
      >
        <Suspense fallback={null}>
          {/* Entorno optimizado */}
          {!performanceMode && <Environment preset="city" />}
          
          {/* Efectos de brillo alternativos sin postprocessing */}
          {!performanceMode && (
            <>
              <pointLight 
                position={[0, 0, 8]} 
                intensity={theme === "dark" ? 0.8 : 0.6} 
                color="#3b82f6" 
                distance={20}
                decay={2}
              />
              <pointLight 
                position={[-8, 8, 5]} 
                intensity={theme === "dark" ? 0.4 : 0.3} 
                color="#60a5fa" 
                distance={15}
                decay={2}
              />
            </>
          )}

          {/* Componente principal del mapa optimizado */}
          <OptimizedVenezuelaShape />

          {/* Controles de cámara optimizados */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={8}
            maxDistance={25}
            autoRotate={!performanceMode} // Desactivar rotación automática en modo rendimiento
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            enableDamping
            dampingFactor={0.08}
            zoomSpeed={0.8}
            rotateSpeed={0.5}
          />

          {/* Efectos adicionales solo en modo alto rendimiento */}
          {!performanceMode && (
            <Sparkles
              count={30} // Reducido para mejor rendimiento
              scale={[15, 8, 4]}
              size={1.5}
              speed={0.2}
              color={theme === "dark" ? "#60a5fa" : "#3b82f6"}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* Indicador de modo de rendimiento */}
      {performanceMode && (
        <div className="absolute top-2 right-2 text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">
          Modo Rendimiento
        </div>
      )}
    </div>
  )
}