<?php

namespace App\Services\Contracts;

interface StructuredLoggingServiceInterface
{
    /**
     * Categorías de log
     */
    const CATEGORY_AUTH = 'authentication';
    const CATEGORY_VISIT = 'visit';
    const CATEGORY_USER = 'user';
    const CATEGORY_EMPLOYEE = 'employee';
    const CATEGORY_SYSTEM = 'system';
    const CATEGORY_PERFORMANCE = 'performance';
    const CATEGORY_SECURITY = 'security';
    const CATEGORY_AUDIT = 'audit';
    const CATEGORY_ERROR = 'error';

    /**
     * Niveles de log
     */
    const LEVEL_EMERGENCY = 'emergency';
    const LEVEL_ALERT = 'alert';
    const LEVEL_CRITICAL = 'critical';
    const LEVEL_ERROR = 'error';
    const LEVEL_WARNING = 'warning';
    const LEVEL_NOTICE = 'notice';
    const LEVEL_INFO = 'info';
    const LEVEL_DEBUG = 'debug';

    /**
     * Log estructurado para auditoría
     *
     * @param string $action
     * @param string $resourceType
     * @param mixed $resourceId
     * @param array $data
     * @return void
     */
    public function logAudit(string $action, string $resourceType, $resourceId, array $data = []): void;

    /**
     * Log estructurado para autenticación
     *
     * @param string $action
     * @param int|null $userId
     * @param array $data
     * @return void
     */
    public function logAuthentication(string $action, ?int $userId, array $data = []): void;

    /**
     * Log estructurado para visitas
     *
     * @param string $action
     * @param mixed $visitId
     * @param array $data
     * @return void
     */
    public function logVisit(string $action, $visitId, array $data = []): void;

    /**
     * Log estructurado para errores
     *
     * @param string $message
     * @param array $data
     * @return void
     */
    public function logError(string $message, array $data = []): void;

    /**
     * Log estructurado para performance
     *
     * @param string $operation
     * @param float $duration
     * @param array $data
     * @return void
     */
    public function logPerformance(string $operation, float $duration, array $data = []): void;

    /**
     * Log estructurado para seguridad
     *
     * @param string $action
     * @param array $data
     * @return void
     */
    public function logSecurity(string $action, array $data = []): void;

    /**
     * Log estructurado para sistema
     *
     * @param string $action
     * @param array $data
     * @return void
     */
    public function logSystem(string $action, array $data = []): void;

    /**
     * Obtener estadísticas de logs
     *
     * @param int $days
     * @return array
     */
    public function getLogStatistics(int $days = 7): array;
}