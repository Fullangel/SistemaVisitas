<?php

namespace App\Services\Contracts;

interface EmployeeServiceInterface
{
    /**
     * Obtener todos los empleados con paginación
     *
     * @param int $perPage
     * @param array $filters
     * @return array
     */
    public function getAllEmployees(int $perPage = 15, array $filters = []): array;

    /**
     * Obtener un empleado específico
     *
     * @param int $id
     * @return array
     */
    public function getEmployeeById(int $id): array;

    /**
     * Crear un nuevo empleado
     *
     * @param array $data
     * @return array
     */
    public function createEmployee(array $data): array;

    /**
     * Actualizar un empleado existente
     *
     * @param int $id
     * @param array $data
     * @return array
     */
    public function updateEmployee(int $id, array $data): array;

    /**
     * Eliminar un empleado
     *
     * @param int $id
     * @return array
     */
    public function deleteEmployee(int $id): array;

    /**
     * Buscar empleados por término
     *
     * @param string $term
     * @param int $limit
     * @return array
     */
    public function searchEmployees(string $term, int $limit = 10): array;

    /**
     * Obtener empleados por departamento
     *
     * @param int $departmentId
     * @param int $perPage
     * @return array
     */
    public function getEmployeesByDepartment(int $departmentId, int $perPage = 15): array;

    /**
     * Obtener empleados por designación
     *
     * @param int $designationId
     * @param int $perPage
     * @return array
     */
    public function getEmployeesByDesignation(int $designationId, int $perPage = 15): array;

    /**
     * Obtener empleados activos
     *
     * @param int $perPage
     * @return array
     */
    public function getActiveEmployees(int $perPage = 15): array;

    /**
     * Obtener empleados inactivos
     *
     * @param int $perPage
     * @return array
     */
    public function getInactiveEmployees(int $perPage = 15): array;

    /**
     * Verificar disponibilidad de email de empleado
     *
     * @param string $email
     * @param int|null $excludeEmployeeId
     * @return array
     */
    public function checkEmployeeEmailAvailability(string $email, ?int $excludeEmployeeId = null): array;

    /**
     * Verificar disponibilidad de identificación de empleado
     *
     * @param string $identification
     * @param int|null $excludeEmployeeId
     * @return array
     */
    public function checkEmployeeIdentificationAvailability(string $identification, ?int $excludeEmployeeId = null): array;
}