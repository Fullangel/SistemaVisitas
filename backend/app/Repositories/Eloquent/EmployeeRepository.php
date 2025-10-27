<?php

namespace App\Repositories\Eloquent;

use App\Models\Employee;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class EmployeeRepository extends BaseRepository implements EmployeeRepositoryInterface
{
    public function __construct(Employee $model)
    {
        parent::__construct($model);
    }

    /**
     * Obtener empleados activos
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveEmployees()
    {
        return $this->model->where('status', 'active')->get();
    }

    /**
     * Buscar empleados por nombre o email
     *
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function searchEmployees($search)
    {
        return $this->model->where(function ($query) use ($search) {
            $query->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('employee_id', 'like', "%{$search}%");
        })->get();
    }

    /**
     * Obtener empleados por departamento
     *
     * @param int $departmentId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByDepartment($departmentId)
    {
        return $this->model->where('department_id', $departmentId)->get();
    }

    /**
     * Obtener empleados por cargo
     *
     * @param int $designationId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByDesignation($designationId)
    {
        return $this->model->where('designation_id', $designationId)->get();
    }

    /**
     * Obtener empleados por sede
     *
     * @param int $headquarterId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByHeadquarter($headquarterId)
    {
        return $this->model->where('headquarter_id', $headquarterId)->get();
    }

    /**
     * Obtener empleados con usuario asociado
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getEmployeesWithUsers()
    {
        return $this->model->has('user')->get();
    }

    /**
     * Obtener empleados sin usuario asociado
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getEmployeesWithoutUsers()
    {
        return $this->model->doesntHave('user')->get();
    }

    /**
     * Contar visitas del empleado
     *
     * @param int $employeeId
     * @return int
     */
    public function countEmployeeVisits($employeeId)
    {
        return DB::table('visits')
            ->where('employee_id', $employeeId)
            ->count();
    }

    /**
     * Obtener estadísticas de visitas por empleado
     *
     * @param int $employeeId
     * @param \DateTime|null $startDate
     * @param \DateTime|null $endDate
     * @return array
     */
    public function getEmployeeVisitStats($employeeId, $startDate = null, $endDate = null)
    {
        $query = DB::table('visits')
            ->where('employee_id', $employeeId);

        if ($startDate) {
            $query->whereDate('visit_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('visit_date', '<=', $endDate);
        }

        $stats = $query->select(
            DB::raw('COUNT(*) as total_visits'),
            DB::raw('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed_visits'),
            DB::raw('SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) as cancelled_visits'),
            DB::raw('SUM(CASE WHEN status = "scheduled" THEN 1 ELSE 0 END) as scheduled_visits')
        )->first();

        return [
            'total_visits' => $stats->total_visits ?? 0,
            'completed_visits' => $stats->completed_visits ?? 0,
            'cancelled_visits' => $stats->cancelled_visits ?? 0,
            'scheduled_visits' => $stats->scheduled_visits ?? 0,
            'completion_rate' => $stats->total_visits > 0 ? round(($stats->completed_visits / $stats->total_visits) * 100, 2) : 0
        ];
    }

    /**
     * Verificar si el email del empleado existe
     *
     * @param string $email
     * @param int|null $excludeId
     * @return bool
     */
    public function emailExists(string $email, int $excludeId = null): bool
    {
        $query = $this->model->where('email', $email);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

    /**
     * Verificar si la identificación del empleado existe
     *
     * @param string $identification
     * @param int|null $excludeId
     * @return bool
     */
    public function identificationExists(string $identification, int $excludeId = null): bool
    {
        $query = $this->model->where('identification', $identification);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }
}