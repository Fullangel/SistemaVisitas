# Rediseño del Dashboard de Sistema de Visitas

Este documento describe la nueva arquitectura, decisiones de diseño y funcionalidad del dashboard general y el panel de administración del sistema interno de visitas empresarial/gubernamental.

## Objetivos
- Arquitectura modular, mantenible y orientada a componentes.
- UI/UX profesional con paleta corporativa y efectos discretos.
- Métricas relevantes y acciones rápidas, con navegación clara.
- Código TypeScript estricto y componentes React optimizados.
- Diseño responsive compatible con dispositivos móviles y escritorio.

## Arquitectura
- Páginas: `src/pages/Dashboard.tsx` y `src/pages/admin/dashboard.tsx`.
- Componentes compartidos: `DashboardLayout`, `DashboardStatCard`, `DashboardActionCard`, `QuickActionButton` (en `components/dashboard/shared`).
- Tipos locales por página para separar dominios: métricas, módulos/secciones y acciones.
- Tema: objeto `theme` por página con colores de marca y superficies glass.
- Estilos: Tailwind CSS + pequeñas porciones de CSS-in-JS (gradiente dinámico del hero).

## Decisiones clave
- Acciones siempre reciben un `icon` válido (componentes Fluent UI) o se resuelven con un mapeo seguro (`resolveActionIcon`).
- Separación de métricas de usuario vs. administración para reflejar contextos distintos.
- Grillas responsivas: 1–4 columnas según el ancho, manteniendo legibilidad.
- Evitar dependencia de estados globales innecesarios; se usan estados locales y `useMemo` para datos derivados.

## Patrones de Tipos
- General:
  - `MetricStat`: totales y pendientes.
  - `ActionItem`: nombre, color, icono y callback.
  - `ModuleBlock`: id, título, color, icono y lista de acciones.
- Administración:
  - `AdminStats`: totales, salud del sistema y último respaldo.
  - `SectionAction`: nombre, color y callback.
  - `SectionBlock`: id, título, color, icono y acciones.

Sugerencia: En componentes compartidos, preferir `icon: React.ElementType` para reforzar tipos de iconos.

## Accesibilidad
- Contraste en botones y tarjetas; gradientes con texto blanco legible.
- Botones con etiquetas claras y foco visible.
- Navegación por teclado en acciones principales.

## Rendimiento
- Cálculos derivados con `useMemo`.
- Renderizado controlado de listas y filtrado por búsqueda.

## Próximos pasos
- Integrar datos reales desde API del backend.
- Añadir tests de render y tipos en los componentes compartidos.
- Estandarizar tema global si se requiere personalización multi-institucional.