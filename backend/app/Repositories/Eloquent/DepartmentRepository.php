<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Eloquent\BaseRepository;
use App\Repositories\Interfaces\DepartmentRepositoryInterface;
use App\Models\Department;

class DepartmentRepository extends BaseRepository implements DepartmentRepositoryInterface
{
    /**
     * @var Model
     */
    protected $model;

    /**
     * BaseRepository constructor.
     *
     * @param Model $model
     */
    public function __construct(Department $model)
    {
        $this->model = $model;
    }

    /**
     * {@inheritdoc}
     */
    public function findByName(string $name, int $limit = 10)
    {
        return $this->model
            ->where('name', 'like', "%{$name}%")
            ->limit($limit)
            ->get();
    }

    /**
     * {@inheritdoc}
     */
    public function getActiveDepartments()
    {
        return $this->model
            ->where('status', true)
            ->orderBy('name')
            ->get();
    }

    /**
     * {@inheritdoc}
     */
    public function getDepartmentsWithEmployees()
    {
        return $this->model
            ->withCount('employees')
            ->orderBy('name')
            ->get();
    }

    /**
     * {@inheritdoc}
     */
    public function nameExists(string $name, int $excludeId = null): bool
    {
        $query = $this->model->where('name', $name);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }
}