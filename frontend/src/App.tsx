import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Importar estilos
import './main.css'

const App: React.FC = () => {
  useEffect(() => {
    console.log('Sistema Nacional de Visitas - Iniciado')
  }, [])

  return (
    <>
      <Helmet>
        <title>Sistema Nacional de Visitas</title>
        <meta name="description" content="Sistema integral de gestión de visitas a nivel nacional" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Helmet>

      <div id="app" className="min-h-screen bg-background">
        <Outlet />
      </div>
    </>
  )
}

export default App