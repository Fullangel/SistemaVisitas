# Guía de Estilo UI

Esta guía establece una base visual consistente para el sistema.

## Colores de Marca
- Primario: `#6366f1` (Indigo 500)
- Secundario: `#8b5cf6` (Violet 500)
- Acento: `#0ea5e9` (Sky 500)
- Superficie clara (glass): `rgba(255,255,255,0.7)`
- Superficie oscura (glass): `rgba(17,24,39,0.7)`

## Tipografía
- Fuente: Sistema por defecto + Tailwind config.
- Títulos: peso semibold; subtítulos con opacidad para jerarquía.

## Componentes
- `DashboardLayout`: título y subtítulo obligatorios.
- `DashboardStatCard`: icono visible, color semántico, valores cortos.
- `DashboardActionCard`: acciones con `variant` default/outline; iconos válidos.
- `QuickActionButton`: icono y label claros; contrastes suficientes.

## Efectos
- Glassmorphism discreto: blur + bordes `border-white/10`.
- Gradientes: lineales con mezcla de primario-secundario-acento.

## Responsividad
- Grillas:
  - 1 columna (móvil), 2 columnas (md), 4 columnas (lg).
- Mantener padding suficiente: `px-6`–`px-8`, `py-6`–`py-8`.

## Accesibilidad
- Contrast ratio adecuado en botones.
- Estados de foco visibles y consistentes.
- Evitar texto en gradiente sin fondo sólido.

## Iconografía
- Usar Fluent UI React Icons.
- Tipado sugerido: `icon: React.ElementType`.

## Buenas Prácticas
- No renderizar íconos `undefined`.
- Extraer tema común si múltiples páginas comparten valores.
- Evitar lógica compleja en el render; usar helpers como `resolveActionIcon`.