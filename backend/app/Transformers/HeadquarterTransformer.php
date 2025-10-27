<?php

namespace App\Transformers;

use App\Models\Headquarter;

class HeadquarterTransformer extends BaseTransformer
{
    /**
     * Transformar una sede
     *
     * @param Headquarter $headquarter
     * @return array
     */
    public function transform($headquarter): array
    {
        return [
            'id' => $headquarter->id,
            'name' => $headquarter->name,
            'address' => $headquarter->address,
            'city' => $headquarter->city,
            'region' => $headquarter->region ? [
                'id' => $headquarter->region->id,
                'name' => $headquarter->region->name,
                'code' => $headquarter->region->code
            ] : null,
            'phone' => $headquarter->phone,
            'email' => $headquarter->email,
            'status' => $headquarter->status,
            'departments_count' => $headquarter->departments_count ?? $headquarter->departments()->count(),
            'employees_count' => $headquarter->employees_count ?? $headquarter->employees()->count(),
            'created_at' => $this->formatDate($headquarter->created_at),
            'updated_at' => $this->formatDate($headquarter->updated_at)
        ];
    }

    /**
     * Transformar sede para listado (versión simplificada)
     *
     * @param Headquarter $headquarter
     * @return array
     */
    public function transformForList($headquarter): array
    {
        return [
            'id' => $headquarter->id,
            'name' => $headquarter->name,
            'address' => $headquarter->address,
            'city' => $headquarter->city,
            'region' => $headquarter->region->name ?? null,
            'phone' => $headquarter->phone,
            'status' => $headquarter->status,
            'departments_count' => $headquarter->departments_count ?? $headquarter->departments()->count(),
            'employees_count' => $headquarter->employees_count ?? $headquarter->employees()->count(),
            'created_at' => $this->formatDate($headquarter->created_at)
        ];
    }

    /**
     * Transformar sede con departamentos
     *
     * @param Headquarter $headquarter
     * @return array
     */
    public function transformWithDepartments($headquarter): array
    {
        $transformed = $this->transform($headquarter);
        
        if ($headquarter->relationLoaded('departments')) {
            $departmentTransformer = new DepartmentTransformer();
            $transformed['departments'] = $departmentTransformer->transformCollection($headquarter->departments);
        }
        
        return $transformed;
    }

    /**
     * Transformar sede con estadísticas completas
     *
     * @param Headquarter $headquarter
     * @param array $stats
     * @return array
     */
    public function transformWithStats($headquarter, array $stats): array
    {
        $transformed = $this->transform($headquarter);
        $transformed['statistics'] = $stats;
        
        return $transformed;
    }
}