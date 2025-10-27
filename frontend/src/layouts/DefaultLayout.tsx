import React from "react"
import { Outlet } from "react-router-dom"
import "@/main.css"
import { ThemeProvider } from "@/components/theme-provider"

export default function DefaultLayout() {
  return (
    <div className="min-h-screen font-sans antialiased">
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </div>
  )
}