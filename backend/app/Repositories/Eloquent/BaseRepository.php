<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Interfaces\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements RepositoryInterface
{
    /**
     * @var Model
     */
    protected $model;

    /**
     * @var Builder
     */
    protected $query;

    /**
     * @var array
     */
    protected $eagerLoad = [];

    /**
     * @var array
     */
    protected $wheres = [];

    /**
     * @var array
     */
    protected $orderBy = [];

    /**
     * @var int|null
     */
    protected $limit = null;

    /**
     * Constructor
     *
     * @param Model $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
        $this->resetQuery();
    }

    /**
     * Obtener todos los registros
     */
    public function all(array $columns = ['*'])
    {
        $this->applyConditions();
        $result = $this->query->get($columns);
        $this->resetQuery();
        return $result;
    }

    /**
     * Encontrar un registro por su ID
     */
    public function find(int $id, array $columns = ['*'])
    {
        return $this->model->find($id, $columns);
    }

    /**
     * Encontrar un registro por su ID o fallar
     */
    public function findOrFail(int $id, array $columns = ['*'])
    {
        return $this->model->findOrFail($id, $columns);
    }

    /**
     * Crear un nuevo registro
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * Actualizar un registro existente
     */
    public function update(int $id, array $data)
    {
        $model = $this->find($id);
        if ($model) {
            $model->update($data);
            return $model;
        }
        return false;
    }

    /**
     * Eliminar un registro
     */
    public function delete(int $id): bool
    {
        $model = $this->find($id);
        if ($model) {
            return $model->delete();
        }
        return false;
    }

    /**
     * Obtener el modelo asociado
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * Establecer relaciones eager loading
     */
    public function with(array $relations)
    {
        $this->eagerLoad = array_merge($this->eagerLoad, $relations);
        return $this;
    }

    /**
     * Aplicar condiciones where
     */
    public function where(string $column, $operator = null, $value = null)
    {
        if (func_num_args() === 2) {
            $this->wheres[] = ['column' => $column, 'operator' => '=', 'value' => $operator];
        } else {
            $this->wheres[] = ['column' => $column, 'operator' => $operator, 'value' => $value];
        }
        return $this;
    }

    /**
     * Aplicar ordenamiento
     */
    public function orderBy(string $column, string $direction = 'asc')
    {
        $this->orderBy[] = ['column' => $column, 'direction' => $direction];
        return $this;
    }

    /**
     * Limitar resultados
     */
    public function limit(int $limit)
    {
        $this->limit = $limit;
        return $this;
    }

    /**
     * Paginar resultados
     */
    public function paginate(int $perPage = 15)
    {
        $this->applyConditions();
        $result = $this->query->paginate($perPage);
        $this->resetQuery();
        return $result;
    }

    /**
     * Aplicar todas las condiciones acumuladas
     */
    protected function applyConditions()
    {
        // Aplicar eager loading
        if (!empty($this->eagerLoad)) {
            $this->query->with($this->eagerLoad);
        }

        // Aplicar wheres
        foreach ($this->wheres as $where) {
            $this->query->where($where['column'], $where['operator'], $where['value']);
        }

        // Aplicar ordenamiento
        foreach ($this->orderBy as $order) {
            $this->query->orderBy($order['column'], $order['direction']);
        }

        // Aplicar límite
        if ($this->limit !== null) {
            $this->query->limit($this->limit);
        }
    }

    /**
     * Reiniciar la consulta
     */
    protected function resetQuery()
    {
        $this->query = $this->model->newQuery();
        $this->eagerLoad = [];
        $this->wheres = [];
        $this->orderBy = [];
        $this->limit = null;
    }
}