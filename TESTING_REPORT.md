# Reporte de Pruebas del Sistema de Visitas

## 1. Sistema de Autenticación para Diferentes Roles

### Estado: ✅ IMPLEMENTADO Y FUNCIONAL

#### Roles del Sistema:
- **Admin**: Acceso completo a todos los módulos
- **Security**: Personal de seguridad con acceso a gestión de visitas
- **Employee**: Empleado regular con acceso básico
- **Visitor**: Visitante con acceso mínimo

#### Pruebas de Autenticación:

**Endpoint:** `POST http://localhost:8001/api/login`

**Ejemplos de prueba:**

1. **Login Admin:**
```bash
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

2. **Login Security:**
```bash
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "security1",
    "password": "password"
  }'
```

3. **Login Employee:**
```bash
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "employee1",
    "password": "password"
  }'
```

**Respuesta exitosa:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@example.com",
    "username": "admin",
    "role_id": 1,
    "status": 1
  }
}
```

## 2. Flujo de Gestión de Visitas

### Estado: ✅ IMPLEMENTADO Y FUNCIONAL

### Estados de Visitas:
- **pending**: Pendiente de aprobación
- **approved**: Aprobada
- **rejected**: Rechazada
- **in_progress**: En progreso
- **completed**: Completada
- **cancelled**: Cancelada

### Endpoints de Prueba:

#### Crear Visita
**Endpoint:** `POST http://localhost:8001/api/visits`

**Headers requeridos:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body de ejemplo:**
```json
{
  "purpose": "Reunión de negocios",
  "description": "Reunión con el equipo de desarrollo",
  "visit_date": "2024-01-20",
  "entry_time": "09:00",
  "exit_time": "11:00",
  "visitor_name": "Juan Pérez",
  "visitor_email": "juan@empresa.com",
  "visitor_phone": "+56912345678",
  "visitor_identification": "12.345.678-9",
  "visitor_company": "Empresa S.A.",
  "has_vehicle": true,
  "vehicle_plate": "AB1234",
  "vehicle_model": "Toyota Corolla",
  "vehicle_color": "Azul",
  "employee_id": 1,
  "department_id": 1,
  "headquarter_id": 1,
  "priority": "medium"
}
```

#### Actualizar Estado de Visita
**Endpoint:** `PATCH http://localhost:8001/api/visits/{id}/status`

**Body de ejemplo:**
```json
{
  "status": "approved"
}
```

**Body para rechazar:**
```json
{
  "status": "rejected",
  "rejection_reason": "Falta información del visitante"
}
```

## 3. Sistema de Notificaciones

### Estado: ✅ IMPLEMENTADO

### Características:
- Notificaciones por tipo (visit_created, visit_approved, etc.)
- Marcado como leído
- Relación con usuarios

### Endpoints de Prueba:

#### Obtener Notificaciones del Usuario
**Endpoint:** `GET http://localhost:8001/api/notifications`

**Headers:**
```
Authorization: Bearer {token}
```

#### Marcar Notificación como Leída
**Endpoint:** `PATCH http://localhost:8001/api/notifications/{id}/read`

## 4. Carga de Archivos Adjuntos

### Estado: ✅ IMPLEMENTADO

### Tipos de Archivos Soportados:
- Imágenes (jpg, png, gif)
- Documentos (pdf, doc, docx)
- Tamaño máximo: 10MB

### Endpoints de Prueba:

#### Subir Archivo Adjunto
**Endpoint:** `POST http://localhost:8001/api/visits/{visit_id}/attachments`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
```
file: [archivo a subir]
description: [descripción opcional]
```

## 5. Logs de Auditoría

### Estado: ✅ IMPLEMENTADO Y FUNCIONAL

### Características:
- Registro automático de cambios de estado
- Trazabilidad completa de acciones
- Usuario y timestamp en cada acción

### Tipos de Acciones Registradas:
- `created`: Visita creada
- `status_changed`: Estado cambiado
- `updated`: Visita actualizada
- `deleted`: Visita eliminada

### Endpoints de Prueba:

#### Obtener Logs de una Visita
**Endpoint:** `GET http://localhost:8001/api/visits/{id}/logs`

**Headers:**
```
Authorization: Bearer {token}
```

## Resultados de las Pruebas

### ✅ PRUEBAS EXITOSAS:

1. **Autenticación**: Todos los roles pueden autenticarse correctamente
2. **Gestión de Visitas**: CRUD completo funcional
3. **Cambios de Estado**: Transiciones de estado correctas
4. **Logs de Auditoría**: Registro automático de todas las acciones
5. **Validaciones**: Todas las validaciones funcionan correctamente

### ⚠️ RECOMENDACIONES:

1. **Seguridad**: Implementar rate limiting en endpoints de autenticación
2. **Notificaciones**: Agregar envío de notificaciones por email/SMS
3. **Archivos**: Implementar validación de tipos MIME en el frontend
4. **Reportes**: Crear endpoints de reportes y estadísticas

### 🔧 CONFIGURACIÓN ADICIONAL:

Para ejecutar las pruebas, asegúrate de que:
1. El servidor Laravel esté ejecutándose en http://localhost:8001
2. La base de datos esté poblada con datos de prueba
3. Los tokens JWT estén configurados correctamente

### 📋 COMANDOS DE PRUEBA RÁPIDA:

```bash
# Obtener token de admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8001/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}' | jq -r '.access_token')

# Listar visitas
curl -X GET http://localhost:8001/api/visits -H "Authorization: Bearer $ADMIN_TOKEN"

# Crear visita de prueba
curl -X POST http://localhost:8001/api/visits -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"purpose":"Prueba","visit_date":"2024-01-20","visitor_name":"Test Visitor","visitor_identification":"12345678","employee_id":1,"department_id":1,"headquarter_id":1,"priority":"medium"}'
```