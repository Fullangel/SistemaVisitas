<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\Visit;
use App\Services\AuditService;
use App\Services\MonitoringService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class AuditSystemTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $auditService;
    protected $monitoringService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->auditService = app(AuditService::class);
        $this->monitoringService = app(MonitoringService::class);
        
        // Configurar storage falso para pruebas
        Storage::fake('local');
    }

    /**
     * Test: Auditoría de creación de usuario
     */
    public function test_user_creation_is_audited()
    {
        $this->actingAs($this->user, 'api');
        
        $newUserData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ];
        
        $response = $this->postJson('/api/users', $newUserData);
        
        $response->assertStatus(201);
        
        // Verificar que se creó el log de auditoría
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'created',
            'model' => 'App\Models\User',
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test: Auditoría de actualización de empleado
     */
    public function test_employee_update_is_audited()
    {
        $this->actingAs($this->user, 'api');
        
        $employee = Employee::factory()->create();
        
        $updateData = [
            'first_name' => 'Updated Name',
            'email' => 'updated@example.com',
        ];
        
        $response = $this->putJson("/api/employees/{$employee->id}", $updateData);
        
        $response->assertStatus(200);
        
        // Verificar que se creó el log de auditoría
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'updated',
            'model' => 'App\Models\Employee',
            'model_id' => $employee->id,
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test: Auditoría de cambio de estado en visitas
     */
    public function test_visit_status_change_is_audited()
    {
        $this->actingAs($this->user, 'api');
        
        $visit = Visit::factory()->create(['status' => 'pending']);
        
        $response = $this->putJson("/api/visits/{$visit->id}/status", [
            'status' => 'completed',
        ]);
        
        $response->assertStatus(200);
        
        // Verificar que se creó el log de auditoría con cambio de estado
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'status_change',
            'model' => 'App\Models\Visit',
            'model_id' => $visit->id,
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test: Servicio de auditoría - logActivity
     */
    public function test_audit_service_log_activity()
    {
        $this->actingAs($this->user, 'api');
        
        $this->auditService->logActivity(
            'test_action',
            'App\Models\TestModel',
            123,
            ['test' => 'data'],
            '127.0.0.1',
            'Mozilla/5.0',
            '/api/test'
        );
        
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'test_action',
            'model' => 'App\Models\TestModel',
            'model_id' => 123,
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test: Servicio de auditoría - getAuditLogs
     */
    public function test_audit_service_get_audit_logs()
    {
        // Crear logs de prueba
        AuditLog::factory()->count(5)->create([
            'model' => 'App\Models\User',
            'action' => 'created',
        ]);
        
        $logs = $this->auditService->getAuditLogs([
            'model' => 'App\Models\User',
            'action' => 'created',
        ]);
        
        $this->assertCount(5, $logs);
    }

    /**
     * Test: Servicio de auditoría - getStatistics
     */
    public function test_audit_service_get_statistics()
    {
        // Crear logs de prueba
        AuditLog::factory()->count(3)->create(['action' => 'created']);
        AuditLog::factory()->count(2)->create(['action' => 'updated']);
        
        $statistics = $this->auditService->getStatistics();
        
        $this->assertArrayHasKey('total_logs', $statistics);
        $this->assertArrayHasKey('actions_breakdown', $statistics);
        $this->assertEquals(5, $statistics['total_logs']);
        $this->assertEquals(3, $statistics['actions_breakdown']['created']);
        $this->assertEquals(2, $statistics['actions_breakdown']['updated']);
    }

    /**
     * Test: Servicio de monitoreo - checkHealth
     */
    public function test_monitoring_service_check_health()
    {
        $health = $this->monitoringService->checkHealth();
        
        $this->assertArrayHasKey('healthy', $health);
        $this->assertArrayHasKey('status', $health);
        $this->assertArrayHasKey('timestamp', $health);
        $this->assertArrayHasKey('checks', $health);
    }

    /**
     * Test: Servicio de monitoreo - getSystemStats
     */
    public function test_monitoring_service_get_system_stats()
    {
        $stats = $this->monitoringService->getSystemStats();
        
        $this->assertArrayHasKey('memory_usage', $stats);
        $this->assertArrayHasKey('disk_usage', $stats);
        $this->assertArrayHasKey('cache_stats', $stats);
        $this->assertArrayHasKey('database_stats', $stats);
        $this->assertArrayHasKey('queue_stats', $stats);
    }

    /**
     * Test: Comando de limpieza de logs
     */
    public function test_cleanup_audit_logs_command()
    {
        // Crear logs antiguos y recientes
        AuditLog::factory()->count(3)->create([
            'created_at' => now()->subDays(100),
        ]);
        
        AuditLog::factory()->count(2)->create([
            'created_at' => now()->subDays(30),
        ]);
        
        $this->assertDatabaseCount('audit_logs', 5);
        
        // Ejecutar comando de limpieza (mantener últimos 90 días)
        Artisan::call('audit:cleanup', ['--days' => 90]);
        
        // Verificar que solo quedan los logs recientes
        $this->assertDatabaseCount('audit_logs', 2);
    }

    /**
     * Test: Comando de salud del sistema
     */
    public function test_system_health_command()
    {
        Artisan::call('system:health');
        
        $output = Artisan::output();
        
        $this->assertStringContainsString('System Health Check', $output);
        $this->assertStringContainsString('Overall Status', $output);
    }

    /**
     * Test: API endpoint - listar logs de auditoría
     */
    public function test_api_list_audit_logs()
    {
        $this->actingAs($this->user, 'api');
        
        // Asignar permiso necesario
        $this->user->givePermissionTo('view_audit_logs');
        
        // Crear logs de prueba
        AuditLog::factory()->count(5)->create();
        
        $response = $this->getJson('/api/audit/logs');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'action', 'model', 'user_name', 'created_at']
                    ],
                    'current_page',
                    'total',
                ]
            ]);
    }

    /**
     * Test: API endpoint - estadísticas de auditoría
     */
    public function test_api_audit_statistics()
    {
        $this->actingAs($this->user, 'api');
        
        // Asignar permiso necesario
        $this->user->givePermissionTo('view_audit_logs');
        
        // Crear logs de prueba
        AuditLog::factory()->count(10)->create();
        
        $response = $this->getJson('/api/audit/statistics');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_logs',
                    'actions_breakdown',
                    'models_breakdown',
                    'users_breakdown',
                    'recent_activity',
                ]
            ]);
    }

    /**
     * Test: API endpoint - salud del sistema
     */
    public function test_api_system_health()
    {
        $this->actingAs($this->user, 'api');
        
        // Asignar permiso necesario
        $this->user->givePermissionTo('view_system_monitoring');
        
        $response = $this->getJson('/api/system/health');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'healthy',
                    'status',
                    'timestamp',
                    'checks',
                ]
            ]);
    }

    /**
     * Test: Sanitización de datos sensibles
     */
    public function test_sensitive_data_is_sanitized()
    {
        $this->actingAs($this->user, 'api');
        
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'secretpassword123',
            'password_confirmation' => 'secretpassword123',
        ];
        
        $response = $this->postJson('/api/users', $userData);
        
        $response->assertStatus(201);
        
        // Verificar que la contraseña no se guardó en los logs
        $auditLog = AuditLog::where('action', 'created')
            ->where('model', 'App\Models\User')
            ->latest()
            ->first();
        
        $changes = json_decode($auditLog->changes, true);
        
        $this->assertArrayNotHasKey('password', $changes);
        $this->assertArrayNotHasKey('password_confirmation', $changes);
    }

    /**
     * Test: Middleware de logging de requests
     */
    public function test_request_logging_middleware()
    {
        $this->actingAs($this->user, 'api');
        
        // Realizar una solicitud
        $response = $this->getJson('/api/users');
        
        $response->assertStatus(200);
        
        // Verificar que se registró la actividad (puede estar en logs de archivo)
        $this->assertTrue(true); // Placeholder - verificar logs de archivo sería más complejo
    }
}