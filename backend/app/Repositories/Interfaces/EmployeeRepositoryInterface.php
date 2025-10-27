<?php

namespace App\Repositories\Interfaces;

interface EmployeeRepositoryInterface
{
    /**
     * Obtener empleados activos
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveEmployees();

    /**
     * Buscar empleados por nombre o email
     *
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function searchEmployees($search);

    /**
     * Obtener empleados por departamento
     *
     * @param int $departmentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByDepartment($departmentId);

    /**
     * Obtener empleados por cargo
     *
     * @param int $designationId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByDesignation($designationId);

    /**
     * Obtener empleados por sede
     *
     * @param int $headquarterId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByHeadquarter($headquarterId);

    /**
     * Obtener empleados con usuario asociado
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getEmployeesWithUsers();

    /**
     * Obtener empleados sin usuario asociado
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getEmployeesWithoutUsers();

    /**
     * Contar visitas del empleado
     *
     * @param int $employeeId
     * @return int
     */
    public function countEmployeeVisits($employeeId);

    /**
     * Obtener estadísticas de visitas por empleado
     *
     * @param int $employeeId
     * @param \DateTime|null $startDate
     * @param \DateTime|null $endDate
     * @return array
     */
    public function getEmployeeVisitStats($employeeId, $startDate = null, $endDate = null);

    /**
     * Verificar si el email del empleado existe
     *
     * @param string $email
     * @param int|null $excludeId
     * @return bool
     */
    public function emailExists(string $email, int $excludeId = null): bool;

    /**
     * Verificar si la identificación del empleado existe
     *
     * @param string $identification
     * @param int|null $excludeId
     * @return bool
     */
    public function identificationExists(string $identification, int $excludeId = null): bool;
}