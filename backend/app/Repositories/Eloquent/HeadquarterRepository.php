<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Eloquent\BaseRepository;
use App\Repositories\Interfaces\HeadquarterRepositoryInterface;
use App\Models\Headquarter;

class HeadquarterRepository extends BaseRepository implements HeadquarterRepositoryInterface
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
    public function __construct(Headquarter $model)
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
    public function getActiveHeadquarters()
    {
        return $this->model
            ->where('status', true)
            ->orderBy('name')
            ->get();
    }

    /**
     * {@inheritdoc}
     */
    public function getHeadquartersWithDepartments()
    {
        return $this->model
            ->with('departments')
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

    /**
     * {@inheritdoc}
     */
    public function findByCity(string $city)
    {
        return $this->model
            ->where('city', 'like', "%{$city}%")
            ->orderBy('name')
            ->get();
    }
}