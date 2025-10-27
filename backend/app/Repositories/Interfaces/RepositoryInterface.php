<?php

namespace App\Repositories\Interfaces;

interface RepositoryInterface
{
    /**
     * Obtener todos los registros
     *
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(array $columns = ['*']);

    /**
     * Encontrar un registro por su ID
     *
     * @param int $id
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function find(int $id, array $columns = ['*']);

    /**
     * Encontrar un registro por su ID o fallar
     *
     * @param int $id
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Model
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail(int $id, array $columns = ['*']);

    /**
     * Crear un nuevo registro
     *
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function create(array $data);

    /**
     * Actualizar un registro existente
     *
     * @param int $id
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model|bool
     */
    public function update(int $id, array $data);

    /**
     * Eliminar un registro
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Obtener el modelo asociado
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function getModel();

    /**
     * Establecer relaciones eager loading
     *
     * @param array $relations
     * @return $this
     */
    public function with(array $relations);

    /**
     * Aplicar condiciones where
     *
     * @param string $column
     * @param mixed $operator
     * @param mixed $value
     * @return $this
     */
    public function where(string $column, $operator = null, $value = null);

    /**
     * Aplicar ordenamiento
     *
     * @param string $column
     * @param string $direction
     * @return $this
     */
    public function orderBy(string $column, string $direction = 'asc');

    /**
     * Limitar resultados
     *
     * @param int $limit
     * @return $this
     */
    public function limit(int $limit);

    /**
     * Paginar resultados
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate(int $perPage = 15);
}