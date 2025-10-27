<?php

namespace App\Transformers;

use App\Models\Department;

class DepartmentTransformer extends BaseTransformer
{
    /**
     * Transformar un departamento
     *
     * @param Department $department
     * @return array
     */
    public function transform($department): array
    {
        return [
            'id' => $department->id,
            'name' => $department->name,
            'description' => $department->description,
            'status' => $department->status,
            'headquarter' => $department->headquarter ? [
                'id' => $department->headquarter->id,
                'name' => $department->headquarter->name,
                'city' => $department->headquarter->city
            ] : null,
            'employees_count' => $department->employees_count ?? $department->employees()->count(),
            'created_at' => $this->formatDate($department->created_at),
            'updated_at' => $this->formatDate($department->updated_at)
        ];
    }

    /**
     * Transformar departamento para listado (versión simplificada)
     *
     * @param Department $department
     * @return array
     */
    public function transformForList($department): array
    {
        return [
            'id' => $department->id,
            'name' => $department->name,
            'description' => $department->description,
            'status' => $department->status,
            'headquarter' => $department->headquarter->name ?? null,
            'employees_count' => $department->employees_count ?? $department->employees()->count(),
            'created_at' => $this->formatDate($department->created_at)
        ];
    }

    /**
     * Transformar departamento con empleados
     *
     * @param Department $department
     * @return array
     */
    public function transformWithEmployees($department): array
    {
        $transformed = $this->transform($department);
        
        if ($department->relationLoaded('employees')) {
            $employeeTransformer = new EmployeeTransformer();
            $transformed['employees'] = $employeeTransformer->transformCollection($department->employees);
        }
        
        return $transformed;
    }
}