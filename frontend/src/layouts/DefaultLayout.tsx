import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import "@/main.css"
import { Sidebar } from "@/components/navigation/Sidebar"

export default function DefaultLayout() {
  return (
    <div className="min-h-screen font-sans antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[280px] min-h-screen transition-all duration-300 ease-in-out">
        <Outlet />
      </main>
    </div>
  )
}