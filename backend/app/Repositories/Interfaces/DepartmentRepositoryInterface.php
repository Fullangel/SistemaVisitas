<?php

namespace App\Repositories\Interfaces;

interface DepartmentRepositoryInterface extends RepositoryInterface
{
    /**
     * Buscar departamentos por nombre
     *
     * @param string $name
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByName(string $name, int $limit = 10);

    /**
     * Obtener departamentos activos
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveDepartments();

    /**
     * Obtener departamentos con empleados
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getDepartmentsWithEmployees();

    /**
     * Verificar si el nombre del departamento existe
     *
     * @param string $name
     * @param int|null $excludeId
     * @return bool
     */
    public function nameExists(string $name, int $excludeId = null): bool;
}