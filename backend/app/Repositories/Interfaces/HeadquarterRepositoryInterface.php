<?php

namespace App\Repositories\Interfaces;

interface HeadquarterRepositoryInterface extends RepositoryInterface
{
    /**
     * Buscar sedes por nombre
     *
     * @param string $name
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByName(string $name, int $limit = 10);

    /**
     * Obtener sedes activas
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveHeadquarters();

    /**
     * Obtener sedes con departamentos
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getHeadquartersWithDepartments();

    /**
     * Verificar si el nombre de la sede existe
     *
     * @param string $name
     * @param int|null $excludeId
     * @return bool
     */
    public function nameExists(string $name, int $excludeId = null): bool;

    /**
     * Obtener sedes por ciudad
     *
     * @param string $city
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByCity(string $city);
}