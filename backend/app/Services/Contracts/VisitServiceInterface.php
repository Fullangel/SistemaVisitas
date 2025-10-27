<?php

namespace App\Services\Contracts;

interface VisitServiceInterface
{
    /**
     * Obtener todas las visitas con paginación
     *
     * @param int $perPage
     * @param array $filters
     * @return array
     */
    public function getAllVisits(int $perPage = 15, array $filters = []): array;

    /**
     * Obtener una visita específica
     *
     * @param int $id
     * @return array
     */
    public function getVisitById(int $id): array;

    /**
     * Crear una nueva visita
     *
     * @param array $data
     * @return array
     */
    public function createVisit(array $data): array;

    /**
     * Actualizar una visita existente
     *
     * @param int $id
     * @param array $data
     * @return array
     */
    public function updateVisit(int $id, array $data): array;

    /**
     * Eliminar una visita
     *
     * @param int $id
     * @return array
     */
    public function deleteVisit(int $id): array;

    /**
     * Aprobar una visita
     *
     * @param int $id
     * @param int $approvedBy
     * @return array
     */
    public function approveVisit(int $id, int $approvedBy): array;

    /**
     * Rechazar una visita
     *
     * @param int $id
     * @param string $reason
     * @param int $rejectedBy
     * @return array
     */
    public function rejectVisit(int $id, string $reason, int $rejectedBy): array;

    /**
     * Buscar visitas por término
     *
     * @param string $term
     * @param int $limit
     * @return array
     */
    public function searchVisits(string $term, int $limit = 10): array;

    /**
     * Obtener visitas por estado
     *
     * @param string $status
     * @param int $perPage
     * @return array
     */
    public function getVisitsByStatus(string $status, int $perPage = 15): array;

    /**
     * Obtener visitas por empleado
     *
     * @param int $employeeId
     * @param int $perPage
     * @return array
     */
    public function getVisitsByEmployee(int $employeeId, int $perPage = 15): array;

    /**
     * Obtener visitas por rango de fechas
     *
     * @param string $startDate
     * @param string $endDate
     * @param int $perPage
     * @return array
     */
    public function getVisitsByDateRange(string $startDate, string $endDate, int $perPage = 15): array;

    /**
     * Obtener estadísticas de visitas
     *
     * @param array $filters
     * @return array
     */
    public function getVisitStatistics(array $filters = []): array;
}