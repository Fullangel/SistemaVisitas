<?php

namespace App\Observers;

use App\Models\Employee;

class EmployeeObserver extends BaseObserver
{
    /**
     * Handle the Employee "created" event.
     *
     * @param  \App\Models\Employee  $employee
     * @return void
     */
    public function created(Employee $employee)
    {
        $this->logActivity($employee, 'created', [
            'employee_id' => $employee->employee_id,
            'full_name' => $employee->full_name,
            'email' => $employee->email,
            'department_id' => $employee->department_id,
            'designation_id' => $employee->designation_id,
            'headquarter_id' => $employee->headquarter_id,
            'status' => $employee->status
        ]);
    }

    /**
     * Handle the Employee "updated" event.
     *
     * @param  \App\Models\Employee  $employee
     * @return void
     */
    public function updated(Employee $employee)
    {
        $changes = $this->getChanges($employee);
        
        // Detectar cambios de estado importantes
        if (isset($changes['status'])) {
            $this->logStatusChange($employee, $changes['status']);
        }

        $this->logActivity($employee, 'updated', $changes);
    }

    /**
     * Handle the Employee "deleted" event.
     *
     * @param  \App\Models\Employee  $employee
     * @return void
     */
    public function deleted(Employee $employee)
    {
        $this->logActivity($employee, 'deleted', [
            'employee_id' => $employee->employee_id,
            'full_name' => $employee->full_name,
            'email' => $employee->email,
            'deleted_at' => now()->toDateTimeString()
        ]);
    }

    /**
     * Log de cambio de estado específico
     *
     * @param Employee $employee
     * @param array $statusChange
     * @return void
     */
    protected function logStatusChange(Employee $employee, array $statusChange)
    {
        $oldStatus = $statusChange['old'];
        $newStatus = $statusChange['new'];

        $this->logActivity($employee, 'status_changed', [
            'from_status' => $oldStatus,
            'to_status' => $newStatus,
            'employee_name' => $employee->full_name,
            'employee_id' => $employee->employee_id
        ]);

        // Log adicional para ciertos cambios de estado
        if ($newStatus === 'inactive' && $oldStatus !== 'inactive') {
            $this->logActivity($employee, 'employee_deactivated', [
                'employee_name' => $employee->full_name,
                'employee_id' => $employee->employee_id,
                'resignation_date' => $employee->resignation_date
            ]);
        } elseif ($newStatus === 'active' && $oldStatus !== 'active') {
            $this->logActivity($employee, 'employee_activated', [
                'employee_name' => $employee->full_name,
                'employee_id' => $employee->employee_id
            ]);
        }
    }
}