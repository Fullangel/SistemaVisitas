"use client"

import { Button } from "@/components/ui/button"
import { WeatherMoonRegular, WeatherSunnyRegular, DesktopRegular } from "@fluentui/react-icons"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, actualTheme, toggleTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <WeatherSunnyRegular className="mr-2 h-4 w-4" />
      case "dark":
        return <WeatherMoonRegular className="mr-2 h-4 w-4" />
      case "system":
        return <DesktopRegular className="mr-2 h-4 w-4" />
      default:
        return <WeatherMoonRegular className="mr-2 h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Claro"
      case "dark":
        return "Oscuro"
      case "system":
        return `Auto (${actualTheme === "dark" ? "Oscuro" : "Claro"})`
      default:
        return "Oscuro"
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="border-blue-400/50 bg-blue-950/50 text-blue-100 backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-blue-900/70 hover:scale-105 dark:border-blue-400/50 dark:bg-blue-950/50 dark:text-blue-100 dark:hover:border-blue-400 dark:hover:bg-blue-900/70"
      title={`Tema actual: ${getThemeLabel()}`}
    >
      {getThemeIcon()}
      <span className="hidden sm:inline">{getThemeLabel()}</span>
      <span className="sm:hidden">Tema</span>
    </Button>
  )
}