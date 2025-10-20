"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Componente SVG simple de Venezuela como fallback
export function VenezuelaMapSimple({ className }: { className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <div className="animate-pulse rounded-full h-8 w-8 bg-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 300 400"
        className="w-full h-full max-w-md opacity-30 dark:opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="venezuela-gradient-simple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          <radialGradient id="city-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Silueta de Venezuela */}
        <path
          d="M80,60 L220,55 L260,80 L250,120 L240,160 L220,180 L200,190 L180,185 L160,180 L140,170 L120,150 L110,130 L105,110 L100,90 L95,70 Z"
          fill="url(#venezuela-gradient-simple)"
          stroke="#3b82f6"
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Ciudades principales */}
        <circle cx="165" cy="105" r="4" fill="#f59e0b" opacity="0.8" />
        <circle cx="140" cy="125" r="3" fill="#fbbf24" opacity="0.6" />
        <circle cx="180" cy="135" r="3" fill="#fbbf24" opacity="0.6" />
        <circle cx="150" cy="145" r="3" fill="#fbbf24" opacity="0.6" />
        
        {/* Animación de pulso para Caracas */}
        <circle cx="165" cy="105" r="6" fill="url(#city-glow)" opacity="0.4">
          <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Etiquetas */}
        <text x="165" y="95" textAnchor="middle" className="text-xs fill-blue-600 dark:fill-blue-400 font-medium">
          Caracas
        </text>
      </svg>
    </div>
  )
}