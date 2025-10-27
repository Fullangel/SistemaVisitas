# Sistema de Auditoría y Monitoreo

## Descripción General

El sistema de auditoría y monitoreo proporciona un mecanismo completo para:
- Registrar todas las actividades importantes del sistema
- Monitorear el rendimiento y salud del sistema
- Generar reportes y estadísticas
- Exportar datos de auditoría
- Alertar sobre problemas del sistema

## Componentes Principales

### 1. Modelos

#### AuditLog (`App\Models\AuditLog`)
Modelo principal para almacenar logs de auditoría en la base de datos.

**Campos principales:**
- `action`: Tipo de acción (created, updated, deleted, etc.)
- `model`: Modelo afectado
- `model_id`: ID del registro afectado
- `user_id`: Usuario que realizó la acción
- `ip_address`: Dirección IP del usuario
- `url`: URL de la solicitud
- `changes`: Cambios realizados (JSON)

### 2. Servicios

#### AuditService (`App\Services\AuditService`)
Servicio principal para gestionar la auditoría.

**Métodos principales:**
- `logActivity()`: Registrar actividad en BD y archivo
- `getAuditLogs()`: Obtener logs con filtros
- `getStatistics()`: Generar estadísticas
- `exportToCsv()`: Exportar logs a CSV
- `cleanupOldLogs()`: Limpiar logs antiguos

#### MonitoringService (`App\Services\MonitoringService`)
Servicio para monitoreo del sistema.

**Métodos principales:**
- `logEvent()`: Registrar eventos del sistema
- `checkHealth()`: Verificar salud del sistema
- `getSystemStats()`: Obtener estadísticas del sistema
- `monitorQueryPerformance()`: Monitorear rendimiento de queries
- `logSuspiciousActivity()`: Registrar actividad sospechosa

### 3. Observers

Los observers registran automáticamente cambios en los modelos:

- `UserObserver`: Usuarios
- `EmployeeObserver`: Empleados  
- `VisitObserver`: Visitas

### 4. Transformers

#### AuditLogTransformer (`App\Transformers\AuditLogTransformer`)
Transforma datos de auditoría para las APIs.

**Métodos:**
- `transform()`: Transformación completa
- `transformForList()`: Para listados
- `transformForDashboard()`: Para dashboards

### 5. Middleware

#### LogRequests (`App\Http\Middleware\LogRequests`)
Middleware para registrar todas las solicitudes HTTP.

### 6. Comandos Artisan

#### CleanupAuditLogs (`App\Console\Commands\CleanupAuditLogs`)
Limpia logs antiguos de auditoría.

```bash
php artisan audit:cleanup --days=90
```

#### SystemHealthCheck (`App\Console\Commands\SystemHealthCheck`)
Verifica la salud del sistema.

```bash
php artisan system:health --detailed
```

## Configuración

### Variables de Entorno

```env
# Auditoría
AUDIT_ENABLED=true
AUDIT_RETENTION_DAYS=90

# Monitoreo
MONITORING_ENABLED=true
```

### Archivo de Configuración

`config/audit.php` contiene toda la configuración del sistema.

## Uso

### Registro de Actividad Manual

```php
use App\Traits\LogsActivity;

class MiController extends Controller
{
    use LogsActivity;
    
    public function miMetodo()
    {
        // Log de auditoría
        $this->logAudit('user_action', [
            'action' => 'custom_action',
            'details' => 'Detalles de la acción'
        ]);
        
        // Log de monitoreo
        $this->logMonitoring('system_event', [
            'event' => 'custom_event'
        ]);
    }
}
```

### API Endpoints

#### Auditoría

- `GET /api/audit/logs` - Listar logs de auditoría
- `GET /api/audit/statistics` - Estadísticas de auditoría
- `GET /api/audit/export` - Exportar logs a CSV

#### Monitoreo

- `GET /api/system/health` - Salud del sistema
- `GET /api/system/statistics` - Estadísticas del sistema
- `GET /api/system/performance` - Métricas de rendimiento
- `GET /api/system/logs` - Logs recientes
- `POST /api/system/clear-cache` - Limpiar caché de métricas

### Filtros de Auditoría

Los endpoints de auditoría aceptan varios filtros:

```http
GET /api/audit/logs?model=App\Models\User&action=created&user_id=1&date_from=2024-01-01&date_to=2024-12-31
```

**Parámetros disponibles:**
- `model`: Modelo afectado
- `action`: Tipo de acción
- `user_id`: ID del usuario
- `date_from`: Fecha inicial (Y-m-d)
- `date_to`: Fecha final (Y-m-d)
- `ip_address`: Dirección IP
- `search`: Búsqueda en los cambios

## Estructura de Logs

### Log de Auditoría (BD)

```json
{
    "id": 1,
    "action": "created",
    "model": "App\\Models\\User",
    "model_id": 123,
    "user_id": 1,
    "user_name": "Admin User",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "url": "/api/users",
    "changes": {
        "name": "John Doe",
        "email": "john@example.com"
    },
    "created_at": "2024-01-01 12:00:00"
}
```

### Log de Archivo

```
[2024-01-01 12:00:00] audit.INFO: User created {"user_id":1,"model":"App\\Models\\User","model_id":123}
```

## Permisos y Seguridad

### Permisos Necesarios

- `view_audit_logs`: Ver logs de auditoría
- `view_audit_statistics`: Ver estadísticas
- `export_audit_logs`: Exportar logs
- `view_system_monitoring`: Ver monitoreo del sistema
- `view_system_health`: Ver salud del sistema

### Seguridad

- Los datos sensibles se sanitizan automáticamente
- Las contraseñas y tokens nunca se registran
- Los logs se rotan diariamente
- Se mantiene retención configurada (90 días por defecto)

## Mantenimiento

### Limpieza Automática

Los logs antiguos se limpian automáticamente mediante el comando programado:

```php
// En app/Console/Kernel.php
$schedule->command('audit:cleanup')->weekly();
```

### Monitoreo de Salud

El sistema verifica automáticamente la salud cada hora:

```php
$schedule->command('system:health')->hourly();
```

## Solución de Problemas

### Logs No Se Guardan

1. Verificar que `AUDIT_ENABLED=true`
2. Verificar permisos de escritura en `storage/logs/`
3. Verificar que los observers estén registrados

### Problemas de Rendimiento

1. Verificar índices en la tabla `audit_logs`
2. Ajustar el período de retención
3. Considerar particionamiento de tablas

### Alertas de Salud

Las siguientes condiciones generan alertas:
- Uso de memoria > 80%
- Uso de disco > 85%
- Tiempo de query > 1000ms
- Tamaño de cola > 100

## Mejores Prácticas

1. **Siempre usar los traits** para logging consistente
2. **Sanitizar datos sensibles** antes de guardar
3. **Configurar alertas** para problemas críticos
4. **Revisar logs regularmente** para patrones
5. **Mantener backups** de logs importantes
6. **Documentar acciones personalizadas**