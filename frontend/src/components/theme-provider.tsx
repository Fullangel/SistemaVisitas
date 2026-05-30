
import type React from "react"
import type { ReactNode } from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextType = {
  theme: Theme
  actualTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light") // Cambiado de "dark" a "light"

  // Detectar preferencia del sistema
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light" // Cambiado de "dark" a "light" como fallback
  }

  // Inicializar tema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      setTheme("system")
    }
  }, [])

  // Actualizar tema actual basado en la configuración
  useEffect(() => {
    let newActualTheme: "light" | "dark"

    if (theme === "system") {
      newActualTheme = getSystemTheme()

      // Escuchar cambios en la preferencia del sistema
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      newActualTheme = theme
    }

    setActualTheme(newActualTheme)
  }, [theme])

  // Aplicar tema al DOM
  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.toggle("dark", actualTheme === "dark")

    // Agregar clase para transiciones suaves
    document.documentElement.style.setProperty("color-scheme", actualTheme)
  }, [theme, actualTheme])

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark"
      if (prev === "dark") return "system"
      return "light"
    })
  }

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}