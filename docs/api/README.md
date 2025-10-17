# Documentación de la API

## 📋 Índice

1. [Autenticación](#autenticación)
2. [Endpoints](#endpoints)
3. [Códigos de Estado](#códigos-de-estado)
4. [Ejemplos](#ejemplos)
5. [Rate Limiting](#rate-limiting)
6. [Internacionalización](#internacionalización)

## 🔐 Autenticación

El sistema utiliza Laravel Sanctum para autenticación basada en tokens.

### Obtener Token

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
}
```

**Respuesta Exitosa (200):**
```json
{
    "success": true,
    "data": {
        "token": "1|laravel_sanctum_token...",
        "user": {
            "id": 1,
            "name": "Juan Pérez",
            "email": "usuario@ejemplo.com",
            "role": "admin"
        }
    }
}
```

### Usar Token

Incluir el token en el header de cada petición:

```http
Authorization: Bearer 1|laravel_sanctum_token...
```

### Refresh Token

```http
POST /api/auth/refresh
Authorization: Bearer 1|laravel_sanctum_token...
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer 1|laravel_sanctum_token...
```

## 🎯 Endpoints

### Visitas

#### Listar Visitas
```http
GET /api/visits
```

**Parámetros de Query:**
- `page` (integer): Número de página
- `per_page` (integer): Elementos por página (máx 100)
- `status` (string): Filtrar por estado (pending, approved, rejected, completed)
- `start_date` (date): Fecha de inicio (YYYY-MM-DD)
- `end_date` (date): Fecha de fin (YYYY-MM-DD)
- `search` (string): Búsqueda por título o descripción

**Respuesta (200):**
```json
{
    "success": true,
    "data": {
        "visits": [
            {
                "id": 1,
                "title": "Visita de Ministros",
                "description": "Visita oficial de ministros extranjeros",
                "start_date": "2024-01-15",
                "end_date": "2024-01-17",
                "status": "approved",
                "participants_count": 15,
                "created_at": "2024-01-01T10:00:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 50,
            "per_page": 10
        }
    }
}
```

#### Crear Visita
```http
POST /api/visits
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Visita de Ministros",
    "description": "Visita oficial de ministros extranjeros",
    "start_date": "2024-01-15",
    "end_date": "2024-01-17",
    "institution_id": 1,
    "participants": [
        {
            "name": "Juan Pérez",
            "email": "juan@ejemplo.com",
            "phone": "+1234567890",
            "role": "Ministro"
        }
    ],
    "requirements": ["Traductor", "Seguridad"]
}
```

#### Actualizar Visita
```http
PUT /api/visits/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Visita Actualizada",
    "status": "approved"
}
```

#### Eliminar Visita
```http
DELETE /api/visits/{id}
Authorization: Bearer {token}
```

### Usuarios

#### Listar Usuarios
```http
GET /api/users
Authorization: Bearer {token}
```

#### Crear Usuario
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "contraseña",
    "role": "admin",
    "phone": "+1234567890",
    "department_id": 1
}
```

#### Actualizar Usuario
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Juan Pérez Actualizado",
    "role": "supervisor"
}
```

### Notificaciones

#### Listar Notificaciones
```http
GET /api/notifications
Authorization: Bearer {token}
```

**Parámetros:**
- `unread` (boolean): Solo notificaciones no leídas
- `type` (string): Filtrar por tipo

#### Marcar como Leída
```http
POST /api/notifications/{id}/read
Authorization: Bearer {token}
```

#### Marcar Todas como Leídas
```http
POST /api/notifications/mark-all-read
Authorization: Bearer {token}
```

### Estadísticas

#### Dashboard Stats
```http
GET /api/stats/dashboard
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
    "success": true,
    "data": {
        "total_visits": 150,
        "pending_visits": 25,
        "approved_visits": 100,
        "rejected_visits": 10,
        "completed_visits": 15,
        "visits_this_month": 45,
        "visits_last_month": 38,
        "growth_percentage": 18.4
    }
}
```

## 📊 Códigos de Estado

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Petición exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Error en los datos enviados |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | Sin permisos para esta acción |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Error de validación |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |

### Respuesta de Error Estándar

```json
{
    "success": false,
    "message": "Mensaje de error descriptivo",
    "errors": {
        "field_name": ["Error específico del campo"]
    }
}
```

## 💡 Ejemplos

### Ejemplo Completo: Crear Visita

```bash
curl -X POST "http://localhost:8080/api/visits" \
  -H "Authorization: Bearer 1|laravel_sanctum_token..." \
  -H "Content-Type: application/json" \
  -H "Accept-Language: es" \
  -d '{
    "title": "Visita Presidencial",
    "description": "Visita oficial del presidente de Colombia",
    "start_date": "2024-02-15",
    "end_date": "2024-02-16",
    "institution_id": 1,
    "participants": [
      {
        "name": "Presidente",
        "email": "presidente@presidencia.gov.co",
        "phone": "+5712345678",
        "role": "Presidente"
      }
    ],
    "requirements": ["Seguridad presidencial", "Protocolo diplomático"]
  }'
```

### Ejemplo: Paginación y Filtros

```bash
# Obtener visitas aprobadas del último mes con búsqueda
curl -X GET "http://localhost:8080/api/visits?status=approved&start_date=2024-01-01&end_date=2024-01-31&search=ministerial&page=2&per_page=20" \
  -H "Authorization: Bearer 1|laravel_sanctum_token..."
```

## ⚡ Rate Limiting

El sistema implementa límites de petición según el tipo de endpoint:

| Endpoint | Límite | Ventana de Tiempo |
|----------|--------|-------------------|
| `/api/auth/login` | 5 intentos | 1 minuto |
| `/api/auth/register` | 3 intentos | 5 minutos |
| `/api/password/*` | 3 intentos | 15 minutos |
| General API | 60 peticiones | 1 minuto |

**Headers de Rate Limit:**
- `X-RateLimit-Limit`: Límite total
- `X-RateLimit-Remaining`: Peticiones restantes
- `X-RateLimit-Reset`: Tiempo hasta reinicio

## 🌍 Internacionalización

### Headers de Idioma

```http
Accept-Language: es
# Opciones: es, en, pt
```

### Respuestas Traducidas

Las respuestas de error y mensajes del sistema se adaptan automáticamente según el idioma solicitado.

```json
// Accept-Language: es
{
    "success": false,
    "message": "El campo título es obligatorio"
}

// Accept-Language: en
{
    "success": false,
    "message": "The title field is required"
}
```

## 🔧 Debugging

### Health Check

```http
GET /api/health
```

**Respuesta (200):**
```json
{
    "status": "healthy",
    "services": {
        "database": "connected",
        "redis": "connected",
        "storage": "writable"
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
```

### Información del Sistema

```http
GET /api/system/info
Authorization: Bearer {token}
```

## 📚 Recursos Adicionales

- [Laravel Documentation](https://laravel.com/docs)
- [Vue.js Documentation](https://vuejs.org/)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🆘 Soporte

Para problemas con la API, contactar a:
- Email: soporte-api@visitas-nacional.gob
- Teléfono: +1 234 567 8900