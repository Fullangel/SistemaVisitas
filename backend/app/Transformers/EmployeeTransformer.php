<?php

namespace App\Transformers;

use App\Models\Employee;

class EmployeeTransformer extends BaseTransformer
{
    /**
     * Transformar un empleado
     *
     * @param Employee $employee
     * @return array
     */
    public function transform($employee): array
    {
        return [
            'id' => $employee->id,
            'employee_id' => $employee->employee_id,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'full_name' => $employee->full_name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'address' => $employee->address,
            'status' => $employee->status,
            'joining_date' => $employee->joining_date,
            'resignation_date' => $employee->resignation_date,
            'department' => $employee->department ? [
                'id' => $employee->department->id,
                'name' => $employee->department->name,
                'description' => $employee->department->description
            ] : null,
            'designation' => $employee->designation ? [
                'id' => $employee->designation->id,
                'name' => $employee->designation->name,
                'description' => $employee->designation->description
            ] : null,
            'headquarter' => $employee->headquarter ? [
                'id' => $employee->headquarter->id,
                'name' => $employee->headquarter->name,
                'address' => $employee->headquarter->address,
                'city' => $employee->headquarter->city,
                'region' => $employee->headquarter->region->name ?? null
            ] : null,
            'user' => $employee->user ? [
                'id' => $employee->user->id,
                'username' => $employee->user->username,
                'email' => $employee->user->email,
                'status' => $employee->user->status,
                'last_login_at' => $this->formatDate($employee->user->last_login_at)
            ] : null,
            'created_at' => $this->formatDate($employee->created_at),
            'updated_at' => $this->formatDate($employee->updated_at)
        ];
    }

    /**
     * Transformar empleado para listado (versión simplificada)
     *
     * @param Employee $employee
     * @return array
     */
    public function transformForList($employee): array
    {
        return [
            'id' => $employee->id,
            'employee_id' => $employee->employee_id,
            'full_name' => $employee->full_name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'status' => $employee->status,
            'department' => $employee->department->name ?? null,
            'designation' => $employee->designation->name ?? null,
            'headquarter' => $employee->headquarter->name ?? null,
            'has_user' => (bool) $employee->user,
            'created_at' => $this->formatDate($employee->created_at)
        ];
    }

    /**
     * Transformar empleado con estadísticas
     *
     * @param Employee $employee
     * @param array $stats
     * @return array
     */
    public function transformWithStats($employee, array $stats): array
    {
        $transformed = $this->transform($employee);
        $transformed['statistics'] = $stats;
        
        return $transformed;
    }
}