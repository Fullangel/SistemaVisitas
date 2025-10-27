<?php

namespace App\Repositories\Interfaces;

interface VisitRepositoryInterface
{
    /**
     * Obtener visitas por fecha
     *
     * @param string $date
     * @param int $limit
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getByDate(string $date, int $limit = 15);

    /**
     * Obtener visitas por estado
     *
     * @param string $status
     * @param int $limit
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getByStatus(string $status, int $limit = 15);

    /**
     * Obtener visitas de un empleado específico
     *
     * @param int $employeeId
     * @param int $limit
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getByEmployee(int $employeeId, int $limit = 15);

    /**
     * Buscar visitas por término
     *
     * @param string $term
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function search(string $term, int $limit = 10);

    /**
     * Obtener visitas activas (pendientes o en progreso)
     *
     * @param int $limit
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getActiveVisits(int $limit = 15);

    /**
     * Obtener estadísticas de visitas por fecha
     *
     * @param string $date
     * @return array
     */
    public function getStatisticsByDate(string $date): array;

    /**
     * Verificar límite de visitas por día
     *
     * @param string $date
     * @return bool
     */
    public function hasReachedDailyLimit(string $date): bool;

    /**
     * Obtener visitas próximas a vencer
     *
     * @param int $minutes
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getExpiringVisits(int $minutes = 30);

    /**
     * Actualizar estado de visita
     *
     * @param int $visitId
     * @param string $status
     * @param array $additionalData
     * @return \App\Models\Visit|bool
     */
    public function updateStatus(int $visitId, string $status, array $additionalData = []);
}