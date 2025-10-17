# Manual de Usuario - Sistema Nacional de Visitas

## 📋 Índice

1. [Introducción](#introducción)
2. [Primeros Pasos](#primeros-pasos)
3. [Gestión de Visitas](#gestión-de-visitas)
4. [Panel de Administración](#panel-de-administración)
5. [Notificaciones](#notificaciones)
6. [Reportes y Estadísticas](#reportes-y-estadísticas)
7. [Configuración de Usuario](#configuración-de-usuario)
8. [Solución de Problemas](#solución-de-problemas)

## 🎯 Introducción

El Sistema Nacional de Visitas es una plataforma integral diseñada para gestionar, coordinar y hacer seguimiento de todas las visitas institucionales. Este manual le guiará a través de todas las funcionalidades del sistema.

### Roles del Sistema

- **Administrador**: Control total del sistema
- **Supervisor**: Gestión de visitas y usuarios
- **Coordinador**: Gestión de visitas asignadas
- **Usuario**: Visualización y registro básico

## 🚀 Primeros Pasos

### Acceso al Sistema

1. **Abrir el navegador** e ir a: `https://sistema-visitas.tu-dominio.com`
2. **Ingresar credenciales** proporcionadas por el administrador
3. **Cambiar contraseña** en el primer acceso

### Dashboard Principal

![Dashboard](images/dashboard.png)

**Elementos del Dashboard:**
- **Tarjetas de Resumen**: Visitas totales, pendientes, aprobadas
- **Calendario**: Próximas visitas
- **Notificaciones**: Alertas y recordatorios
- **Accesos Rápidos**: Crear visita, ver reportes

## 📅 Gestión de Visitas

### Crear Nueva Visita

1. **Click en "Nueva Visita"** en el menú principal
2. **Completar el formulario:**

#### Información General
- **Título**: Nombre descriptivo de la visita
- **Descripción**: Objetivos y alcance
- **Institución**: Entidad visitante
- **Tipo de Visita**: Oficial, Técnica, Protocolo, etc.

#### Fechas y Horarios
```
Fecha de Inicio: [Seleccionar en calendario]
Fecha de Fin:   [Seleccionar en calendario]
Hora de Inicio: [HH:MM]
Hora de Fin:    [HH:MM]
```

#### Participantes
```
Nombre:        [Texto]
Cargo:         [Selección]
Email:         [Email]
Teléfono:      [Número]
País:          [Selección]
```

#### Requisitos Especiales
- **Traductor**: Idioma requerido
- **Seguridad**: Nivel de seguridad
- **Transporte**: Tipo de vehículos
- **Alojamiento**: Hotel preferido
- **Requisitos Dietéticos**: Vegetariano, Halal, etc.

3. **Adjuntar documentos** (opcional):
   - Carta de invitación
   - Lista de participantes
   - Itinerario preliminar

4. **Guardar como borrador** o **Enviar para aprobación**

### Estados de Visita

| Estado | Color | Descripción | Acciones Disponibles |
|--------|--------|-------------|---------------------|
| **Borrador** | 🟡 | En edición | Editar, Enviar |
| **Pendiente** | 🔵 | Esperando aprobación | Ver, Cancelar |
| **Aprobada** | 🟢 | Aprobada | Ver, Programar |
| **Rechazada** | 🔴 | No aprobada | Ver, Reenviar |
| **En Curso** | 🟠 | Visitando | Ver, Finalizar |
| **Completada** | ⚫ | Finalizada | Ver, Reportar |

### Editar Visita

1. **Buscar la visita** en la lista
2. **Click en "Editar"** (solo si es borrador o tiene permisos)
3. **Modificar campos** necesarios
4. **Guardar cambios**

### Cancelar Visita

1. **Abrir visita** a cancelar
2. **Click en "Cancelar"**
3. **Seleccionar motivo:**
   - Cambio de fechas
   - Cancelación por institución
   - Problemas logísticos
   - Otro (especificar)
4. **Confirmar cancelación**

## ⚙️ Panel de Administración

### Gestión de Usuarios

#### Crear Usuario

1. **Ir a "Administración" → "Usuarios"**
2. **Click en "Nuevo Usuario"**
3. **Completar información:**

```
Nombre Completo:    [Obligatorio]
Email:             [Obligatorio - único]
Teléfono:          [Opcional]
Departamento:      [Selección]
Rol:               [Administrador/Supervisor/Coordinador/Usuario]
Estado:            [Activo/Inactivo]
Idioma Preferido:  [Español/Inglés/Portugués]
```

4. **Asignar permisos** específicos
5. **Guardar usuario**

#### Editar Usuario

1. **Buscar usuario** en la lista
2. **Click en "Editar"**
3. **Modificar campos** necesarios
4. **Guardar cambios**

#### Resetear Contraseña

1. **Seleccionar usuario**
2. **Click en "Resetear Contraseña"**
3. **Confirmar acción**
4. **Sistema envía** nueva contraseña por email

### Gestión de Instituciones

#### Agregar Institución

1. **Ir a "Administración" → "Instituciones"**
2. **Click en "Nueva Institución"**
3. **Completar datos:**

```
Nombre:           [Obligatorio]
País:            [Selección]
Tipo:            [Gubernamental/Privada/ONG/Internacional]
Dirección:       [Opcional]
Teléfono:        [Opcional]
Email:           [Opcional]
Sitio Web:       [Opcional]
Notas:           [Opcional]
```

### Configuración del Sistema

#### Parámetros Generales
- **Zona Horaria**: UTC-5 (por defecto)
- **Idioma Principal**: Español
- **Moneda**: USD
- **Formato de Fecha**: DD/MM/YYYY
- **Formato de Hora**: 24 horas

#### Notificaciones
- **Email de Sistema**: noreply@tu-dominio.com
- **Frecuencia de Notificaciones**: Inmediato/Diario/Semanal
- **Plantillas de Email**: Personalizables

## 🔔 Notificaciones

### Tipos de Notificaciones

| Tipo | Icono | Descripción | Frecuencia |
|------|--------|-------------|------------|
| **Nueva Visita** | 📅 | Nueva visita registrada | Inmediata |
| **Cambio de Estado** | 🔄 | Visita aprobada/rechazada | Inmediata |
| **Recordatorio** | ⏰ | Próxima visita | 24h antes |
| **Tarea Pendiente** | ✅ | Acción requerida | Diaria |
| **Alerta de Seguridad** | 🚨 | Evento crítico | Inmediata |

### Configurar Notificaciones

1. **Ir a "Perfil" → "Notificaciones"**
2. **Seleccionar tipos** a recibir:
   - Email
   - In-app
   - SMS (si configurado)
3. **Establecer frecuencia** preferida
4. **Guardar configuración**

### Bandeja de Notificaciones

**Filtros disponibles:**
- Todas
- No leídas
- Importantes
- Por tipo
- Por fecha

**Acciones:**
- Marcar como leída
- Marcar todas como leídas
- Eliminar
- Archivar

## 📊 Reportes y Estadísticas

### Reportes Disponibles

#### 1. Reporte de Visitas por Período

**Generar reporte:**
1. **Ir a "Reportes" → "Visitas por Período"**
2. **Seleccionar rango de fechas**
3. **Elegir formato**: PDF/Excel/CSV
4. **Click en "Generar"**

**Información incluida:**
- Total de visitas
- Visitas por estado
- Visitas por institución
- Visitas por tipo
- Participantes totales

#### 2. Reporte de Participantes

**Datos mostrados:**
- Nombre y cargo
- Institución
- País de origen
- Fecha de visita
- Contacto

#### 3. Reporte de Requisitos

**Incluye:**
- Traductores utilizados
- Servicios de seguridad
- Transporte requerido
- Alojamientos
- Requisitos dietéticos

### Dashboard de Estadísticas

#### Métricas Principales

**Visitas:**
- Total del mes
- Comparación con mes anterior
- Promedio mensual
- Tasa de crecimiento

**Estados:**
- Porcentaje aprobado
- Tiempo promedio de aprobación
- Tasa de cancelación

**Participantes:**
- Total por mes
- Promedio por visita
- Distribución por país

#### Gráficos Interactivos

1. **Línea de Tiempo**: Visitas por mes
2. **Gráfico de Torta**: Distribución por estado
3. **Gráfico de Barras**: Visitas por institución
4. **Mapa de Calor**: Participantes por país

### Exportar Datos

**Formatos disponibles:**
- **PDF**: Para presentaciones
- **Excel**: Para análisis
- **CSV**: Para importar a otros sistemas

**Opciones de exportación:**
- Seleccionar columnas específicas
- Aplicar filtros
- Incluir gráficos
- Personalizar encabezado

## 👤 Configuración de Usuario

### Perfil Personal

**Información editable:**
- Nombre completo
- Teléfono
- Idioma preferido
- Zona horaria
- Foto de perfil

**Cambiar Contraseña**

1. **Ir a "Perfil" → "Seguridad"**
2. **Ingresar contraseña actual**
3. **Ingresar nueva contraseña** (mínimo 8 caracteres)
4. **Confirmar nueva contraseña**
5. **Guardar cambios**

### Preferencias

#### Interfaz
- **Tema**: Claro/Oscuro/Automático
- **Tamaño de Fuente**: Pequeño/Mediano/Grande
- **Idioma**: Español/Inglés/Portugués
- **Formato de Fecha**: DD/MM/YYYY o MM/DD/YYYY

#### Notificaciones
- **Email**: Sí/No
- **In-app**: Sí/No
- **Sonido**: Sí/No
- **Frecuencia**: Inmediato/Diario/Semanal

#### Privacidad
- **Perfil Visible**: Público/Solo Equipo/Privado
- **Mostrar Email**: Sí/No
- **Mostrar Teléfono**: Sí/No

## 🔧 Solución de Problemas

### Problemas Comunes

#### 1. No puedo iniciar sesión

**Causas posibles:**
- Contraseña incorrecta
- Usuario inactivo
- Cuenta bloqueada

**Soluciones:**
- Verificar mayúsculas/minúsculas
- Usar "Olvidé mi contraseña""
- Contactar al administrador

#### 2. No veo algunas visitas

**Verificar:**
- Permisos de usuario
- Filtros aplicados
- Estado del visita

**Acciones:**
- Limpiar filtros
- Verificar con administrador
- Actualizar página (F5)

#### 3. Error al subir documentos

**Requisitos:**
- Formato: PDF, DOC, DOCX, JPG, PNG
- Tamaño máximo: 10MB
- Nombre sin caracteres especiales

**Soluciones:**
- Comprimir archivo
- Cambiar formato
- Renombrar archivo

#### 4. Notificaciones no llegan

**Verificar:**
- Configuración de notificaciones
- Carpeta de spam
- Email correcto en perfil

**Acciones:**
- Revisar configuración
- Verificar carpeta spam
- Actualizar email

### Códigos de Error

| Código | Significado | Solución |
|--------|-------------|----------|
| **400** | Solicitud inválida | Verificar datos ingresados |
| **401** | No autorizado | Reintentar login |
| **403** | Sin permisos | Contactar administrador |
| **404** | No encontrado | Verificar URL o ID |
| **422** | Validación fallida | Corregir campos marcados |
| **429** | Demasiadas peticiones | Esperar y reintentar |
| **500** | Error del servidor | Contactar soporte |

### Contactar Soporte

**Información requerida:**
- Nombre de usuario
- Fecha y hora del problema
- Descripción detallada
- Screenshots si aplica
- URL donde ocurrió

**Canales de soporte:**
- **Email**: soporte@visitas-nacional.gob
- **Teléfono**: +1 234 567 8900
- **Chat interno**: Disponible en el sistema
- **Horario**: Lunes a Viernes 8:00-18:00

### Tips de Uso

#### Productividad

1. **Usar filtros** para encontrar visitas rápidamente
2. **Guardar búsquedas frecuentes**
3. **Exportar reportes** para análisis externos
4. **Configurar notificaciones** relevantes
5. **Actualizar perfil** con información correcta

#### Mejores Prácticas

1. **Completar toda la información** de la visita
2. **Subir documentos** con anticipación
3. **Verificar fechas** antes de confirmar
4. **Comunicar cambios** a tiempo
5. **Archivar visitas** antiguas
6. **Hacer backup** de información importante

---

**📞 Para más información:**
- **Manual Técnico**: Disponible en /docs/technical
- **Capacitaciones**: Programadas mensualmente
- **Video Tutoriales**: En la sección de ayuda del sistema